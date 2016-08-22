/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classNames';
import LocalChatStore from './LocalChatStore.js';
import LocalChatMessagePropType from './LocalChatMessagePropType.js';

import invariant from 'invariant';

const LocalChatMessage = React.createClass({
  propTypes: {
    message: LocalChatMessagePropType.isRequired,
  },

  contextTypes: {
    userID: React.PropTypes.string,
  },

  render(): React.Element {
    const message = this.props.message;

    let bubble = null;
    let useBubble = true;
    if (!message.attachment) {
      bubble = this._renderText();
    } else if (message.attachment.type === 'image') {
      bubble = this._renderImage();
      useBubble = false;
    } else if (
      message.attachment.type === 'template' &&
      message.attachment.payload.template_type === 'button'
    ) {
      bubble = this._renderButtonTemplate();
    } else {
      bubble =
        <div>Error: This message is corrupted or unsupported</div>
    }

    return (
      <div>
        <span className={classNames(
          'message', {
            'me': message.fromUser,
            'message-bubble': useBubble,
          })}>
          {bubble}
        </span>
        <div className="clear"></div>
      </div>
    );
  },

  _renderText(): React.Element {
    const message = this.props.message;
    return (
      <span>{message.text}</span>
    );
  },

  _renderButtonTemplate(): React.Element {
    const message = this.props.message;
    const buttons = message.attachment.payload.buttons.map(button => {
      return this._renderButton(button);
    });
    return (
      <span>
        {message.attachment.payload.text}
        <div className="list-group chat-button-list">
          {buttons}
        </div>
      </span>
    );
  },

  _renderButton(button: Object): React.Element {
    return (
      <button onClick={() => this._clickButton(button)} className="list-group-item chat-button">
        {button.title}
      </button>
    );
  },

  _renderImage(): React.Element {
    const message = this.props.message;
    return (
      <img src={message.attachment.payload.url} />
    );
  },

  _clickButton(button: Object): void {
    if (button.type === 'web_url') {
      return;
    }
    LocalChatStore.sendPostbackForUser(this.context.userID, button.payload);
  },
});

module.exports = LocalChatMessage;
