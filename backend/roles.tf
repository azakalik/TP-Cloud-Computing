data "aws_iam_role" "iam_role_labrole" {
    name = "LabRole"
}
data "aws_caller_identity" "current" {}
