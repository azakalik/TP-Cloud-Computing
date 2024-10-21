resource "aws_dynamodb_table" "publications" {
  name           = "PUBLICATIONS"
  billing_mode   = "PAY_PER_REQUEST"  # This sets it to on-demand mode.
  hash_key       = "PK"  # Partition key
  range_key      = "SK"  # Sort key

  attribute {
    name = "PK"
    type = "S"  # String type for partition key
  }

  attribute {
    name = "SK"
    type = "S"  # String type for sort key
  }

  tags = {
    Name = "PUBLICATIONS"
  }
}