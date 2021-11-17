import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Button,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] =useState("")
  const [newPassword, setNewPassword] =useState("")
  const reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }
  const onChangePasswordPress = () => {
    reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updatePassword(newPassword).then(() => {
        Alert.alert("Password was changed");
      }).catch((error) => { console.log(error.message); });
    }).catch((error) => { console.log(error.message) });
  }


  return (
      <View style={{flex: 1, flexDirection: "column", paddingVertical: 50, paddingHorizontal: 10,}}>
        <TextInput style={styles.textInput}
         type='text'
         value={currentPassword}
          placeholder="Current Password" autoCapitalize="none" secureTextEntry={true}
          onChangeText={(text) => { setCurrentPassword(text) }}
        />

        <TextInput style={styles.textInput} 
          placeholder="New Password" autoCapitalize="none" secureTextEntry={true}
          type='text'
          value={newPassword}
          onChangeText={(text) => { setNewPassword(text) }}
        />

        <Button title="Change Password" onPress={onChangePasswordPress} />
 
      </View>
  );
}
const styles = StyleSheet.create({
  text: { color: "white", fontWeight: "bold", textAlign: "center", fontSize: 20, },
  textInput: { borderWidth:1, borderColor:"gray", marginVertical: 20, padding:10, height:40, alignSelf: "stretch", fontSize: 18, },
});