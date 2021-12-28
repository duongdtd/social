import * as React from 'react';
import { Animated, Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button,ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Avatar, Badge } from 'react-native-elements'
//import moment from 'moment';
require('firebase/firestore')

function findDaysDiffrent(seconds,nanoseconds) {

  let CreatedDate = new Date(seconds * 1000 + nanoseconds / 1000000)
  let today = new Date()
  let requiredDiffrentDays
  
  const oneMinute =   60 * 1000;
  const diffMinutes = Math.round(Math.abs((CreatedDate - today) / oneMinute));
  if (diffMinutes >= 518400) {
      requiredDiffrentDays = Math.floor(diffMinutes / 518400) == 1 ? `${Math.floor(diffMinutes / 525600)} year ago` : `${Math.floor(diffMinutes / 525600)} years ago`
  } else if (diffMinutes >= 43200) {
      requiredDiffrentDays = Math.floor(diffMinutes / 43200) == 1 ? `${Math.floor(diffMinutes / 43200)} month ago` : `${Math.floor(diffMinutes / 43200)} months ago`
  } else if (diffMinutes >= 1440) {
    requiredDiffrentDays = Math.floor(diffMinutes / 1440) == 1 ? `${Math.floor(diffMinutes / 1440)} day ago` : `${Math.floor(diffMinutes / 1440)} days ago`
  }else if (diffMinutes >= 60) {
    requiredDiffrentDays = Math.floor(diffMinutes / 60) == 1 ? `${Math.floor(diffMinutes / 60)} hour ago` : `${Math.floor(diffMinutes / 60)} hours ago`
  }else if (diffMinutes < 60) {
    requiredDiffrentDays = (diffMinutes == 1 || diffMinutes == 0) == 1 ? "just now" : `${Math.floor(diffMinutes)} minutes ago`
  }
  return requiredDiffrentDays;
}
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
    if(userId != firebase.auth().currentUser.uid)
    {firebase.firestore()
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
      })}
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
  const ITEM_SIZE = 515;
  const renderMainItem = ({ item,index }) => {
    const inputRange = [-1,0,ITEM_SIZE * index,ITEM_SIZE * (index + 1)];
    const opacityInputRange = [-1,0,ITEM_SIZE * index,ITEM_SIZE * (index + 0.5)];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange:[1,1,1,0]
    })
    const opacity = scrollY.interpolate({
      inputRange: opacityInputRange,
      outputRange:[1,1,1,0]
    })
    if (item.type === 'row') {
      return (
        <View style={styles.containerView}>
          <Animated.View style={[styles.container1,{transform:[{scale}]},{opacity:opacity}]}>
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
                  <Text>asd</Text>
                  <Text style={styles.date}>{findDaysDiffrent(item.creation.seconds,item.creation.nanoseconds)}</Text>
              </View>
            </View>
            <Image
              style={styles.postImg}
              source={{ uri: item.downloadURL }}
            />
            <Text style={styles.postText}>
                    {item.caption}
            </Text>
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
                    <AntDesign name="heart" size={24} color="red" />
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
                    <AntDesign name="hearto" size={24} color="#ffb412" />
                  </TouchableOpacity>
                )}
              {/* <Text style={styles.interReactionText}>
                Likes
              </Text> */}
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
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#ffb412" />
              </TouchableOpacity>
              {/* <Text style={styles.interReactionText}>
                Comments
              </Text> */}
              </View>
            </View>
            {/* <View style={styles.deviler} /> */}
            <Text style={styles.like}>{String(item.LikesCount)} Likes</Text> 
            <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Comments', {
                postId: item.id,
                uid: item.user.uid, caption: item.caption,
                image: item.user.downloadURL,
                type :item.type,
                name: item.user.nickname[item.user.nickname.length - 1]
              }
              )}>
           <Text style={styles.cmt}>View all {String(item.cmts)} comments</Text> 
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    }
    if (item.type === 'list') {
      return (
        <View style={styles.containerView}>
          <Animated.View style={[styles.container1,{transform:[{scale}]}, {opacity:opacity}]}>
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
                  <Text style={styles.date}>{findDaysDiffrent(item.creation.seconds,item.creation.nanoseconds)}</Text>
                </View>
            </View>
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
            <Text style={styles.postText}>
                    {item.caption}
            </Text>
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
                    <AntDesign name="heart" size={24} color="red" />
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
                    <AntDesign name="hearto" size={24} color="#ffb412" />
                  </TouchableOpacity>
                )}
              {/* <Text style={styles.interReactionText}>
                Likes
              </Text> */}
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
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#ffb412" />
              </TouchableOpacity>
              {/* <Text style={styles.interReactionText}>
                Comments
              </Text> */}
              </View>
            </View>
            {/* <View style={styles.deviler} /> */}
            <Text style={styles.like}>{String(item.LikesCount)} Likes</Text> 
            <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Comments', {
                postId: item.id,
                uid: item.user.uid, caption: item.caption,
                image: item.user.downloadURL,
                type :item.type,
                name: item.user.nickname[item.user.nickname.length - 1]
              }
              )}>
            <Text style={styles.cmt}>View all {String(item.cmts)} comments</Text> 
            </TouchableOpacity>   
          </Animated.View>
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

  //console.log(posts)
  const scrollY = React.useRef(new Animated.Value(0)).current;
  if (posts.length == 0) {
    return <View />
  }
  return (

    <View style={styles.container}>
      <View style={styles.comtainerGalley}>
        <ImageBackground 
          source={require('../../image/bg1.jpg')}
          style={StyleSheet.absoluteFillObject}
          blurRadius={65}
        />  
        <Animated.FlatList
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true}
          )}
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
    //backgroundColor: '#ffb412',
  },
  containerInfo: {
    margin: 20
  },
  comtainerGalley: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    
  },
  horizontalItem: {
    width: Dimensions.get('screen').width , 
    height:300,
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
    marginTop: 12,
    borderRadius: 14,
    elevation:18,
    shadowColor: 'black',
    //shadowOpacity: 0.7,
    //shadowOffset: { width: 0, height: 10},
    shadowRadius: 14,
    //transform:[{scale}]
    // shadowColor:'#000',
    // shadowOffset: {
    //   width:0,
    //   height:10
    // }
    //shadowRadius: 20,
    //fontFamily: 'Poppins, sans-serif'
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#fff',
    padding: 8,
    //fontFamily: 'Poppins, sans-serif'
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //fontFamily: 'Poppins, sans-serif'
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
    //fontFamily: 'Freight Sans'
  },
  userName: {
    marginTop:8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    //fontFamily: 'Poppins, sans-serif'
  },
  date: {
    //marginTop:6,
    fontSize:11,
    //marginLeft:12,
    //fontFamily: 'Poppins, sans-serif'
  },
  postText: {
    marginLeft:12,
    marginTop:5,
    fontStyle:'italic',
    fontSize: 16,
    // paddingLeft: 12,
    // paddingRight: 15,
    //fontFamily: 'Poppins, sans-serif'
  },
  postImg: {
    width: '100%',
    height: 300,
    marginTop: 8,
    resizeMode :'contain'
    
  },
  like: {
    marginLeft:12,
    marginBottom:10,
    fontSize:15,
    fontWeight:'bold',
    //paddingLeft:12
  },
  cmt: {
    marginLeft:12,
    marginBottom:10,
    fontSize:15,
    fontWeight:'bold',
    color:'gray'
    //paddingLeft:12

  },
  interReactionWrapper: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //padding: 8,

  },
  interReaction: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 2,
    //marginTop:4
  },
  reaction: {
    //flexDirection: 'row',
    //flex:1,
    paddingLeft:10,
    //paddingRight:10
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
    width: '95%',
    alignSelf: 'center',
    marginTop: 5,
  }
})
export default connect(mapStateToProps, null)(NewFeeds)