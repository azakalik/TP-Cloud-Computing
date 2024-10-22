variable "aws_credentials_path" {
  description = "Path to the AWS credentials file."
  type        = string
  default     = "~/.aws/credentials"
}

variable "aws_profile" {
  description = "The AWS CLI profile to use. If not set, the default profile will be used."
  type        = string
  default     = "cloud-lab-profile" 
}

variable "aws_region" {
  description = "The AWS region to use for deploying resources."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "rds_db_name" {
  description = "The name of the RDS database."
  type        = string
  default     = "ezauction"
}

variable "rds_username" {
  description = "The username for the RDS instance."
  type        = string  
}

variable "rds_password" {
  description = "The password for the RDS instance."
  type        = string
}

variable "s3_publication_bucket_name" {
  description = "The name of the S3 bucket for storing publications."
  type        = string  
  default     = "ezauction-publications-images"
}

variable "rds_credentials_secret_name" {
  description = "The name of the secret for storing RDS credentials."
  type        = string
  default     = "ezauction-rds-secret"
}