import React, {Component} from 'react';
import '../layout/components/message.sass';

class Message extends Component {
  render() {
    if(this.props.message) {
      return(
        <div className="message">
          {this.props.message}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Message;