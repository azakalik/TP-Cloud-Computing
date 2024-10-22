output "lambda_arn" {
  value = aws_lambda_function.lambda.arn  
}

output "lambda_id" {
    value = aws_lambda_function.lambda.id
}