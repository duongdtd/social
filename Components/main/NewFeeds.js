import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements'
require('firebase/firestore')
function NewFeeds(props, { navigation }) {

  const [posts, setPosts] = useState([])
  useEffect(() => {
    let posts = [];
    console.log(props.usersFollowingLoaded),
      console.log(props.following.length)
    if (props.usersFollowingLoaded == props.following.length) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find(el => el.uid === props.following[i]);
        if (user != undefined) {
          posts = [...posts, ...user.posts]
        }
      }
      posts.sort(function (x, y) {
        return x.creation - y.creation;
      })
      setPosts(posts)
    }

  }, [props.usersLoaded])

  return (
    <View style={styles.container}>
      <View style={styles.comtainerGalley}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text>{item.user.name}</Text>
              <Image
                style={styles.image}
                source={{ uri: item.downloadURL }}
              />
              <Text
                onPress={() => props.navigation.navigate('Comments', { postId: item.id, uid  : item.user.uid }
                )}
              >View Comments...</Text>
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

  users: store.usersState.users,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
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
  },

})
export default connect(mapStateToProps, null)(NewFeeds)