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
  }

  integrates_with_api_gw = true
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

  integrates_with_api_gw = true
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

resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.auction_queue.arn  # SQS queue ARN
  function_name    = module.lambda_ws_notify.id
} 
