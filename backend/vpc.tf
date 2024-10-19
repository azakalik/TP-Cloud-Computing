module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "ezauction-vpc"
  cidr = var.vpc_cidr

  azs             = ["us-east-1a", "us-east-1a", "us-east-1b", "us-east-1b"]
  private_subnets = [cidrsubnet(var.vpc_cidr, 2, 0), cidrsubnet(var.vpc_cidr, 8, 192), cidrsubnet(var.vpc_cidr, 2, 1), cidrsubnet(var.vpc_cidr, 8, 193)]
  private_subnet_names = ["ezauction-subnet-lambda-a", "ezauction-subnet-rds-a", "ezauction-subnet-lambda-b", "ezauction-subnet-rds-b"]

  enable_dns_hostnames = true
  enable_dns_support = true
}

