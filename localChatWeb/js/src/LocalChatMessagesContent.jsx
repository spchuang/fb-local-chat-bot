/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import LocalChatMessage from './LocalChatMessage.jsx';
import LocalChatMessagePropType from './LocalChatMessagePropType.js';

const LocalChatMessagesContent = React.createClass({
  propTypes: {
    messages: PropTypes.arrayOf(LocalChatMessagePropType).isRequired,
  },

  render(): React.Element {
    const messages = this.props.messages.map((message, index) => {
      if (!message.message) {
        return null;
      }
      return (
        <LocalChatMessage
          message={message.message}
          fromUser={message.fromUser}
          key={index}
        />
      );
    });

    // check for sender action for last message
    const lastMessage = this.props.messages[this.props.messages.length - 1];
    const senderActionType = lastMessage && lastMessage.sender_action;
    const senderTypingAction = senderActionType === 'typing_on'
      ? <div className='sender-typing-on'>
          typing...
        </div>
      : null;


    return (
      <div className='messages-content'>
        {messages}
        {senderTypingAction}
      </div>
    );
  },
});

module.exports = LocalChatMessagesContent;
