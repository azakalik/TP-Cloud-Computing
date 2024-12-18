resource "aws_s3_bucket" "publication_images" {
  bucket = var.s3_publication_bucket_name
  force_destroy = true

  tags = {
    Name        = var.s3_publication_bucket_name
    Environment = "production"
  }
}

resource "aws_s3_bucket_ownership_controls" "publication_images_ownership_controls" {
  bucket = aws_s3_bucket.publication_images.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "publication_images_encryption_config" {
  bucket = aws_s3_bucket.publication_images.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Update the public access block to allow public bucket policies
resource "aws_s3_bucket_public_access_block" "publication_images_block" {
  bucket = aws_s3_bucket.publication_images.id

  block_public_acls       = false
  block_public_policy     = false  # Allow public policies to be applied
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "publication_images_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.publication_images_ownership_controls,
    aws_s3_bucket_public_access_block.publication_images_block,
  ]

  bucket = aws_s3_bucket.publication_images.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "publication_images_public_policy" {
  bucket = aws_s3_bucket.publication_images.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.publication_images.arn}/*"
      },
      {
        Sid       = "PublicUploadPutObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:PutObject",
        Resource  = "${aws_s3_bucket.publication_images.arn}/*",
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "public-read"
          }
        }
      }
    ]
  })
}


resource "aws_s3_bucket_cors_configuration" "publication_images_cors" {
  bucket = aws_s3_bucket.publication_images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "GET"]
    allowed_origins = ["*"]  # Replace with your frontend origin, e.g., ["https://example.com"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
