import React, { useState } from "react";
import { View, TextInput,Button,Image } from "react-native";
import firebase from "firebase";
require("firebase/firestore")
require("firebase/firebase-firestore")
export default function Save(props, {navigation}) {
    console.log(props)
    const [caption,setCaption] =useState("")
    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath =`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)
        const   response =await fetch(uri);
        const blob =await response.blob();  
        const task =firebase.storage()
        .ref()
        .child(childPath)
        .put(blob);
        const taskProgress = snapshot  => {
            console.log(`transferred : ${snapshot.bytesTransferred}`)
        }
        const taskCompleted  =   () => {
            task.snapshot.ref.getDownloadURL().then((snapshot)=>{
                savePostData(snapshot);
                console.log(snapshot)
            })
        }
        const taskError =snapshot => {
            console.log(snapshot) 
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }
    const savePostData = (downloadURL) => {
        firebase.firestore()
        .collection("Posts")
        .doc(firebase.auth().currentUser.uid)
        .collection('UserPosts')
        .add ({
            downloadURL,
            caption,
            creation : firebase.firestore.FieldValue.serverTimestamp() 
        }).then((function () {
            props.navigation.navigate('Feed');
        }))

    }
    return(
        <View style ={{flex :1}}>
            <Image source ={{uri :props.route.params.image}} style ={{flex :1}} />
            <TextInput
            placeholder =" Write a Caption....."
            onChangeText={(caption)=>setCaption(caption)}>
            </TextInput>
            <Button
            title ='Save'
            onPress = {() => uploadImage()}
            ></Button>
        </View>
    )
}