import firebase from "firebase";
import {USER_STATE_CHANGE,USERS_LIKES_STATE_CHANGE,USER_POSTS_STATE_CHANGE,USER_FOLLOWING_STATE_CHANGE,USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE,CLEAR_DATA} from "../constants/index"

export function clearData()
{
    return((dispacth) => {
        dispacth({type :CLEAR_DATA})
    })
}


export function fetchUser() {
    return((dispacth)   => {
        firebase.firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((snapshot)=>{
            if(snapshot.exists){
                dispacth({type :USER_STATE_CHANGE , currentUser: snapshot.data()})
            }
            else{
            }
        })
    })
}
export function fetchUserPosts() {
    return((dispacth)   => {
        firebase.firestore()
        .collection("Posts")
        .doc(firebase.auth().currentUser.uid)
        .collection("UserPosts")
        .orderBy("creation","asc")
        .get()
        .then((snapshot)=>{
            let posts = snapshot.docs.map(doc => {
                const data =doc.data();
                const id = doc.id;
                return {id, ...data}
            })
            dispacth({type :USER_POSTS_STATE_CHANGE, posts})
        })
    })
}
export function fetchUserFollowing() {
    return((dispacth)   => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot)=>{
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id
            })
            dispacth({type :USER_FOLLOWING_STATE_CHANGE, following})
            for(let i=0;i<following.length;i++)
            {
                dispacth(fetchUsersData(following[i],true));
            }
        })
    })
}
export function fetchUsersData(uid,getPosts)
{
    return((dispacth, getState) =>{
        const found = getState().usersState.users.some(el => el.uid === uid);
        if(!found)
        {
        firebase.firestore()
        .collection("Users")
        .doc(uid)
        .onSnapshot((snapshot)=>{
            if(snapshot.exists){
                let user =snapshot.data();
                user.uid =snapshot.id;
                dispacth({type :USERS_DATA_STATE_CHANGE , user})

            }
            else{
            }
        })
        if(getPosts)
        {
            dispacth(fetchUserFollowingPosts(uid));
        }
        }
    })
}

export function fetchUserFollowingPosts(uid) {
    return((dispacth,getState)   => {
        firebase.firestore()
        .collection("Posts")
        .doc(uid)
        .collection("UserPosts")
        .orderBy("creation","asc")
        .get()
        .then((snapshot)=>{
            const uid =snapshot.docs[0].ref.path.split('/')[1]  
            const user =getState().usersState.users.find(el => el.uid === uid);

            let posts = snapshot.docs.map(doc => {
                const data =doc.data();
                const id = doc.id;
                return {id, ...data, user}
            })
            for(let i=0;i<posts.length;i++)
            {
                dispacth(fetchUsersFollowingLikes(uid,posts[i].id))
            }
            dispacth({type :USERS_POSTS_STATE_CHANGE, posts,uid})
        })
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
    firebase.firestore()
    .collection("Posts")
    .doc(uid)
    .collection("UserPosts")
    .doc(postId)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .onSnapshot((snapshot) => {
    const postId = snapshot.ref.path.split('/')[3];
    let currentUserLike = false;
    if(snapshot.exists){
    currentUserLike = true;
    }
    dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
    })
    })
    }