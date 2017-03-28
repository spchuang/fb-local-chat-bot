// @flow

'use strict';

import ChatUtils from './ChatUtils';
import {EventEmitter} from 'events'
import FBLocalChatRoutes from './FBLocalChatRoutes';
import {Router} from 'express';
import Promise from 'bluebird';
import invariant from 'invariant';
import rp from 'request-promise';

import type {
  MultimediaAttachment,
  ButtonTemplateAttachment,
  GenericTemplateAttachmentElement,
  GenericTemplateAttachment,
  ListTemplateAttachmentElement,
  ListTemplateAttachment,
  QuickReply,
  URLButton,
  PostbackButton,
  CallButton,
  ShareButton,
  TextQuickReply,
  LocationQuickReply,
  Attachment,
  Button,
  Message,
  WebviewHeightRatio,
  SendActionType,
  PersistentMenu,
  PersistenMenuItem,
  NestedPersistentMenuItem,
} from './type';

class Bot extends EventEmitter {
  _token: string;
  _verifyToken: string;
  _useLocalChat: boolean;
  _useMessenger: boolean;
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

  init(
    token: string,
    verfyToken: string,
    useLocalChat: boolean = false,
    useMessenger: boolean = true,
  ): void {
    this._token = token;
    this._verifyToken = verfyToken;
    this._useLocalChat = useLocalChat;
    this._useMessenger = useMessenger;
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

  getUserProfile(id: string): Promise<Object> {
    this._verifyInitOrThrow();
    return rp({
      uri: 'https://graph.facebook.com/v2.6/' + id,
      qs: {
        access_token: this._token,
        fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
      },
      json: true,
    });
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
        // Handle authentication
        if (event.optin && event.optin.ref) {
          this.emit('optin', event);
        }
        // TODO: handle message delivery
      })
    });
  }

  /**
   * send APIs
   */
  send(recipientID: string, messageData: Message): Promise {
    this._verifyInitOrThrow();
    return ChatUtils.send(
      recipientID,
      this._token,
      {message: messageData},
      this._useLocalChat,
      this._useMessenger,
    );
  }

  sendSenderAction(recipientID: string, action: SendActionType): Promise {
    return ChatUtils.send(
      recipientID,
      this._token,
      {sender_action: action},
      this._useLocalChat,
      this._useMessenger,
    );
  }

  setPersistentMenu(menuDefinition: Array<PersistentMenu>): void {
    ChatUtils.setPersistentMenu(menuDefinition);
  }

  storePersistentMenu(): Promise {
    return ChatUtils.storePersistentMenu(this._token);
  }

  sendText(recipientID: string, text: string): Promise {
    return this.send(recipientID, {text: text});
  }

  sendAttachment(recipientID: string, attachment: Attachment): Promise {
    return this.send(recipientID, {'attachment': attachment});
  }

  sendImage(recipientID: string, url: string): Promise {
    return this.sendAttachment(recipientID,this.createImageAttachment(url));
  }

  sendVideo(recipientID: string, url: string): Promise {
    return this.sendAttachment(recipientID, this.createVideoAttachment(url));
  }

  sendFile(recipientID: string, url: string): Promise {
    return this.sendAttachment(recipientID, this.createFileAttachment(url));
  }

  sendAudio(recipientID: string, url: string): Promise {
    return this.sendAttachment(recipientID, this.createAudioAttachment(url));
  }

  sendButtons(recipientID: string, text: string, buttons: Array<Button>): Promise {
    const attachment: ButtonTemplateAttachment = {
      'type':'template',
      'payload': {
        'template_type': 'button',
        'text': text,
        'buttons': buttons,
      },
    };
    return this.sendAttachment(recipientID, attachment);
  }

  sendGenericTemplate(recipientID: string, elements: Array<GenericTemplateAttachmentElement>): Promise {
    const attachment: GenericTemplateAttachment = {
      'type':'template',
      'payload': {
        'template_type': 'generic',
        'elements': elements,
      },
    };
    return this.sendAttachment(recipientID, attachment);
  }

  sendListTemplate(
    recipientID: string,
    elements: Array<ListTemplateAttachmentElement>,
    topElementStyle?: 'large' | 'compact',
    buttons?: Array<Button>
  ): Promise {
    const attachment: ListTemplateAttachment = {
      'type':'template',
      'payload': {
        'template_type': 'list',
        'elements': elements,
      },
    };

    if (topElementStyle) {
      attachment.payload.top_element_style = topElementStyle;
    }
    if (buttons) {
      attachment.payload.buttons = buttons;
    }
    return this.sendAttachment(recipientID, attachment);
  }

  sendQuickReplyWithAttachment(recipientID: string, attachment: Object, quickReplyList: Array<QuickReply>): Promise {
    const messageData = {
      'attachment': attachment,
      'quick_replies': quickReplyList,
    }
    return this.send(recipientID, messageData);
  }

  sendQuickReplyWithText(recipientID: string, text: string, quickReplyList: Array<QuickReply>): Promise {
    const messageData = {
      'text': text,
      'quick_replies': quickReplyList,
    }
    return this.send(recipientID, messageData);
  }

  /*
   * Helpers to create persistent menu
   */
  createPersistentMenu(locale: string, composerInputDisabled: boolean, menuItems: Array<PersistenMenuItem>): PersistentMenu {
    return {
      locale: locale,
      composer_input_disabled: composerInputDisabled,
      call_to_actions: menuItems,
    };
  }

  createNestedMenuItem(title: string, menuItems: Array<PersistenMenuItem>): NestedPersistentMenuItem {
    return {
      title: title,
      type: 'nested',
      call_to_actions: menuItems,
    };
  }

  /*
   * Helpers to create attachment
   */
  createQuickReply(text: string, payload: string): TextQuickReply {
    return {
      'content_type': 'text',
      'title': text,
      'payload': payload,
    };
  }

  createLocationQuickReplay(): LocationQuickReply {
    return {
      content_type: 'location',
    };
  }

  createCallButton(text: string, payload: string): CallButton {
    return {
      'type': 'phone_number',
      'title': text,
      'payload': payload,
    };
  }

  createPostbackButton(text: string, payload: string): PostbackButton {
    return {
      'type': 'postback',
      'title': text,
      'payload': payload,
    };
  }

  createShareButton(): ShareButton {
    return {
      'type': 'element_share',
    };
  }

  createURLButton(
    text: string,
    url: string,
    height?: WebviewHeightRatio = 'full',
    useMessengerExtensions?: boolean = false,
    fallbackUrl?: string,
  ): URLButton {
    return {
      'type': 'web_url',
      'url': url,
      'title': text,
      'webview_height_ratio': height,
      'messenger_extensions': useMessengerExtensions,
      'fallback_url': fallbackUrl,
    };
  }

  createGenericTemplateElement(
    title: string,
    itemUrl: ?string,
    defaultAction: ?Object,
    imageUrl: ?string,
    subtitle: ?string,
    buttons: ?Array<Object>,
  ): GenericTemplateAttachmentElement {
    invariant(!(itemUrl && defaultAction), 'One element cannot have both default_action and item_url');
    const val: GenericTemplateAttachmentElement = {
      'title': title,
    };

    if (itemUrl) {
      val.item_url = itemUrl;
    }
    if (defaultAction) {
      val.default_action = defaultAction;
    }
    if (imageUrl) {
      val.image_url = imageUrl;
    }
    if (subtitle) {
      val.subtitle = subtitle;
    }
    if (buttons) {
      val.buttons = buttons;
    }
    return val;
  }

  createImageAttachment(url: string): MultimediaAttachment {
    return {
      'type': 'image',
      'payload': {
        'url': url,
      },
    };
  }

  createVideoAttachment(url: string): MultimediaAttachment {
    return {
      'type': 'video',
      'payload': {
        'url': url,
      },
    };
  }

  createFileAttachment(url: string): MultimediaAttachment {
    return {
      'type': 'file',
      'payload': {
        'url': url,
      },
    };
  }

  createAudioAttachment(url: string): MultimediaAttachment {
    return {
      'type': 'audio',
      'payload': {
        'url': url,
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
