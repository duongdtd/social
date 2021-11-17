import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import {
  ImageBackground, StyleSheet, Text,
  View, Image, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import firebase from 'firebase'
import firestore from '@react-native-firebase/firestore';
const { width: WIDTH } = Dimensions.get('window')
export default function Register({navigation}) {
  const [isShow,setIs] =useState(true)
  const [name, setname]=useState("")
  const [email, setemail]=useState("")
  const [password, setpassword]=useState("")
  const [phone, setPhone]=useState("")

  function generateSearchIndex(str) {
    var temp = []
    str.trim().split(" ").forEach(word => {
      temp = temp.concat(generateSearchIndexWord(word))
    })
    return temp
  }
  
  function generateSearchIndexWord(word) {
    if (word.length == 0) {
      return []
    } else if (word.length <= 3) {
      return [word]
    } else {
      var ret = []
      for (var i = 3 ; i <= word.length ; i++) {
        ret.push(word.substring(0, i))
      }
      return ret
    }
  }
  const sign = () =>{
    firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
        firebase.firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid)
      .set({
        name: name,
        email: email,
        downloadURL: 'https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg',
        phone : generateSearchIndex(phone)
      })
      .then(() => {
        console.log('User added!');
      });
      var user =authUser.user;
      user.updateProfile({
        displayName : name,
        photoURL :'https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg',
      })
    })
    .catch((error)=> alert(error.message))
      }
  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style='light' />
        <View style={styles.logocontainer}>
          <Text style={styles.logotext}>Đăng kí</Text>
        </View>
        <View >
          <Ionicons name="md-person" size={30} color="rgba(255,255,255,1)" style={styles.inputIcon1} />
          <TextInput
            style={styles.input1}
            placeholder="Enter username" 
            placeholderTextColor='rgba(255,255,255,1)'
            keyboardType='email-address'
            returnKeyType="next" 
            type='text'
            value={email}
            onChangeText={(text) =>setemail(text)} 
          >
          </TextInput>
          <Ionicons name="md-lock-closed" size={30} color="rgba(255,255,255,1)" style={styles.inputIcon2} />
          <TextInput
            style={styles.input2} 
            placeholder="Password" 
            placeholderTextColor='rgba(255,255,255,1)'
            returnKeyType="go"
            secureTextEntry={isShow}
            type='text'
            value={password}
            onChangeText={(text) =>setpassword(text)} 
          >
          </TextInput>
          <AntDesign name="filetext1" size={30} color="rgba(255,255,255,1)" style={styles.inputIcon5} />
          <TextInput
            style={styles.input2} 
            placeholder="Name" 
            placeholderTextColor='rgba(255,255,255,1)'
            returnKeyType="go"
            type='text'
            value={name}
            onChangeText={(text) =>setname(text)} 
          >
          </TextInput>
          <AntDesign name="phone" size={30} color="rgba(255,255,255,1)" style={styles.inputIcon4} />
          <TextInput
            style={styles.input2} 
            placeholder="Phone Number" 
            placeholderTextColor='rgba(255,255,255,1)'
            returnKeyType="go"
            type='text'
            value={phone}
            onChangeText={(text) =>setPhone(text)} 
          >
          </TextInput>
          <TouchableOpacity  style={styles.inputIcon3} onPress ={() => {setIs((x)=>!x)}} >
          <Ionicons name={isShow ? "md-eye" : "md-eye-off" }size={30} color="rgba(255,255,255,1)" />
          </TouchableOpacity>
        </View>
        <View  alignItems = 'center'>
        <TouchableOpacity
          style={styles.login}
          onPress ={sign}
        >
          <Text style={styles.textlogin}>Sign</Text>
        </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
  },
  logocontainer: {
    alignItems: 'center',
  },
  logo: {
    width: 48 * 2,
    height: 48 * 2,
  },
  logotext: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10,
  },
  input1: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,1)',
    color: 'rgba(255,255,255,1)',
    marginHorizontal: 25,
    paddingHorizontal: 50,
    marginTop: 20,
  }, input2: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,1)',
    color: 'rgba(255,255,255,1)',
    marginHorizontal: 25,
    paddingHorizontal: 50,
    marginTop: 5,
  },
  inputIcon1: {
    position: 'absolute',
    top: 25,
    left: 37,
    zIndex: 10,
  },
  inputIcon2: {
    position: 'absolute',
    top: 75,
    left: 37,
    zIndex: 10,
  },
  inputIcon3: {
    position: 'absolute',
    top: 75,
    right: 37,
    zIndex: 10,
  },
  inputIcon4: {
    position: 'absolute',
    top: 175,
    left: 37,
    zIndex: 10,
  },
  inputIcon5: {
    position: 'absolute',
    top: 125,
    left: 37,
    zIndex: 10,
  },
  login: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    backgroundColor: `#FF6347`,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  login2: {
    marginTop: 30,
    marginHorizontal: 60/2,
  },
  textlogin: {
    fontSize: 16,
    color: 'rgba(0,0,0,1)',
    fontWeight: '900',
  },
  textlogin2: {
    fontSize: 16,
    color: 'rgba(255,255,255,1)',
    fontWeight: '900',
  },
  action: {
    flexDirection: 'row',
    justifyContent:'space-between',
  }
});
