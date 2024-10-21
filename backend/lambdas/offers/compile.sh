
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
cd $lambda_name
npm ci
npm run compile

# Zip the lambda
zip -r $output_dir/$lambda_name.zip 'node_modules/*' 'amazon-root-ca.pem' 'package.json' 'package-lock.json' 'dist/*'

echo "Created $output_dir/$lambda_name.zip"




