import React from "react";
import { Text,Button, View } from "react-native";
export default function Landing ({navigation})
{
    return(
        <View style={{flex :1, justifyContent: 'center'}}>
            <Button
            title="Register"
            onPress ={()=>navigation.navigate("Register")}
            ></Button>
            <Button
            title="Login"
            onPress ={()=>navigation.navigate("Login")}
            ></Button>
        </View>
    )
}