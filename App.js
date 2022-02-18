import React from "react";
import App from "./App/index";

import Amplify from 'aws-amplify';

const awsmobile = {
    "aws_project_region": "us-east-1",
    "aws_appsync_graphqlEndpoint": "https://so3izsg42rcydeh3sa7k6ruoca.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-ny5wk2jvjzf75ohnh4mk6wzqpa",
    "aws_cognito_identity_pool_id": "us-east-1:4c4a6522-b24e-4f25-acec-92857c8160aa",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_17owOlMQr",
    "aws_user_pools_web_client_id": "l9qu3hv8ncs51i0hqn8l0cfeb",
    "oauth": {},
    "aws_cognito_username_attributes": [
        "PHONE_NUMBER"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "PHONE_NUMBER"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_LOWERCASE",
            "REQUIRES_NUMBERS",
            "REQUIRES_SYMBOLS",
            "REQUIRES_UPPERCASE"
        ]
    },
    "aws_cognito_verification_mechanisms": [
        "PHONE_NUMBER"
    ]
};
Amplify.configure(awsmobile)

//import config from './src/aws-exports'
//Amplify.configure(config)

export default () => <App />;