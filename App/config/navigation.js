import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Welcome from '../screens/Welcome';
import SignIn from '../screens/SignIn';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Colors from '../screens/Colors';
import ContactDetails from '../screens/ContactDetails';
import ActionsList from '../screens/ActionsList';
import ActionDetails from '../screens/ActionDetails';
import Settings from '../screens/Settings';

import SignUp from '../screens/SignUp';
import Loading from '../screens/Loading';
import Modal from '../screens/Modal';

import { Auth, Hub } from 'aws-amplify';

const AuthTabs = createBottomTabNavigator();
const AuthTabsScreen = () => (
  <AuthTabs.Navigator>
    <AuthTabs.Screen
      name="Welcome"
      component={Welcome}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="home" size={props.size} color={props.color} />
        ),
      }}
    />
    <AuthTabs.Screen
      name="Sign In"
      component={SignIn}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="home" size={props.size} color={props.color} />
        ),
      }}
    />
  </AuthTabs.Navigator>
);

const AppStack = createStackNavigator();
const AppStackScreen = () => (
  <AppStack.Navigator
    screenOptions={{ animationEnabled: false, presentation: "modal", headerShown: true }}
  >
    <AppStack.Screen
      name="Home"
      component={Home}
      options={{
        headerTitle: 'Home',
      }}
    />
    <AppStack.Screen name="Red"
      options={{
        headerTitle: 'Red Food',
      }}
    >{props => (<Colors {...props} color={"red"} />)}</AppStack.Screen>
    <AppStack.Screen name="Orange">{props => (<Colors {...props} color={"orange"} />)}</AppStack.Screen>
    <AppStack.Screen name="Yellow">{props => (<Colors {...props} color={"yellow"} />)}</AppStack.Screen>
    <AppStack.Screen name="Green">{props => (<Colors {...props} color={"green"} />)}</AppStack.Screen>
    <AppStack.Screen name="Purple">{props => (<Colors {...props} color={"purple"} />)}</AppStack.Screen>
    <AppStack.Screen name="Blue"
      options={{
        headerTitle: 'Water',
      }}
    >
      {props => (<Colors {...props} color={"blue"} />)}
    </AppStack.Screen>
  </AppStack.Navigator>
);

const AppTabs = createBottomTabNavigator();
const AppTabsScreen = () => (
  <AppTabs.Navigator
    screenOptions={{ animationEnabled: false, presentation: "modal", headerShown: false }}>
    <AppTabs.Screen
      name="Home"
      component={AppStackScreen}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="home" size={props.size} color={props.color} />
        ),
      }}
    />
    <AppTabs.Screen
      name="My Stuff"
      component={Profile}
      options={{
        tabBarIcon: (props) => (
          <Ionicons
            name="checkmark-circle-outline"
            size={props.size}
            color={props.color}
          />
        ),
      }}
    />
  </AppTabs.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {

    Hub.listen('auth', (data) => {
      const { payload } = data
      //console.log('A new auth event has happened: ', payload)
      if (payload.event === 'signIn') {
        console.log('A user has signed in!', payload.data.username)
        setUser(payload.data.username)
      }
      if (payload.event === 'signOut') {
        //console.log('A user has signed out!')
        setUser()
      }
    })

    return () => {
      Hub.remove('auth')
    }
  }, []);

  React.useEffect(() => {    
    setIsLoading(!isLoading);
    checkUser()

    return () => {
      setIsLoading(!isLoading);
    }
  }, []);

  async function checkUser() {
    try {
      const thisUser = await Auth.currentAuthenticatedUser()
      //console.log('thisUser', thisUser.username)      
      thisUser && setUser(thisUser.username)
    } catch (err) {
      //console.log(' User is not signed in', err)
      setUser()
    }
  }

  return (
    <RootStack.Navigator
      screenOptions={{ animationEnabled: false, presentation: "modal", headerShown: false }}
    >
      {isLoading ? (
        <RootStack.Screen name="Loading" component={Loading} />
      ) : user ? (
        <RootStack.Screen name="AppTabsScreen" component={AppTabsScreen} />
      ) : (
        <RootStack.Screen name="AuthTabsScreen" component={AuthTabsScreen} />
      )}
    </RootStack.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
};