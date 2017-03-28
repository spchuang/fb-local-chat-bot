/*
 * @flow
 */

import $ from 'jquery';
import EventStore from './EventStore.js';

const POLLING_INTERVAL = 1500;
const BASE_URL = '';

type WebViewHeightRatio = 'compact' | 'tall' | 'full';

class LocalChatStore extends EventStore {
  _userIDToMessagesMap: Object;
  _baseURL: string;
  _webViewURL: string;
  _openWebView: boolean;
  _webViewHeightRatio: WebViewHeightRatio;
  _persistentMenu: Array<Object>;

  constructor() {
    super();
    this._userIDToMessagesMap = {};
    this._webViewURL = '';
    this._openWebView = false;
    this._webViewHeightRatio = 'compact';
    this._persistentMenu = [];
  }

  _getPersistentMenu(): void {
    const url = this._baseURL + '/localChat/persistentMenu';
    $.get(url)
      .done((res: Array<Object>) => {
        this._persistentMenu = res;
        this.emitChange();
      })
      .fail((res: Object) => {
        console.log(res);
      });
  }

  setBaseUrl(baseURL: string) {
    this._baseURL = baseURL;
  }

  startPolling(): void {
    // get all the local messages
    const url = this._baseURL + '/localChat/getMessages';
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

  openWebView(url: string, heightRatio: WebViewHeightRatio): void {
    this._webViewURL = url;
    this._webViewHeightRatio = heightRatio;
    this._openWebView = true;
    this.emitChange();
  }

  closeWebView(): void {
    this._openWebView = false;
    this.emitChange();
  }

  sendOptinForUser(senderID: string, param: string): void {
    const url = this._baseURL + '/localChat/optin';
    $.post(url, {senderID: senderID, ref: param})
      .done((res: Object) => {
      })
      .fail((res: Object) => {
        console.log(res);
      });
  }

  getWebViewState(): Object {
    return {
      openWebView: this._openWebView,
      webViewHeightRatio: this._webViewHeightRatio,
      webViewURL: this._webViewURL,
    };
  }

  getPersistentMenu(): Array<Object> {
    return this._persistentMenu;
  }

  getMessagesForUser(userID: string): Array<Object> {
    if (userID in this._userIDToMessagesMap) {
      return this._userIDToMessagesMap[userID];
    }
    return [];
  }

  sendMessageForUser(senderID: string, message: string): void {
    const url = this._baseURL + '/localChat/sendMessage';
    $.post(url, {senderID: senderID, message: message})
      .fail((res: Object) => {
        console.log(res);
      });
  }

  sendPostbackForUser(senderID: string, payload: string): void {
    const url = this._baseURL + '/localChat/postback';
    $.post(url, {senderID: senderID, payload: payload})
      .fail((res: Object) => {
        console.log(res);
      });
  }

  sendQuickReplyForUser(senderID: string, text: string, payload: string): void {
    const url = this._baseURL + '/localChat/quickReply';
    $.post(url, {senderID: senderID, text: text, payload: payload})
      .fail((res: Object) => {
        console.log(res);
      });
  }

  storePersistentMenu(): void {
    const url = this._baseURL + '/localChat/storePersistentMenuWithFacebook';
    $.post(url)
      .done((res: Object) => {
        alert("Successfully stored the menu!");
      })
      .fail((res: Object) => {
        alert("Failed to store the menu: " + res.responseText);
        console.log(res);
      });
  }
}

const store = new LocalChatStore();

module.exports = store;
