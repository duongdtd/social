import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
export default function Photo({ navigation }) {
  const [hasCameraPermission, setCameraHasPermission] = useState(null);
  const [hasGalleyPermission, setGalleyHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
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
      <View style={styles.cameraContainer}>
        {isFocused && <Camera ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={['1:1']}>
          {image && <TouchableOpacity onPress={() => navigation.navigate('Save', { image })}><Image source={{ uri: image }} style={{
            width: 100,
            height: 100,
            margin: 20,
            resizeMode: 'contain'
          }} /></TouchableOpacity>}
          <View style={styles.camera}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <AntDesign name="retweet" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPress={() => takeImage()}
            >
              <Ionicons name="md-radio-button-on-sharp" size={90} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPress={() => pickImage()}>
              <AntDesign name="picture" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
        }

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
  }
})
