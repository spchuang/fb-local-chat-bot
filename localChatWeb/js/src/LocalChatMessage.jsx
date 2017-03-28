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

const HSCROLL_ELEMENT_WIDHT = 300;

const LocalChatMessage = React.createClass({
  propTypes: {
    message: LocalChatMessagePropType.isRequired,
    fromUser: PropTypes.bool.isRequired,
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
      message.attachment.payload.template_type === 'generic'
    ) {
      bubble = this._renderGenericTemplate();
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
            'me': this.props.fromUser,
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

  _renderGenericTemplate(): React.Element {
    const message = this.props.message;
    const elements = message.attachment.payload.elements.map((element, index) => {
      const buttons = element.buttons.map((button, index) => {
        return this._renderButton(button, index);
      });
      return (
        <div className='hscroll-element' style={{width: HSCROLL_ELEMENT_WIDHT}}>
          <img className='image' src={element.image_url}/>
          <h4 className='title'>{element.title}</h4>
          <p className='subtitle'>{element.subtitle}</p>
          {buttons}
        </div>
      )
    });
    return (
      <div className='hscroll-wrapper' style={{width : elements.length * (HSCROLL_ELEMENT_WIDHT+10)}}>
        {elements}
      </div>
    )
  },

  _renderButtonTemplate(): React.Element {
    const message = this.props.message;
    const buttons = message.attachment.payload.buttons.map((button, index) => {
      return this._renderButton(button, index);
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

  _renderButton(button: Object, index: number): React.Element {
    if (button.type === 'element_share') {
      button.title = 'Share';
    }
    return (
      <button
        onClick={() => this._clickButton(button)}
        className="list-group-item chat-button"
        key={index}>
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
    switch (button.type) {
      case 'web_url':
        LocalChatStore.openWebView(button.url, button.webview_height_ratio);
        break;
      case 'postback':
        LocalChatStore.sendPostbackForUser(this.context.userID, button.payload);
        break;
      case 'phone_number':
        alert('calling number for: ' + button.payload);
        break;
      case 'element_share':
        alert('Share!');
        break;
    }
  },
});

module.exports = LocalChatMessage;
