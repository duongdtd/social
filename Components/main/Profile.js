import * as React from 'react';
import { Text, View,Image,FlatList,StyleSheet,TouchableOpacity,Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import{useLayoutEffect} from 'react'
import { AntDesign } from '@expo/vector-icons';
import {Avatar} from 'react-native-elements'
 function Profile(props,{navigation}) {

  const SignOut = () => {
    firebase.auth().signOut();
  }
   const { currentUser, posts} = props;
   console.log({currentUser,posts})
  return (
    <View style={styles.container}>
      <Avatar
      rounded
      size="large"
      marginLeft ={20}
      source={{
        uri :firebase.auth().currentUser.photoURL
      }}
      />
      <View style={styles.containerInfo}>
      <Text>{currentUser.name}</Text>
      <TouchableOpacity
      onPress={SignOut}>
      <AntDesign name="logout" size={24} color="black" />
      </TouchableOpacity>
      </View>
      <View style={styles.comtainerGalley}
      >
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem ={({item})=>(
            <View style={styles.containerImage}>
            <Image
            style={styles.image}
            source ={{uri :item.downloadURL}}
            />
            </View>
          )}
        
        />

      </View>
    </View>
  );
}

const mapStateToProps =(store) =>({
  currentUser :store.userState.currentUser,
  posts :store.userState.posts,
})
const  styles = StyleSheet.create({
  container : {
    flex:1,
    marginTop: 40,
  },
  containerInfo :{
    margin :20
  },
  comtainerGalley: {
    flex :1,
  },
  image :{
    flex :1,
    aspectRatio: 1/1
  },
  containerImage:{
    flex :1/3
  },
  userImage :{
    height :100,
    width:100,
    borderRadius :75
  }
  
})
export default connect(mapStateToProps,null)(Profile)