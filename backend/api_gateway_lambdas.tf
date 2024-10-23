resource "aws_lambda_function" "ezauction_lambda_create_publication" {
  function_name = "ezauction-lambda-create-publication"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/postPublications.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  source_code_hash = filebase64sha256("./functions_zips/postPublications.zip")
  timeout       = 30
  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.publication_images.bucket
      TABLE_NAME = aws_dynamodb_table.publications.name 
    }
  }
}

resource "aws_lambda_function" "ezauction_lambda_get_publication" {
  function_name = "ezauction-lambda-get-publication"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/getPublications.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  source_code_hash = filebase64sha256("./functions_zips/getPublications.zip")
  timeout       = 30
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.publications.name 
    }
  }
}

resource "aws_lambda_function" "ezauction_lambda_get_highest_offer" {
  function_name = "ezauction-lambda-get-highest-offer"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/getHighestOffer.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  source_code_hash = filebase64sha256("./functions_zips/getHighestOffer.zip")
  timeout       = 30
  vpc_config {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
  environment {
    variables = {
      RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
      DB_SECRET_NAME = var.rds_credentials_secret_name
    }
  }
}

resource "aws_lambda_function" "ezauction_lambda_create_offer" {
  function_name = "ezauction-lambda-create-offer"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/placeOffer.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  source_code_hash = filebase64sha256("./functions_zips/placeOffer.zip")
  timeout       = 30
  vpc_config {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
  environment {
    variables = {
      RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
      SECRET_NAME = var.rds_credentials_secret_name
      SQS_URL = aws_sqs_queue.auction_queue.url
      SQS_ENDPOINT = module.vpc_endpoint_sqs.endpoint
    }
  }
}

resource "aws_lambda_function" "ezauction_lambda_create_offers_table" {
  function_name = "ezauction-lambda-create-offers-table"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/createOffersTable.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  source_code_hash = filebase64sha256("./functions_zips/createOffersTable.zip")
  timeout       = 30
  vpc_config {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
  environment {
    variables = {
      SECRET_NAME = var.rds_credentials_secret_name
      RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
    }
  }
}