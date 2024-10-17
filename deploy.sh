#!/bin/bash

# Exit script on any error
set -e

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
    *) 
        NO_BUILD=false 
        ;;
esac

# Step 1: Deploy the frontend if required
if $DEPLOY_FRONTEND; then
    echo "Deploying frontend..."
    cd frontend  # Navigate to the frontend directory
    ./deploy_frontend.sh "${NO_BUILD:+--no-build}" # Pass the no-build flag if specified
    cd -  # Navigate back to the root directory
fi

# Step 2: Deploy the backend if required (placeholder)
if $DEPLOY_BACKEND; then
    echo "Deploying backend... (not implemented)"
    # Call backend deployment script here (if implemented)
fi

# Step 3: Print completion message
if ! $DEPLOY_FRONTEND && ! $DEPLOY_BACKEND; then
    echo "No deployment requested. Please specify 'frontend' or 'backend'."
fi