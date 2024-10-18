#!/bin/bash

# Define directories
CONNECT_DIR="lambdas/websocketConnect"
DISCONNECT_DIR="lambdas/websocketDisconnect"
NOTIFICATIONS_DIR="lambdas/notifications"
OUTPUT_DIR="functions_zips"

# Create the output directory if it doesn't exist
if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Creating $OUTPUT_DIR directory..."
  mkdir "$OUTPUT_DIR"
fi

# Create zip files for the connect lambda
if [ -d "$CONNECT_DIR" ]; then
  echo "Processing $CONNECT_DIR..."
  cd "$CONNECT_DIR" || exit
  
  # Check if node_modules exists, run npm install if it doesn't
  if [ ! -d "node_modules" ];then
    echo "node_modules not found in $CONNECT_DIR. Running npm install..."
    npm install
  fi

  # Zip the function
  zip -qr "../../$OUTPUT_DIR/websocketConnect.zip" main.js node_modules package.json package-lock.json
  cd - || exit
  echo "Created $OUTPUT_DIR/websocketConnect.zip"
else
  echo "$CONNECT_DIR does not exist."
fi

# Create zip files for the disconnect lambda
if [ -d "$DISCONNECT_DIR" ]; then
  echo "Processing $DISCONNECT_DIR..."
  cd "$DISCONNECT_DIR" || exit

  # Check if node_modules exists, run npm install if it doesn't
  if [ ! -d "node_modules" ]; then
    echo "node_modules not found in $DISCONNECT_DIR. Running npm install..."
    npm install
  fi

  # Zip the function
  zip -qr "../../$OUTPUT_DIR/websocketDisconnect.zip" main.js node_modules package.json package-lock.json
  cd - || exit
  echo "Created $OUTPUT_DIR/websocketDisconnect.zip"
else
  echo "$DISCONNECT_DIR does not exist."
fi


# Create zip files for the notification lambda
if [ -d "$NOTIFICATIONS_DIR" ]; then
  echo "Processing $NOTIFICATIONS_DIR..."
  cd "$NOTIFICATIONS_DIR" || exit

  # Check if node_modules exists, run npm install if it doesn't
  if [ ! -d "node_modules" ]; then
    echo "node_modules not found in $NOTIFICATIONS_DIR. Running npm install..."
    npm install
  fi

  # Zip the function
  zip -qr "../../$OUTPUT_DIR/notifications.zip" main.js node_modules package.json package-lock.json
  cd - || exit
  echo "Created $OUTPUT_DIR/notifications.zip"
else
  echo "$DISCONNECT_DIR does not exist."
fi


echo "Zipping completed."

# Check if terraform init has been run (i.e., check if the .terraform directory exists)
if [ ! -d ".terraform" ]; then
  echo ".terraform directory not found. Running terraform init..."
  terraform init
else
  echo "terraform init has already been run."
fi

# Run terraform apply
echo "Running terraform apply..."
terraform apply
