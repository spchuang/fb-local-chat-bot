/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import LocalChatStore from './LocalChatStore.js';

const LocalChatOptin = React.createClass({
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
      <div className='chat-optin'>
        <div className="input-group">
          <input
            ref="passThroughParam"
            type="text"
            value={this.state.val}
            className="form-control input-sm"
            placeholder="PASS_THROUGH_PARAM"
            onChange={this._onChange}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-primary btn-sm"
              onClick={this._onAuthenticate}>
              Authenticate
            </button>
          </span>
        </div>
      </div>
    );
  },

  _onChange(): void {
    this.setState({
      val: this.refs.passThroughParam.value,
    });
  },

  _onAuthenticate(): void {
    const param = this.refs.passThroughParam.value;
    if (param === '') {
      return;
    }
    LocalChatStore.sendOptinForUser(this.props.userID, param);
    this.setState({val: ''});
  },
});

module.exports = LocalChatOptin;
