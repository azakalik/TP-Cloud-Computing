resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "EzAuctionWebSocketAPI"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}


resource "aws_apigatewayv2_integration" "lambda_connect_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_uri  = aws_lambda_function.connect_lambda.arn
  integration_type = "AWS_PROXY"
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn
}

resource "aws_apigatewayv2_integration" "lambda_disconnect_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_uri  = aws_lambda_function.disconnect_lambda.arn
  integration_type = "AWS_PROXY"
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn
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


resource "aws_lambda_permission" "allow_api_gateway_invoke_connect" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.connect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api_gateway_invoke_disconnect" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.disconnect_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}



resource "aws_apigatewayv2_stage" "production_stage" {
  api_id = aws_apigatewayv2_api.websocket_api.id
  name   = "production"
  auto_deploy = true
}

