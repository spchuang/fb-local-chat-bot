/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import LocalChatStore from './LocalChatStore.js';
import LocalChatFooter from './LocalChatFooter.jsx';
import LocalChatMessagesContent from './LocalChatMessagesContent.jsx';
import LocalChatMessagesQuickReply from './LocalChatMessagesQuickReply.jsx';

const LocalChatContainer = React.createClass({
  propTypes: {
    userID: PropTypes.string.isRequired,
  },

  getInitialState(): Object {
    return {
      userID: this.props.userID,
      messages: LocalChatStore.getMessagesForUser(this.props.userID),
    }
  },

  childContextTypes: {
    userID: React.PropTypes.string,
  },

  getChildContext: function() {
    return {
      userID: this.state.userID,
    };
  },

  componentDidMount(): void {
    LocalChatStore.addChangeListener(this._onChange);
  },

  render(): React.Element {
    const messages = this.state.messages;
    console.log(messages);
    return (
      <div className='fb-local-chat-container col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3'>
        <div className="panel panel-default">
          <div className="panel-heading"><b>Local FB chat test (user ID: {this.state.userID})</b></div>
          <LocalChatMessagesContent messages={messages}/>
          <LocalChatMessagesQuickReply message={messages[messages.length - 1]}/>
          <div className="panel-footer">
            <LocalChatFooter userID={this.state.userID}>
            </LocalChatFooter>
          </div>
        </div>
      </div>
    );
  },

  _onChange(): void {
    const newMessages = LocalChatStore.getMessagesForUser(this.state.userID);
    if (newMessages.length !== this.state.messages.length) {
      this.setState({
        messages: newMessages,
      });
    }
  },
});

module.exports = LocalChatContainer;
