output_dir=$1

if [ -z "$output_dir" ]; then
  echo "Output directory is required"
  exit 1
fi

npm ci

lambdas=./functions/*/

pwd="$(pwd)"
tmp_tsc_dir=$PWD/tmp/tsc
tmp_zip_dir=$PWD/tmp/zip

for lambda_dir in $lambdas; do
  lambda_name=$(basename "$lambda_dir") 

  rm -rf "$tmp_zip_dir" || true
  mkdir -p "$tmp_zip_dir"
  cp -r node_modules amazon-root-ca.pem package.json package-lock.json $tmp_zip_dir
  cp -r $lambda_dir/. $tmp_zip_dir
  cd $tmp_zip_dir
  find . -name "*.ts" -type f -delete

  cd $pwd

  rm -rf "$tmp_tsc_dir" || true
  mkdir -p "$tmp_tsc_dir"
  cp -r shared tsconfig.json $tmp_tsc_dir

  cp -r $lambda_dir/. $tmp_tsc_dir

  cd $tmp_tsc_dir
  npx tsc

  find . -name "*.map" -type f -delete

  cp -r dist/. $tmp_zip_dir

  cd $tmp_zip_dir

  zip_file=$output_dir/$lambda_name.zip

  rm -rf $zip_file

  zip -qr $zip_file *

  cd $pwd

  echo "Created $zip_file"
done
