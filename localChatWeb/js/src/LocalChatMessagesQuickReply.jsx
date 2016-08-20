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
    quickReplyMessage: LocalChatMessagePropType,
  },

  contextTypes: {
    userID: React.PropTypes.string,
  },

  render(): React.Element {
    let quickReplyButtons = []
    if ('quick_replies' in this.props.quickReplyMessage){
      quickReplyButtons = this.props.quickReplyMessage.quick_replies
      .map((qr) => {
        return (
          <div>
            <button
              onClick={() => this._clickButton(qr)}
              key={qr.title}
              className={classNames(
                'message', {
                  'message-bubble': true,
              })}>
              {qr.title}
            </button>
            <div key='clearDiv' className="clear"></div>
          </div>
        );
      });
    }
    return (
      <div className='messages-quick-reply'>
        {quickReplyButtons}
      </div>
    );
  },

  _clickButton(qr: Object): void {
    LocalChatStore.sendQuickReplyForUser(this.context.userID, qr.title, qr.payload);
  },
});

module.exports = LocalChatMessagesQuickReply;
