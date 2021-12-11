import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button, } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Avatar, Badge } from 'react-native-elements'
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
  }, [props.usersFollowingLoaded, props.feed])
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
        LikesCount: firebase.firestore.FieldValue.increment(1)
      })
  }
  const AddNotifications = (userId, postId, nameUser,type,img,caption) => {
    firebase.firestore()
      .collection("Notifications")
      .doc(userId)
      .collection("UserNotifications")
      .add({
        name: 'Test',
        kid: String(postId),
        image: firebase.auth().currentUser.photoURL,
        nameUser: nameUser,
        type: ' đã thích bài viết của bạn',
        seen: 'no',
        typePost :type,
        imageOwn:img,
        caption:caption,
        creation:firebase.firestore.FieldValue.serverTimestamp(),
      })
  }

  const onDisLikePress = (userId, postId) => {
    firebase.firestore()
      .collection("Posts")
      .doc(userId)
      .collection("UserPosts")
      .doc(postId)
      .update({
        LikesCount: firebase.firestore.FieldValue.increment(-1)
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
  const renderMainItem = ({ item }) => {
    if (item.type === 'row') {
      return (
        <View style={styles.containerView}>
          <View style={styles.container1}>
            <View style={styles.userInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid })}>
                    <Image style={styles.userImg}
                      source={{
                        uri: item.user.downloadURL
                      }}>
                    </Image>
                  </TouchableOpacity>
                </View>
                <View style={styles.userInfoText}>
                  <Text style={styles.userName}>
                    {item.user.nickname[item.user.nickname.length - 1]}
                  </Text>
                  <Text style={styles.date}>{new Date(item.creation.seconds * 1000 + item.creation.nanoseconds / 1000000).toDateString()}
              at {new Date(item.creation.seconds * 1000 + item.creation.nanoseconds / 1000000).toLocaleTimeString()}
              </Text>
              </View>
            </View>
            <Text style={styles.postText}>
              {item.caption}
            </Text>
            <Image
              style={styles.postImg}
              source={{ uri: item.downloadURL }}
            /><Text style={styles.like}>{String(item.LikesCount)} likes</Text>
            <View style={styles.deviler} />
            <View style={styles.interReactionWrapper}>
              <View style={styles.reaction}>
              {item.currentUserLike ?
                (
                  <TouchableOpacity
                    style={styles.interReaction}
                    title="Dislike"
                    onPress={() => {
                      onDisLikePress(item.user.uid, item.id),
                        DisLikePress(item.user.uid, item.id), item.LikesCount--
                    }}>
                    <AntDesign name="heart" size={30} color="red" />
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity
                    title="Like"
                    style={styles.interReaction}
                    onPress={() => {
                      onLikePress(item.user.uid, item.id),
                        LikePress(item.user.uid, item.id), item.LikesCount++,
                        AddNotifications(item.user.uid, item.id, 
                          props.currentUser.nickname[props.currentUser.nickname.length - 1]
                          ,item.type,item.user.downloadURL,item.caption)
                    }}
                  >
                    <AntDesign name="hearto" size={30} color="#ffb412" />
                  </TouchableOpacity>
                )}
                  <Text style={styles.interReactionText}>
                    Likes
                  </Text>
              </View> 
              <View style={styles.reaction}> 
                <TouchableOpacity
                  title="Comments"
                  style={styles.interReaction}
                  onPress={() =>
                    props.navigation.navigate('Comments', {
                      postId: item.id,
                      uid: item.user.uid, caption: item.caption,
                      image: item.user.downloadURL,
                      type :item.type,
                      name: item.user.nickname[item.user.nickname.length - 1]
                    }
                    )}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={27} color="#ffb412" />
                </TouchableOpacity>
                <Text style={styles.interReactionText}>
                  Comments
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
    if (item.type === 'list') {
      return (
        <View style={styles.containerView}>
          <View style={styles.container1}>
            <View style={styles.userInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid })}>
                    <Image style={styles.userImg}
                      source={{
                        uri: item.user.downloadURL
                      }}>

                    </Image>
                  </TouchableOpacity>
                </View>
                <View style={styles.userInfoText}>
                  <Text style={styles.userName}>
                    {item.user.nickname[item.user.nickname.length - 1]}
                  </Text>
                </View>
            </View>
            <Text style={styles.postText}>
              {item.caption}
            </Text>
            <Text style={styles.date}>{new Date(item.creation.seconds * 1000 + item.creation.nanoseconds / 1000000).toDateString()}
             at {new Date(item.creation.seconds * 1000 + item.creation.nanoseconds / 1000000).toLocaleTimeString()}</Text>
              <View style={styles.postImg}>
            <FlatList
              data={item.downloadURL}
              keyExtractor={keyExtractor}
              renderItem={renderHorizontalItem}
              horizontal={true}
              snapToInterval={Dimensions.get('window').width}
              snapToAlignment={'start'}
              decelerationRate={'normal'}
            />
            </View>
            <Text style={styles.like}>{String(item.LikesCount)} Likes</Text>
            <View style={styles.deviler} />
            <View style={styles.interReactionWrapper}>
            <View style={styles.reaction}>
              {item.currentUserLike ?
                (
                  <TouchableOpacity
                    style={styles.interReaction}
                    title="Dislike"
                    onPress={() => {
                      onDisLikePress(item.user.uid, item.id),
                        DisLikePress(item.user.uid, item.id), item.LikesCount--
                    }}>
                    <AntDesign name="heart" size={30} color="red" />
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity
                    title="Like"
                    style={styles.interReaction}
                    onPress={() => {
                      onLikePress(item.user.uid, item.id),
                        LikePress(item.user.uid, item.id), item.LikesCount++,
                        AddNotifications(item.user.uid, item.id, 
                          props.currentUser.nickname[props.currentUser.nickname.length - 1],
                          item.type,item.user.downloadURL,item.caption)
                    }}
                  >
                    <AntDesign name="hearto" size={30} color="#ffb412" />
                  </TouchableOpacity>
                )}
              <Text style={styles.interReactionText}>
                Likes
              </Text>
              </View>
              <View style={styles.reaction}>
              <TouchableOpacity
                title="Comments"
                style={styles.interReaction}
                onPress={() =>
                  props.navigation.navigate('Comments', {
                    postId: item.id,
                    uid: item.user.uid, caption: item.caption,
                    image: item.user.downloadURL,
                    type :item.type,
                    name: item.user.nickname[item.user.nickname.length - 1]
                  }
                  )}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={27} color="#ffb412" />
              </TouchableOpacity>
              <Text style={styles.interReactionText}>
                Comments
              </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
  const keyExtractor = (item, index) => {
    return index.toString();
  }
   const renderHorizontalItem = ({item}) => {
    return (
        <Image
        style={styles.horizontalItem}
        source={{uri :item}}>
        </Image>
    );
  }

  console.log(posts)

  if (posts.length == 0) {
    return <View />
  }
  return (

    <View style={styles.container}>
      <View style={styles.comtainerGalley}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={renderMainItem}
          keyExtractor={keyExtractor}
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
    backgroundColor: '#ffb412'
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
  horizontalItem: {
    width: Dimensions.get('screen').width , 
    height:250,
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
    marginBottom: 12,
    borderRadius: 10
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userImg: {
    marginLeft:12,
    marginTop:12,
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
  date: {
    fontSize:11,
    marginLeft:12
  },
  postText: {
    marginTop:10,
    fontStyle:'italic',
    fontSize: 16,
    paddingLeft: 12,
    paddingRight: 15,
  },
  postImg: {
    width: '100%',
    height: 250,
    marginTop: 15,

  },
  like: {
    marginTop:10,
    fontSize:20,
    fontWeight:'bold',
    paddingLeft:36
  },
  interReactionWrapper: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    padding: 8,

  },
  interReaction: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
  },
  reaction: {
    flexDirection: 'row',
    flex:1,
    paddingLeft:24
  },
  interReactionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginLeft: 10,

  },
  deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '92%',
    alignSelf: 'center',
    marginTop: 10,
  }
})
export default connect(mapStateToProps, null)(NewFeeds)