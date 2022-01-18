import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';

import {
  NativeBaseProvider,
  View,
} from 'native-base';

//screens for un-authed users
import Welcome from './src/Welcome';

//screens for auth users
import Home from './src/Home';

import Amplify from 'aws-amplify'
import awsconfig from './src/aws-exports'
Amplify.configure(awsconfig)

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
    </AuthStack.Navigator>
  );
}

function MyAppStack() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">{Home}</AppStack.Screen>
    </AppStack.Navigator>
  );
}

function App() {
  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');

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

export default App
