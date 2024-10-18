module "connect_lambda" {
  source        = "./IaCLambdaModule"
  function_name = "WebSocketConnectHandler"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  role_arn      = var.role_arn
  filename      = "./functions_zips/websocketConnect.zip"
  environment_variables = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
  }
  policy_statements = [
    {
      Action   = [ "dynamodb:UpdateItem"],
      Effect   = "Allow",
      Resource = aws_dynamodb_table.user_sessions.arn
    }
  ]
}

module "disconnect_lambda" {
  source        = "./IaCLambdaModule"
  function_name = "WebSocketDisconnectHandler"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/websocketDisconnect.zip"
  role_arn      = var.role_arn
  environment_variables = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
  }
  policy_statements = [
    {
      Action   = ["dynamodb:DeleteItem"],
      Effect   = "Allow",
      Resource = aws_dynamodb_table.user_sessions.arn
    }
  ]
}


locals {
  connections_url = "https://${aws_apigatewayv2_api.websocket_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_apigatewayv2_stage.production_stage.name}"
}



# Create the Lambda function
resource "aws_lambda_function" "ezauction_lambda_notify" {
  function_name = "ezauction-lambda-notify"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/notifications.zip"
  role          = var.role_arn  # Use the provided role ARN
  # Define environment variables
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.user_sessions.name  # Reference to an already existing table
      WS_API_GATEWAY_ENDPOINT = local.connections_url
    }
  }
}

# Create an SQS event source mapping for the Lambda function
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.auction_queue.arn  # SQS queue ARN
  function_name    = aws_lambda_function.ezauction_lambda_notify.id
}


