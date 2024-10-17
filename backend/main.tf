module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "ezauction-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1a", "us-east-1b", "us-east-1b"]
  private_subnets = ["10.0.0.0/18", "10.0.192.0/24", "10.0.64.0/18", "10.0.193.0/24"]
  private_subnet_names = ["ezauction-subnet-lambda-a", "ezauction-subnet-rds-a", "ezauction-subnet-lambda-b", "ezauction-subnet-rds-b"]

  enable_dns_hostnames = true
  enable_dns_support = true
}