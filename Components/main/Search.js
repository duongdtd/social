import React, { useState, useLayoutEffect, useEffect } from "react";
import { Image, View, Text, TextInput, FlatList, TouchableOpacity,TouchableWithoutFeedback,Keyboard, StyleSheet, ImageBackground,Dimensions  } from "react-native";
import firebase from "firebase";
import { Avatar, Badge, SearchBar } from 'react-native-elements';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
require('firebase/firestore')
export default function Search(props, { navigation }) {
    const [users, setUsers] = useState([])
    const [text, setText] = useState("")
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('Users')
            .where('nickname', 'array-contains', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUsers(users)
            })
        setText(search)
    }
    if (text == "") {
        return (
            <TouchableWithoutFeedback  style={{ flex: 1, backgroundColor: 'white'}} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: 'white'}}>
                <SearchBar
                    placeholder="Search Here..."
                    onChangeText={(text) => fetchUsers(text)}
                    value={text}
                    round
                    lightTheme
                    containerStyle={{ backgroundColor: 'white' }}
                    

                />
                <View style={{flex:1,justifyContent: 'center',alignItems:'center',flexDirection:'row' }}>
                    <Image
                    style={{
                       resizeMode:'contain'
                       ,width:"80%",height:"80%"
                       
                    }
                    }
                    source={require('../../image/meo.jpg')}
                    />
                </View>
            </View>
            </TouchableWithoutFeedback>

        );
    }
    return (
        <TouchableWithoutFeedback  style={{ flex: 1, backgroundColor: 'white'}} onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchBar
                placeholder="Search Here..."
                onChangeText={(text) => fetchUsers(text)}
                value={text}
                round
                lightTheme
                containerStyle={{ backgroundColor: 'white' }}

            />
            <View style={{ marginBottom: 40 }}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={users}
                    renderItem={({ item }) => (
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Profile", { uid: item.id })}>
                                <View style={{ flexDirection: 'row',backgroundColor:'#ffb412',borderRadius:60,height:55,
                                 justifyContent: 'flex-start', alignItems: 'center',marginTop:5,}}>
                                    <View >
                                        <Avatar
                                            size="medium"
                                            rounded
                                            source={{
                                                uri: item.downloadURL
                                            }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: 10 }}>
                                        
                                        <Text style={{fontSize:16}}>{item.nickname[item.nickname.length - 1]}</Text>
                                        <Text style={{fontSize:16}}>{item.name}</Text>
                                    </View>
                                </View>

                            </TouchableOpacity>
                        </View>)}
                ></FlatList>

            </View>

        </View>
        </TouchableWithoutFeedback>
    )
}
