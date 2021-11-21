import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import MainScreen from './Components/Main'
import firebase from 'firebase'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Photo from './Components/main/Image/Photo'
import Profile from './Components/main/Profile'
import Save from './Components/main/Save'
import Search from './Components/main/Search';
import AvatarUpdate from './Components/main/AvatarUpdate'
import NewFeeds from './Components/main/NewFeeds'
import Comments from './Components/main/Comments';
import Messenger from './Components/main/Messenger';
import Chat from './Components/main/Chat';
import EditProfile from './Components/main/EditProfile';
import User from './Components/main/User';

const store = createStore(rootReducer, applyMiddleware(thunk))
const firebaseConfig = {
  apiKey: "AIzaSyBSZEWL2hKfM64C4ZJEcKBxYhsoo5DtCfE",
  authDomain: "social-cee8e.firebaseapp.com",
  databaseURL: "https://social-cee8e-default-rtdb.firebaseio.com",
  projectId: "social-cee8e",
  storageBucket: "social-cee8e.appspot.com",
  messagingSenderId: "603980226181",
  appId: "1:603980226181:web:ad95757a499e2e3a5193ec",
  measurementId: "G-JTSMRCB9PV"
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
      loggedIn: null,
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
        const uid = user.uid;
        //const UserUid = User.uid;
        this.setState({
          loggedIn: true,
          loaded: true,
        })
        //console.log(user.uid)
        if(this.state.loggedIn) {
          User.uid = uid; 
        }
        console.log(User.uid)
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
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
          <Stack.Navigator initialRouteName="Login">
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
           
          }}>
            <Stack.Screen name="Main" component={MainScreen} options ={{headerShown : false}} />
            <Stack.Screen name="EditProfile" component={EditProfile} navigation={this.props.navigation} />
            <Stack.Screen name="Messenger"  component={Messenger} navigation={this.props.navigation}/>
            <Stack.Screen name="Chat" component={Chat} navigation={this.props.navigation} options={{title: 'Default'}}/>
            <Stack.Screen name="Photo" component={Photo} navigation={this.props.navigation}options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={Save} navigation={this.props.navigation} />
            <Stack.Screen name="Comments" component={Comments} navigation={this.props.navigation} />
            <Stack.Screen name="AvatarUpdate" component={AvatarUpdate} navigation={this.props.navigation} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App