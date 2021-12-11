import React, { useState,useEffect } from "react";
import { View, TextInput,Button,Image,StyleSheet,ActivityIndicator,Alert } from "react-native";
import firebase from "firebase";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { NavigationContainer } from "@react-navigation/native";
require("firebase/firestore")
require("firebase/firebase-firestore")
export default function CheckUser(props) {
    const [running, setRunning] =useState(false)
    const [data, setData] =useState("")
    useEffect(() => {
        if(data != "" && data != "Undetected" )
        {
          props.navigation.navigate("Profile", { uid: data })
        }
        else if(data == "Undetected")
        {
            Alert.alert('Thông báo', 'Không tìm được', [
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ]);
        }
    })
        const up =async  () => {
            const response = await fetch(`http://103.138.113.112:5000/find_user`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            [  
                {
                 image: `data:image/png;base64,${props.route.params.image}`
                }
            ]
            )
          });
            const json = await response.json();
            setData(json.user_id)
        
    }
    return(
        <View style ={{flex :1, marginTop :10}}>
            <Image source ={{uri :`data:image/png;base64,${props.route.params.image}`}} style ={styles.image} />
            <View style={styles.deviler}></View>
            <Button
            title ='Check'
            onPress = {() =>{ up()}}
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