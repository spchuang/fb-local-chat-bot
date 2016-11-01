/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classNames';

import invariant from 'invariant';

const LocalChatWebviewOverlay = React.createClass({

  render(): React.Element {
    let webviewClassName = 'webview-overlay';
    if(this.props.hide){
      webviewClassName += ' hidden';
    }
    return (
      <div className={webviewClassName}></div>
    );
  },
});

module.exports = LocalChatWebviewOverlay;
