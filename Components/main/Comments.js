import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
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
    const [change, setChage] = useState(false)
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
                .onSnapshot((snapshot) => {
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

    }, [props.route.params.postId, props.users, props.route.params.postId.likesCouter,comments])
console.log(comments)
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
    const cmts = (userId, postId) => {
        firebase.firestore()
            .collection("Posts")
            .doc(userId)
            .collection("UserPosts")
            .doc(postId)
            .update({
                cmts: firebase.firestore.FieldValue.increment(+1)
            })
    }
    const deleteCmts = (userId, postId) => {
        firebase.firestore()
            .collection("Posts")
            .doc(userId)
            .collection("UserPosts")
            .doc(postId)
            .update({
                cmts: firebase.firestore.FieldValue.increment(-1)
            })
    }
    const onCommentDelete = (id) => {
        firebase.firestore()
            .collection('Posts')
            .doc(props.route.params.uid)
            .collection('UserPosts')
            .doc(props.route.params.postId)
            .collection('Comments')
            .doc(id)
            .delete()
    }
    const AddNotifications = (userId, postId, nameUser) => {
        firebase.firestore()
            .collection("Notifications")
            .doc(userId)
            .collection("UserNotifications")
            .add({
                kid: String(postId),
                image: firebase.auth().currentUser.photoURL,
                nameUser: nameUser,
                type: ' đã bình luận bài viết của bạn',
                seen: 'no'
            })
    }

    return (
        <View style={{
            flex: 1,
            marginTop: 30,
            flexDirection: 'column',
            justifyContent: 'flex-start',
        }}>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Avatar
                        size="small" rounded source={{ uri: props.route.params.image }} />
                    <Text>
                        {props.route.params.name}
                    </Text>
                </View>
                <Text>{props.route.params.caption}</Text>

            </View>
            <View style={{
                borderBottomColor: '#dddddd',
                borderBottomWidth: 1,
                width: '92%',
                alignSelf: 'center',
                marginTop: 15,
                marginBottom: 15,
            }} />
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
                                    {item.user.nickname[item.user.nickname.length - 1]}
                                </Text>
                                {
                                    item.user.uid === firebase.auth().currentUser.uid ? (
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    onCommentDelete(item.id),
                                                    deleteCmts(props.route.params.uid, props.route.params.postId)
                                                }}>
                                                <AntDesign name="delete" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                                }
                            </View>
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View style={{
                borderBottomColor: '#dddddd',
                borderBottomWidth: 1,
                width: '100%',
                alignSelf: 'center',
                marginTop: 15,
                marginBottom: 15,
            }} />
            <View style={styles.Container}>
                <Avatar
                size ={'small'}
                rounded
                source={{uri : firebase.auth().currentUser.photoURL}}
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Add a comment "
                    onChangeText={(text) => setText(text)}
                />
                <TouchableOpacity style={{marginRight :10}}
                     onPress={() => {
                    onCommentSend(), cmts(props.route.params.uid, props.route.params.postId)
                        , AddNotifications(props.route.params.uid, props.route.params.postId, props.currentUser.name)
                }}>
                <Text>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
      },
      inputStyle: {
        flex: 1,
      },
})
const mapStateToProps = (store) => ({
    users: store.usersState.users,
    currentUser: store.userState.currentUser,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Comments)