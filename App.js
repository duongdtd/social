import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import MainScreen from './Components/Main'
import * as firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Photo from './Components/main/Photo'
import Profile from './Components/main/Profile'
import Feed from './Components/main/Feed'
import Save from './Components/main/Save'
import Search from './Components/main/Search';
import AvatarUpdate from './Components/main/AvatarUpdate'
const store = createStore(rootReducer, applyMiddleware(thunk))
const firebaseConfig = {
  apiKey: "AIzaSyBm0GkkdkMO8iz9tLtssu9v4XtcXB1wvns",
  authDomain: "data-c4893.firebaseapp.com",
  databaseURL: "https://data-c4893-default-rtdb.firebaseio.com",
  projectId: "data-c4893",
  storageBucket: "data-c4893.appspot.com",
  messagingSenderId: "958934199875",
  appId: "1:958934199875:web:4dea931ea7b99663116ef6",
  measurementId: "G-4XZ0Q0JEBF"
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}
const Stack = createNativeStackNavigator();

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }
      else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })

      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    const SignOut = () => {
      firebase.auth().signOut();
    }
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Login" component={Login} options={{ headerShow: false }} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        </NavigationContainer>
      );

    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main" screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShow: true }} />
            <Stack.Screen name="Profile" component={Profile}
              navigation={this.props.navigation} />
            <Stack.Screen name="Photo" component={Photo} navigation={this.props.navigation}
            />
            <Stack.Screen name="Search" component={Search} navigation={this.props.navigation} options={{ headerShow: false }} />
            <Stack.Screen name="Save" component={Save} navigation={this.props.navigation} options={{ headerShow: false }} />
            <Stack.Screen name="AvatarUpdate" component={AvatarUpdate} navigation={this.props.navigation} options={{ headerShow: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App