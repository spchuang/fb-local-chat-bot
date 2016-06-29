/*
 * @flow
 */

import $ from 'jquery';
import EventStore from '../common/EventStore';

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
    $.get(url)
      .done((res: Object) => {
        this._userIDToMessagesMap = res;
        this.emitChange();
        setTimeout(this.startPolling.bind(this), POLLING_INTERVAL)
      })
      .fail((res: Object) => {
        console.log(res);
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
    $.post(url, {senderID: senderID, message: message})
      .done((res: Object) => {
      })
      .fail((res: Object) => {
        console.log(res);
      });
  }

  sendPostbackForUser(senderID: string, payload: string): void {
    const url = BASE_URL + '/intern/localChat/postback';
    $.post(url, {senderID: senderID, payload: payload})
      .done((res: Object) => {
      })
      .fail((res: Object) => {

      });
  }
}

const store = new LocalChatStore();

module.exports = store;
