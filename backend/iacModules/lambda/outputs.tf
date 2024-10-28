output "arn" {
  value = aws_lambda_function.function.arn  
}

output "id" {
    value = aws_lambda_function.function.id
}

output "function_name" {
    value = aws_lambda_function.function.function_name
}