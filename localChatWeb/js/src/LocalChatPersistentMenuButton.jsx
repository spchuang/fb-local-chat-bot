/*
 * @flow
 */

'use strict';

import React, {PropTypes} from 'react';
import {ButtonToolbar, DropdownButton, MenuItem, OverlayTrigger, Popover} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import LocalChatStore from './LocalChatStore.js';

const LocalChatPersistentMenuButton = React.createClass({
  propTypes: {
    persistentMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  },

  contextTypes: {
    userID: React.PropTypes.string,
  },

  getInitialState(): Object {
    return {
      menuIndex: 0,
      levels: [],
    };
  },

  render(): React.Element {
    return (
      <ButtonToolbar>
        <OverlayTrigger trigger="click" placement="top" overlay={this.renderMenu()}>
          <button className="btn btn-primary btn-sm">
            Menu
          </button>
        </OverlayTrigger>
      </ButtonToolbar>
    );
  },

  getMenuItem(): Array<Object> {
    let menuItems = this.props.persistentMenu[this.state.menuIndex].call_to_actions;
    this.state.levels.forEach((level) => {
      menuItems = menuItems[level].call_to_actions;
    });
    return menuItems;
  },

  getTitle(): string {
    const numLevels = this.state.levels.length;
    let menuItems = this.props.persistentMenu[this.state.menuIndex].call_to_actions;

    for (let i = 0; i < numLevels; i++) {
      const level = this.state.levels[i];
      // stop at the level before to get the title
      if (i ===  numLevels - 1) {
        return menuItems[level].title;
      }
      menuItems = menuItems[level].call_to_actions;
    }

    return 'Menu';
  },

  renderMenuItem(item: Object, index: number): React.Element {
    const glyph = item.type === 'nested'
      ? <span className="pull-right">
          <span className="glyphicon glyphicon-chevron-right"></span>
        </span>
      : null;

    return (
      <a
        href="#a"
        className="list-group-item clearfix"
        key={index}
        onClick={() => this._handleClickItem(item, index)}>
        {item.title}
        {glyph}
      </a>
    );
  },

  getLocaleDropDown(): ?React.Element {
    const persistentMenu = this.props.persistentMenu;

    if (persistentMenu.length === 1) {
      return null;
    }

    const items = persistentMenu.map((menu, index) => {
      return (
        <MenuItem
          key={index}
          onClick={() => this.setState({menuIndex: index})}>
          {menu.locale}
        </MenuItem>
      );
    });
    return (
      <div className="locale-dropdown">
        Locale:
        <DropdownButton
          title={persistentMenu[this.state.menuIndex].locale}
          id="bg-nested-dropdown"
          className="dropdown-button btn-sm">
          {items}
        </DropdownButton>
        <hr/>
      </div>
    );
  },

  renderMenu(): React.Element {
    const menuItems = this.getMenuItem().map((item, index) => {
      return this.renderMenuItem(item, index);
    });


    const backButton = this.state.levels.length > 0
      ? <a href="#a" onClick={this._goBackOneLevel}>
          <span className="glyphicon glyphicon-chevron-left"></span>
          back
        </a>
      : null;

    return (
      <Popover id="popover-trigger-click" title={this.getTitle()}>
        {this.getLocaleDropDown()}
        {backButton}
        <div className="list-group">
          {menuItems}
        </div>
      </Popover>
    );
  },

  _handleClickItem(item: Object, index: number): void {
    switch (item.type) {
      case 'web_url':
        LocalChatStore.openWebView(item.url, item.webview_height_ratio);
        break;
      case 'postback':
        LocalChatStore.sendPostbackForUser(this.context.userID, item.payload);
        break;
      case 'nested':
        const levels = this.state.levels;
        levels.push(index);
        this.setState({levels: levels});
        break;
    }
  },

  _goBackOneLevel(): void {
    const levels = this.state.levels;
    levels.pop();
    this.setState({levels: levels})
  },
});

module.exports = LocalChatPersistentMenuButton;
