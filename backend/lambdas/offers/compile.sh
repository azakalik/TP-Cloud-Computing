lambda_name=$1
output_dir=$2

if [ -z "$lambda_name" ]; then
  echo "Lambda name is required"
  exit 1
fi

if [ -z "$output_dir" ]; then
  echo "Output directory is required"
  exit 1
fi

# Build the lambda
cd lambdas/offers/$lambda_name
npm ci
npm run compile


# Zip the lambda
echo I am zipping $lambda_name # Print a message indicating which Lambda function is being zipped
mkdir -p ../../../$output_dir  # Create the output directory if it doesn't exist
rm -rf temp_zip_directory || true # Remove the previous output directory. Ignore errors if doesn't exist
mkdir temp_zip_directory # Create a temporary directory for zipping files
cp -r node_modules amazon-root-ca.pem package.json package-lock.json dist temp_zip_directory # Copy required files and directories into the temporary directory
cd temp_zip_directory # Change the current directory to the temporary directory
mv dist/index.js index.js # Move index.js from the dist directory to the root of temp_zip_directory
rm -rf ../../../../$output_dir/$lambda_name.zip # Remove any existing zip file in the output directory to avoid conflicts
zip -qr ../../../../$output_dir/$lambda_name.zip * # Zip all contents of the temporary directory into a single zip file in the output directory
cd ..
rm -rf temp_zip_directory # Remove the temporary directory and its contents after zipping

cd ../../../

echo "Created $output_dir/$lambda_name.zip"
