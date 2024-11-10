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


module "lambda_check_sns_sub" {
  depends_on = [ aws_apigatewayv2_api.api_http, aws_s3_bucket.publication_images, aws_dynamodb_table.publications, data.aws_iam_role.iam_role_labrole ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-check-sns-sub"
  filename = "./functions_zips/checkSnsSub.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = { 
    ACCOUNT_ID = data.aws_caller_identity.current.account_id
  }
  handler = "index.handler"

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /publications/suscribeSnS"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
}



module "lambda_suscribe_sns" {
  depends_on = [ aws_apigatewayv2_api.api_http, aws_s3_bucket.publication_images, aws_dynamodb_table.publications, data.aws_iam_role.iam_role_labrole ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-suscribe-sns-mail"
  filename = "./functions_zips/suscribeSns.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = { 
    ACCOUNT_ID = data.aws_caller_identity.current.account_id
  }
  handler = "main.handler"

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "POST /publications/suscribeSnS"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
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
    SEND_EMAIL_LAMBDA_ARN = aws_lambda_function.send_msg_disc.arn
  }

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
  handler = "main.handler"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    TABLE_NAME = aws_dynamodb_table.publications.name
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /publications"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

module "lambda_create_offer" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy, aws_sns_topic.auction_topic, module.vpc_endpoint_sns, aws_cognito_user_pool.ez_auction_user_pool, aws_cognito_user_pool_client.ez_auction_pool_client ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-create-offer"
  filename = "./functions_zips/placeOffer.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    SECRET_NAME = var.rds_credentials_secret_name
    SNS_ARN = aws_sns_topic.auction_topic.arn
    SNS_ENDPOINT = "https://${module.vpc_endpoint_sns.endpoint}"
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.ez_auction_user_pool.id
    COGNITO_CLIENT_ID = aws_cognito_user_pool_client.ez_auction_pool_client.id
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "POST /offers"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id

  vpc_config = {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
}

module "lambda_get_highest_offer" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-get-highest-offer"
  filename = "./functions_zips/getHighestOffer.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    SECRET_NAME = var.rds_credentials_secret_name
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /offers"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id

  vpc_config = {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
}

module "lambda_add_funds" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-add-funds"
  filename = "./functions_zips/addFunds.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    SECRET_NAME = var.rds_credentials_secret_name
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "PUT /funds"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id

  vpc_config = {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
}

module "lambda_get_funds" {
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-get-funds"
  filename = "./functions_zips/getFunds.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    SECRET_NAME = var.rds_credentials_secret_name
  }

  api_gw_id = aws_apigatewayv2_api.api_http.id
  route_key = "GET /funds"
  api_gw_execution_arn = aws_apigatewayv2_api.api_http.execution_arn

  has_jwt_authorizer = true
  authorizer_id = aws_apigatewayv2_authorizer.cognito_authorizer.id

  vpc_config = {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }  
}

module "lambda_notify_winner" {
  # TODO: Add the SNS dependency
  depends_on = [ aws_apigatewayv2_api.api_http, data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy, module.vpc_endpoint_sns ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-notify-winner"
  filename = "./functions_zips/notifyWinner.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    SECRET_NAME = var.rds_credentials_secret_name
    SNS_ENDPOINT = "https://${module.vpc_endpoint_sns.endpoint}"
    ACCOUNT_ID = data.aws_caller_identity.current.account_id
  }

  vpc_config = {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
}

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
