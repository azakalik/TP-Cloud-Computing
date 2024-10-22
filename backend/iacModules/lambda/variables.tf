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
    description = "The ARN of the API Gateway execution role. Required if api_gw_id is set."
    type        = string 
    nullable    = true
    default     = null
}

variable "route_key" {
    description = "The route key for the Lambda function. Required if api_gw_id is set."
    type        = string
    nullable    = true
    default     = null
}