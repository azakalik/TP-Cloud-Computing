resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "EzAuctionWebSocketAPI"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

locals {
  connections_url = "https://${aws_apigatewayv2_api.websocket_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_apigatewayv2_stage.production_stage.name}"
}

resource "aws_apigatewayv2_stage" "production_stage" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  name   = "production"
  auto_deploy = true
}

module "lambda_ws_connect" {
  depends_on = [ aws_apigatewayv2_api.websocket_api, data.aws_iam_role.iam_role_labrole, aws_dynamodb_table.user_sessions ]
  source = "./iacModules/lambda"

  handler = "main.handler"
  function_name = "WebSocketConnectHandler"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  filename = "./functions_zips/websocketConnect.zip"
  env_vars = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.ez_auction_user_pool.id
    COGNITO_CLIENT_ID = aws_cognito_user_pool_client.ez_auction_pool_client.id
  }

  api_gw_id = aws_apigatewayv2_api.websocket_api.id
  route_key = "$connect"
  api_gw_execution_arn = aws_apigatewayv2_api.websocket_api.execution_arn
}

module "lambda_ws_disconnect" {
  depends_on = [ aws_apigatewayv2_api.websocket_api, data.aws_iam_role.iam_role_labrole, aws_dynamodb_table.user_sessions ]
  source = "./iacModules/lambda"

  handler = "main.handler"
  function_name = "WebSocketDisconnectHandler"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  filename = "./functions_zips/websocketDisconnect.zip"
  env_vars = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
  }

  api_gw_id = aws_apigatewayv2_api.websocket_api.id
  route_key = "$disconnect"
  api_gw_execution_arn = aws_apigatewayv2_api.websocket_api.execution_arn
}

module "lambda_ws_notify" {
  depends_on = [ data.aws_iam_role.iam_role_labrole, aws_dynamodb_table.user_sessions, aws_apigatewayv2_api.websocket_api ]
  source = "./iacModules/lambda"

  handler = "main.handler"
  function_name = "ezauction-lambda-notify"
  filename = "./functions_zips/notifications.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
    WS_API_GATEWAY_ENDPOINT = local.connections_url
  }
}

# Create a Lambda subscription to the SNS topic
resource "aws_sns_topic_subscription" "sns_lambda_subscription" {
  topic_arn = aws_sns_topic.auction_topic.arn
  protocol  = "lambda"
  endpoint  = module.lambda_ws_notify.arn  # Lambda ARN
}

# Allow SNS to invoke the Lambda function
resource "aws_lambda_permission" "allow_sns_invoke" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_ws_notify.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.auction_topic.arn
}
