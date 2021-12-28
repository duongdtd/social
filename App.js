
import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
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
import Photo from './Components/main/Image/Photo'
import Profile from './Components/main/Profile'
import Save from './Components/main/Save'
import CheckUser from './Components/main/CheckUser'
import Search from './Components/main/Search';
import NewFeeds from './Components/main/NewFeeds'
import Comments from './Components/main/Comments';
import Messenger from './Components/main/Messenger';
import Chat from './Components/main/Chat';
import EditProfile from './Components/main/EditProfile';
import User from './Components/main/User';
import Post from './Components/main/Post';
import ChangePassword from './Components/main/ChangePassword';
import QRcode from './Components/main/Image/QRcode';
import QRscreen from './Components/main/QRscreen'
import SearchImage from './Components/main/Image/SearchImage';
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
        var userStatusDatabaseRef = firebase.database().ref('/User/' + uid);
        // or online.
        var isOfflineForDatabase = {
          state: 'offline',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
        var isOnlineForDatabase = {
          state: 'online',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
        firebase.database().ref('.info/connected').on('value', function (snapshot) {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() == false) {
            return;
          };
          userStatusDatabaseRef.onDisconnect().update(isOfflineForDatabase).then(function () {
            userStatusDatabaseRef.update(isOnlineForDatabase);
          });
        });
        this.setState({
          loggedIn: true,
          loaded: true,
        })
        if (this.state.loggedIn) {
          User.uid = uid;
        }
        //console.log(User.uid)
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      (<View style={{
        flex: 1, justifyContent: 'center',
        alignItems: 'center', backgroundColor: '#ffb412'
      }}>
        <View >
          <Image style={{ width: 200, height: 200 }} source={require('./image/dog.jpg')} />
        </View>
      </View>

      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );

    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main" screenOptions={{

          }}>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} navigation={this.props.navigation} />
            <Stack.Screen name="Messenger" component={Messenger} navigation={this.props.navigation} />
            <Stack.Screen name="Chat" component={Chat} navigation={this.props.navigation} />
            {/* <Stack.Screen name="EditProfile" component={EditProfile} navigation={this.props.navigation} options ={{headerLeft :null}} /> */}
            <Stack.Screen name="Photo" component={Photo} navigation={this.props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="SearchImage" component={SearchImage} navigation={this.props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="QRcode" component={QRcode} navigation={this.props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} navigation={this.props.navigation} />
            <Stack.Screen name="Save" component={Save} navigation={this.props.navigation} />
            <Stack.Screen name="CheckUser" component={CheckUser} navigation={this.props.navigation} />
            <Stack.Screen name="QRscreen" component={QRscreen} navigation={this.props.navigation} />
            <Stack.Screen name="Comments" component={Comments} options={{ headerTitle: () => <Text style={{ fontWeight: 'bold', fontSize: 26 }}>Comments</Text> }} navigation={this.props.navigation} />
            <Stack.Screen name="Post" component={Post} navigation={this.props.navigation} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} navigation={this.props.navigation} />

          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App