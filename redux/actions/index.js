import firebase from "firebase";
import {USER_STATE_CHANGE} from "../constants/index"
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