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
      quickReplyMessage: {},
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
    return (
      <div className='fb-local-chat-container col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3'>
        <div className="panel panel-default">
          <div className="panel-heading"><b>Local FB chat test (user ID: {this.state.userID})</b></div>
          <LocalChatMessagesContent messages={this.state.messages}/>
          <LocalChatMessagesQuickReply quickReplyMessage={this.state.quickReplyMessage}/>
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
      const newQuickReplyMessage = this._getQuickReplyMessage(newMessages);
      this.setState({
        messages: newMessages,
        quickReplyMessage: newQuickReplyMessage,
      });
    }
  },

  _getQuickReplyMessage(messages: Array<Object>): Object {
    //Only render quick replies if it is the latest message
    //Any message after it's text/attachment will cause it to disappear
    //even if non of the options was clicked
    let QRmessage = messages[messages.length - 1];
    if ('quick_replies' in QRmessage){
      return QRmessage;
    } else {
      return {};
    }
  }
});

module.exports = LocalChatContainer;
