/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classNames';

import invariant from 'invariant';

const LocalChatWebview = React.createClass({

  render(): React.Element {
    let webviewClassName = 'webview-container';
    if(this.props.hide) {
      webviewClassName += ' hidden';
    }
    return (
      <div className={webviewClassName}>
        <div className='webview-header'>
          <span onClick={this.props.closeWebview}>✖</span>
        </div>
        <iframe
          src={this.props.webviewURL}
          ref={ (iframe) => this.webviewIframe = iframe } >
        </iframe>
      </div>
    );
  },
});

module.exports = LocalChatWebview;
