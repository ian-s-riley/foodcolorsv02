import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useDispatch } from 'react-redux'
import { updateUser } from '../features/user/userSlice'

import Welcome from '../screens/Welcome';
import SignIn from '../screens/SignIn';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Colors from '../screens/Colors';
import Streak from '../screens/Streak';
import Joke from '../screens/Joke';
import Recipes from '../screens/Recipes';
import Ingredients from '../screens/Ingredients';
import Info from '../screens/Info';
import Loading from '../screens/Loading';

import { Auth, Hub } from 'aws-amplify';

const AuthTabs = createBottomTabNavigator();
const AuthTabsScreen = () => (
  <AuthTabs.Navigator>
    <AuthTabs.Screen
      name="Welcome"
      component={Welcome}
      options={{
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            name={'home-circle-outline'}
            size={props.size}
            color={props.color}
          />
        ),
      }}
    />
    <AuthTabs.Screen
      name="Sign In"
      component={SignIn}
      options={{
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            name={'home-outline'}
            size={props.size}
            color={props.color}
          />
        ),
      }}
    />
  </AuthTabs.Navigator>
);





const RootStack = createStackNavigator();
const RootStackScreen = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {

    Hub.listen('auth', (data) => {
      const { payload } = data
      //console.log('A new auth event has happened: ', payload.data)
      if (payload.event === 'signIn') {
        setUser(payload.data.attributes.phone_number)
        dispatch(updateUser(payload.data.username))
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
    setIsLoading(!isLoading)
    Auth.currentAuthenticatedUser({
    }).then(user => {
      setUser(user.attributes.phone_number)
    })
      .catch(err => {
        setUser()
      })
  }, []);

  //function checkUser() {
  // try {
  //   const thisUser = await Auth.currentAuthenticatedUser()
  //   //console.log('thisUser', thisUser.username) 
  //     if (thisUser) {
  //       setIsLoading(!isLoading);
  //       setUser(thisUser.username)
  //       dispatch(updateUser(thisUser.username))
  //     }     
  // } catch (err) {
  //   //console.log(' User is not signed in', err)
  //     setIsLoading(!isLoading);
  //     setUser()
  // }
  //}

  const AppStack = createStackNavigator();
  const AppStackScreen = () => (
    <AppStack.Navigator
      screenOptions={{ animationEnabled: false, presentation: "modal" }}
    >
      <AppStack.Screen name="Home"
        component={Home}
        options={{ headerTitle: 'Home', headerShown: true }}
        initialParams={{ username: user }}
      />
      <AppStack.Screen name="Red" options={{ headerTitle: 'Red Servings' }}>{props => (<Colors {...props} color={"red"} />)}</AppStack.Screen>
      <AppStack.Screen name="Orange" options={{ headerTitle: 'Orange' }}>{props => (<Colors {...props} color={"orange"} />)}</AppStack.Screen>
      <AppStack.Screen name="Yellow" options={{ headerTitle: 'Orange' }}>{props => (<Colors {...props} color={"yellow"} />)}</AppStack.Screen>
      <AppStack.Screen name="Green" options={{ headerTitle: 'Orange' }}>{props => (<Colors {...props} color={"green"} />)}</AppStack.Screen>
      <AppStack.Screen name="Purple" options={{ headerTitle: 'Orange' }}>{props => (<Colors {...props} color={"purple"} />)}</AppStack.Screen>
      <AppStack.Screen name="Blue" options={{ headerTitle: 'Water' }}>{props => (<Colors {...props} color={"blue"} />)}</AppStack.Screen>
      <AppStack.Screen name="Recipes" options={{ headerTitle: 'Orange' }}>{props => (<Recipes {...props} />)}</AppStack.Screen>
      <AppStack.Screen name="Ingredients" options={{ headerTitle: 'Orange' }}>{props => (<Ingredients {...props} />)}</AppStack.Screen>
      <AppStack.Screen name="Info" options={{ headerTitle: 'Orange' }}>{props => (<Info {...props} />)}</AppStack.Screen>
    </AppStack.Navigator>
  );

  const ProfileStack = createStackNavigator();
  const ProfileStackScreen = () => (
    <ProfileStack.Navigator
      screenOptions={{ animationEnabled: false, presentation: "modal", headerShown: true }}
    >
      <ProfileStack.Screen name="Profile">{props => (<Profile {...props} />)}</ProfileStack.Screen>
      <ProfileStack.Screen name="Streak">{props => (<Streak {...props} />)}</ProfileStack.Screen>
      <ProfileStack.Screen name="Joke">{props => (<Joke {...props} />)}</ProfileStack.Screen>
    </ProfileStack.Navigator>
  );

  const AppTabs = createBottomTabNavigator();
  const AppTabsScreen = () => (
    <AppTabs.Navigator
      screenOptions={{ animationEnabled: false, presentation: "modal", headerShown: false, tabBarShowLabel: false }}
    >
      <AppTabs.Screen
        name="AppStack"
        component={AppStackScreen}
        options={{
          headerTitle: 'Home',
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              name={'home-circle'}
              size={35}
              color={props.color}
            />
          ),
        }}
      />
      <AppTabs.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          headerTitle: 'Profile',
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              name={'account-circle'}
              size={35}
              color={props.color}
            />
          ),
        }}
      />
    </AppTabs.Navigator>
  );



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