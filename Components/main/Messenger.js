import * as React from 'react';
import { SafeAreaView, Button, Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set } from "firebase/database";
import firebase from "firebase/app";
import User from '../main/User';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'


function check(arr, uid) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].uid == uid && arr[i].state == 'online') {
      return true;
    }
  }

}

export default class Messenger extends React.Component {
  static navigationOptions = {
    title: "Messenger"
  }

  state = {
    users: [],
    statusUser: []
  }

  UNSAFE_componentWillMount() {
    let dbRef = firebase.database().ref('Users/' + User.uid)
    dbRef.on('child_added', (val) => {
      let person = val.val();
      person.uid = val.key;
      {
        this.setState((prevState) => {
          // console.log("1",typeof person);
          // console.log("2",prevState);
          // console.log("3",typeof this.state.users);
          return {
            users: [...prevState.users, person]
          }

        })
        // console.log(this.state.users)
      }
    })
  }
  componentDidMount() {
    let dbRef = firebase.database().ref('User')
    dbRef.on('child_added', (val) => {
      let person = val.val();
      // console.log(person)
      person.uid = val.key;
      {
        this.setState((prevState) => {
          return {
            statusUser: [...prevState.statusUser, person]
          }
        })
        // console.log(this.state.statusUser)
      }
    })
  }
  renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chat', item)}
        style={{ width: '100%', padding: 12, borderColor: '#DDDDDD', borderBottomWidth: 0.5 }}>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Image source={{ uri: item.avatar }} style={styles.userImg} />
            <View>
            {check(this.state.statusUser, item.uid) == true ? (
              <View style={styles.Badge_onl}/>
           )
              : (
                  <View style={styles.Badge_off}/>
            )
            }
            </View>
          </View>
          <Text style={{ fontSize: 24 }}>{item.name}</Text>

        </View>
      </TouchableOpacity>
    )
  }

  render() {
    console.log(this.state.statusUser)
    //console.log("User.uid la:",User.uid)
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={(item) => { return item.uid }}
        />
        {/* <Text>{this.users.name}</Text> */}
      </SafeAreaView>
    )
  }

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '90%',
    marginBottom: 10,
    borderRadius: 5
  },
  btnText: {
    color: 'darkblue',
    fontSize: 20
  },
  Badge_off :{
    position: 'absolute', bottom: 10, right: 10,
    width: 10,
    height: 10,
    borderRadius: 25,
    backgroundColor:'red'

  },
  Badge_onl :{
    position: 'absolute', bottom: 10, right: 10,
    width: 10,
    height: 10,
    borderRadius: 25,
    backgroundColor:'green'

  },
  userImg: {
    // marginHorizontal:12,
    // marginTop:12,
   
    margin: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
})

// export default function Messenger({ navigation, user, text}) {
//   const [users,setUsers] = useState([]);

//   useEffect(() => {
//     let dbRef = firebase.database().ref('UserID');
//     dbRef.on('child_added',(val) => {
//       let person = val.val();
//       person.uid = val.key;
//       setUsers((prevState) => {
//         return {
//           users: [...prevState, person]
//         }
//       })

//     })
//   },[])

//   // const renderRow = ({item}) => {
//   //   return (
//   //     <TouchableOpacity>
//   //           <Text>{item.name}</Text>
//   //         </TouchableOpacity>
//   //   )
//   // }
// //console.log((Object.values(users)[0]).name)
// // const a = users[0]
// // console.log(a);
//   console.log(users)
//   return (
//      <View style={styles.container}>
//        <FlatList
//     //     data={users[0]}
//     //     renderItem={renderRow}
//     //     keyExtractor={(item)=> item.uid}
//        />
//     </View>
//   );
// }