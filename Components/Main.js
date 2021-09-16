import React, {Component} from "react";
import { View, Text,TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions/index";
import firebase from "firebase";
const SignOut = () => {
    firebase.auth().signOut();
  }
export class Main extends Component {
    
    componentDidMount()
    {
        this.props.fetchUser();

    }
    render(){
        const {currentUser} = this.props;
        console.log()
        if(currentUser==undefined)
        {
            return(
                <View>
                </View>
            )
        }
        return(
            <View style={{flex: 1, justifyContent :'center'}}> 
              <Text>{currentUser.name} is logged in</Text>
              <TouchableOpacity style={{ marginRight: 10 }}
                    onPress={SignOut}>
                    <AntDesign name="login" size={24} color="black" />
                  </TouchableOpacity>
            </View>
        )
    }
}
const mapStateToProps =(store) =>({
    currentUser :store.userState.currentUser
})
const mapDispatchProps =(dispatch) => bindActionCreators({fetchUser},dispatch);
export default connect(mapStateToProps,mapDispatchProps)(Main)