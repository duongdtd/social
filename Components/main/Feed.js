import * as React from 'react';
import { Text, View,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
export default function Feed() {
  const SignOut = () => {
    firebase.auth().signOut();
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
      <TouchableOpacity
      onPress={SignOut}>
      <AntDesign name="logout" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}