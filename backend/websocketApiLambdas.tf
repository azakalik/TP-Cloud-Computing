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
