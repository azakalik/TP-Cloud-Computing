# Create an SNS topic
resource "aws_sns_topic" "auction_topic" {
  name = "ezauction-sns-auction-topic"
}

# Attach a policy to the SNS topic
resource "aws_sns_topic_policy" "auction_topic_policy" {
  arn = aws_sns_topic.auction_topic.arn

  policy = jsonencode({
    Version = "2012-10-17",
    Id      = "__default_policy_ID",
    Statement = [
      {
        Sid    = "__owner_statement",
        Effect = "Allow",
        Principal = {
          AWS = data.aws_iam_role.iam_role_labrole.arn
        },
        Action = [
          "SNS:*"
        ],
        Resource = aws_sns_topic.auction_topic.arn # Refer to the SNS topic ARN here
      },
      {
        Sid    = "__publisher_statement",
        Effect = "Allow",
        Principal = {
          AWS = [
            data.aws_iam_role.iam_role_labrole.arn
          ]
        },
        Action = [
          "SNS:Publish"
        ],
        Resource = aws_sns_topic.auction_topic.arn # Refer to the SNS topic ARN here
      },
      {
        Sid    = "__subscriber_statement",
        Effect = "Allow",
        Principal = {
          AWS = [
            data.aws_iam_role.iam_role_labrole.arn
          ]
        },
        Action = [
          "SNS:Subscribe",
          "SNS:Receive"
        ],
        Resource = aws_sns_topic.auction_topic.arn # Refer to the SNS topic ARN here
      }
    ]
  })
}
