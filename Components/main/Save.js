import React, { useState } from "react";
import { View, TextInput,Button,Image,StyleSheet,ActivityIndicator } from "react-native";
import firebase from "firebase";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
require("firebase/firestore")
require("firebase/firebase-firestore")
export default function Save(props) {
    console.log(props)
    const [caption,setCaption] =useState("")
    const [running, setRunning] =useState(false)

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
            setRunning(true);
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
            LikesCount :0,
            cmts:0,
            creation : firebase.firestore.FieldValue.serverTimestamp() 
        }).then(setRunning(false))

    }
const addPost =() => {
    firebase.firestore()
  .collection("Users")
  .doc(firebase.auth().currentUser.uid)
  .update({
    Posts : firebase.firestore.FieldValue.increment(1)
  })
    }
    if(running)
    {   return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator color='red' size='large'/>
        </View>
    );
    }
    return(
        <View style ={{flex :1, marginTop :10}}>
            <Avatar
            rounded
            size="large"
            source={{
              uri: firebase.auth().currentUser.photoURL
            }}
          ></Avatar>
            <TextInput
            placeholder =" Write a Caption....."
            onChangeText={(caption)=>setCaption(caption)}>
            </TextInput>
            <Image source ={{uri :props.route.params.image}} style ={styles.image} />
            <View style={styles.deviler}></View>
            <Button
            title ='Save'
            onPress = {() =>{ uploadImage(),addPost()}}
            ></Button>
        </View>
    )
}
const styles = StyleSheet.create({
image : {
    width: '100%',
    height: 300,
    marginTop :10,
    marginBottom: 30,

},
deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '92%',
    alignSelf: 'center',
    marginBottom: 15,
}
})