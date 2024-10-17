variable "function_name" {
  description = "The name of the Lambda function that does not opperate at VPC level"
  type        = string
}

variable "handler" {
  description = "The function handler (e.g., index.handler)"
  type        = string
}

variable "runtime" {
  description = "The Lambda runtime (e.g., nodejs14.x)"
  type        = string
}

variable "filename" {
  description = "The filename of the Lambda function zip"
  type        = string
}

variable "role_arn" {
  description = "The ARN of the Lambda execution role"
  type        = string
}


variable "policy_statements" {
  description = "IAM policy statements for the Lambda function"
  type        = list(object({
    Action   = list(string),
    Effect   = string,
    Resource = string
  }))
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}
