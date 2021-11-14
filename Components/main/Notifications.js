import React, { useState,useLayoutEffect, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import firebase from "firebase";
import { Avatar } from 'react-native-elements';
require('firebase/firestore')
export default function Notifications({navigation}) {

    const [notifications, setNotifications] = useState([])
    useEffect(() =>{
        firebase.firestore()
            .collection('Notifications')
            .doc(firebase.auth().currentUser.uid)
            .collection('UserNotifications')
            .onSnapshot((snapshot) => {
                let notifications = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setNotifications(notifications)
            })
    },[])
    return (
        <View>
            <View >
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={notifications}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity
                            onPress ={() =>  navigation.navigate("Post", { postid: item.id })}>
                            <Text>{item.name}</Text>
                            </TouchableOpacity>
                        </View>)}
                ></FlatList>
            </View>
        </View>
    )
}