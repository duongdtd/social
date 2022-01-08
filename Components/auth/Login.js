import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  ImageBackground, StyleSheet, Text,View, Image, TextInput, Dimensions, TouchableWithoutFeedback, Alert,Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width: WIDTH } = Dimensions.get('window')
import firebase from 'firebase'
import User from '../main/User';
export default function Login({navigation} ) {
  const [isShow,setIs] =useState(true)
  const [email, setemail]=useState("")
  const [password, setpassword]=useState("")
  const [uid,setUID] = useState("");
  const  forgotPassword = (Email) => {
    firebase.auth().sendPasswordResetEmail(Email)
      .then(() => {
        Alert.alert(`check email ${Email}`);
      }).catch((error)=> alert(error.message))
  }
  const SignIn = () => {
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;

    firebase.firestore()
    .collection('Users')
    .doc(firebase.auth().currentUser.uid)
    .update({
      status: "online",
    })
    console.log(user.uid)
  })
  .catch((error)=> alert(error.message))
  }

  return (
    <View style={{flex:1, backgroundColor:'white', flexDirection:'row',alignItems:'center',justifyContent:'center'}}> 
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <View>
        <StatusBar style='light' />
        <View style={styles.logocontainer}>
          <Image style={{ width: 200, height: 140 }} source={require('../../image/logo.png')}/>
        </View>
        <View >
          <Ionicons name="md-person" size={30} color="rgba(255,255,255,1)" style={styles.inputIcon1} />
          <TextInput
            style={styles.input1}
            placeholder="Enter username" placeholderTextColor='rgba(255,255,255,1)'
            keyboardType='email-address'
            returnKeyType="next"
            type='text'
            value={email}
            onChangeText={(text) =>setemail(text)}   
          >
          </TextInput>
          <Ionicons name="md-lock-closed" size={30} color="rgba(255,255,255,1)" style={styles.inputIcon2} />
          <TextInput
            style={styles.input2} placeholder="Password" placeholderTextColor='rgba(255,255,255,1)'
            returnKeyType="go"
            secureTextEntry={isShow}
            type='text'
            value={password}
            onChangeText={(text) =>setpassword(text)} 
          >
          </TextInput>
          <TouchableOpacity  style={styles.inputIcon3} onPress ={() => {setIs((x)=>!x)}} >
          <Ionicons name={isShow ? "md-eye" : "md-eye-off" }size={30} color="rgba(255,255,255,1)" />
          </TouchableOpacity>
        </View>
        <View  alignItems = 'center'>
        <TouchableOpacity
          style={styles.login}
          onPress ={SignIn}
        >
          <Text style={styles.textlogin} >Login</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.action}>
        <TouchableOpacity style={styles.login2}
        onPress ={()=>navigation.navigate('Register')}>
          <Text style ={styles.textlogin2}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.login2} 
        onPress={() =>{forgotPassword(email)}}>
          <Text style ={styles.textlogin2}>Quên mật khẩu</Text>
        </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    flexDirection:'row'
  },
  logocontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:30,
    //marginBottom:10,
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
  login: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    backgroundColor: `#FFA500`,
    marginTop: 20,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
    borderWidth:2,
    borderColor:'black'
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
    color: 'rgba(0,0,0,1)',
    fontWeight: '900',
  },
  action: {
    flexDirection: 'row',
    justifyContent:'space-between',
  }
});
