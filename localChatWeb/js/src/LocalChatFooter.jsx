/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import LocalChatStore from './LocalChatStore.js';

const LocalChatFooter = React.createClass({
  propTypes: {
    userID: PropTypes.string.isRequired,
  },

  getInitialState(): Object {
    return {
      val: '',
    };
  },

  render(): React.Element {
    return (
      <div className='chat-footer'>
        <div className="input-group">
          <input
            ref="messageInput"
            type="text"
            value={this.state.val}
            className="form-control input-sm"
            placeholder="Write a reply"
            onChange={this._onChange}
            onKeyPress={this._handleKeyPress}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-primary btn-sm"
              onClick={this._onSend}>
              Send
            </button>
          </span>
        </div>
      </div>
    );
  },

  _handleKeyPress(e: Object): void {
    if (e.key === 'Enter') {
      this._onSend();
    }
  },

  _onChange(): void {
    this.setState({
      val: this.refs.messageInput.value,
    });
  },

  _onSend(): void {
    const text = this.refs.messageInput.value;
    if (text === '') {
      return;
    }
    LocalChatStore.sendMessageForUser(this.props.userID, text);
    this.setState({val: ''});
  },
});

module.exports = LocalChatFooter;
