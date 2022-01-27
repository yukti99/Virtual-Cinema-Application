echo "STARTING DEPLOY"
echo "====================================="
rm -rf build
yarn build
cd build
aws s3 sync . s3://vc.hojaeyoon.com