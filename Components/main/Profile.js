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
import { SimpleLineIcons, Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function Profile(props, { navigation }) {
  var bs = React.useRef(null);
  var fall = new Animated.Value(1);

  const SignOut = () => {
    firebase.auth().signOut();
  }
  const renderInner = () => (
    <View style={styles.panel}>
      <TouchableOpacity style={styles.panelButton}
        onPress={() => (props.navigation.navigate('EditProfile', { uid: firebase.auth().currentUser.uid }), bs.current.snapTo(1))}>
        <Text style={styles.panelButtonTitle}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}
        onPress={() => (props.navigation.navigate('Photo'), bs.current.snapTo(1))}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}
        onPress={() => firebase.auth().signOut()} >
        <Text style={styles.panelButtonTitle}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.hearder}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} ></View>
      </View>
    </View>
  );
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  
  useEffect(() => {
    const { currentUser, posts } = props;
    console.log({ currentUser, posts })
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      firebase.firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
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
        .doc(firebase.auth().currentUser.uid)
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
      <BottomSheet
        ref={bs}
        snapPoints={[300, 0]}
        initialSnap={1}
        renderContent={renderInner}
        renderHeader={renderHeader}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentGestureInteraction={false}
      />
      <Animated.View style={{
        flex: 1,
        marginTop: 40,
        opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
      }}>
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
              {props.route.params.uid == firebase.auth().currentUser.uid ? (
                <View style={{ marginLeft: 20 }}>

                  <TouchableOpacity
                    onPress={() => bs.current.snapTo(0)}
                  >
                    <AntDesign name="setting" size={24} color="black" />
                  </TouchableOpacity>

                </View>
              ) : null}

              {/* User header basic info */}
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
              <TouchableOpacity style={styles.button}
                onPress={() => props.navigation.navigate('Messenger')}>
                <Feather name="message-circle" size={30} color="black" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
        <View
          style={styles.deviler} />
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
      </Animated.View>
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
    margin: 2,
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
  deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '92%',
    alignSelf: 'center',
    marginTop: 15,
  },
  hearder: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelSubTitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,

  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  }

})
export default connect(mapStateToProps, null)(Profile)