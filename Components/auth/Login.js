import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  ImageBackground, StyleSheet, Text,
  View, Image, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width: WIDTH } = Dimensions.get('window')
import firebase from 'firebase'

export default function Login({navigation} ) {
  const [isShow,setIs] =useState(true)
  const [email, setemail]=useState("")
  const [password, setpassword]=useState("")
  const [uid,setUID] = useState("");
  const SignIn = () => {
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    //firebase.database().ref('user')
    // ...
  })
  .catch((error)=> alert(error.message))
  }
//   useEffect(()=>{
//     const unsubcrible =auth.onAuthStateChanged(
//       function(user){
//         if(user)
//         {
//           navigation.replace('Chat')
//         }
//         else {
//             navigation.canGoBack() && navigation.popToTop();
//           }

//       })
//       return unsubcrible;
//   })
  return (
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
      <View>
        <StatusBar style='light' />
        <View style={styles.logocontainer}>
          <Text style={styles.logotext}>Wellcome</Text>
        </View>
        <View >
          <Ionicons name="md-person" size={30} color="rgba(255,255,255,0.8)" style={styles.inputIcon1} />
          <TextInput
            style={styles.input1}
            placeholder="Enter username" placeholderTextColor='rgba(255,255,255,0.8)'
            keyboardType='email-address'
            returnKeyType="next"
            type='text'
            value={email}
            onChangeText={(text) =>setemail(text)}   
          >
          </TextInput>
          <Ionicons name="md-lock-closed" size={30} color="rgba(255,255,255,0.8)" style={styles.inputIcon2} />
          <TextInput
            style={styles.input2} placeholder="Password" placeholderTextColor='rgba(255,255,255,0.8)'
            returnKeyType="go"
            secureTextEntry={isShow}
            type='text'
            value={password}
            onChangeText={(text) =>setpassword(text)} 
          >
          </TextInput>
          <TouchableOpacity  style={styles.inputIcon3} onPress ={() => {setIs((x)=>!x)}} >
          <Ionicons name={isShow ? "md-eye" : "md-eye-off" }size={30} color="rgba(255,255,255,0.8)" />
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
        <TouchableOpacity style={styles.login2} >
          <Text style ={styles.textlogin2}>Quên mật khẩu</Text>
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
    opacity: 0.5,
  },
  input1: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: 'rgba(255,255,255,0.8)',
    marginHorizontal: 25,
    paddingHorizontal: 50,
    marginTop: 20,
  }, input2: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: 'rgba(255,255,255,0.8)',
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
    backgroundColor: `#e0ffff`,
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
    color: 'rgba(0,0,0,0.8)',
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
