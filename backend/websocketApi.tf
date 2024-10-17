resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "EzAuctionWebSocketAPI"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}


# Use our Lambda function to service requests
resource "aws_apigatewayv2_integration" "lambda_connect_integration" {
  api_id             = aws_apigatewayv2_api.websocket_api.id
  integration_uri    = module.connect_lambda.lambda_function_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  credentials_arn    = var.role_arn
}


resource "aws_apigatewayv2_integration" "lambda_disconnect_integration" {
  api_id          = aws_apigatewayv2_api.websocket_api.id
  integration_uri = module.disconnect_lambda.lambda_function_arn
  credentials_arn = var.role_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}



resource "aws_apigatewayv2_route" "connect_route" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_connect_integration.id}"
}

resource "aws_apigatewayv2_route" "disconnect_route" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_disconnect_integration.id}"
}


resource "aws_apigatewayv2_stage" "production_stage" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  name   = "production"
  auto_deploy = true
}

