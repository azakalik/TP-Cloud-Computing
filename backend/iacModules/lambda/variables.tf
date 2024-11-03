variable "function_name" {
    description = "The name of the Lambda function."
    type        = string  
}

variable "handler" {
    description = "The handler of the Lambda function."
    type        = string  
    default     = "index.handler"
}

variable "runtime" {
    description = "The runtime of the Lambda function."
    type        = string  
    default     = "nodejs20.x"
}

variable "filename" {
    description = "The filename of the Lambda function."
    type        = string  
}

variable "timeout" {
    description = "The timeout of the Lambda function."
    type        = number  
    default     = 30  
}

variable "role_arn" {
    description = "The ARN of the IAM role."
    type        = string  
}

variable "env_vars" {
    description = "The environment variables for the Lambda function."
    type        = map(string) 
}

variable "api_gw_id" {
    description = "The ID of the API Gateway."
    type        = string 
    nullable    = true
    default     = null
}

variable "api_gw_execution_arn" {
    description = "The ARN of the API Gateway execution role. Required if api_gw_id is not null."
    type        = string 
    nullable    = true
    default     = null
}

variable "route_key" {
    description = "The route key for the Lambda function. Required if api_gw_id is not null."
    type        = string
    nullable    = true
    default     = null
}

variable "has_jwt_authorizer" {
    description = "Whether the Lambda function has a JWT authorizer."
    type        = bool
    default     = false    
}

variable "authorizer_id" {
    description = "The ID of the authorizer. Required if has_jwt_authorizer is true."
    type        = string
    nullable    = true
    default     = null  
}

variable "vpc_config" {
    description = "The VPC configuration for the Lambda function."
    type        = object({
        security_group_ids = list(string)
        subnet_ids         = list(string)
    })
    nullable    = true
    default     = null
}