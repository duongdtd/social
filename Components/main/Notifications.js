import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import firebase from "firebase";
import { Avatar } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
require('firebase/firestore')
function findDaysDiffrent(seconds, nanoseconds) {

    let CreatedDate = new Date(seconds * 1000 + nanoseconds / 1000000)
    let today = new Date()
    let requiredDiffrentDays

    const oneMinute = 60 * 1000;
    const diffMinutes = Math.round(Math.abs((CreatedDate - today) / oneMinute));
    if (diffMinutes >= 518400) {
        requiredDiffrentDays = Math.floor(diffMinutes / 518400) == 1 ? `${Math.floor(diffMinutes / 525600)} year ago` : `${Math.floor(diffMinutes / 525600)} years ago`
    } else if (diffMinutes >= 43200) {
        requiredDiffrentDays = Math.floor(diffMinutes / 43200) == 1 ? `${Math.floor(diffMinutes / 43200)} month ago` : `${Math.floor(diffMinutes / 43200)} months ago`
    } else if (diffMinutes >= 1440) {
        requiredDiffrentDays = Math.floor(diffMinutes / 1440) == 1 ? `${Math.floor(diffMinutes / 1440)} day ago` : `${Math.floor(diffMinutes / 1440)} days ago`
    } else if (diffMinutes >= 60) {
        requiredDiffrentDays = Math.floor(diffMinutes / 60) == 1 ? `${Math.floor(diffMinutes / 60)} hour ago` : `${Math.floor(diffMinutes / 60)} hours ago`
    } else if (diffMinutes < 60) {
        requiredDiffrentDays = (diffMinutes == 1 || diffMinutes == 0) == 1 ? "just now" : `${Math.floor(diffMinutes)} minutes ago`
    }
    return requiredDiffrentDays;
}
export default function Notifications({ navigation }) {

    const [notifications, setNotifications] = useState([])
    const [running, setRunning] = useState(true)
    const change = (id) => {
        firebase.firestore()
            .collection("Notifications")
            .doc(firebase.auth().currentUser.uid)
            .collection("UserNotifications")
            .doc(id)
            .update({
                seen: 'yes'
            })

    }
    const deleteNotification = (id) => {
        firebase.firestore()
            .collection('Notifications')
            .doc(firebase.auth().currentUser.uid)
            .collection('UserNotifications')
            .doc(id)
            .delete()
    }

    useEffect(() => {
        firebase.firestore()
            .collection('Notifications')
            .doc(firebase.auth().currentUser.uid)
            .collection('UserNotifications')
            .orderBy("creation", "asc")
            .onSnapshot((snapshot) => {
                let notification = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setNotifications(notification)
            })
    }, [])
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
                                    <TouchableOpacity style={{ backgroundColor: '#fff', marginTop: 10 }}
                                        onPress={() => {
                                            navigation.navigate("Post", {
                                                postId: item.kid,
                                                type: item.typePost,
                                                uid: firebase.auth().currentUser.uid, nameUser: item.nameUser,
                                                imgOwn: item.imageOwn, uid1: firebase.auth().currentUser.uid
                                            }), change(item.id)
                                        }}>
                                        <View style={{ height:82, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                            <Image style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 25,
                                                marginHorizontal:8
                                            }}
                                                source={{ uri: item.image }}>
                                            </Image>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text>
                                                    {item.nameUser}{item.type}
                                                </Text>
                                                <Text>
                                                    caption : {item.caption}
                                                </Text>
                                                <Text>
                                                    {findDaysDiffrent(item.creation.seconds, item.creation.nanoseconds)}
                                                </Text>

                                            </View>
                                            <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                                                <Entypo name="dots-three-horizontal" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>

                                ) : (
                                    <TouchableOpacity style={{ backgroundColor: '#ffb412d6', marginTop: 10 }}
                                        onPress={() => navigation.navigate("Post", {
                                            postId: item.kid, type: item.typePost,
                                            uid: firebase.auth().currentUser.uid, nameUser: item.nameUser,
                                            imgOwn: item.imageOwn, uid1: firebase.auth().currentUser.uid
                                        })}>
                                        <View style={{ height:82, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Image style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 25,
                                                marginHorizontal:8
                                            }}
                                                source={{ uri: item.image }}>
                                            </Image>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text>
                                                    {item.nameUser}{item.type}
                                                </Text>
                                                <Text>
                                                    caption : {item.caption}
                                                </Text>
                                                <Text>
                                                    {findDaysDiffrent(item.creation.seconds, item.creation.nanoseconds)}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                                                <Entypo name="dots-three-horizontal" size={24} color="black" />
                                            </TouchableOpacity>
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
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text>
                                            {item.nameUser}{item.type}
                                        </Text>
                                        <Text>
                                            {findDaysDiffrent(item.creation.seconds, item.creation.nanoseconds)}
                                        </Text>

                                    </View>
                                    <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                ></FlatList>
            </View>
        );
    }
}