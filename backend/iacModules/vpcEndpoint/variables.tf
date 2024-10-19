variable "aws_region" {
    description = "The AWS region to use for deploying resources."
    type        = string
}

variable "name" {
    description = "The name of the VPC endpoint."
    type        = string
}

variable "vpc_id" {
    description = "The ID of the VPC."
    type        = string
}

variable "service_name" {
    description = "The name of the service."
    type        = string  
}

variable "subnet_ids" {
    description = "The IDs of the subnets."
    type        = list(string)
}

variable "security_group_ids" {
    description = "The IDs of the security groups."
    type        = list(string)
} 

variable "policy_statements" {
    description = "Policy statements for the VPC endpoint."
    type        = list(object({
        Effect = string,
        Action   = list(string),
        Resource = string
        PrincipalArn = string
    }))    
}