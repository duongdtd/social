import * as React from 'react';
import { SafeAreaView, FlatList, Text,Dimensions, View, TouchableOpacity, TextInput } from 'react-native';
//import { TextInput } from 'react-native-gesture-handler';
import styles from '../constants/style';
import User from './User';
import firebase from 'firebase';

export default class Chat extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: props.route.params.name,
        uid: props.route.params.uid
      },
      textMessage: '',
      messageList: []
    }
    this.props.navigation.setOptions({title:this.state.person.name})
    console.log("1",this.state.person.name)
    
  }

  // static navigationOptions = () => {
  //   return {
  //     title: this.person.name
  //   }
  //   //console.log("dau tien",this.state.person.name)
  // }

  handleChange = key => val => {
    this.setState({ [key]: val })
    console.log(this.state.person.name)
  }

  UNSAFE_componentWillMount() {
    firebase.database().ref('messages').child(User.uid).child(this.state.person.uid)
      .on('child_added', (value) => {
        this.setState((prevState)=>{
          return{
            messageList: [...prevState.messageList, value.val()]
          }
        })
      })
  }
  convertTime = (time) => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() <10 ? '0' : '') + d.getMinutes();
    if(c.getDay()!= d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  }

  sendMessage = async () => {
    if(this.state.textMessage.length > 0) {
      console.log(typeof User.uid,User.uid)
      let msgId = firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).push().key;
      let updates = {};
      let message = {
        message : this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.uid
      }
      updates['messages/' + User.uid +'/'+ this.state.person.uid +'/'+ msgId] = message;
      updates['messages/' + this.state.person.uid +'/'+ User.uid +'/'+ msgId] = message;
      firebase.database().ref().update(updates);
      this.setState({ textMessage: '' });
    }
  }

  renderRow = ({item}) => {
    return(
      <View style={{
        flexDirection:'row',width:'60%',
        alignSelf: item.from === User.uid ? 'flex-end': 'flex-start',
        backgroundColor:item.from === User.uid ? '#00897b' : '#7cb342',
        borderRadiu:5,
        marginBottom:10
      }}>
        <Text style={{color:'#fff',padding:7,fontSize:16}}>
          {item.message}
        </Text>
        <Text style={{color:'#eee',padding:3,fontSize:10}}>{this.convertTime(item.time)}</Text>
      </View>
    )
  }

  render() {
    // console.log(User.name)
    // console.log(User.uid)
    console.log("2",this.state.person.name)
    let {height,width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <FlatList
        style={{padding:10, height: height*0.8}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center',marginHorizontal:5 }}>
          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage} style={{paddingBottom:10,marginLeft:5}}>
            <Text style={styles.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

