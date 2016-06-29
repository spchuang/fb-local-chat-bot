// @flow

'use strict';

import Promise from 'bluebird';
import rp from 'request-promise';

let _userToMessagesMap = {};

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
  send(
    recipientID: string,
    token: string,
    messageData: Object,
    useLocalChat: boolean,
  ): Promise {
    // Use the local chat interface instead of making GraphAPI call
    if (useLocalChat) {
      _saveMessageToLocalChat(recipientID, messageData, false /* fromUser */);
      return;
    }

    return rp({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      body: {
        recipient: {id: recipientID},
        message: messageData,
      },
      json: true,
    }, function(err, response) {
      if (err) {
        // TODO
      } else if (response.body.error) {
        // TODO
      }
    });
  },

  getLocalChatMessages(): Object {
    return _userToMessagesMap;
  },

  clearLocalChatMessages(): void {
    _userToMessagesMap = {};
  },

  saveSenderMessageToLocalChat(senderID: string, text: string): void {
    _saveMessageToLocalChat(senderID, {text: text}, true /* fromUser */);
  },
};

module.exports = ChatUtils;
