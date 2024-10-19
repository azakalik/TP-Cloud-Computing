module "vpc_endpoint_sqs" {
    depends_on = [ aws_sqs_queue.auction_queue, data.aws_iam_role.iam_role_labrole, module.sg_vpc_endpoint, module.vpc ]
    source = "./iacModules/vpcEndpoint"

    aws_region = var.aws_region
    name = "ezauction-vpc-endpoint-sqs-offers"
    vpc_id = module.vpc.vpc_id
    service_name = "sqs"
    subnet_ids = local.lambda_subnets
    security_group_ids = [module.sg_vpc_endpoint.security_group_id]
    policy_statements = [
        {
            Effect = "Allow"
            Action = ["sqs:SendMessage"]
            Resource = aws_sqs_queue.auction_queue.arn
            PrincipalArn = data.aws_iam_role.iam_role_labrole.arn
        }
    ]
}

module "vpc_endpoint_secretsmanager" {
    depends_on = [ aws_secretsmanager_secret_version.secret_rds_credentials_version, data.aws_iam_role.iam_role_labrole, module.sg_vpc_endpoint, module.vpc ]
    source = "./iacModules/vpcEndpoint"

    aws_region = var.aws_region
    name = "ezauction-vpc-endpoint-secrets"
    vpc_id = module.vpc.vpc_id
    service_name = "secretsmanager"
    subnet_ids = local.lambda_subnets
    security_group_ids = [module.sg_vpc_endpoint.security_group_id]
    policy_statements = [
        {
            Effect = "Allow"
            Action = ["secretsmanager:GetSecretValue"]
            Resource = aws_secretsmanager_secret.secret_rds_credentials.arn
            PrincipalArn = data.aws_iam_role.iam_role_labrole.arn
        }
    ]
}