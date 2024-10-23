#!/bin/bash

# Exit script on any error
set -e

# Check if --no-build was passed
# If --no-build is passed, the script will skip the npm install and build steps
BUILD_FRONTEND=true
for arg in "$@"; do
  if [ "$arg" == "--no-build" ]; then
    BUILD_FRONTEND=false
    break
  fi
done

DIST_DIR="dist"  # Path to the build output

# Step 1: Build the frontend if needed
if $BUILD_FRONTEND; then
    echo "Building the frontend..."
    yarn install  # Install dependencies (optional)
    yarn build    # Build the frontend
else
    echo "Skipping frontend build. Using existing dist folder if it exists..."
    if [ ! -d "$DIST_DIR" ]; then
        echo "Error: Dist folder not found. Please ensure the frontend is built correctly."
        exit 1
    fi
fi

# Step 2: Navigate back to the root directory and deploy Terraform
echo "Deploying Terraform infrastructure..."
terraform init      # Initialize Terraform (only needed for the first time or after changes)
# terraform plan
terraform apply -auto-approve

# Step 3: Upload the build output (dist) to the S3 bucket
S3_BUCKET=$(terraform output -raw frontend_bucket_name)  # Fetch the bucket name from Terraform output
echo "Uploading the dist folder to S3 bucket: $S3_BUCKET"
aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET/" --profile cloud-lab-profile # Sync dist folder with S3 bucket

# Step 4: Print success message
echo "Deployment successful! Your website should be live at http://$S3_BUCKET.s3-website-us-east-1.amazonaws.com"
