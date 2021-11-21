import React,{ Component } from 'react';


export default class MessageInput extends Component {
    state = {
        value:''
    };

    onChange = event => this.setState({value: event.target.value})
    render() {
        return (
            <input
                type="text"
                placeholder="type message here"
                className="message-input"
                onChange={this.onChange}
                value={this.state.value}
            />
        )
    }
}