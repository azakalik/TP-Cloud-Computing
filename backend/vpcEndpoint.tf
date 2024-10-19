resource "aws_vpc_endpoint" "vpc_endpoint_sqs" {
    depends_on = [ module.vpc, module.sg_vpc_endpoint ]
    vpc_id = module.vpc.vpc_id
    service_name = join(".", ["com.amazonaws", var.aws_region, "sqs"])
    subnet_ids = local.lambda_subnets
    vpc_endpoint_type = "Interface"
    security_group_ids = [module.sg_vpc_endpoint.security_group_id]
    
    dns_options {
        dns_record_ip_type = "ipv4"
    }

    tags = {
        Name = "ezauction-vpc-endpoint-sqs-offers"
    }  

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    AWS = data.aws_iam_role.iam_role_labrole.arn
                },
                Action = [
                    "sqs:SendMessage"
                ],
                Resource = aws_sqs_queue.auction_queue.arn
            }
        ]
    })
}

resource "aws_vpc_endpoint" "vpc_endpoint_secretsmanager" {
    depends_on = [ module.vpc, module.sg_vpc_endpoint ]
    vpc_id = module.vpc.vpc_id
    service_name = join(".", ["com.amazonaws", var.aws_region, "secretsmanager"])
    subnet_ids = local.lambda_subnets
    vpc_endpoint_type = "Interface"
    security_group_ids = [module.sg_vpc_endpoint.security_group_id]
    
    dns_options {
        dns_record_ip_type = "ipv4"
    }

    tags = {
        Name = "ezauction-vpc-endpoint-secrets"
    }  

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    AWS = data.aws_iam_role.iam_role_labrole.arn
                },
                Action = [
                    "secretsmanager:GetSecretValue"
                ],
                Resource = aws_secretsmanager_secret.secret_rds_credentials.arn
            }
        ]
    })
}
