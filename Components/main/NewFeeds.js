import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button, } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign,Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements'
require('firebase/firestore')
function NewFeeds(props, { navigation }) {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {

      props.feed.sort(function (x, y) {
        return y.creation - x.creation;
      })
      setPosts(props.feed)
    }
    console.log(posts)
  }, [props.usersFollowingLoaded, props.feed,])
  const onLikePress = (userId, postId) => {
    firebase.firestore()
      .collection("Posts")
      .doc(userId)
      .collection("UserPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({})
  }
  const LikePress = (userId, postId) => {
    firebase.firestore()
      .collection("Posts")
      .doc(userId)
      .collection("UserPosts")
      .doc(postId)
      .update({
        likesCouter: firebase.firestore.FieldValue.increment(1)
      })
  }

  const onDisLikePress = (userId, postId) => {
    firebase.firestore()
      .collection("Posts")
      .doc(userId)
      .collection("UserPosts")
      .doc(postId)
      .update({
        likesCouter: firebase.firestore.FieldValue.increment(-1)
      })
  }
  const DisLikePress = (userId, postId) => {
    firebase.firestore()
      .collection("Posts")
      .doc(userId)
      .collection("UserPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete({})
  }

  return (

    <View style={styles.container}>
      <View style={styles.comtainerGalley}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerView}>
              <View style={styles.container1}>
                <View style={styles.userInfo}>
                  <View style={styles.userInfo}>
                    <Image style={styles.userImg}
                      source={{
                        uri: item.user.downloadURL
                      }}>
                    </Image>
                    <View style={styles.userInfoText}>
                      <Text style={styles.userName}>
                        {item.user.name}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.postText}>
                  {item.caption}
                </Text>
                <Image
                  style={styles.postImg}
                  source={{ uri: item.downloadURL }}
                /><Text>{String(item.likesCouter)} likes</Text>
                <View style ={styles.deviler} />
                <View style={styles.interReactionWrapper}>
                {item.currentUserLike ?
                (
                  <TouchableOpacity
                    style={styles.interReaction}
                    title="Dislike"
                    onPress={() => { onDisLikePress(item.user.uid, item.id), DisLikePress(item.user.uid, item.id), item.LikesCount-- }}>
                    <AntDesign name="heart" size={30} color="red" />
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity
                    title="Like"
                    style={styles.interReaction}
                    onPress={() => { onLikePress(item.user.uid, item.id), LikePress(item.user.uid, item.id), item.LikesCount++ }}
                  >
                    <AntDesign name="hearto" size={30} color="black" />
                  </TouchableOpacity>
                )}
                <Text style ={styles.interReactionText}>
                  likes
                </Text>
                <TouchableOpacity
                    title="Comments"
                    style={styles.interReaction}
                    onPress={() => props.navigation.navigate('Comments', { postId: item.id, uid: item.user.uid }
                )}
                  >
                   <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style ={styles.interReactionText}>
                  Comments
                </Text>
                </View>
              </View>
              {/* <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
              /> */}
              {/* <Text>{String(item.likesCouter)} likes</Text>
              {item.currentUserLike ?
                (
                  <TouchableOpacity
                    title="Dislike"

                    onPress={() => { onDisLikePress(item.user.uid, item.id), DisLikePress(item.user.uid, item.id), item.likesCouter-- }}>
                    <AntDesign name="heart" size={30} color="red" />
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity
                    title="Like"
                    onPress={() => { onLikePress(item.user.uid, item.id), LikePress(item.user.uid, item.id), item.likesCouter++ }}
                  >
                    <AntDesign name="hearto" size={30} color="black" />
                  </TouchableOpacity>

                )}
              <Text
                onPress={() => props.navigation.navigate('Comments', { postId: item.id, uid: item.user.uid }
                )}
              >View Comments...</Text> */}
            </View>
          )}

        />

      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,

  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerInfo: {
    margin: 20
  },
  comtainerGalley: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1
  },
  containerImage: {
    flex: 1 / 3
  },
  userImage: {
    height: 100,
    width: 100,
    borderRadius: 75
  },
  container1: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    marginBottom: 20,
    borderRadius: 10
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoText: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  postText: {
    fontSize: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  postImg: {
    width: '100%',
    height: 250,
    marginTop: 15,

  },
  interReactionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,

  },
  interReaction: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
  },
  interReactionText :{
    fontSize :15,
    fontWeight :'bold',
    color :'black',
    marginTop :10,
    marginLeft :10,

  },
  deviler :{
    borderBottomColor :'#dddddd',
    borderBottomWidth :1,
    width :'92%',
    alignSelf: 'center',
    marginTop: 15,
  }
})
export default connect(mapStateToProps, null)(NewFeeds)