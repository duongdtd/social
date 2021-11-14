import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
require('firebase/firestore')
import { SimpleLineIcons } from '@expo/vector-icons';
function Post(props) {
  const [post, setPost] =useState(null)
  const [currentUserLike, setCurrentUserLike] =useState(false)
  function check(postid) {
    firebase.firestore()
    .collection("Posts")
    .doc(firebase.auth().currentUser.uid)
    .collection("UserPosts")
    .doc(postid)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .onSnapshot((snapshot) => {
        setCurrentUserLike(false);
    if(snapshot.exists){
        setCurrentUserLike(true);
    }
    })
  }
  useEffect(() => {
    firebase.firestore()
    .collection("Posts")
    .doc(firebase.auth().currentUser.uid)
    .collection("UserPosts")
    .doc(props.route.params.postid)
    .get()
    .then((snapshot)=>{
           setPost(snapshot.data());
           check(props.route.params.postid)
    })
  },[])
  console.log(post)
  if (post === null) {
    return <View />
  }
  return (
    <View style={styles.container}>
        <Text>hello {post.caption}</Text>
        {currentUserLike ?
                (
                        <View><Text>Like</Text></View>
                )
                : (
                    <View><Text>unLike</Text></View>
                )}
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

})
export default (Post)