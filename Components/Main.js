import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from "../redux/actions/index";
import firebase from "firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./main/Profile";
import NewFeeds from "./main/NewFeeds"
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Search from "./main/Search";
import Notifications from "./main/Notifications";

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
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    // You can return any component that you like here!
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#ffb412',
                tabBarInactiveTintColor: '#333333',
            })}>
                <Tab.Screen name="NewFeeds" component={NewFeeds} navigation={this.props.navigation}
                    options={{
                        tabBarLabel:"",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={28} color={color} />
                        ),
                        headerTitle: () => <Image style={{ width: 120, height: 62, borderRadius: 5 }} source={require('../image/logo.png')} />,
                        headerRight: () => <View style={styles.container}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.props.navigation.navigate("Photo")}>
                                <AntDesign name="pluscircleo" size={29} color="#ffb412" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.props.navigation.navigate("Messenger")}>
                                <Feather name="message-circle" size={32} color="#ffb412" />
                            </TouchableOpacity>
                        </View>,
                    }}
                />
               
                <Tab.Screen name="Search" component={Search} navigation={this.props.navigation}
                    options={{
                        tabBarLabel:"",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="search" size={28} color={color} />
                        ),
                        headerTitle: () => <Text style={styles.header}>Search</Text>,
                        headerRight: () => <View style={styles.container}>
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.props.navigation.navigate("QRcode")}>
                                <AntDesign name="qrcode" size={30} color="#ffb412" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.props.navigation.navigate("SearchImage")}>
                                <AntDesign name="camerao" size={30} color="#ffb412" />
                            </TouchableOpacity>
                        </View>,
                    }}
                />
                 <Tab.Screen name="Notifications" component={Notifications} navigation={this.props.navigation}
                    options={{
                        tabBarLabel:"",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="notifications" size={28} color={color} />
                        ),
                        headerTitle: () => <Text style={styles.header}>Notifications</Text>
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
                        tabBarLabel:"",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={28} color={color} />
                        ),
                        headerTitle: () => <Text style={styles.header}>Profile</Text>
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
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        marginRight: 16,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 26
    }

})