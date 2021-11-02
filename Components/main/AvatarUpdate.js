import React, { useState } from "react";
import { View, TextInput,Button,Image } from "react-native";
import firebase from "firebase";
require("firebase/firestore")
require("firebase/firebase-firestore")
export default function AvatarUpdate(props, {navigation}) {
    console.log(props)
    const [caption,setCaption] =useState("")
    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath =`user/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)
        const response =await fetch(uri);
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
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update ({
            downloadURL,
        }).then((function () {
            props.navigation.navigate('Feed');
        })
        )
        const update = {
            photoURL: downloadURL,
          };
          
           firebase.auth().currentUser.updateProfile(update);
    }
    return(
        <View style ={{flex :1}}>
            <Image source ={{uri :props.route.params.image}} style ={{flex :1}} />
            <Button
            title ='Save'
            onPress = {() => uploadImage()}
            ></Button>
        </View>
    )
}