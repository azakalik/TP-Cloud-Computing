#!/bin/bash

# Define directories
CONNECT_DIR="lambdas/websocketConnect"
DISCONNECT_DIR="lambdas/websocketDisconnect"
OUTPUT_DIR="functions_zips"

# Create the output directory if it doesn't exist
if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Creating $OUTPUT_DIR directory..."
  mkdir "$OUTPUT_DIR"
fi

# Create zip files for the connect lambda
if [ -d "$CONNECT_DIR" ]; then
  echo "Zipping main.js from $CONNECT_DIR..."
  cd "$CONNECT_DIR" || exit
  zip -r "../../$OUTPUT_DIR/websocketConnect.zip" main.js
  cd - || exit
  echo "Created $OUTPUT_DIR/websocketConnect.zip"
else
  echo "$CONNECT_DIR does not exist."
fi

# Create zip files for the disconnect lambda
if [ -d "$DISCONNECT_DIR" ]; then
  echo "Zipping main.js from $DISCONNECT_DIR..."
  cd "$DISCONNECT_DIR" || exit
  zip -r "../../$OUTPUT_DIR/websocketDisconnect.zip" main.js
  cd - || exit
  echo "Created $OUTPUT_DIR/websocketDisconnect.zip"
else
  echo "$DISCONNECT_DIR does not exist."
fi

echo "Zipping completed."

terraform init
terraform apply

