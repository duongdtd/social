import * as React from 'react';
import { Text, View,Image,FlatList,StyleSheet,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
 function Profile(props) {
  const SignOut = () => {
    firebase.auth().signOut();
  }
   const { currentUser, posts} = props;
   console.log({currentUser,posts})
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
      <Text>{currentUser.name}</Text>
      <Text>{currentUser.email}</Text>
      <TouchableOpacity style={{ marginRight: 10 }}
                    onPress={SignOut}>
                    <AntDesign name="login" size={24} color="black" />
                  </TouchableOpacity>
      </View>
      <View style={styles.comtainerGalley}
      >
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem ={({item})=>(
            <View style={styles.containerImage}>
            <Image
            style={styles.image}
            source ={{uri :item.downloadURL}}
            />
            </View>
          )}
        
        />

      </View>
    </View>
  );
}

const mapStateToProps =(store) =>({
  currentUser :store.userState.currentUser,
  posts :store.userState.posts,
})
const  styles = StyleSheet.create({
  container : {
    flex:1,
    marginTop: 40,
  },
  containerInfo :{
    margin :20
  },
  comtainerGalley: {
    flex :1,
  },
  image :{
    flex :1,
    aspectRatio: 1/1
  },
  containerImage:{
    flex :1/3
  }
})
export default connect(mapStateToProps,null)(Profile)