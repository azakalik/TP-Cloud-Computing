locals {
  full_frontend_bucket_name = "${var.frontend_bucket_name}-${var.username}"  # Using locals to create a full bucket name
}

# Create an S3 bucket for static website hosting
module "frontend_s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${local.full_frontend_bucket_name}"

  # Disable Block Public Access settings
  block_public_acls = false
  ignore_public_acls = false
  block_public_policy = false
  restrict_public_buckets = false

  attach_policy = true
  policy = jsonencode({
   
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
               "s3:ListBucket",
               "s3:GetObject",
               "s3:PutObject"
            ],
            "Resource": [
               "arn:aws:s3:::${local.full_frontend_bucket_name}",
               "arn:aws:s3:::${local.full_frontend_bucket_name}/*"
               ]
         }
    ]
})


putin_khuylo = true # We agree that putin is a khuylo

  cors_rule = [
   {
      allowed_methods = ["GET"]
      allowed_origins = ["*"]  # todo change to the domain of the frontend
      allowed_headers = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
   }
  ]

  website = {
      index_document = var.frontend_index_document
      error_document = var.frontend_error_document
  }
}

output "frontend_bucket_name" {
  value = local.full_frontend_bucket_name
}