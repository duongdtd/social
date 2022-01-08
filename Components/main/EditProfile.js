import * as React from 'react';
import { Text, View, Image, FlatList,ActivityIndicator, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { useLayoutEffect, useEffect } from 'react'
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements'
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
require('firebase/database');
require('firebase/firestore')
function EditProfile(props, { navigation }) {
  const [user, setUser] = useState(null)
  const [name, setname] = useState("")
  const [nickname, setNickname] = useState("")
  const [phone, setphone] = useState("")
  const [hasCameraPermission, setCameraHasPermission] = useState(null);
  const [hasGalleyPermission, setGalleyHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState("");
  const [running, setRunning] = useState(false)
  const uploadImage = async () => {
    setRunning(true)
    const uri = image;
    const childPath = `user/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath)
    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase.storage()
      .ref()
      .child(childPath)
      .put(blob);
    const taskProgress = snapshot => {
      console.log(`transferred : ${snapshot.bytesTransferred}`)
    }
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        saveData(snapshot);
        setRunning(false);
        showAlert();
      })
    }
    const taskError = snapshot => {
      console.log(snapshot)
    }
    task.on("state_changed", taskProgress, taskError, taskCompleted);
    up();
  }
  const up = () => {
    fetch(`http://171.244.53.66:5000/add_faces?user_id=${firebase.auth().currentUser.uid}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            [
                {
                    image: `data:image/png;base64,${base64}`
                }
            ]
        )
    });
}
console.log(base64)
  const saveData = (downloadURL) => {
    firebase.firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        downloadURL,
      }).then(({})
      )
    const update = {
      photoURL: downloadURL,
      displayName: name
    };
    firebase.auth().currentUser.updateProfile(update);
  }
  function generateSearchIndex(str) {
    var temp = []
    str.trim().split(" ").forEach(word => {
      temp = temp.concat(generateSearchIndexWord(word))
    })
    return temp
  }
  function generateSearchIndexWord(word) {
    if (word.length == 0) {
      return []
    } else if (word.length <= 3) {
      return [word]
    } else {
      var ret = []
      for (var i = 3; i <= word.length; i++) {
        ret.push(word.substring(0, i))
      }
      return ret
    }
  }
  const showAlert = () =>
    Alert.alert(
      "Profile ",
      "Success",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel!!"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => props.navigation.navigate('NewFeeds')
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  const update = () => {
    firebase.firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        name: name,
        nickname: generateSearchIndex(nickname),
        phone: generateSearchIndex(phone)
      })
      .then(() => {
      });
  }
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraHasPermission(status === 'granted');

      const galleyStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleyHasPermission(galleyStatus.status === 'granted');

    })();
    const { currentUser } = props;
    setUser(currentUser);
    setImage(currentUser.downloadURL);
  }, []);
  if (user === null) {
    return <View />
  }
  if (running) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color='red' size='large' />
        </View>
    );
}
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64:true,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      setBase64(result.base64);
    }
  };
  if (hasCameraPermission === null || hasGalleyPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleyPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => pickImage()}>
          <Avatar
            rounded
            size="xlarge"
            source={{
              uri: image
            }}
          ><Avatar.Accessory size={24} /></Avatar>
        </TouchableOpacity>
        <View style={styles.containerInfo}>
          <Text>{user.name}</Text>
        </View>
        <View style={styles.containerInfo}>

          <TouchableOpacity
            onPress={() => pickImage()}>
            <Text style={styles.text}>Change avatar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.viewTextInput}>
        <Text>Name</Text>
        <View style={{ width: '80%' }}>
          <TextInput style={{}}
            placeholder={user.name}
            placeholderTextColor='rgba(0,0,0,1)'
            keyboardType='email-address'
            returnKeyType="next"
            type='text'
            value={name}
            onChangeText={(text) => setname(text)}
          ></TextInput>
        </View>
      </View>
      <View
        style={styles.deviler} />
      <View style={styles.viewTextInput}>

        <Text>Nickname</Text>
        <View style={{ width: '80%' }}>
          <TextInput style={{}}
            placeholder={user.nickname[user.nickname.length - 1]}
            placeholderTextColor='rgba(0,0,0,1)'
            keyboardType='email-address'
            returnKeyType="next"
            type='text'
            value={nickname}
            onChangeText={(text) => setNickname(text)}
          ></TextInput>
        </View>
      </View>
      <View
        style={styles.deviler} />
      <View style={styles.viewTextInput}>
        <Text>Phone</Text>
        <View style={{ width: '80%' }}>
          <TextInput style={{}}
            placeholder={user.phone[user.phone.length - 1]}
            placeholderTextColor='rgba(0,0,0,1)'
            keyboardType='email-address'
            returnKeyType="next"
            type='text'
            value={phone}
            onChangeText={(text) => setphone(text)}
          ></TextInput>
        </View>
      </View>
      <View
        style={styles.deviler} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.panelButton}
          onPress={() => { uploadImage(),update() }}>
          <Text style={styles.panelButtonTitle}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
})
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'center'
  },
  containerInfo: {
    marginTop: 10
  },
  text: {
    color: '#6495ed',
    fontSize: 20,
    fontWeight: 'bold'
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
  deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 1,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    borderColor:'black',
    borderWidth:2,
    backgroundColor: '#ffb412',
    alignItems: 'center',
    marginVertical: 7,
    width: '50%'
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
  viewTextInput: {
    marginLeft: 20,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20

  }


})
export default connect(mapStateToProps, null)(EditProfile)