import * as React from 'react';
import { Text, View, Image, FlatList, TouchableWithoutFeedback, Keyboard, 
  StyleSheet,ScrollView, TouchableOpacity, Button, TextInput,KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
require('firebase/firestore');
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
function Post(props,{navigation}) {
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useState("")
  const [text, setText] = useState("")
  const [post, setPost] = useState(null)
  const [u, setU] = useState(null)
  const [currentUserLike, setCurrentUserLike] = useState(false)
  function check(postid) {
    firebase.firestore()
      .collection("Posts")
      .doc(props.route.params.uid1)
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
  function checkUser() {
    firebase.firestore()
        .collection("Users")
        .doc(props.route.params.uid1)
        .get()
        .then((snapshot) => {
          setU(snapshot.data())
        })
  }
  useEffect(() => {
    firebase.firestore()
      .collection("Posts")
      .doc(props.route.params.uid1)/////
      .collection("UserPosts")
      .doc(props.route.params.postId)
      .get()
      .then((snapshot) => {
        setPost(snapshot.data());
        check(props.route.params.postId);
        checkUser(props.route.params.uid1)
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
        .orderBy("creation","asc")
        .onSnapshot((snapshot) => {
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
    return function cleanup()
    {
      setCurrentUserLike(false);
      setComments([]);
      setPostId("");
      setText("");
      setPost(null);
      setU(null);
    }
  }, [props.route.params.postId, props.users, props.route.params.postId.LikesCount])


  const onCommentSend = () => {
    firebase.firestore()
      .collection('Posts')
      .doc(props.route.params.uid1)
      .collection('UserPosts')
      .doc(props.route.params.postId)
      .collection('Comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
        creation:firebase.firestore.FieldValue.serverTimestamp(),
      })
  }
  const AddNotifications = () => {
    if(props.route.params.uid1 != firebase.auth().currentUser.uid)
        {firebase.firestore()
        .collection("Notifications")
        .doc(props.route.params.uid1)
        .collection("UserNotifications")
        .add({
            kid: String(props.route.params.postId),
            image: firebase.auth().currentUser.photoURL,
            nameUser: props.currentUser.nickname[props.currentUser.nickname.length-1],
            type: ' đã bình luận bài viết của bạn',
            seen: 'no',
            typePost :props.route.params.type,
            imageOwn:props.route.params.imgOwn,
            creation:firebase.firestore.FieldValue.serverTimestamp(),
            caption:post.caption,
        })}
}
const AddLikeNotifications = () => {
  if(props.route.params.uid1 != firebase.auth().currentUser.uid)
      {firebase.firestore()
      .collection("Notifications")
      .doc(props.route.params.uid1)
      .collection("UserNotifications")
      .add({
          kid: String(props.route.params.postId),
          image: firebase.auth().currentUser.photoURL,
          nameUser: props.currentUser.nickname[props.currentUser.nickname.length-1],
          type: ' đã thích bài viết của bạn',
          seen: 'no',
          typePost :props.route.params.type,
          imageOwn:props.route.params.imgOwn,
          creation:firebase.firestore.FieldValue.serverTimestamp(),
          caption:post.caption,
      })}
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
        LikesCount: firebase.firestore.FieldValue.increment(1)
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

  if (post ==  null || u == null) {
    return <View />
  }
  return (
    <TouchableWithoutFeedback style={styles.containerView} onPress={Keyboard.dismiss}>
    <View style={styles.containerView}>
      {props.route.params.type =="list" ? (
            <View style={styles.container1}>
        <View style={styles.userInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image style={styles.userImg}
              source={{
                uri: u.downloadURL
              }}>
            </Image>
          </View>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>
                {u.nickname[u.nickname.length -1]}
              </Text>
          </View>
        </View>
        <Text style={styles.postText}>
          {post.caption}
        </Text>
              <View style={styles.postImg}>
            <FlatList
              data={post.downloadURL}
              keyExtractor={keyExtractor}
              renderItem={renderHorizontalItem}
              horizontal={true}
              snapToInterval={Dimensions.get('window').width}
              snapToAlignment={'start'}
              decelerationRate={'normal'}
            />
            </View>
            <Text style={styles.like}>{String(post.LikesCount)} likes</Text>
            <View style={styles.deviler} />
            <View style={styles.interReactionWrapper}>
            <View style={styles.reaction}>
            {currentUserLike ?
            (
              <TouchableOpacity
                style={styles.interReaction}
                title="Dislike"
                onPress={() => {
                  onDisLikePress(props.route.params.uid1 ,props.route.params.postId),
                  DisLikePress(props.route.params.uid1, props.route.params.postId), post.LikesCount--
                }}>
                <AntDesign name="heart" size={30} color="red" />
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity
                title="Like"
                style={styles.interReaction}
                onPress={() => {
                  onLikePress(props.route.params.uid1, props.route.params.postId),AddLikeNotifications(),
                  LikePress(props.route.params.uid1, props.route.params.postId), post.LikesCount++
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
                  props.navigation.navigate('Comments',
                   { postId: props.route.params.postId, 
                     uid: firebase.auth().currentUser.uid,
                     image :props.route.params.imgOwn,
                     name:props.currentUser.name,
                     type:props.route.params.type,
                   }
               )}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={28} color="#ffb412" />
              </TouchableOpacity>
              <Text style={styles.interReactionText}>
                Comments
              </Text>
            </View>
            </View>
          </View>
          
      ):(
<View style={styles.container1}>
          <View style={styles.userInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image style={styles.userImg}
              source={{
                uri: u.downloadURL
              }}>
            </Image>
          </View>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>
              {u.nickname[u.nickname.length -1]}
              </Text>
            </View>
        </View>
        <Image
          style={styles.postImg}
          source={{ uri: post.downloadURL }}
        /><Text style={styles.like}>{String(post.LikesCount)} Likes</Text>
        <View style={styles.deviler} />
        <View style={styles.interReactionWrapper}>
        <View style={styles.reaction}>
          {currentUserLike ?
            (
              <TouchableOpacity
                style={styles.interReaction}
                title="Dislike"
                onPress={() => {
                  onDisLikePress(props.route.params.uid1 ,props.route.params.postId),
                  DisLikePress(props.route.params.uid1, props.route.params.postId), post.LikesCount--
                }}>
                <AntDesign name="heart" size={30} color="#ffb412" />
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity
                title="Like"
                style={styles.interReaction}
                onPress={() => {
                  onLikePress(props.route.params.uid1, props.route.params.postId),AddLikeNotifications(),
                  LikePress(props.route.params.uid1, props.route.params.postId), post.LikesCount++
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
               props.navigation.navigate('Comments',
                { postId: props.route.params.postId, 
                  uid: firebase.auth().currentUser.uid,
                  image :props.route.params.imgOwn,
                  name:props.currentUser.name,
                  type:props.route.params.type,
                }
            )}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#ffb412" />
          </TouchableOpacity>
          <Text style={styles.interReactionText}>
            Comments
          </Text>
        </View>
        </View>
      </View>
      )
      }
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
                  <View style={styles.Avatar}>
                    <Avatar size="small" rounded source={{ uri: item.user.downloadURL }} />
                  </View> 
                  <Text style={{flex:5,fontWeight:'bold'}}>
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
                          }}
                          style={{alignItems:'flex-end',marginRight:10}}>
                          <AntDesign name="delete" size={18} color="black" />
                        </TouchableOpacity>
                      </View>
                    ) : null
                  }
                </View>
                : null}
              <Text style={styles.comment}>{item.text}</Text>
            </View>
          )}
        />
        </View>
        <View style={styles.sendComment}>
          <TextInput 
            style={{height:36,flex:4,borderWidth:2,
              borderColor:'#dddddd',padding:6,borderRadius:6,marginRight:12}}
            placeholder=' Comment...'
            onChangeText={(text) => setText(text)}>
          </TextInput>
          <TouchableOpacity
            onPress={() => {onCommentSend(),AddNotifications()}}
            style={{height:34,flex:1,backgroundColor:"#ffb412",alignItems:'center',justifyContent:'center',borderWidth:2, borderRadius:6,padding:5}}
          >
            <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Send</Text>
          </TouchableOpacity>  
        </View>
    </View>
    </TouchableWithoutFeedback>

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
  Avatar: {
    marginLeft:8,
    marginRight:6,
    marginTop:5
  },
  comment: {
    marginLeft:10,
    fontSize:15,
    //fontFamily: 'Open Sans, san-serif'
  },
  sendComment: {
    alignItems:'center',
    flexDirection: 'row',
    marginBottom:10,
    width:'100%',
    justifyContent:'space-between'
  },
  container1: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userImg: {
    //marginLeft:12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  postText: {
    marginTop:10,
    fontStyle:'italic',
    fontSize: 16,
    //paddingLeft: 12,
    paddingRight: 15,
  },
  postImg: {
    width: '100%',
    height: 250,
    marginTop: 15,

  },
  like: {
    marginTop:6,
    marginBottom:6,
    fontSize:20,
    fontWeight:'bold',
    paddingLeft:36
  },
  interReactionWrapper: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
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
  reaction: {
    flexDirection: 'row',
    flex:1,
    paddingLeft:24
  },
  deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '96%',
    alignSelf: 'center',
    //marginBottom:5
  },
  input1: {
    width: '100%',
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 50,
  },
  horizontalItem: {
    width: Dimensions.get('screen').width , 
    height:250,
  },

})
const mapStateToProps = (store) => ({
  users: store.usersState.users,
  currentUser: store.userState.currentUser,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Post)