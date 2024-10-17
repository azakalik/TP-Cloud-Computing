#!/bin/bash

# Exit script on any error
set -e

# If no arguments are provided, default to building the frontend
if [ "$#" -eq 0 ]; then
    BUILD_FRONTEND=true  # Default to building the frontend
else
# Parse command-line arguments
   while [[ "$#" -gt 0 ]]; do
      case $1 in
         --no-build) BUILD_FRONTEND=false; shift ;; # Skip building the frontend
         *) echo "Unknown parameter: $1"; exit 1 ;;
      esac
   done
fi


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
terraform apply  # Deploy infrastructure

# Step 3: Upload the build output (dist) to the S3 bucket
S3_BUCKET=$(terraform output -raw frontend_bucket_name)  # Fetch the bucket name from Terraform output
echo "Uploading the dist folder to S3 bucket: $S3_BUCKET"
aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET/"  # Sync dist folder with S3 bucket

# Step 4: Print success message
echo "Deployment successful! Your website should be live at http://$S3_BUCKET.s3-website-us-east-1.amazonaws.com"
