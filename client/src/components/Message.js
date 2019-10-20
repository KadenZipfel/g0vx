import React, {Component} from 'react';
import '../layout/components/message.sass';

class Message extends Component {
  render() {
    if(this.props.message != null) {
      return(
        <div className="message">
          <p className="message__text">
            {this.props.message}
          </p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Message;