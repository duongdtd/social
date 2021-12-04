import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import firebase from "firebase";
import { Avatar, Badge } from 'react-native-elements';
import { Button } from "react-native-elements/dist/buttons/Button";
import styles from "../constants/style";
require('firebase/firestore')
export default function Search(props, { navigation }) {
    const [users, setUsers] = useState([])
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('Users')
            .where('nickname', 'array-contains', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUsers(users)
            })
    }
    return (
        <View>
            <TextInput style={styles.inputSearch} onChangeText={(search) => fetchUsers(search)}
                placeholder="Type number, name here" />
            <View style={{marginBottom: 40}}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={users}
                    renderItem={({ item }) => (
                        <View style={{marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Profile", { uid: item.id })}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Avatar
                                        size="small"
                                        rounded
                                        source={{
                                            uri: item.downloadURL
                                        }}
                                    />
                                
                                    
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: 10 }}>
                                        <Text>{item.name}</Text>
                                        <Text>{item.email}</Text>
                                       
                                    </View>
                                </View>

                            </TouchableOpacity>
                        </View>)}
                ></FlatList>
                 
            </View>
           
        </View>
    )
}