import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Landing from './Components/auth/Landing';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import MainScreen from './Components/Main'
import * as firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore,applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Photo from './Components/main/Photo'
import Profile from './Components/main/Profile'
import Feed from './Components/main/Feed'
import Main from './Components/Main';

const store = createStore(rootReducer , applyMiddleware(thunk))
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
if(firebase.apps.length === 0 )
{
  firebase.initializeApp(firebaseConfig)
} 
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export class  App extends Component {
  
constructor(props)
{
  super(props);
  this.state= {
    loaded: false, 
  }
}
componentDidMount()
{
  firebase.auth().onAuthStateChanged((user)=>{
    if(!user)
    {
      this.setState({
        loggedIn :false,
        loaded:true,
      })
    }
    else {
      this.setState({
        loggedIn :true,
        loaded:true,
      })

    }
  })
}
render() {
  const {loggedIn,loaded}=this.state;
  if(!loaded)
  {
    return(
        <View style={{flex: 1, justifyContent :'center'}}> 
          <Text>Loading</Text>
        </View>
    )
  }
  if(!loggedIn)
  {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          {/* <Stack.Screen name ="Landing" component ={Landing} options ={{headerShow : false}}/> */}
          {/* <Stack.Screen name ="Register" component ={Register} options ={{headerShow : false}}/> */}
          <Stack.Screen name ="Login" component ={Login} options ={{headerShow : false}}/>
          <Stack.Screen name ="Register" component ={Register} options ={{headerShow : false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );

  }
  return(
<Provider store={store}>
<NavigationContainer>
          <Tab.Navigator initialRouteName="Main">
          <Tab.Screen name ="Main" component ={MainScreen} options ={{headerShow : false}}/>
          <Tab.Screen name ="Profile" component ={Profile} />
          <Tab.Screen name ="Photo" component ={Photo} />
        </Tab.Navigator>
    </NavigationContainer>
</Provider>
)
}
}

export default App