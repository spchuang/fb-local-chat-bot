/*
 * @flow
 */
'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classNames';
import LocalChatMessagePropType from './LocalChatMessagePropType.js';
import LocalChatStore from './LocalChatStore.js';

const LocalChatMessagesQuickReply = React.createClass({
  propTypes: {
    message: LocalChatMessagePropType.isRequired,
  },

  contextTypes: {
    userID: React.PropTypes.string,
  },

  render(): ?React.Element {
    if (!this.props.message || !('quick_replies' in this.props.message)) {
      return null;
    }

    const quickReplyButtons = this.props.message.quick_replies
      .map((quickReplyButton) => {
        return (
          <button
            onClick={() => this._clickButton(quickReplyButton)}
            key={quickReplyButton.title}
            className={classNames(
              'message', {
                'message-bubble': true,
            })}>
            {quickReplyButton.title}
          </button>
        );
      });
    return (
      <div id='messages-quick-reply' className='messages-quick-reply'>
        {quickReplyButtons}
      </div>
    );
  },

  componentDidUpdate(prevProps: Object, prevState:Object): void {
    // if quick reply div overflows, change justify-content to flex-start
    let messagesQuickReplyDiv = document.getElementById('messages-quick-reply');
    if (!messagesQuickReplyDiv) {
      return;
    }
    if (messagesQuickReplyDiv.scrollHeight > messagesQuickReplyDiv.clientHeight
      || messagesQuickReplyDiv.scrollWidth > messagesQuickReplyDiv.clientWidth) {
      messagesQuickReplyDiv.style.justifyContent = 'flex-start';
    }
  },

  _clickButton(quickReplyButton: Object): void {
    LocalChatStore.sendQuickReplyForUser(
      this.context.userID,
      quickReplyButton.title,
      quickReplyButton.payload,
    );
  },
});

module.exports = LocalChatMessagesQuickReply;
