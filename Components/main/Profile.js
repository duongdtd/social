import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements'
require('firebase/firestore')
function Profile(props, { navigation }) {

  const SignOut = () => {
    firebase.auth().signOut();
  }
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  useEffect(() => {

    const { currentUser, posts } = props;
    console.log({ currentUser, posts })
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser),
        setUserPosts(posts)
    }
    else {
      firebase.firestore()
        .collection("Users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data())
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
      if(props.following.indexOf(props.route.params.uid) >-1)
      {
        setFollowing(true);
      } else {
        setFollowing(false);
      }

  }, [props.route.params.uid , props.following ])
const onfollowing =() =>{
  firebase.firestore()
  .collection("following")
  .doc(firebase.auth().currentUser.uid)
  .collection("userFollowing")
  .doc(props.route.params.uid)
  .set({})
}
const unfollowing =() =>{
  firebase.firestore()
  .collection("following")
  .doc(firebase.auth().currentUser.uid)
  .collection("userFollowing")
  .doc(props.route.params.uid)
  .delete()
}

  if (user === null) {
    return <View />
  }
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="large"
        marginLeft={20}
        source={{
          uri: user.downloadURL
        }}
      />
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button
                title="Following"
                onPress={() => unfollowing()}>

              </Button>
            ) : (
              <Button
                title="Follow"
                onPress={() => onfollowing()}>

              </Button>
            )
            }
          </View>
        ) : null}

      </View>
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
  }

})
export default connect(mapStateToProps, null)(Profile)