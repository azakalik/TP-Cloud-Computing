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

variable "integrates_with_api_gw" {
    description = "Whether the Lambda function integrates with an API Gateway."
    type        = bool
    default     = false  
}

variable "api_gw_id" {
    description = "The ID of the API Gateway. Required if integrates_with_api_gw is true."
    type        = string 
    nullable    = true
    default     = null
}

variable "api_gw_execution_arn" {
    description = "The ARN of the API Gateway execution role. Required if integrates_with_api_gw is true."
    type        = string 
    nullable    = true
    default     = null
}

variable "route_key" {
    description = "The route key for the Lambda function. Required if integrates_with_api_gw is true."
    type        = string
    nullable    = true
    default     = null
}