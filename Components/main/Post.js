import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button, TextInput,KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
require('firebase/firestore');
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
function Post(props) {
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useState("")
  const [text, setText] = useState("")
  const [post, setPost] = useState(null)
  const [currentUserLike, setCurrentUserLike] = useState(false)
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
        if (snapshot.exists) {
          setCurrentUserLike(true);
        }
      })
  }
  useEffect(() => {
    firebase.firestore()
      .collection("Posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserPosts")
      .doc(props.route.params.postId)
      .get()
      .then((snapshot) => {
        setPost(snapshot.data());
        check(props.route.params.postId)
      })

    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty('user')) {
          continue;
        }
        const user = props.users.find(x => x.uid === comments[i].creator)
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false)
        }
        else {
          comments[i].user = user
        }
      }
      setComments(comments)
    }

    if (props.route.params.postId !== postId) {
      firebase.firestore()
        .collection('Posts')
        .doc(props.route.params.uid)
        .collection('UserPosts')
        .doc(props.route.params.postId)
        .collection('Comments')
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
          })
          matchUserToComment(comments)

        })
      setPostId(props.route.params.postId)
    }
    else {
      matchUserToComment(comments)
    }

  }, [props.route.params.postId, props.users, props.route.params.postId.likesCouter])


  const onCommentSend = () => {
    firebase.firestore()
      .collection('Posts')
      .doc(props.route.params.uid)
      .collection('UserPosts')
      .doc(props.route.params.postId)
      .collection('Comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text
      })
  }
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
  const AddNotifications = (userId, postId) => {
    firebase.firestore()
      .collection("Notifications")
      .doc(userId)
      .collection("UserNotifications")
      .add({
        name: 'Test',
        id: postId,
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
  console.log(comments)
  if (post === null) {
    return <View />
  }
  return (
    <View style={styles.containerView}>
      <View style={styles.container1}>
        <View style={styles.userInfo}>
          <View style={styles.userInfo}>
            <Image style={styles.userImg}
              source={{
                uri: firebase.auth().currentUser.photoURL
              }}>
            </Image>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>
                { props.route.params.nameUser}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.postText}>
          {post.caption}
        </Text>
        <Image
          style={styles.postImg}
          source={{ uri: post.downloadURL }}
        /><Text>{String(post.likesCouter)} likes</Text>
        <View style={styles.deviler} />
        <View style={styles.interReactionWrapper}>
          {currentUserLike ?
            (
              <TouchableOpacity
                style={styles.interReaction}
                title="Dislike"
                onPress={() => {
                  onDisLikePress(props.route.params.uid ,props.route.params.postId),
                  DisLikePress(props.route.params.uid, props.route.params.postId), post.LikesCount--
                }}>
                <AntDesign name="heart" size={30} color="red" />
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity
                title="Like"
                style={styles.interReaction}
                onPress={() => {
                  onLikePress(props.route.params.uid, props.route.params.postId),
                  LikePress(props.route.params.uid, props.route.params.postId), post.LikesCount++
                }}
              >
                <AntDesign name="hearto" size={30} color="black" />
              </TouchableOpacity>
            )}
          <Text style={styles.interReactionText}>
            likes
          </Text>
          <TouchableOpacity
            title="Comments"
            style={styles.interReaction}
            onPress={() => props.navigation.navigate('Comments', { postId: props.route.params.postId, uid: firebase.auth().currentUser.uid }
            )}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.interReactionText}>
            Comments
          </Text>
        </View>
      </View>
      <View style={styles.deviler} />
      <View style={styles.container}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          renderItem={({ item }) => (
            <View>
              {item.user !== undefined ?
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Avatar
                    size="small" rounded source={{ uri: item.user.downloadURL }} />
                  <Text>
                    {item.user.name}
                  </Text>
                  {
                    item.user.uid === firebase.auth().currentUser.uid ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            firebase.firestore()
                              .collection('Posts')
                              .doc(props.route.params.uid)
                              .collection('UserPosts')
                              .doc(props.route.params.postId)
                              .collection('Comments')
                              .doc(item.id)
                              .delete()
                          }}>
                          <AntDesign name="delete" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                    ) : null
                  }
                </View>
                : null}
              <Text>{item.text}</Text>
            </View>
          )}
        />
        </View>
        <TextInput 
          placeholder='comment.....'
          onChangeText={(text) => setText(text)}>
        </TextInput>
        <Button
          onPress={() => onCommentSend()}
          title="send"
        />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 5,
  },
  container2: {
    backgroundColor: '#fff',
    width: '100%',
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
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10
  },
  containerView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
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
    marginTop: 15,
  },
  input1: {
    width: '100%',
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 50,
  }
})
const mapStateToProps = (store) => ({
  users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Post)