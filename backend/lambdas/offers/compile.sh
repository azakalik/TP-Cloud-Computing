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
echo I am zipping $lambda_name
mkdir -p ../../../$output_dir  # Ensure the output directory exists
rm -rf ../../../$output_dir/$lambda_name.zip
zip -qr ../../../$output_dir/$lambda_name.zip node_modules amazon-root-ca.pem package.json package-lock.json dist/index.js

cd -

echo "Created $output_dir/$lambda_name.zip"
