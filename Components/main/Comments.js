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
                .orderBy("creation","asc")
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
    const onCommentSend = () => {
        firebase.firestore()
            .collection('Posts')
            .doc(props.route.params.uid)
            .collection('UserPosts')
            .doc(props.route.params.postId)
            .collection('Comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text,
                creation:firebase.firestore.FieldValue.serverTimestamp(),
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
    const AddNotifications = (userId, postId, nameUser,type,img,caption) => {
        if(userId != firebase.auth().currentUser.uid)
        {firebase.firestore()
            .collection("Notifications")
            .doc(userId)
            .collection("UserNotifications")
            .add({
                kid: String(postId),
                image: firebase.auth().currentUser.photoURL,
                nameUser: nameUser,
                type: ' đã bình luận bài viết của bạn',
                seen: 'no',
                typePost :type,
                imageOwn:img,
                time:firebase.firestore.FieldValue.serverTimestamp(),
                caption:caption,
        })}
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
                    <View style={styles.Avatar}>
                        <Avatar size="small" rounded source={{ uri: props.route.params.image }} />
                    </View>
                    <Text style={{fontSize:18,fontWeight:'bold'}}>
                        {props.route.params.name}
                    </Text>
                </View>
                <Text style={styles.comment, styles.Caption}>{props.route.params.caption}</Text>

            </View>
            <View style={{
                //borderBottomColor: '#dddddd',
                borderBottomWidth: 1,
                width: '92%',
                alignSelf: 'center',
                marginTop: 15,
                marginBottom: 15,
                borderColor: '#FFCC00',
            }} />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.commentRow}>
                        {item.user !== undefined ?
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={styles.Avatar}>
                                    <Avatar size="small" rounded source={{ uri: item.user.downloadURL }} />                
                                </View>                                               
                                <Text style={{flex:5,fontWeight:'bold'}}>
                                    {item.user.nickname[item.user.nickname.length - 1]}
                                </Text>
                                {
                                    item.user.uid === firebase.auth().currentUser.uid ? (
                                        <View style={{flexGrow:0.5}}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    onCommentDelete(item.id),
                                                    deleteCmts(props.route.params.uid, props.route.params.postId)
                                                }}
                                                style={{alignItems:'flex-end',marginRight:10}}>
                                                <AntDesign name="delete" size={18} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                                }
                            </View>
                            : null}
                        <Text style={styles.comment}>{item.text}</Text>
                    </View>
                )}
            />
            <View style={{
                borderBottomColor: '#dddddd',
                borderBottomWidth: 1,
                width: '92%',
                alignSelf: 'center',
                marginTop: 15,
                marginBottom: 15,
                borderColor: '#FFCC00',
            }} />
            <View style={styles.Container}>
                <View style={styles.Avatar}>
                    <Avatar 
                    size ={'small'}
                    rounded
                    source={{uri : firebase.auth().currentUser.photoURL}}               
                    />
                </View>
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Add a comment "
                    onChangeText={(text) => setText(text)}
                />
                <TouchableOpacity style={{alignItems:'flex-end',marginRight :10}}
                     onPress={() => {
                    onCommentSend(), cmts(props.route.params.uid, props.route.params.postId)
                        , AddNotifications(props.route.params.uid, 
                            props.route.params.postId,
                             props.currentUser.name,props.route.params.type,props.route.params.image
                             ,props.route.params.caption)
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
        //borderTopWidth:1,
        //borderColor: '#FFCC00',
        paddingTop:10,
        paddingBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'center' 
    },
    inputStyle: {
        width:'100%',
        height:30,
        padding:8,
        marginLeft: 6,
        marginRight: 10
    },
    Avatar: {
        marginLeft:12,
        marginRight:10,
    },
    comment: {
        marginLeft:12,
        fontSize:18,
    },
    Caption: {
        fontSize:22,
        fontWeight:'400',
        marginLeft:12,
    },
    commentRow: {
        //width:'100%',
        borderWidth:1,
        borderRadius:18,
        borderColor:'#EEB422',
        backgroundColor:'#f5d941',
        padding:5,
        marginHorizontal:10,
        marginVertical:6
    }
})
const mapStateToProps = (store) => ({
    users: store.usersState.users,
    currentUser: store.userState.currentUser,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Comments)