import firebase from "firebase";
import {USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE} from "../constants/index"
export function fetchUser() {
    return((dispacth)   => {
        firebase.firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot)=>{
            if(snapshot.exists){
                console.log(snapshot.data())
                dispacth({type :USER_STATE_CHANGE , currentUser: snapshot.data()})
            }
            else{
                console.log('does not exists')
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
            console.log(posts)
            dispacth({type :USER_POSTS_STATE_CHANGE, posts})
        })
    })
}