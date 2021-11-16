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
                let notification = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setNotifications(notification)
            })
    },[notifications.length])
    console.log(notifications)
    return (
        <View>
            <View >
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={notifications}
                    renderItem={({ item }) => (
                        <View >
                            <TouchableOpacity style={{margin :10}}
                            onPress ={() =>  navigation.navigate("Post", { postId: item.kid,
                             uid: firebase.auth().currentUser.uid,nameUser : item.nameUser })}>
                             <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Avatar
                                    size="small" rounded source={{ uri: item.image }} />
                                <Text>
                                    {item.nameUser}{item.type}
                                </Text>
                                </View>
                            </TouchableOpacity>
                        </View>)}
                ></FlatList>
            </View>
        </View>
    )
}