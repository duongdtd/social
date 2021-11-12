import * as React from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
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
require('firebase/firestore')
function EditProfile(props, { navigation }) {
  const [user, setUser] = useState(null)
  const [name, setname]=useState("")
  const [phone, setphone]=useState("")
  const [hasCameraPermission, setCameraHasPermission] = useState(null);
  const [hasGalleyPermission, setGalleyHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const uploadImage = async () => {
    const uri = image;
    const childPath =`user/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath)
    const response =await fetch(uri);
    const blob =await response.blob();  
    const task =firebase.storage()
    .ref()
    .child(childPath)
    .put(blob);
    const taskProgress = snapshot  => {
        console.log(`transferred : ${snapshot.bytesTransferred}`)
    }
    const taskCompleted  =   () => {
        task.snapshot.ref.getDownloadURL().then((snapshot)=>{
            saveData(snapshot);
            console.log(snapshot)
        })
    }
    const taskError =snapshot => {
        console.log(snapshot) 
    }
    task.on("state_changed", taskProgress, taskError, taskCompleted);
}
const saveData = (downloadURL) => {
    firebase.firestore()
    .collection("Users")
    .doc(firebase.auth().currentUser.uid)
    .update ({
        downloadURL,
    }).then(( {})
    )
    const update = {
        photoURL: downloadURL,
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
    "Profile Updated",
    "My Alert Msg",
    [
      {
        text: "Cancel",
        onPress: () => navigation.navigate('NewFeeds'),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => Alert.alert("Cancel Pressed"),
        style: "cancel",
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
  const update =() =>{
  firebase.firestore()
  .collection('Users')
  .doc(firebase.auth().currentUser.uid)
  .update({
    name: name,
    phone : generateSearchIndex(phone)
  })
  .then(() => {
    console.log('User updated!');

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
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
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
      </View>
      <View style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 20 }
      }>
        <Text>Name :</Text>
        <TextInput style={{ marginLeft: 30 }}
          placeholder={user.name}
          placeholderTextColor='rgba(0,0,0,1)'
          keyboardType='email-address'
          returnKeyType="next"
          type='text'
          value={name}
          onChangeText={(text) =>setname(text)} 
        ></TextInput>
      </View>
      <View
        style={styles.deviler} />
      <View style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 20 }
      }>
        <Text>Phone :</Text>
        <TextInput style={{ marginLeft: 30 }}
          placeholder={user.phone[user.phone.length - 1]}
          placeholderTextColor='rgba(0,0,0,1)'
          keyboardType='email-address'
          returnKeyType="next"
          type='text'
          value={phone}
          onChangeText={(text) =>setphone(text)} 
        ></TextInput>
      </View>
      <View
        style={styles.deviler} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.panelButton}
        onPress={() =>(showAlert,uploadImage())}>
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
  deviler: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    width: '100%',
    alignSelf: 'center',
    marginTop: 1,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
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

})
export default connect(mapStateToProps, null)(EditProfile)