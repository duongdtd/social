import React, { useState } from "react";
import { View,Text,TextInput,FlatList } from "react-native";
import firebase from "firebase";
import { Avatar } from 'react-native-elements';
require('firebase/firestore')
export default function Search() {
    const [users, setUsers] =useState([])
    const fetchUsers =(search) =>{
        firebase.firestore()
        .collection('Users') 
        .where('name','>=',search)
        .get()
        .then((snapshot)=>{
            let users = snapshot.docs.map(doc => {
                const data =doc.data();
                const id = doc.id;
                return {id, ...data}
            })
            setUsers(users)
        })
    }
    console.log(users)
    return(
        <View>
            <TextInput onChangeText ={(search)=>fetchUsers(search)}
            placeholder="type" />
            <View >
            <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({item})=>(
                <View>
                    <Avatar
  size="small"
  rounded
  source={{
    uri:item.downloadURL
  }}
/>
            <Text>{item.name}</Text> 
            </View>)}
            ></FlatList>
            </View> 
        </View>
    )
}