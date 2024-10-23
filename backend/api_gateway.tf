resource "aws_apigatewayv2_api" "api_http" {
  name = "ezauction-api-http"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["Authorization", "Content-Type"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = ["*"] # Allow from anywhere
    expose_headers = ["Authorization"]
    max_age = 3600 # Cache CORS preflight responses for 1 hour
  }
}

resource "aws_apigatewayv2_stage" "api_http_stage" {
  api_id = aws_apigatewayv2_api.api_http.id
  name   = "prod"
  auto_deploy = true
}


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

  integrates_with_api_gw = true
  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "POST /publications"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
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

  integrates_with_api_gw = true
  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /publications"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

module "lambda_create_offers_table" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-create-offers-table"
  filename = "./functions_zips/createOffersTable.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    SECRET_NAME = var.rds_credentials_secret_name
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
  }

  integrates_with_api_gw = true
  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "POST /tables/offers"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

module "lambda_create_offer" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy, aws_sqs_queue.auction_queue, module.vpc_endpoint_sqs ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-create-offer"
  filename = "./functions_zips/placeOffer.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    SECRET_NAME = var.rds_credentials_secret_name
    SQS_URL = aws_sqs_queue.auction_queue.url
    SQS_ENDPOINT = module.vpc_endpoint_sqs.endpoint
  }

  integrates_with_api_gw = true
  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "POST /offers"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

module "lambda_get_highest_offer" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-get-highest-offer"
  filename = "./functions_zips/getHighestOffer.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    DB_SECRET_NAME = var.rds_credentials_secret_name
  }

  integrates_with_api_gw = true
  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /offers"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

resource "aws_lambda_invocation" "create_offers_table_invocation" {
  depends_on = [ module.lambda_create_offers_table, aws_db_instance.rds_instance_primary, aws_db_instance.rds_instance_replica ]
  function_name = module.lambda_create_offers_table.function_name
  input = jsonencode({})
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

# COGNITO AUTHORIZER
resource "aws_apigatewayv2_authorizer" "cognito_authorizer" {
  api_id = aws_apigatewayv2_api.api_http.id
  authorizer_type = "JWT"
  identity_sources = ["$request.header.Authorization"]  # Cognito tokens are passed in the Authorization header
  name = "CognitoAuthorizer"
  
  jwt_configuration {
    audience = [aws_cognito_user_pool_client.ez_auction_pool_client.id]  # Specify the Cognito app client ID
    issuer = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.ez_auction_user_pool.id}"      # Use the user pool's endpoint
  }
}
