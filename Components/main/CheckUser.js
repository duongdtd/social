import React, { useState,useEffect } from "react";
import { View,Text, TextInput,Button,Image,StyleSheet,ActivityIndicator,Alert,TouchableOpacity } from "react-native";
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
            Alert.alert('Notification', 'Can not find', [
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ]);
        }
    })
        const up =async  () => {
            const response = await fetch(`http://171.244.53.66:5000/find_user`, {
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
        <View style ={{flex :1, marginTop :10,alignItems:'center'}}>
            <Image source ={{uri :`data:image/png;base64,${props.route.params.image}`}} style ={styles.image} />
            <View style={styles.deviler}></View>
            <TouchableOpacity
             style={{ height: 40, width: '50%', backgroundColor: "#ffb412", alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 6, padding: 5 }}
            title ='Check'
            onPress = {() =>{ up()}}
            >
                 <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Check</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
image : {
    width: '100%',
    height: 300,
    marginTop :10,
    marginBottom: 30,
    resizeMode:'contain'

},
deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '92%',
    alignSelf: 'center',
    marginBottom: 15,
}
})