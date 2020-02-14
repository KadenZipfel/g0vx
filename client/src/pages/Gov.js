import React, { Component } from "react";

import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Message from '../components/Message';

import '../layout/config/_base.sass';

class Gov extends Component {

  setMessage(newMessage) {
    this.setState({
      message: newMessage
    });
    console.log(this.state.message);
  }

  clearMessage() {
    this.setState({
      message: null
    });
  }

  render() {
    return (
      <div>
        <Nav />
        
        <Message />
      </div>
    );
  }
}

export default Gov;
