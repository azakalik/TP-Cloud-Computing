

resource "aws_apigatewayv2_api" "api_http" {
  name = "ezauction-api-http"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "api_http_stage" {
  api_id = aws_apigatewayv2_api.api_http.id
  name   = "prod"
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

module "lambda_create_publication" {
  depends_on = [ aws_apigatewayv2_api.api_http, aws_s3_bucket.publication_images, aws_dynamodb_table.publications, data.aws_iam_role.iam_role_labrole ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-create-publication"
  filename = "./functions_zips/postPublications.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    BUCKET_NAME = aws_s3_bucket.publication_images.bucket
    TABLE_NAME = aws_dynamodb_table.publications.name
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "POST /publications"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn
}

module "lambda_get_publication" {
  depends_on = [ aws_apigatewayv2_api.api_http, aws_dynamodb_table.publications, data.aws_iam_role.iam_role_labrole ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-get-publication"
  filename = "./functions_zips/getPublications.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    TABLE_NAME = aws_dynamodb_table.publications.name
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /publications"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn
}


# resource "aws_apigatewayv2_domain_name" "api_custom_domain" {
#   domain_name = "api.aws.martinippolito.com.ar"
#   domain_name_configuration {
#     certificate_arn = aws_acm_certificate.wildcard.arn  # Assuming you already have the ACM certificate
#     endpoint_type   = "REGIONAL"
#     security_policy = "TLS_1_2"
#   }
# # Add a depends_on to wait for the certificate validation to be completed
#   depends_on = [aws_acm_certificate_validation.wildcard_validation]
# }

# resource "aws_apigatewayv2_api_mapping" "api_mapping" {
#   api_id      = aws_apigatewayv2_api.api_http.id
#   domain_name = aws_apigatewayv2_domain_name.api_custom_domain.domain_name
#   stage       = aws_apigatewayv2_stage.api_http_stage.name
# }

