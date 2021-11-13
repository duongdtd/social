import * as React from 'react';
import { Button, Text, View,StyleSheet, FlatList,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set } from "firebase/database";
import firebase from "firebase/app";
import User from '../main/User';


export default function Messenger({ navigation, user, text}) {
  const [users,setUsers] = useState([{name:'a',uid:'1234'}]);
  //const [userList,setUserList] = useState([]);
  useEffect(() => {
    let dbRef = firebase.database().ref('UserID');
    dbRef.on('child_added',(val) => {
      let person = val.val(); 
      person.uid = val.key;
      setUsers((prevState) => {
        // console.log(person);
        // console.log(person.name)
        return {
          ...prevState, person
        }  
      })
      
    })
  },[])

  const renderRow = ({item}) => {
    return (
      <TouchableOpacity>
            <Text>{item.name}</Text>
          </TouchableOpacity>
    )
  }
//console.log((Object.values(users)[0]).name)
// const a = users[0]
// console.log(a);
console.log(users.person)
  return (
    <View style={styles.container}>
      {/* <FlatList
        data={users}
        renderItem={renderRow}
        keyExtractor={(item)=> item.uid}
      /> */}
      <Text>{users.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
	flex:1,
	justifyContent:'center',
	alignItems:'center',
	backgroundColor:'F5FCFF',
	},
	input: {
	padding: 10,
	borderWidth:1,
	borderColor: '#ccc',
	width:'90%',
	marginBottom:10,
	borderRadius:5
	},
	btnText: {
	color:'darkblue',
	fontSize:20
	},
})