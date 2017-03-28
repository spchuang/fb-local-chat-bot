/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import LocalChatStore from './LocalChatStore.js';
import classNames from 'classNames';

const LocalChatWebview = React.createClass({
  _webviewIframe: null,
  propTypes: {
    webViewURL: PropTypes.string.isRequired,
    webViewHeightRatio: PropTypes.oneOf(['tall', 'compact', 'full']).isRequired,
  },

  render(): React.Element {

    const heightStyle = 'webview-' + this.props.webViewHeightRatio;
    return (
      <div className={'webview-container'}>
        <div className={classNames('webview', heightStyle)}>
          <div className='webview-header'>
            <span onClick={this._handleCloseWebView}>✖</span>
          </div>
          <iframe
            src={this.props.webViewURL}
            ref={ (iframe) => this._webviewIframe = iframe } >
          </iframe>
        </div>
      </div>
    );
  },

  _handleCloseWebView(): void {
    LocalChatStore.closeWebView();
  }
});

module.exports = LocalChatWebview;
