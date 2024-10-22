resource "aws_lambda_function" "connect_lambda" {
  function_name = "WebSocketConnectHandler"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  role      = data.aws_iam_role.iam_role_labrole.arn
  filename      = "./functions_zips/websocketConnect.zip"

  environment {

     variables = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
  }

  }
}

resource "aws_lambda_function" "disconnect_lambda" {
  function_name = "WebSocketDisconnectHandler"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/websocketDisconnect.zip"
  role      = data.aws_iam_role.iam_role_labrole.arn

  environment {

    variables = {
    TABLE_NAME = aws_dynamodb_table.user_sessions.name
  }
    
  }

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
  role          = data.aws_iam_role.iam_role_labrole.arn
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


