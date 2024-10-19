# Create an SQS queue without policy
resource "aws_sqs_queue" "auction_queue" {
  name                       = "ezauction-sqs-offers"
  visibility_timeout_seconds = 60     # 1 minute visibility timeout
  delay_seconds              = 0      # 0 seconds delivery delay
  receive_wait_time_seconds  = 5      # 5 seconds receive message wait time
  message_retention_seconds  = 3600   # 1 hour message retention period
  max_message_size           = 262144 # 256 KB max message size

  kms_master_key_id = "alias/aws/sqs" # Amazon SQS-managed encryption key
}

# Attach the policy to the SQS queue
resource "aws_sqs_queue_policy" "auction_queue_policy" {
  queue_url = aws_sqs_queue.auction_queue.id

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
          "SQS:*"
        ],
        Resource = aws_sqs_queue.auction_queue.arn # Refer to the queue ARN here
      },
      {
        Sid    = "__sender_statement",
        Effect = "Allow",
        Principal = {
          AWS = [
            data.aws_iam_role.iam_role_labrole.arn
          ]
        },
        Action = [
          "SQS:SendMessage"
        ],
        Resource = aws_sqs_queue.auction_queue.arn # Refer to the queue ARN here
      },
      {
        Sid    = "__receiver_statement",
        Effect = "Allow",
        Principal = {
          AWS = [
            data.aws_iam_role.iam_role_labrole.arn
          ]
        },
        Action = [
          "SQS:ChangeMessageVisibility",
          "SQS:DeleteMessage",
          "SQS:ReceiveMessage"
        ],
        Resource = aws_sqs_queue.auction_queue.arn # Refer to the queue ARN here
      }
    ]
  })
}