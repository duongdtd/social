import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firebase from 'firebase';
import { AntDesign,FontAwesome } from '@expo/vector-icons';
export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [renewPassword, setReNewPassword] = useState("")
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
      }).catch((error) => {Alert.alert(error.message); });
    }).catch((error) => { Alert.alert(error.message) });
  }


  return (
    <View style={{ flex: 1,
     flexDirection: "column",alignItems:'center'}}>
       <View style={styles.view}>
       <Text>Password should be at least 6 characters</Text>
       </View>
       <View style={styles.viewInput}>
      <TextInput style={styles.textInput}
        type='text'
        value={currentPassword}
        placeholder="Current password" autoCapitalize="none" secureTextEntry={true}
        onChangeText={(text) => { setCurrentPassword(text) }}
      />
      </View>
      <View style={styles.viewInput}>
      <TextInput style={styles.textInput}
        placeholder="New password" autoCapitalize="none" secureTextEntry={true}
        type='text'
        value={newPassword}
        onChangeText={(text) => { setNewPassword(text) }}
      />
      {newPassword.length == 0 ? (<View></View>) : newPassword.length <6 ? 
      (<FontAwesome  style={styles.icon} name="remove" size={24} color="red" />)
       :(<FontAwesome style={styles.icon} name="check" size={24} color="green" />)}
      </View>
      <View style={styles.viewInput}>
      <TextInput style={styles.textInput}
        placeholder="Re-enter new password" autoCapitalize="none" secureTextEntry={true}
        type='text'
        value={renewPassword}
        onChangeText={(text) => { setReNewPassword(text) }}
      />
      {newPassword.length == 0 ? (<View></View>) : renewPassword != newPassword  ? 
      (<FontAwesome  style={styles.icon} name="remove" size={24} color="red" />)
       :(<FontAwesome style={styles.icon} name="check" size={24} color="green" />)}
      </View>

      <View style={{marginTop :10,flex:1,width:'100%',alignItems:'center'}}>

        { renewPassword != newPassword ?
         (<TouchableOpacity style={styles.panelButton}>
          <Text style={styles.panelButtonTitle}>Update</Text>
        </TouchableOpacity>)
        :
      (  <TouchableOpacity style={styles.panelButton}
          onPress={onChangePasswordPress}>
          <Text style={styles.panelButtonTitle}>Update</Text>
        </TouchableOpacity>)
        }
     
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "black",
    padding: 10,
    height: 50,
    alignSelf: "stretch",
    fontSize: 18,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    borderColor:'black',
    borderWidth:2,
    backgroundColor: '#ffb412',
    alignItems: 'center',
    marginVertical: 7,
    width: '60%'
  },
  view :{

    flex:1/4,
    width:'100%',
    alignItems:'center',
    marginTop:20

  },
  viewInput :{

    flex:1/4,
    width:'95%',
    justifyContent:'center',
    margin :10

  },
  icon: {
    position: 'absolute',
    right: 10,
  }
});