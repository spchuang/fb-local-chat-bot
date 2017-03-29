// @flow

'use strict';

import Promise from 'bluebird';
import rp from 'request-promise';

import type {
  PersistentMenu,
} from './type';

let _userToMessagesMap = {};
let _persistentMenu = [];

function _saveMessageToLocalChat(
  recipientID: string,
  messageData: Object,
  fromUser: boolean,
): void {
  if (!(recipientID in _userToMessagesMap)) {
    _userToMessagesMap[recipientID] = [];
  }
  // store a special flag to determine the source of message
  messageData.fromUser = fromUser;
  _userToMessagesMap[recipientID].push(messageData);
}

const ChatUtils = {
  storePersistentMenu(token: string): Promise {
    return rp({
      uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
      qs: {access_token: token},
      method: 'POST',
      body: {
        persistent_menu: _persistentMenu,
      },
      json: true,
    });
  },

  send(
    recipientID: string,
    token: string,
    data: Object,
    useLocalChat: boolean,
    useMessenger: boolean,
  ): ?Promise {
    if (useLocalChat) {
      _saveMessageToLocalChat(recipientID, Object.assign({}, data), false /* fromUser */);
    }

    if (useMessenger) {
      return rp({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        body: {
          recipient: {id: recipientID},
          ...data,
        },
        json: true,
      }, function(err, response) {
        if (err) {
          // TODO
        } else if (response.body.error) {
          // TODO
        }
      });
    }
    return;
  },

  getLocalChatMessages(): Object {
    return _userToMessagesMap;
  },

  clearLocalChatMessages(): void {
    _userToMessagesMap = {};
  },

  saveSenderMessageToLocalChat(senderID: string, text: string): void {
    _saveMessageToLocalChat(senderID, {message: {text: text}}, true /* fromUser */);
  },

  setPersistentMenu(persistentMenu: Array<PersistentMenu>): void {
    _persistentMenu = persistentMenu;
  },

  getPersistentMenu(): Array<PersistentMenu> {
    return _persistentMenu;
  },
};

module.exports = ChatUtils;
