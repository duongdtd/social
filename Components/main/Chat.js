import * as React from 'react';
import { Animated, StyleSheet, Pressable, SafeAreaView, FlatList, Text, 
         Dimensions, View, TouchableOpacity, TextInput, Easing  } from 'react-native';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
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
      messageList: [],
      messageId: []
    }
    this.props.navigation.setOptions({ title: this.state.person.name })
    this.chatRow = this.chatRow.bind(this);
    //console.log("1",this.state.person.name)

  }

  handleChange = key => val => {
    this.setState({ [key]: val })
    //console.log(this.state.person.name)
  }

  UNSAFE_componentWillMount() {
    firebase.database().ref('messages').child(User.uid).child(this.state.person.uid)
      .on('child_added', (value) => {
        this.setState((prevState) => {
          return {
            messageList: [...prevState.messageList, value.val()]
          }
        })
      })
    // const messagesId = firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).key
    //   .then(function () {
    //     this.setState((prevState) => {
    //       return {
    //         messageId: [...prevState, messagesId]
    //       }
    //     })
    //     console.log(messageId)
    //   })
    firebase.database().ref('messages').child(User.uid).child(this.state.person.uid)
    .on('child_added', (key) => {
      this.setState((prevState) => {
        return {
          messageId: [...prevState.messageId, key.val()]
        }
      })
    })

    this.position = new Animated.ValueXY(0, 0);
  }
  convertTime = (time) => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    // if (c.getDay() != d.getDay()) {
    //   result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    // }
    return result;
  }

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      console.log(typeof User.uid, User.uid)
      let msgId = firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.uid
      }
      updates['messages/' + User.uid + '/' + this.state.person.uid + '/' + msgId] = message;
      updates['messages/' + this.state.person.uid + '/' + User.uid + '/' + msgId] = message;
      firebase.database().ref().update(updates);
      this.setState({ textMessage: '' });
    }
  }

  chatRow = () => {
    Animated.sequence([
      Animated.timing(this.position, {
        toValue: { x: -34, y: 0 },
        easing:Easing.ease
      }),
      Animated.timing(this.position, {
        delay:1400,
        easing:Easing.ease,
        toValue:{x:0,y:0}
    }),
  ]).start();   
  }

  otherRow = () => {
    Animated.sequence([
      Animated.timing(this.position, {
        toValue: { x: 34, y: 0 },
        easing:Easing.ease
      }),
      Animated.timing(this.position, {
        delay:1400,
        easing:Easing.ease,
        toValue:{x:0,y:0}
    }),
  ]).start();   
  }
  renderRow = ({ item }) => {
    return (
      <View style={{display:'flex'}}>
        <View style={Style.rowChat}>
          <Pressable onPress={item.from=== User.uid ? this.chatRow : this.otherRow}>
            <Animated.View style={[this.position.getLayout(),
            {
              maxWidth: '60%',
              alignSelf: item.from === User.uid ? 'flex-end' : 'flex-start',
              backgroundColor: item.from === User.uid ? '#ffb412' : '#000',
              borderWidth: 1,
              borderRadius: 15,
              marginBottom: 10,
              fontFamily: 'Helvetica Neue',
            }]
            }>
              <View >
                <Text style={{ color: item.from === User.uid ? '#000': '#ffb412', padding: 7, fontSize: 18 }}>
                  {item.message}
                  {item.id}
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        </View>
        <View  style={Style.rowTime}>
           <Text style={{alignSelf: item.from === User.uid ? 'flex-end' : 'flex-start',color:'#000',padding:3,fontSize:10}}>{this.convertTime(item.time)}</Text>
        </View>
               

      </View>
    )
  }

  render() {
    console.log(this.state.textMessage)
    // console.log(User.name)
    // console.log(User.uid)
    //console.log("2",this.state.person.name)
    let { height, width } = Dimensions.get('window');
    return (
      <SafeAreaView style={{height:'100%'}}>
        <FlatList
          style={{ padding: 10, height: height * 0.8 }}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ height:'8%',width:'100%',flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
          <TextInput
            style={Style.input}
            value={this.state.textMessage}
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage} style={[{ paddingBottom: 5, marginTop: 4 }
          ,{ transform: [{ rotate: '45deg' }]
          }]}>
            {/* <Text style={styles.btnText}>Send</Text> */}
            {/* <AntDesign name="SendOutlined" size={28} color="#ffb412"/> */}
            <Feather name="send" size={36} color="#ffb412" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const Style = StyleSheet.create({
  input: {
		padding: 10,
		borderWidth:1,
		borderColor: '#ccc',
		width:'85%',
		borderRadius:5
	},
  rowChat: {
    //position: 'absolute',
    zIndex:10,
    // padding:7,
    // flex:1
    //left:-30
  },
  rowTime: {
    width:'100%',
    position:'absolute',
    zIndex: 1,
    padding: 3
  }
})