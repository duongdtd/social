import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import 'firebase/database'
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
require('firebase/firestore')
require('firebase/database');
import { SimpleLineIcons, Feather, Foundation } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function Profile(props, { navigation }) {
  var bs = React.useRef(null);
  var fall = new Animated.Value(1);
  const logout = () => {
    // firebase.auth().signOut();
    Alert.alert('Warning', 'Log out ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => firebase.auth().signOut() },
    ]);
  }
  const renderInner = () => (
    <View style={styles.panel}>
      <TouchableOpacity style={styles.panelButton}
        onPress={() => (props.navigation.navigate('EditProfile', { uid: firebase.auth().currentUser.uid }), bs.current.snapTo(1))}>
        <Text style={styles.panelButtonTitle}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}
        onPress={() => (props.navigation.navigate('ChangePassword'), bs.current.snapTo(1))}>
        <Text style={styles.panelButtonTitle}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}
        onPress={logout}>
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
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      firebase.firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((snapshot) => {
          setUser(snapshot.data())
        })
      firebase.firestore()
        .collection("Posts")
        .doc(firebase.auth().currentUser.uid)
        .collection("UserPosts")
        .orderBy("creation", "desc")
        .onSnapshot((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
          })
          setUserPosts(posts)
        })
    }
    else {
      firebase.firestore()
        .collection("Users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data())
        })
      firebase.firestore()
        .collection("Posts")
        .doc(props.route.params.uid)
        .collection("UserPosts")
        .orderBy("creation", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
          })
          setUserPosts(posts)
        })
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
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

  const handleChat = () => {
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/' + props.route.params.uid).set({ name: user.name, avatar: user.downloadURL });
    props.navigation.navigate('Messenger')

  }
  const AddNotifications = (userId, nameUser) => {
    firebase.firestore()
      .collection("Notifications")
      .doc(userId)
      .collection("UserNotifications")
      .add({
        name: 'Test',
        kid: "null",
        image: firebase.auth().currentUser.photoURL,
        nameUser: nameUser,
        type: ' ???? theo d??i b???n b???n',
        seen: 'yes',
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
  }
  const renderHorizontalItem = ({ item }) => {
    return (
      <View style={styles.containerImage}>
        {props.route.params.uid === firebase.auth().currentUser.uid ? (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Post", {
              postId: item.id, type: item.type,
              uid: firebase.auth().currentUser.uid,
              uid1: firebase.auth().currentUser.uid,
              imgOwn: firebase.auth().currentUser.photoURL
            })}>
            {item.type == "list" ?
              (
                <View style={styles.item}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.im }}
                  />
                  <Foundation name="page-multiple" size={30} color="rgba(255,255,255,0.8)" style={{ position: 'absolute', top: 8, right: 8 }} />
                </View>
              ) : ( 
                item.type == "row" ?
               ( <View style={styles.item}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                  />
                </View>) :null
              )
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Post", {
              postId: item.id, type: item.type,
              uid: firebase.auth().currentUser.uid,
              uid1: props.route.params.uid,
              imgOwn: user.downloadURL,
            })}>
            {item.type == "list" ?
              (
                <View style={styles.item}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.im }}
                  />
                  <Foundation name="page-multiple" size={30} color="rgba(255,255,255,0.8)"
                    style={{ position: 'absolute', top: 8, right: 8 }} />
                </View>
              ) : (
                item.type == "row" ?
                (<View style={styles.item}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                  />
                </View> ): null
              )
            }
          </TouchableOpacity>
        )}
      </View>
    );
  }
  if (user == null) {
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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ flex: 1 / 3, alignItems: 'center' }}>
            <Avatar
              rounded
              size={90}
              //containerStyle={{marginLeft:20}}
              source={{
                uri: user.downloadURL
              }}
            />
            <Text style={styles.text}>{user.nickname[user.nickname.length - 1]}</Text>
          </View>
          <View style={styles.containerInfo}>
            {/* User header basic info */}
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
            <View style={styles.Header}>
              {props.route.params.uid == firebase.auth().currentUser.uid ? (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => bs.current.snapTo(0)} //style={styles.button}
                  >
                    <AntDesign name="setting" size={30} color="#ffb412" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => props.navigation.navigate('QRscreen', { data: firebase.auth().currentUser.uid })}
                  >
                    <AntDesign name="qrcode" size={30} color="#ffb412" />
                  </TouchableOpacity>

                </View>
              ) : (
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={handleChat}
                  >
                    <Feather name="message-circle" size={30} color="#ffb412" />
                  </TouchableOpacity>
                  {following == true ? (
                    <TouchableOpacity
                      style={styles.btnFollow}
                      onPress={() => { unfollowing(), SubFollow(), SubFollowing() }}>
                      <Text style={styles.followText}>Unfollow</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.btnFollow}
                      onPress={() => {
                        onfollowing(), AddFollow(), AddFollowing()
                          , AddNotifications(props.route.params.uid,
                            props.currentUser.nickname[props.currentUser.nickname.length - 1])
                      }}><Text style={styles.followText}>follow</Text>
                    </TouchableOpacity>
                  )
                  }
                </View>
              )}
            </View>
          </View>
        </View>
        <View
          style={styles.deviler} />
        <View style={styles.comtainerGalley}
        >
          <FlatList
            numColumns={2}
            horizontal={false}
            data={userPosts}
            renderItem={renderHorizontalItem}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  following: store.userState.following,
  currentUser: store.userState.currentUser,
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  containerInfo: {
    //marginLeft: 30
    flex: 3 / 5
  },
  button: {
    marginLeft: '13%'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    //marginLeft: 20
  },
  Header: {
    //justifyContent: 'flex-start',
    flexDirection: 'row',
    //justifyContent: 'space-between',
  },
  comtainerGalley: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 5,
    flexDirection: 'column'
  },
  image: {
    flex: 1,
    borderRadius: 10,
    aspectRatio: 1 / 1
  },
  containerImage: {
    flex: 1 / 2,
  },
  userImage: {
    height: 100,
    width: 100,
    borderRadius: 75
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    borderRadius: 14,
    backgroundColor: '#ffb412',
    alignItems: 'center',
    marginVertical: 7,
    borderWidth: 2,
    borderColor: 'black'
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
    color: 'black',
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnFollow: {
    marginLeft: '16%',
    textAlign: 'center',
    alignItems: 'center',
    height: 38,
    width: '50%',
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 12,
    backgroundColor: '#ffb412',
  },
  followText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 17
  },
  item: {
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    height: 185,

  }
})
export default connect(mapStateToProps, null)(Profile)