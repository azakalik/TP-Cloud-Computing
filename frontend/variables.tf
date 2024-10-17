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

############## FRONTEND STUFF ##############
# Username for the dynamic bucket name
variable "username" {
  description = "Username defined in .tfvars to ensure uniqueness."
  type        = string
}

# S3 bucket frontend name
variable "frontend_bucket_name" {
  description = "The name of the frontend S3 bucket, which includes the username to ensure uniqueness."
  type        = string
  default     = "frontend-bucket"
}

# Local folder path to the website files
variable "frontend_directory" {
   description = "The local path where your static website files are stored."
   type        = string
   default     = "./src"
}

# Index document name
variable "frontend_index_document" {
  description = "The index document for the S3 static website."
  type        = string
  default     = "index.html"
}

# Error document name
variable "frontend_error_document" {
  description = "The error document for the S3 static website it is the same to index to allow accessing paths inside the webpage."
  type        = string
  default     = "index.html"
}
############## ##############
