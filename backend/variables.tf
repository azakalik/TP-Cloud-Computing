############## PROVIDER STUFF ##############
# AWS Credentials file path
variable "aws_credentials_path" {
  description = "Path to the AWS credentials file."
  type        = string
  default     = "~/.aws/credentials"  # Default credentials path, can be overridden in .tfvars
}

# AWS Profile
variable "aws_profile" {
  description = "The AWS CLI profile to use. If not set, the default profile will be used."
  type        = string
  default     = "cloud-lab-profile"  # Use 'default' profile unless specified in .tfvars
}

# Other variables like region
variable "aws_region" {
  description = "The AWS region to use for deploying resources."
  type        = string
  default     = "us-east-1"
}
############## ##############

############## VPC STUFF ##############
variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}