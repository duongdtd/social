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
function ProfileFriend(props, { navigation }) {


  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  useEffect(() => {
    const { currentUser, posts } = props;
    console.log({ currentUser, posts })
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
    }
    else {
      firebase.firestore()
        .collection("Users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data())
            console.log(snapshot.data())
          }
          else {
            console.log('does not exists')
          }
        })
      firebase.firestore()
        .collection("Posts")
        .doc(props.route.params.uid)
        .collection("UserPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
          })
          console.log(posts)
          setUserPosts(posts)
        })
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
    console.log(following)

  }, [props.route.params.uid, props.following])
  const onfollowing = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }
  const unfollowing = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete()
  }
  const AddFollow = () => {
    firebase.firestore()
      .collection("Users")
      .doc(props.route.params.uid)
      .update({
        Followers: firebase.firestore.FieldValue.increment(1)
      })
  }
  const SubFollow = () => {
    firebase.firestore()
      .collection("Users")
      .doc(props.route.params.uid)
      .update({
        Followers: firebase.firestore.FieldValue.increment(-1)
      })
  }
  const AddFollowing = () => {
    firebase.firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        Following: firebase.firestore.FieldValue.increment(1)
      })
  }
  const SubFollowing = () => {
    firebase.firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        Following: firebase.firestore.FieldValue.increment(-1)
      })
  }
  if (user === null) {
    return <View />
  }
  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
        <Avatar
          rounded
          size="large"
          marginLeft={20}
          source={{
            uri: user.downloadURL
          }}
        />
        <View style={styles.containerInfo}>
          <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
            <Text style={styles.text}>{user.name}</Text>
            {props.route.params.uid !== firebase.auth().currentUser.uid ? (
              <View style={{ marginLeft: 20 }}>
                {following ? (
                  <TouchableOpacity
                    onPress={() => { unfollowing(), SubFollow(), SubFollowing() }}>
                    <SimpleLineIcons name="user-following" size={24} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => { onfollowing(), AddFollow(), AddFollowing() }}>
                    <SimpleLineIcons name="user-unfollow" size={24} color="black" />
                  </TouchableOpacity>
                )
                }
              </View>
            ) : null}
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoTitle}>{user.Posts}</Text>
              <Text style={styles.userInfoView}>Post</Text>

            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoTitle}>{user.Followers}</Text>
              <Text style={styles.userInfoView}>Followers</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoTitle}>{user.Following}</Text>
              <Text style={styles.userInfoView}>Following</Text>
            </View>

          </View>

        </View>
      </View>
      <View
      style ={styles.deviler} />
      <View style={styles.comtainerGalley}
      >
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    marginLeft: 30
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20
  },
  comtainerGalley: {
    flex: 1,
    marginTop: 40,
    flexDirection: 'column'
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
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 10,
  },
  userInfoItem: {
    justifyContent: 'center',

  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoView: {
    fontSize: 12,
    textAlign: 'center',
    color: "black",
  },
  deviler :{
    borderBottomColor :'#dddddd',
    borderBottomWidth :1,
    width :'92%',
    alignSelf: 'center',
    marginTop: 15,
  },
})
export default connect(mapStateToProps, null)(ProfileFriend)