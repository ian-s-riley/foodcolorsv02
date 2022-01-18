import React, { useState, useEffect } from 'react';

import { useDispatch, connect } from 'react-redux'
import { updateUser } from './src/features/user/userSlice'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import moment from 'moment';

import {
  NativeBaseProvider,
  View,
} from 'native-base';

//screens for un-authed users
import Welcome from './src/Welcome';
import ProfileAuth from './src/ProfileAuth';

//screens for auth users
import Home from './src/Home';
import Profile from './src/Profile'
import Colors from './src/Colors';
import Recipes from './src/Recipes';
import Joke from './src/Joke';
import Streak from './src/Streak'

import Amplify, { Auth, Hub } from 'aws-amplify';
//import config from './src/aws-exports'
//Amplify.configure(config)

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

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const Initializing = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="skyblue" />
    </View>
  );
};

function MyAuthStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Home" component={Welcome} />
      <AuthStack.Screen name="New User" component={ProfileAuth} />
    </AuthStack.Navigator>
  );
}

function MyAppStack() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">{props => (<Home {...props} />)}</AppStack.Screen>
      <AppStack.Screen name="Red">{props => (<Colors {...props} color={"red"} />)}</AppStack.Screen>
      <AppStack.Screen name="Orange">{props => (<Colors {...props} color={"orange"} />)}</AppStack.Screen>
      <AppStack.Screen name="Yellow">{props => (<Colors {...props} color={"yellow"} />)}</AppStack.Screen>
      <AppStack.Screen name="Green">{props => (<Colors {...props} color={"green"} />)}</AppStack.Screen>
      <AppStack.Screen name="Purple">{props => (<Colors {...props} color={"purple"} />)}</AppStack.Screen>
      <AppStack.Screen name="Blue">{props => (<Colors {...props} color={"blue"} />)}</AppStack.Screen>
      <AppStack.Screen name="Recipes">{props => (<Recipes {...props} />)}</AppStack.Screen>
      <AppStack.Screen name="Joke">{props => (<Joke {...props} />)}</AppStack.Screen>
      <AppStack.Screen name="Streak">{props => (<Streak {...props} />)}</AppStack.Screen>
      <AppStack.Screen name="Profile">
        {props => (<Profile {...props} />)}</AppStack.Screen>
    </AppStack.Navigator>
  );
}

function mapStateToProps(state) {
  //console.log('App.js - mapStateToProps - state.user', state.user)
  return {
    user: state.user,
  }
}

function App(props) {
  const dispatch = useDispatch()
  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');
  const [loggedInUser, setLoggedInUser] = useState();

  //listen for any auth changes (login & logout) to update the routes
  useEffect(() => {
    Hub.listen('auth', (data) => {
      const { payload } = data
      //console.log('A new auth event has happened: ', payload)
      if (payload.event === 'signIn') {
        //console.log('A user has signed in!')
        //storeData(payload.data)
        setLoggedInUser(payload.data.username)
        setUserLoggedIn('loggedIn')
      }
      if (payload.event === 'signOut') {
        //console.log('A user has signed out!')
        setUserLoggedIn('loggedOut')
      }
    })
  }, [])

  // const storeData = async (value) => {
  //   try {
  //     const jsonValue = JSON.stringify(value)
  //     //console.log('set @storage_Key', jsonValue)
  //     await AsyncStorage.setItem('@storage_Key', jsonValue)
  //   } catch (e) {
  //     // error storing value
  //     //console.log('error', e)
  //   }
  // }

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const thisUser = await Auth.currentAuthenticatedUser()
      setLoggedInUser(thisUser.username)
    } catch (err) {
      //console.log(' User is not signed in', err)
      setLoggedInUser()
      setUserLoggedIn('loggedOut')
    }
  }

  useEffect(() => {
    loggedInUser && setUser()
  }, [loggedInUser])

  async function setUser() {
    try {
      const today = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
      const authUser = await Auth.currentAuthenticatedUser()
      //console.log('App.js - setUser - authUser', authUser.attributes)
      dispatch(updateUser({ ...props.user, "username": authUser.attributes.phone_number, "phoneNumber": authUser.attributes.phone_number, "currentDate": today, "isToday": true }))
      setUserLoggedIn('loggedIn')
    } catch (err) {
      //console.log(' User is not signed in', err)
      setLoggedInUser()
      setUserLoggedIn('loggedOut')
    }
  }

  return (
    <NavigationContainer>
      <NativeBaseProvider>

        {isUserLoggedIn === 'initializing' && <Initializing />}
        {isUserLoggedIn === 'loggedIn' && (
          <MyAppStack />
        )}
        {isUserLoggedIn === 'loggedOut' && (
          <MyAuthStack />
        )}


      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default connect(mapStateToProps)(App)