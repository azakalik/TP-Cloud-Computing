resource "aws_apigatewayv2_api" "api_http" {
  name = "ezauction-api-http"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "api_http_stage" {
  api_id = aws_apigatewayv2_api.api_http.id
  name   = "prod"
  auto_deploy = true
}

# INTEGRATIONS
resource "aws_apigatewayv2_integration" "api_http_integration_publications_get" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.ezauction_lambda_get_publication.arn
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn
}
resource "aws_apigatewayv2_integration" "api_http_integration_publications_post" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.ezauction_lambda_create_publication.arn
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn
}
resource "aws_apigatewayv2_integration" "api_http_integration_offers_place" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.ezauction_lambda_create_offer.arn
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn
}
resource "aws_apigatewayv2_integration" "api_http_integration_offers_highest" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.ezauction_lambda_get_highest_offer.arn
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn
}
resource "aws_apigatewayv2_integration" "api_http_integration_offers_table" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.ezauction_lambda_create_offers_table.arn
  credentials_arn  = data.aws_iam_role.iam_role_labrole.arn  
}

# ROUTES
resource "aws_apigatewayv2_route" "api_http_route_publications_get" {
  api_id    = aws_apigatewayv2_api.api_http.id
  route_key = "GET /publications"
  target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_publications_get.id}"
}
resource "aws_apigatewayv2_route" "api_http_route_publications_post" {
  api_id    = aws_apigatewayv2_api.api_http.id
  route_key = "POST /publications"
  target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_publications_post.id}"
}
resource "aws_apigatewayv2_route" "api_http_route_offers_get" {
  api_id    = aws_apigatewayv2_api.api_http.id
  route_key = "GET /offers"
  target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_offers_highest.id}"
}
resource "aws_apigatewayv2_route" "api_http_route_offers_place" {
  api_id    = aws_apigatewayv2_api.api_http.id
  route_key = "POST /offers"
  target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_offers_place.id}"
}
resource "aws_apigatewayv2_route" "api_http_route_offers_table" {
  api_id    = aws_apigatewayv2_api.api_http.id
  route_key = "POST /tables/offers"
  target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_offers_table.id}"
}

# PERMISSIONS
resource "aws_lambda_permission" "allow_api_gateway_invoke_publications_get" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ezauction_lambda_get_publication.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_http.execution_arn}/*/*"
}
resource "aws_lambda_permission" "allow_api_gateway_invoke_publications_create" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ezauction_lambda_create_publication.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_http.execution_arn}/*/*"
}
resource "aws_lambda_permission" "allow_api_gateway_invoke_offers_get" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ezauction_lambda_get_highest_offer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_http.execution_arn}/*/*"
}
resource "aws_lambda_permission" "allow_api_gateway_invoke_offers_create" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ezauction_lambda_create_offer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_http.execution_arn}/*/*"
}
resource "aws_lambda_permission" "allow_api_gateway_invoke_offers_table_create" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ezauction_lambda_create_offers_table.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_http.execution_arn}/*/*"
}

resource "aws_lambda_invocation" "create_offers_table_invocation" {
  depends_on = [ aws_lambda_function.ezauction_lambda_create_offers_table ]
  function_name = aws_lambda_function.ezauction_lambda_create_offers_table.function_name
  input = jsonencode({})
}

resource "aws_apigatewayv2_domain_name" "api_custom_domain" {
  domain_name = "api.aws.martinippolito.com.ar"
  domain_name_configuration {
    certificate_arn = aws_acm_certificate.wildcard.arn  # Assuming you already have the ACM certificate
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
# Add a depends_on to wait for the certificate validation to be completed
  depends_on = [aws_acm_certificate_validation.wildcard_validation]
}

resource "aws_apigatewayv2_api_mapping" "api_mapping" {
  api_id      = aws_apigatewayv2_api.api_http.id
  domain_name = aws_apigatewayv2_domain_name.api_custom_domain.domain_name
  stage       = aws_apigatewayv2_stage.api_http_stage.name
}

