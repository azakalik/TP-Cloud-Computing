#!/bin/bash

# Check if --no-build was passed
# If --no-build is passed, the script will skip the npm install and build steps
NO_BUILD=false
for arg in "$@"; do
  if [ "$arg" == "--no-build" ]; then
    NO_BUILD=true
    break
  fi
done

# Define directories
CWD="$(pwd)"
DELETE_SNS_SUB_DIR="lambdas/unsuscribeSnS"
CHECK_SNS_SUB="lambdas/checkSnSSuscription"
SUSCRIBE_SNS_DIR="lambdas/suscribeSnS"
CONNECT_DIR="lambdas/websocketConnect"
DISCONNECT_DIR="lambdas/websocketDisconnect"
NOTIFICATIONS_DIR="lambdas/notifications"
GET_PUBLICATIONS_DIR="lambdas/publications/getPublications"
POST_PUBLICATIONS_DIR="lambdas/publications/postPublications"
OFFERS_DIR="lambdas/offers"
OUTPUT_DIR="$CWD/functions_zips"
ENV_FILE="../frontend/.env"


terraform init

# Create the output directory if it doesn't exist
if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Creating $OUTPUT_DIR directory..."
  mkdir "$OUTPUT_DIR"
fi




# If --no-build is not passed, run npm install and build for the lambdas
if [ "$NO_BUILD" = false ]; then

if [ -d "$DELETE_SNS_SUB_DIR" ]; then
    echo "Processing $DELETE_SNS_SUB_DIR..."
    cd "$DELETE_SNS_SUB_DIR" || exit
    
    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/deleteSnsSub.zip" index.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/deleteSnsSub.zip"
  else
    echo "$DELETE_SNS_SUB_DIR does not exist."
  fi


  if [ -d "$SUSCRIBE_SNS_DIR" ]; then
    echo "Processing $SUSCRIBE_SNS_DIR..."
    cd "$SUSCRIBE_SNS_DIR" || exit
    
    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/suscribeSns.zip" main.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/websocketConnect.zip"
  else
    echo "$SUSCRIBE_SNS_DIR does not exist."
  fi


  if [ -d "$CHECK_SNS_SUB" ]; then
    echo "Processing $CHECK_SNS_SUB..."
    cd "$CHECK_SNS_SUB" || exit
    
    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/checkSnsSub.zip" index.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/checkSnsSub.zip"
  else
      echo "$CHECK_SNS_SUB does not exist."
  fi



  # Create zip files for the connect lambda
  if [ -d "$CONNECT_DIR" ]; then
    echo "Processing $CONNECT_DIR..."
    cd "$CONNECT_DIR" || exit
    
    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/websocketConnect.zip" main.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/websocketConnect.zip"
  else
    echo "$CONNECT_DIR does not exist."
  fi

  # Create zip files for the disconnect lambda
  if [ -d "$DISCONNECT_DIR" ]; then
    echo "Processing $DISCONNECT_DIR..."
    cd "$DISCONNECT_DIR" || exit

    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/websocketDisconnect.zip" main.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/websocketDisconnect.zip"
  else
    echo "$DISCONNECT_DIR does not exist."
  fi

  # Create zip files for the notification lambda
  if [ -d "$NOTIFICATIONS_DIR" ]; then
    echo "Processing $NOTIFICATIONS_DIR..."
    cd "$NOTIFICATIONS_DIR" || exit

    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/notifications.zip" main.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/notifications.zip"
  else
    echo "$NOTIFICATIONS_DIR does not exist."
  fi

  # Create zip files for the getPublications lambda
  if [ -d "$GET_PUBLICATIONS_DIR" ]; then
    echo "Processing $GET_PUBLICATIONS_DIR..."
    cd "$GET_PUBLICATIONS_DIR" || exit

    # Skip npm install for getPublications lambda as it doesn't have any dependencies

    # Zip the function
    zip -qr "$OUTPUT_DIR/getPublications.zip" main.js
    cd - || exit
    echo "Created $OUTPUT_DIR/getPublications.zip"
  else
    echo "$GET_PUBLICATIONS_DIR does not exist."
  fi

  # Create zip files for the postPublications lambda
  if [ -d "$POST_PUBLICATIONS_DIR" ]; then
    echo "Processing $POST_PUBLICATIONS_DIR..."
    cd "$POST_PUBLICATIONS_DIR" || exit
    
    npm install

    # Zip the function
    zip -qr "$OUTPUT_DIR/postPublications.zip" index.js node_modules package.json package-lock.json
    cd - || exit
    echo "Created $OUTPUT_DIR/postPublications.zip"
  else
    echo "$POST_PUBLICATIONS_DIR does not exist."
  fi

  # Create zip file for offers lambdas
  if [ -d "$OFFERS_DIR" ]; then
    echo "Processing $OFFERS_DIR..."

    cd "$OFFERS_DIR" || exit

    sh "./compile.sh" "$OUTPUT_DIR"

    cd "$CWD"
  else
    echo "$OFFERS_DIR does not exist."
  fi

  echo "Zipping completed."
else
  echo "--no-build flag passed. Skipping npm install and build steps."
fi


# Check if terraform init has been run (i.e., check if the .terraform directory exists)
if [ ! -d ".terraform" ]; then
  echo ".terraform directory not found. Running terraform init..."
  terraform init
else
  echo "terraform init has already been run."
fi

# Run terraform apply
echo "Running terraform apply..."
terraform apply -target=aws_apigatewayv2_api.api_http -target=aws_apigatewayv2_api.websocket_api -auto-approve
terraform apply -auto-approve


COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
COGNITO_USER_POOL_CLIENT_ID=$(terraform output -raw cognito_user_pool_client_id)

HTTP_API_GW_URL=$(terraform output -raw http_api_gw_url)
WS_API_GW_URL=$(terraform output -raw ws_api_gw_url)


# Check if .env file exists, if not, create it
if [ ! -f "$ENV_FILE" ]; then
  echo "$ENV_FILE does not exist. Creating .env file..."
  touch "$ENV_FILE"
fi

# Write variables to the .env file
echo "VITE_REACT_AWS_REGION=us-east-1" > "$ENV_FILE"

echo "VITE_REACT_COGNITO_POOLID=$COGNITO_USER_POOL_ID" >> "$ENV_FILE"
echo "VITE_REACT_COGNITO_CLIENT_ID=$COGNITO_USER_POOL_CLIENT_ID" >> "$ENV_FILE"

echo "VITE_HTTP_API_GW_URL=$HTTP_API_GW_URL" >> "$ENV_FILE"
echo "VITE_WS_API_GW_URL=$WS_API_GW_URL" >> "$ENV_FILE"

echo "Environment variables updated in $ENV_FILE"
