module "lambda_create_offers_table" {
  depends_on = [ data.aws_iam_role.iam_role_labrole, aws_db_proxy.rds_proxy ]
  source = "./iacModules/lambda"

  function_name = "ezauction-lambda-create-offers-table"
  filename = "./functions_zips/createOffersTable.zip"
  role_arn = data.aws_iam_role.iam_role_labrole.arn
  env_vars = {
    SECRET_NAME = var.rds_credentials_secret_name
    RDS_PROXY_HOST = aws_db_proxy.rds_proxy.endpoint
  }

  vpc_config = {
    security_group_ids = [module.sg_lambda_rds.security_group_id, module.sg_lambda_vpc_endpoint.security_group_id]
    subnet_ids = local.lambda_subnets
  }
}

resource "aws_lambda_invocation" "create_offers_table_invocation" {
  depends_on = [ module.lambda_create_offers_table, aws_db_instance.rds_instance_primary, aws_db_instance.rds_instance_replica, module.vpc_endpoint_secretsmanager ]
  function_name = module.lambda_create_offers_table.function_name
  input = jsonencode({})
}