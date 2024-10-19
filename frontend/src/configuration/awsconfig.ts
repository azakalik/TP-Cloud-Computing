
const awsconfig = {
  Auth: {
    region: import.meta.env.VITE_REACT_AWS_REGION, // Your AWS region
    userPoolId: import.meta.env.VITE_REACT_COGNITO_POOLID, // Your Cognito User Pool ID
    userPoolWebClientId: import.meta.env.VITE_REACT_COGNITO_CLIENT_ID, // Your Cognito App Client ID
    oauth: {
      domain: import.meta.env.VITE_REACT_COGNITO_DOMAIN, // Your Cognito Hosted UI domain
      scope: ['email', 'openid'], // Scopes to request
      redirectSignIn: 'http://localhost:5173/', // URL to redirect to after sign-in
      redirectSignOut: 'http://localhost:5173/', // URL to redirect to after sign-out
      responseType: 'code', // or 'token', based on your needs
    },
  },
};

export default awsconfig;
