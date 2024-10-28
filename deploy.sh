#!/bin/bash

# Exit script on any error
set -e

# Function to check if a command is installed
function check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is not installed. Please install it to continue."
        exit 1
    fi
}

# Validate prerequisites
check_command aws
check_command terraform
check_command node
check_command yarn
check_command zip


# Check if any arguments are provided
if [ "$#" -eq 0 ]; then
    echo "Error: You must specify at least one parameter: frontend, backend, or all."
    exit 1
fi

# Initialize flags
DEPLOY_FRONTEND=false
DEPLOY_BACKEND=false

# Set deployment target flags
case $1 in
    frontend) 
        DEPLOY_FRONTEND=true 
        ;;
    backend) 
        DEPLOY_BACKEND=true 
        ;;
    all) 
        DEPLOY_FRONTEND=true 
        DEPLOY_BACKEND=true 
        ;;
    *) 
        echo "Unknown parameter: $1. Use frontend, backend, or all."
        exit 1 
        ;;
esac

# Parse optional flags
case $2 in
    --no-build) 
        NO_BUILD=true 
        ;;
esac

# Step 1: Deploy the backend if required
if $DEPLOY_BACKEND; then
    echo "Deploying backend..."
    cd backend  # Navigate to the backend directory
    ./deploy_backend.sh "${NO_BUILD:+--no-build}" # Pass the no-build flag if specified
   cd -  # Navigate back to the root directory
    echo "Backend deployment complete."
fi

# Step 2: Deploy the frontend if required
if $DEPLOY_FRONTEND; then
    echo "Deploying frontend..."
    cd frontend  # Navigate to the frontend directory
    ./deploy_frontend.sh "${NO_BUILD:+--no-build}" # Pass the no-build flag if specified
    cd -  # Navigate back to the root directory
    echo "Frontend deployment complete."
fi

# Step 3: Print completion message
if ! $DEPLOY_FRONTEND && ! $DEPLOY_BACKEND; then
    echo "No deployment requested. Please specify 'frontend' or 'backend'."
fi