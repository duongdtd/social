import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput, StyleSheet,TouchableOpacity } from "react-native";
import firebase from "firebase";
import { user } from "../../redux/reducers/user";
import { Avatar } from 'react-native-elements';
require('firebase/firestore')
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
import { AntDesign } from '@expo/vector-icons';
function Comments(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    useEffect(() => {
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                }
                else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('Posts')
                .doc(props.route.params.uid)
                .collection('UserPosts')
                .doc(props.route.params.postId)
                .collection('Comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)

                })
            setPostId(props.route.params.postId)
        }
        else {
            matchUserToComment(comments)
        }


    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {
        firebase.firestore()
            .collection('Posts')
            .doc(props.route.params.uid)
            .collection('UserPosts')
            .doc(props.route.params.postId)
            .collection('Comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
    }
    const onCommentDelete = () => {
        firebase.firestore()
            .collection('Posts')
            .doc(props.route.params.uid)
            .collection('UserPosts')
            .doc(props.route.params.postId)
            .collection('Comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
    }

    return (
        <View style={{
            flex: 1,
            marginTop: 30
        }}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Avatar
                                    size="small" rounded source={{ uri: item.user.downloadURL }} />
                                <Text>
                                    {item.user.name}
                                </Text>
                                {
                                   item.user.uid === firebase.auth().currentUser.uid ? (
                                       <View>
                                    <TouchableOpacity
                                    onPress ={() => {
                                        firebase.firestore()
                                        .collection('Posts')
                                        .doc(props.route.params.uid)
                                        .collection('UserPosts')
                                        .doc(props.route.params.postId)
                                        .collection('Comments')
                                        .doc(item.id)
                                        .delete()
                                    }}>
                                    <AntDesign name="delete" size={24} color="black" />
                                    </TouchableOpacity>
                                       </View>
                                   ) :null
                                }
                            </View>
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View >
                <TextInput
                    placeholder='comment.....'
                    onChangeText={(text) => setText(text)}>
                </TextInput>
                <Button
                    onPress={() => onCommentSend()}
                    title="send"
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Comments)