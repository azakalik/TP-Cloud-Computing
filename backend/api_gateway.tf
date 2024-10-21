resource "aws_apigatewayv2_api" "api_http" {
  name = "ezauction-api-http"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "api_http_stage" {
  api_id = aws_apigatewayv2_api.api_http.id
  name   = "prod"

  auto_deploy  = true   # Enable automatic deployment
}

# ##############################
# # OFFERS
# ##############################

# # INTEGRATIONS

# resource "aws_apigatewayv2_integration" "api_http_integration_offers_place" {
#   api_id             = aws_apigatewayv2_api.api_http.id
#   integration_type   = "AWS_PROXY"
#   integration_method = "POST"
#   // TODO: Change this to the correct lambda function
#   integration_uri    = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.ezauction_lambda_notify.arn}/invocations"
# }

# resource "aws_apigatewayv2_integration" "api_http_integration_offers_get_highest" {
#   api_id             = aws_apigatewayv2_api.api_http.id
#   integration_type   = "AWS_PROXY"
#   integration_method = "GET"
#   // TODO: Change this to the correct lambda function
#   integration_uri    = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.ezauction_lambda_notify.arn}/invocations"
# }

# # ROUTES

# resource "aws_apigatewayv2_route" "api_http_route_offers_place" {
#   api_id    = aws_apigatewayv2_api.api_http.id
#   route_key = "POST /offers"
#   target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_offers_place.id}"
# }

# resource "aws_apigatewayv2_route" "api_http_route_offers_get_highest" {
#   api_id    = aws_apigatewayv2_api.api_http.id
#   route_key = "GET /offers"
#   target    = "integrations/${aws_apigatewayv2_integration.api_http_integration_offers_get_highest.id}"
# }


##############################
# PUBLICATIONS
##############################

# INTEGRATIONS

resource "aws_apigatewayv2_integration" "api_http_integration_publications_get" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_method = "GET"
  integration_uri    = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.ezauction_lambda_get_publication.arn}/invocations"
}

resource "aws_apigatewayv2_integration" "api_http_integration_publications_post" {
  api_id             = aws_apigatewayv2_api.api_http.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.ezauction_lambda_create_publication.arn}/invocations"
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


resource "aws_apigatewayv2_domain_name" "api_custom_domain" {
  domain_name = "api.aws.martinippolito.com.ar"
  domain_name_configuration {
    certificate_arn = aws_acm_certificate.wildcard.arn  # Assuming you already have the ACM certificate
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "api_mapping" {
  api_id      = aws_apigatewayv2_api.api_http.id
  domain_name = aws_apigatewayv2_domain_name.api_custom_domain.domain_name
  stage       = aws_apigatewayv2_stage.api_http_stage.name
}
