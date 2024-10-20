
const awsconfig = {
  Auth: {
    region: import.meta.env.VITE_REACT_AWS_REGION, // Your AWS region
    userPoolId: import.meta.env.VITE_REACT_COGNITO_POOLID, // Your Cognito User Pool ID
    userPoolWebClientId: import.meta.env.VITE_REACT_COGNITO_CLIENT_ID, // Your Cognito App Client ID
  },
};

export default awsconfig;
