import React, { useState } from "react";
import { View, TextInput,Button,Image,StyleSheet,ActivityIndicator,Alert } from "react-native";
import firebase from "firebase";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { NavigationContainer } from "@react-navigation/native";
require("firebase/firestore")
require("firebase/firebase-firestore")
export default function Save(props) {
    const [caption,setCaption] =useState("")
    const [running, setRunning] =useState(false)
    const [url,setUrl] =useState([])
    const [img, setImg] =useState("")
    const asd =() =>{
        console.log(url.length)
    }
    const uploadImage = async () => {
        for(let i=0;i<props.route.params.data.length;i++)
        {
            setRunning(true);
        const uri = props.route.params.data[i];
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
                setUrl(url => [...url,snapshot])
                setImg(snapshot)
                setRunning(false);
            })
        }
        const taskError =snapshot => {
            console.log(snapshot) 
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted);
        }
    }
        const up = (source) => {
            fetch(`http://103.138.113.112:5000/add_faces?user_id=${firebase.auth().currentUser.uid}`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            [  
                {
                 image: source
                }
            ]
            )
          });
    }
    const Uparray = () =>{
        for(let i=0;i<props.route.params.images.length;i++)
        {
            up(`data:image/png;base64,${props.route.params.images[i]}`)
        }
        Alert.alert(
            "Profile Updated",
            "My Alert Msg",
            [
              {
                text: "OK",
                onPress: () => {check(),addPost(),props.navigation.navigate('NewFeeds')},
                style: "cancel",
              },
            ],
       
          );
        
    } 
    const check = () => {
        if(url.length === 1)
        {
            firebase.firestore()
            .collection("Posts")
            .doc(firebase.auth().currentUser.uid)
            .collection('UserPosts')
            .add ({
                downloadURL:img,
                caption,
                LikesCount :0,
                cmts:0,
                type:'row',
                creation : firebase.firestore.FieldValue.serverTimestamp() 
            }).then()
        }
        else
        {
         firebase.firestore()
        .collection("Posts")
        .doc(firebase.auth().currentUser.uid)
        .collection('UserPosts')
        .add ({
            downloadURL:url,
            caption,
            LikesCount :0,
            cmts:0,
            type:'list',
            creation : firebase.firestore.FieldValue.serverTimestamp() 
        }).then()
        }
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
            <Image source ={{uri :`data:image/png;base64,${props.route.params.images[0]}`}} style ={styles.image} />
            <View style={styles.deviler}></View>
            <Button
            title ='Save'
            onPress = {() =>{ Uparray(),uploadImage()}}
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