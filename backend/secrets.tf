resource "aws_secretsmanager_secret" "secret_rds_credentials" {
    name = var.rds_credentials_secret_name
    description = "Access to RDS primary instance"
}

resource "aws_secretsmanager_secret_version" "secret_rds_credentials_version" {
    depends_on = [ aws_secretsmanager_secret.secret_rds_credentials ]
    secret_id = aws_secretsmanager_secret.secret_rds_credentials.id
    secret_string = jsonencode({
        username = var.rds_username,
        password = var.rds_password,
        port = 5432,
        dbname = var.rds_db_name
    })
}

resource "aws_secretsmanager_secret_policy" "secret_rds_credentials_policy" {
    secret_arn = aws_secretsmanager_secret.secret_rds_credentials.arn
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    AWS = data.aws_iam_role.iam_role_labrole.arn
                },
                Action = [
                    "secretsmanager:GetSecretValue"
                ],
                Resource = aws_secretsmanager_secret.secret_rds_credentials.arn
            }
        ]
    })
}
