resource "aws_lambda_function" "ezauction_lambda_create_publication" {
  function_name = "ezauction-lambda-create-publication"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/getPublications.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.publication_images.bucket
      TABLE_NAME = aws_dynamodb_table.publications.name 
    }
  }
}

resource "aws_lambda_function" "ezauction_lambda_get_publication" {
  function_name = "ezauction-lambda-get-publication"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  filename      = "./functions_zips/postPublications.zip"
  role          = data.aws_iam_role.iam_role_labrole.arn
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.publications.name 
    }
  }
}
