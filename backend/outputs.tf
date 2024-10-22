# Output the User Pool ID and App Client ID
output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.ez_auction_user_pool.id
}

output "cognito_user_pool_client_id" {
  description = "The ID of the Cognito User Pool App Client"
  value       = aws_cognito_user_pool_client.ez_auction_pool_client.id
}

output "http_api_gw_url" {
  description = "The URL of the HTTP API Gateway"
  value       = join("/", [aws_apigatewayv2_api.api_http.api_endpoint, aws_apigatewayv2_stage.api_http_stage.name])
}

output "ws_api_gw_url" {
  description = "The URL of the WebSocket API Gateway"
  value       = join("/", [aws_apigatewayv2_api.websocket_api.api_endpoint, aws_apigatewayv2_stage.production_stage.name])
}