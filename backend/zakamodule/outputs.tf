output "ezauction_lambda_create_publication_arn" {
  description = "The ARN of the ezauction lambda create publication function"
  value       = aws_lambda_function.ezauction_lambda_create_publication.lambda_function_arn
}

output "ezauction_lambda_create_publication_name" {
  description = "The name of the ezauction lambda create publication function"
  value       = aws_lambda_function.ezauction_lambda_create_publication.function_name
}

output "ezauction_lambda_get_publication_arn" {
  description = "The ARN of the ezauction lambda get publication function"
  value       = aws_lambda_function.ezauction_lambda_get_publication.lambda_function_arn
}

output "ezauction_lambda_get_publication_name" {
  description = "The name of the ezauction lambda get publication function"
  value       = aws_lambda_function.ezauction_lambda_get_publication.function_name
}
