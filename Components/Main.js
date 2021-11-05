import React, { Component } from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from "../redux/actions/index";
import firebase from "firebase";
import { TabActions } from "@react-navigation/routers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Photo from "./main/Image/Photo";
import Profile from "./main/Profile";
import NewFeeds from "./main/NewFeeds"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search from "./main/Search";
import styled from "styled-components";
const Tab = createBottomTabNavigator();
export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();

    }
    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="NewFeeds" component={NewFeeds} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                        headerTitle:"",
                        headerRight: () => <View style={styles.container}>
                            <TouchableOpacity style={styles.button}
                            onPress ={() =>this.props.navigation.navigate("Photo")}>
                            <AntDesign name="pluscircleo" size={30} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}
                             onPress ={() =>this.props.navigation.navigate("Messenger")}>
                            <Feather name="message-circle" size={30} color="black" />
                            </TouchableOpacity>
                        </View>,
                    }}
                />

                <Tab.Screen name="Profile" component={Profile}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        )
                    }}
                />
                <Tab.Screen name="Search" component={Search} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-search" color={color} size={26} />
                        )
                    }}
                />
            </Tab.Navigator>

        );
    }
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Main)
const styles =StyleSheet.create({
    container : {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    button : {
        margin :20,
    }
})