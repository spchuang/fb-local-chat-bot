/*
 * @flow
 */

import request from 'request';
import EventStore from '../common/EventStore.js';

const POLLING_INTERVAL = 1500;
const BASE_URL = '';

class LocalChatStore extends EventStore {
  _userIDToMessagesMap: Object;

  constructor() {
    super();
    this._userIDToMessagesMap = {};
    this.startPolling();
  }

  startPolling(): void {
    // get all the local messages
    const url = BASE_URL + '/intern/localChat/getMessages';
    request.get({url: url, json: true}, (error, res, body) => {
      console.log(res, body);
      if (!error) {
        this._userIDToMessagesMap = res;
        this.emitChange();
      }
      setTimeout(this.startPolling.bind(this), POLLING_INTERVAL)
    });
  }

  getMessagesForUser(userID: string): Array<Object> {
    if (userID in this._userIDToMessagesMap) {
      return this._userIDToMessagesMap[userID];
    }
    return [];
  }

  sendMessageForUser(senderID: string, message: string): void {
    const url = BASE_URL + '/intern/localChat/sendMessage';
    const formData = {senderID: senderID, message: message};
    request.post({url, formData},  (error, res, body) => {

    });
  }

  sendPostbackForUser(senderID: string, payload: string): void {
    const url = BASE_URL + '/intern/localChat/postback';
    const formData = {senderID: senderID, payload: payload};
    request.post({url, formData},  (error, res, body) => {

    });
  }
}

const store = new LocalChatStore();

module.exports = store;
