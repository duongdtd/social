import React, { useState, useLayoutEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import firebase from "firebase";
import { Avatar, Badge } from 'react-native-elements';
require('firebase/firestore')
export default function Search(props, { navigation }) {

    const [users, setUsers] = useState([])
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('Users')
            .where('phone', 'array-contains', search)
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
    console.log(users)
    return (
        <View>
            <TextInput onChangeText={(search) => fetchUsers(search)}
                placeholder="type" />
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
                                          {item.status == 'online' ? (
                                             <Badge
                                             status="success"
                                            //  value=" "
                                            //  textStyle={{fontSize:30}}
                                             containerStyle={{ position: 'absolute', top: 28, right: -4 }}
                                           /> 
                                          ) :(
                                            <Badge
                                            status="error"
                                            // value=" "
                                            // textStyle={{fontSize:30}}
                                            containerStyle={{ position: 'absolute', top: 28, right: -4 ,}}
                                          />
                                          )}  
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