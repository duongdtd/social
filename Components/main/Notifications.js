import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from "react-native";
import firebase from "firebase";
import { Avatar } from 'react-native-elements';

require('firebase/firestore')
export default function Notifications({ navigation }) {

    const [notifications, setNotifications] = useState([])
    const change =(id) => {
        firebase.firestore()
      .collection("Notifications")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserNotifications")
      .doc(id)
      .update({
        seen :'yes'
      })


    }
    useEffect(() => {
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
    }, [notifications.length])
    if (notifications.length == 0) {
        return <View />
    }
    else {
        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }} >
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={notifications}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: '#fff' }} >
                            {(item.kid != "null") ? (
                                item.seen == 'no' ? (
                                    <TouchableOpacity style={{ backgroundColor: '#f8f8f8', marginTop: 10 }}
                                        onPress={() => {navigation.navigate("Post", {
                                            postId: item.kid,
                                            uid: firebase.auth().currentUser.uid, nameUser: item.nameUser
                                        }),change(item.id)}}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                            <Image style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 25,
                                            }}
                                                source={{ uri: item.image }}>
                                            </Image>
                                            <Text>
                                                {item.nameUser}{item.type}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                ) : (
                                    <TouchableOpacity style={{ backgroundColor: '#fff', marginTop: 10 }}
                                        onPress={() => navigation.navigate("Post", {
                                            postId: item.kid,
                                            uid: firebase.auth().currentUser.uid, nameUser: item.nameUser
                                        })}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Image style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                        source={{ uri: item.image }}>
                                        </Image>
                                            <Text>
                                                {item.nameUser}{item.type}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            ) : (
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}>
                                    <Image style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                        source={{ uri: item.image }}>
                                        </Image>
                                    <Text>
                                        {item.nameUser}{item.type}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                ></FlatList>
            </View>
        );
    }
}