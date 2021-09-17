import React, {Component} from "react";
import { View, Text,TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser,fetchUserPosts } from "../redux/actions/index";
import firebase from "firebase";
import { TabActions } from "@react-navigation/routers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Photo from "./main/Photo";
import Profile from "./main/Profile";
import FeedScreen from "./main/Feed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();
export class Main extends Component {
    componentDidMount()
    {   
        this.props.fetchUser();
        this.props.fetchUserPosts();

    }
    render(){
        return (
            <Tab.Navigator>
                <Tab.Screen name="Feed" component={FeedScreen} 
              options={{
                  tabBarIcon :({color,size}) =>(
                      <MaterialCommunityIcons name ="home" color={color} size={26} />
                  )}}
              />
              <Tab.Screen name="Photo" component={Photo} 
              options={{
                  tabBarIcon :({color,size}) =>(
                      <MaterialCommunityIcons name ="camera" color={color} size={26} />
                  )}}
              />
              <Tab.Screen name="Profile" component={Profile} 
              options={{
                  tabBarIcon :({color,size}) =>(
                      <MaterialCommunityIcons name ="account" color={color} size={26} />
                  )}}
              />
            </Tab.Navigator>
          );
    }
}
const mapStateToProps =(store) =>({
    currentUser :store.userState.currentUser
})
const mapDispatchProps =(dispatch) => bindActionCreators({fetchUser , fetchUserPosts},dispatch);
export default connect(mapStateToProps,mapDispatchProps)(Main)