module "sg_rds" {
    depends_on = [ module.vpc ]
    source = "terraform-aws-modules/security-group/aws"

    name = "ezauction-sg-rds"
    description = "Allow RDS proxy connect to RDS instances"
    vpc_id = module.vpc.vpc_id

    ingress_with_source_security_group_id = [
        {
            rule = "postgresql-tcp"
            source_security_group_id = module.sg_rds.security_group_id
            description = "Allow connection between RDS instances"
        }, 
        {
            rule = "postgresql-tcp"
            source_security_group_id = module.sg_rds_proxy.security_group_id
            description = "Allow connection from RDS proxy"
        }
    ]

    egress_with_source_security_group_id = [
        {
            rule = "postgresql-tcp"
            source_security_group_id = module.sg_rds.security_group_id
            description = "Allow connection between RDS instances"
        }
    ]
}

module "sg_rds_proxy" {
    depends_on = [ module.vpc ]
    source = "terraform-aws-modules/security-group/aws"

    name = "ezauction-sg-rds-proxy"
    description = "Allow VPC lambdas access the RDS instance through the RDS Proxy"
    vpc_id = module.vpc.vpc_id

    ingress_with_source_security_group_id = [
        {
            rule = "postgresql-tcp"
            source_security_group_id = module.sg_lambda_rds.security_group_id
            description = "Allow connection from VPC lambdas"
        }
    ]

    egress_with_source_security_group_id = [
        {
            rule = "postgresql-tcp"
            source_security_group_id = module.sg_rds.security_group_id
            description = "Allow connection to RDS instances"
        }
    ]
}

module "sg_vpc_endpoint" {
    depends_on = [ module.vpc ]
    source = "terraform-aws-modules/security-group/aws"

    name = "ezauction-sg-vpc-endpoint"
    description = "Allow lambdas to access VPC endpoints"
    vpc_id = module.vpc.vpc_id

    ingress_with_source_security_group_id = [
        {
            rule = "all-tcp"
            source_security_group_id = module.sg_lambda_vpc_endpoint.security_group_id
            description = "Allow connection from VPC lambdas"
        }
    ]

    egress_rules = []
}

module "sg_lambda_vpc_endpoint" {
    depends_on = [ module.vpc ]
    source = "terraform-aws-modules/security-group/aws"

    name = "ezauction-sg-lambda-vpc-endpoint"
    description = "Allow offers lambdas to communicate with VPC endpoints"
    vpc_id = module.vpc.vpc_id

    ingress_rules = []

    egress_with_source_security_group_id = [
        {
            rule = "all-tcp"
            source_security_group_id = module.sg_vpc_endpoint.security_group_id
            description = "Allow connection to VPC endpoints"
        }
    ]
}

module "sg_lambda_rds" {
    depends_on = [ module.vpc ]
    source = "terraform-aws-modules/security-group/aws"

    name = "ezauction-sg-lambda-rds"
    description = "Allow offers lambdas to communicate with RDS"
    vpc_id = module.vpc.vpc_id

    ingress_rules = []

    egress_with_source_security_group_id = [
        {
            rule = "postgresql-tcp"
            source_security_group_id = module.sg_rds_proxy.security_group_id
            description = "Allow connection to RDS instances"
        }
    ]
}