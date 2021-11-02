import React, {Component} from "react";
import { View, Text,TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser,fetchUserPosts,fetchUserFollowing,clearData } from "../redux/actions/index";
import firebase from "firebase";
import { TabActions } from "@react-navigation/routers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Photo from "./main/Image/Photo";
import Profile from "./main/Profile";
import FeedScreen from "./main/Feed";
import NewFeeds from "./main/NewFeeds"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search from "./main/Search";
import { event } from "react-native-reanimated";
const Tab = createBottomTabNavigator();
export class Main extends Component {
    componentDidMount()
    {   this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();

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
               <Tab.Screen name="NewFeeds" component={NewFeeds} 
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
              listeners ={({navigation}) => ({
                  tabPress :event => {
                      event.preventDefault();
                      navigation.navigate("Profile",{uid : firebase.auth().currentUser.uid})
                  }
              })}
              options={{
                  tabBarIcon :({color,size}) =>(
                      <MaterialCommunityIcons name ="account" color={color} size={26} />
                  )}}
              />
              <Tab.Screen name="Search" component={Search} navigation={this.props.navigation}
              options={{
                  tabBarIcon :({color,size}) =>(
                      <MaterialCommunityIcons name ="account-search" color={color} size={26} />
                  )}}
              />
            </Tab.Navigator>
            
          );
    }
}
const mapStateToProps =(store) =>({
    currentUser :store.userState.currentUser
})
const mapDispatchProps =(dispatch) => bindActionCreators({fetchUser , fetchUserPosts,fetchUserFollowing,clearData},dispatch);
export default connect(mapStateToProps,mapDispatchProps)(Main)