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
      return (
        <LocalChatMessage message={message} key={index}/>
      );
    })
    return (
      <div className='messages-content'>
        {messages}
      </div>
    );
  },
});

module.exports = LocalChatMessagesContent;
