// @flow

'use strict';

import ChatUtils from './ChatUtils';
import {EventEmitter} from 'events'
import FBLocalChatRoutes from './FBLocalChatRoutes';
import {Router} from 'express';
import Promise from 'bluebird';
import invariant from 'invariant';

class Bot extends EventEmitter {
  _token: string;
  _verifyToken: string;
  _useLocalChat: boolean;
  _init: boolean;

  _verifyInitOrThrow(): void {
    invariant(this._init, 'Please initialize the Bot first');
  }

  _verifyInLocalChatOrThrow(): void {
    invariant(this._useLocalChat, 'Not in local chat mode');
  }

  constructor() {
    super();
    this._init = false;
  }

  init(token: string, verfyToken: string, useLocalChat: boolean): void {
    this._token = token;
    this._verifyToken = verfyToken;
    this._useLocalChat = useLocalChat;
    this._init = true;
  }

  router(): Router {
    this._verifyInitOrThrow();

    let router = Router();
    router.get('/', (req, res) => {
      if (req.query['hub.verify_token'] === this._verifyToken) {
        res.send(req.query['hub.challenge']);
      }
      res.send('Error, wrong validation token');
    });

    router.post('/', (req, res) => {
      this.handleMessage(req.body);
      res.sendStatus(200);
    });

    // attach local chat routes
    if (this._useLocalChat) {
      router = FBLocalChatRoutes(router, this);
    }

    return router;
  }

  getUserProfile(): Promise<Object> {
    this._verifyInitOrThrow();
    // TODO
  }

  handleMessage(data: Object): void {
    if (data.object !== 'page') {
      return;
    }

    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        // handle messages
        if (event.message) {
          // Since a message containing a quick_reply can also contain text
          // and attachment, check for quick_reply first
          if (event.message.quick_reply) {
            this.emit('quick_reply', event);
            return;
          }
          if (event.message.text) {
            this.emit('text', event);
          } else if (event.message.attachments) {
            this.emit('attachments', event);
          }
        }

        // handle postback
        if (event.postback && event.postback.payload) {
          this.emit('postback', event);
        }
        // TODO: handle message delivery and authentication
      })
    });
  }

  /**
   * send APIs
   */
  send(recipientID: string, messageData: Object): Promise {
    this._verifyInitOrThrow();
    return ChatUtils.send(
      recipientID,
      this._token,
      messageData,
      this._useLocalChat,
    );
   }

  sendImage(recipientID: string, imageURL: string): Promise {
    return this.send(recipientID, {'attachment': this.createImageAttachment(imageURL)});
  }

  sendText(recipientID: string, text: string): Promise {
    const messageData = {
      text:text,
    };
    return this.send(recipientID, messageData);
   }

  sendButtons(recipientID: string, text: string, buttonList: Array<Object>): Promise {
    const messageData = {
      'attachment': {
        'type':'template',
        'payload': {
          'template_type': 'button',
          'text': text,
          'buttons': buttonList,
        },
      },
    };
    return this.send(recipientID, messageData);
  }

  sendTemplate(): void {
   // TODO
  }

  sendQuickReplyWithAttachment(recipientID: string, attachment: Object, quickReplyList: Array<Object>): Promise {
    const messageData = {
      'attachment': attachment,
      'quick_replies': quickReplyList,
    }
    return this.send(recipientID, messageData);
  }

  sendQuickReplyWithText(recipientID: string, text: string, quickReplyList: Array<Object>): Promise {
    const messageData = {
      'text': text,
      'quick_replies': quickReplyList,
    }
    return this.send(recipientID, messageData);
  }

  createQuickReply(text: string, payload: string): Object {
    return {
      'content_type': 'text',
      'title': text,
      'payload': payload,
    };
  }

  createPostbackButton(text: string, payload: string): Object {
    return {
      'type': 'postback',
      'title': text,
      'payload': payload,
    };
  }

  createWebButton(text: string, url: string): Object {
    return {
      'type': 'web_url',
      'url': url,
      'title': text,
    };
  }

  createImageAttachment(imageURL: string): Object {
    return {
      'type': 'image',
      'payload': {
        'url': imageURL,
      },
    };
  }

  /**
   * Local Chat APIs (for unit testing purposes)
   */
  saveSenderMessageToLocalChat(senderID: string, text: string): void {
    if (this._useLocalChat) {
      ChatUtils.saveSenderMessageToLocalChat(senderID, text);
    }
  }

  getLocalChatMessages(): Object {
    this._verifyInLocalChatOrThrow();
    return ChatUtils.getLocalChatMessages();
  }

  clearLocalChatMessages(): void {
    this._verifyInLocalChatOrThrow();
    ChatUtils.clearLocalChatMessages();
  }

  getLocalChatMessagesForUser(userID: string): ?Array<Object> {
    this._verifyInLocalChatOrThrow();
    return ChatUtils.getLocalChatMessages()[userID];
  }
}

module.exports = new Bot();
