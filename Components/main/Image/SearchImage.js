import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons,Feather } from '@expo/vector-icons';
export default function Photo2({ navigation }) {
  const [hasCameraPermission, setCameraHasPermission] = useState(null);
  const [hasGalleyPermission, setGalleyHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraFlash, setCameraFlash] = useState(Camera.Constants.FlashMode.off)
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraHasPermission(status === 'granted');

      const galleyStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleyHasPermission(galleyStatus.status === 'granted');

    })();
  }, []);
  const takeImage = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImage(data.uri);
    }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64 :true
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.base64);
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
      <View style={styles.cameraContainer}>
        <View styles={styles.gallery}></View>
        {isFocused ? <Camera ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          flashMode={cameraFlash}
          ratio={['4:3']}>
        </Camera>
          : null}
      </View>
      <View style={styles.sideBarContainer}>
        <TouchableOpacity
          style={styles.sideBarButton}
          onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>

          <AntDesign name="retweet" size={30} color="white" />
          <Text style={styles.iconText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sideBarButton}
          onPress={() => pickImage()}>
          <AntDesign name="picture" size={30} color="white" />
          <Text style={styles.iconText}>Pick</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sideBarButton}
          onPress={() => setCameraFlash(cameraFlash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off)}>

          <Feather name="zap" size={30} color={'white'} />
          <Text style={styles.iconText}>Flash</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.bottomBarContainer}>


        <View style={{ flex: 1 }}></View>
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={() => takeImage()}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => navigation.navigate('CheckUser', { image })}
          >         
            {image == undefined ?
              <></>
              :
              <Image
                style={styles.galleryButtonImage}
                source={{ uri: `data:image/png;base64,${image}` }}
              />} 
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  fixedRatio: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  camera: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: 'transparent',
  },

  camera1: {
    flex: 1,
    backgroundColor: 'black',
    aspectRatio: 9 / 16,
  },
  bottomBarContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    marginBottom: 30,
  },
  recordButtonContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  recordButton: {
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 100,
    height: 80,
    width: 80,
    alignSelf: 'center'
  },
  galleryButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: 80,
    height: 80,
  },
  galleryButtonImage: {
    width: 80,
    height: 80,
  },
  sideBarContainer: {
    top: 60,
    right: 0,
    marginHorizontal: 20,
    position: 'absolute'
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5
  },
  sideBarButton: {
    alignItems: 'center',
    marginBottom: 25
  }
})
