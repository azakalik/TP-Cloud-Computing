# Frontend
## First installation
Run `yarn install`

## Local server
Run `yarn dev`

## Deploy
- Create a S3 bucket with no versioning and the specific settings for static web hosting
- Run the command `yarn build` and a `dist` folder will be generated
- Upload the dist folder contents to the bucket