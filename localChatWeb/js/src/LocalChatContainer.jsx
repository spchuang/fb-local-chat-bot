/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import LocalChatStore from './LocalChatStore.js';
import LocalChatOptin from './LocalChatOptin.jsx';
import LocalChatFooter from './LocalChatFooter.jsx';
import LocalChatMessagesContent from './LocalChatMessagesContent.jsx';
import LocalChatMessagesQuickReply from './LocalChatMessagesQuickReply.jsx';
import LocalChatWebview from './LocalChatWebview.jsx';

const LocalChatContainer = React.createClass({
  propTypes: {
    userID: PropTypes.string.isRequired,
  },

  getInitialState(): Object {
    return {
      userID: this.props.userID,
      messages: LocalChatStore.getMessagesForUser(this.props.userID),
      webViewURL: '',
      openWebView: false,
      webViewHeightRatio: '',
      persistentMenu: [],
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

    const webView = this.state.openWebView
      ? <LocalChatWebview
          webViewURL={this.state.webViewURL}
          webViewHeightRatio={this.state.webViewHeightRatio}
        />
      : null;

    const lastMessageObj = messages[messages.length - 1];
    const lastMessage = lastMessageObj && lastMessageObj.message;

    const saveMenuButton = this.state.persistentMenu.length > 0
      ? <button className="btn btn-primary btn-sm" onClick={this._storePersistentMenu}>
          Store persistent menu with Facebook
        </button>
      : null;

    return (
      <div className='fb-local-chat-container col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3'>
        <div className="panel panel-default">
          <div className="panel-heading">
            <b>Local FB chat test (user ID: {this.state.userID})</b>
            <LocalChatOptin userID={this.state.userID} />
          </div>
          <div className="chat-content-container">
            {webView}
            <LocalChatMessagesContent messages={messages}/>
            <LocalChatMessagesQuickReply message={lastMessage}/>
            <div className="panel-footer">
              <LocalChatFooter
                userID={this.state.userID}
                persistentMenu={this.state.persistentMenu}
              />
            </div>
          </div>
        </div>
        {saveMenuButton}
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

    // set webview config
    this.setState(LocalChatStore.getWebViewState());

    const menu = LocalChatStore.getPersistentMenu();
    if (menu.length !== this.state.persistentMenu.length) {
      this.setState({
        persistentMenu: menu,
      });
    }
  },

  _loadWebview(url: string): void {
    this.setState( {
      webviewURL: url,
      hideWebview: false
    });
  },

  _closeWebview(): void {
    this.setState( {
      webviewURL: '',
      hideWebview: true,
    });
  },

  _storePersistentMenu(): void {
    LocalChatStore.storePersistentMenu();
  },
});

module.exports = LocalChatContainer;
