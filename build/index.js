

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChatUtils = require('./ChatUtils');

var _ChatUtils2 = _interopRequireDefault(_ChatUtils);

var _events = require('events');

var _FBLocalChatRoutes = require('./FBLocalChatRoutes');

var _FBLocalChatRoutes2 = _interopRequireDefault(_FBLocalChatRoutes);

var _express = require('express');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bot = function (_EventEmitter) {
  _inherits(Bot, _EventEmitter);

  _createClass(Bot, [{
    key: '_verifyInitOrThrow',
    value: function _verifyInitOrThrow() {
      (0, _invariant2.default)(this._init, 'Please initialize the Bot first');
    }
  }, {
    key: '_verifyInLocalChatOrThrow',
    value: function _verifyInLocalChatOrThrow() {
      (0, _invariant2.default)(this._useLocalChat, 'Not in local chat mode');
    }
  }]);

  function Bot() {
    _classCallCheck(this, Bot);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).call(this));

    _this._init = false;
    return _this;
  }

  _createClass(Bot, [{
    key: 'init',
    value: function init(token, verfyToken) {
      var useLocalChat = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var useMessenger = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      this._token = token;
      this._verifyToken = verfyToken;
      this._useLocalChat = useLocalChat;
      this._useMessenger = useMessenger;
      this._init = true;
    }
  }, {
    key: 'router',
    value: function router() {
      var _this2 = this;

      this._verifyInitOrThrow();

      var router = (0, _express.Router)();
      router.get('/', function (req, res) {
        if (req.query['hub.verify_token'] === _this2._verifyToken) {
          res.send(req.query['hub.challenge']);
        }
        res.send('Error, wrong validation token');
      });

      router.post('/', function (req, res) {
        _this2.handleMessage(req.body);
        res.sendStatus(200);
      });

      // attach local chat routes
      if (this._useLocalChat) {
        router = (0, _FBLocalChatRoutes2.default)(router, this);
      }

      return router;
    }
  }, {
    key: 'getUserProfile',
    value: function getUserProfile(id) {
      this._verifyInitOrThrow();
      return (0, _requestPromise2.default)({
        uri: 'https://graph.facebook.com/v2.6/' + id,
        qs: {
          access_token: this._token,
          fields: 'first_name,last_name,profile_pic,locale,timezone,gender'
        },
        json: true
      });
    }
  }, {
    key: 'handleMessage',
    value: function handleMessage(data) {
      var _this3 = this;

      if (data.object !== 'page') {
        return;
      }

      data.entry.forEach(function (entry) {
        entry.messaging.forEach(function (event) {
          // handle messages
          if (event.message) {
            // Since a message containing a quick_reply can also contain text
            // and attachment, check for quick_reply first
            if (event.message.quick_reply) {
              _this3.emit('quick_reply', event);
              return;
            }
            if (event.message.text) {
              _this3.emit('text', event);
            } else if (event.message.attachments) {
              _this3.emit('attachments', event);
            }
          }

          // handle postback
          if (event.postback && event.postback.payload) {
            _this3.emit('postback', event);
          }
          // Handle authentication
          if (event.optin && event.optin.ref) {
            _this3.emit('optin', event);
          }
          // TODO: handle message delivery
        });
      });
    }

    /**
     * send APIs
     */

  }, {
    key: 'send',
    value: function send(recipientID, messageData) {
      this._verifyInitOrThrow();
      return _ChatUtils2.default.send(recipientID, this._token, { message: messageData }, this._useLocalChat, this._useMessenger);
    }
  }, {
    key: 'sendSenderAction',
    value: function sendSenderAction(recipientID, action) {
      return _ChatUtils2.default.send(recipientID, this._token, { sender_action: action }, this._useLocalChat, this._useMessenger);
    }
  }, {
    key: 'sendText',
    value: function sendText(recipientID, text) {
      return this.send(recipientID, { text: text });
    }
  }, {
    key: 'sendAttachment',
    value: function sendAttachment(recipientID, attachment) {
      return this.send(recipientID, { 'attachment': attachment });
    }
  }, {
    key: 'sendImage',
    value: function sendImage(recipientID, url) {
      return this.sendAttachment(recipientID, this.createImageAttachment(url));
    }
  }, {
    key: 'sendVideo',
    value: function sendVideo(recipientID, url) {
      return this.sendAttachment(recipientID, this.createVideoAttachment(url));
    }
  }, {
    key: 'sendFile',
    value: function sendFile(recipientID, url) {
      return this.sendAttachment(recipientID, this.createFileAttachment(url));
    }
  }, {
    key: 'sendAudio',
    value: function sendAudio(recipientID, url) {
      return this.sendAttachment(recipientID, this.createAudioAttachment(url));
    }
  }, {
    key: 'sendButtons',
    value: function sendButtons(recipientID, text, buttons) {
      var attachment = {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': text,
          'buttons': buttons
        }
      };
      return this.sendAttachment(recipientID, attachment);
    }
  }, {
    key: 'sendGenericTemplate',
    value: function sendGenericTemplate(recipientID, elements) {
      var attachment = {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': elements
        }
      };
      return this.sendAttachment(recipientID, attachment);
    }
  }, {
    key: 'sendListTemplate',
    value: function sendListTemplate(recipientID, elements, topElementStyle, buttons) {
      var attachment = {
        'type': 'template',
        'payload': {
          'template_type': 'list',
          'elements': elements
        }
      };

      if (topElementStyle) {
        attachment.payload.top_element_style = topElementStyle;
      }
      if (buttons) {
        attachment.payload.buttons = buttons;
      }
      return this.sendAttachment(recipientID, attachment);
    }
  }, {
    key: 'sendQuickReplyWithAttachment',
    value: function sendQuickReplyWithAttachment(recipientID, attachment, quickReplyList) {
      var messageData = {
        'attachment': attachment,
        'quick_replies': quickReplyList
      };
      return this.send(recipientID, messageData);
    }
  }, {
    key: 'sendQuickReplyWithText',
    value: function sendQuickReplyWithText(recipientID, text, quickReplyList) {
      var messageData = {
        'text': text,
        'quick_replies': quickReplyList
      };
      return this.send(recipientID, messageData);
    }

    /*
     * Helpers to create attachment
     */

  }, {
    key: 'createQuickReply',
    value: function createQuickReply(text, payload) {
      return {
        'content_type': 'text',
        'title': text,
        'payload': payload
      };
    }
  }, {
    key: 'createLocationQuickReplay',
    value: function createLocationQuickReplay() {
      return {
        content_type: 'location'
      };
    }
  }, {
    key: 'createCallButton',
    value: function createCallButton(text, payload) {
      return {
        'type': 'phone_number',
        'title': text,
        'payload': payload
      };
    }
  }, {
    key: 'createPostbackButton',
    value: function createPostbackButton(text, payload) {
      return {
        'type': 'postback',
        'title': text,
        'payload': payload
      };
    }
  }, {
    key: 'createShareButton',
    value: function createShareButton() {
      return {
        'type': 'element_share'
      };
    }
  }, {
    key: 'createURLButton',
    value: function createURLButton(text, url) {
      var height = arguments.length <= 2 || arguments[2] === undefined ? 'full' : arguments[2];
      var useMessengerExtensions = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      var fallbackUrl = arguments[4];

      return {
        'type': 'web_url',
        'url': url,
        'title': text,
        'webview_height_ratio': height,
        'messenger_extensions': useMessengerExtensions,
        'fallback_url': fallbackUrl
      };
    }
  }, {
    key: 'createGenericTemplateElement',
    value: function createGenericTemplateElement(title, itemUrl, defaultAction, imageUrl, subtitle, buttons) {
      (0, _invariant2.default)(!(itemUrl && defaultAction), 'One element cannot have both default_action and item_url');
      var val = {
        'title': title
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
  }, {
    key: 'createImageAttachment',
    value: function createImageAttachment(url) {
      return {
        'type': 'image',
        'payload': {
          'url': url
        }
      };
    }
  }, {
    key: 'createVideoAttachment',
    value: function createVideoAttachment(url) {
      return {
        'type': 'video',
        'payload': {
          'url': url
        }
      };
    }
  }, {
    key: 'createFileAttachment',
    value: function createFileAttachment(url) {
      return {
        'type': 'file',
        'payload': {
          'url': url
        }
      };
    }
  }, {
    key: 'createAudioAttachment',
    value: function createAudioAttachment(url) {
      return {
        'type': 'audio',
        'payload': {
          'url': url
        }
      };
    }

    /**
     * Local Chat APIs (for unit testing purposes)
     */

  }, {
    key: 'saveSenderMessageToLocalChat',
    value: function saveSenderMessageToLocalChat(senderID, text) {
      if (this._useLocalChat) {
        _ChatUtils2.default.saveSenderMessageToLocalChat(senderID, text);
      }
    }
  }, {
    key: 'getLocalChatMessages',
    value: function getLocalChatMessages() {
      this._verifyInLocalChatOrThrow();
      return _ChatUtils2.default.getLocalChatMessages();
    }
  }, {
    key: 'clearLocalChatMessages',
    value: function clearLocalChatMessages() {
      this._verifyInLocalChatOrThrow();
      _ChatUtils2.default.clearLocalChatMessages();
    }
  }, {
    key: 'getLocalChatMessagesForUser',
    value: function getLocalChatMessagesForUser(userID) {
      this._verifyInLocalChatOrThrow();
      return _ChatUtils2.default.getLocalChatMessages()[userID];
    }
  }]);

  return Bot;
}(_events.EventEmitter);

module.exports = new Bot();
//# sourceMappingURL=data:application/json;base64,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IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IEZCTG9jYWxDaGF0Um91dGVzIGZyb20gJy4vRkJMb2NhbENoYXRSb3V0ZXMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgTXVsdGltZWRpYUF0dGFjaG1lbnQsXG4gIEJ1dHRvblRlbXBsYXRlQXR0YWNobWVudCxcbiAgR2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQsXG4gIEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnQsXG4gIExpc3RUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50LFxuICBMaXN0VGVtcGxhdGVBdHRhY2htZW50LFxuICBRdWlja1JlcGx5LFxuICBVUkxCdXR0b24sXG4gIFBvc3RiYWNrQnV0dG9uLFxuICBDYWxsQnV0dG9uLFxuICBTaGFyZUJ1dHRvbixcbiAgVGV4dFF1aWNrUmVwbHksXG4gIExvY2F0aW9uUXVpY2tSZXBseSxcbiAgQXR0YWNobWVudCxcbiAgQnV0dG9uLFxuICBNZXNzYWdlLFxuICBXZWJ2aWV3SGVpZ2h0UmF0aW8sXG59IGZyb20gJy4vdHlwZSc7XG5cbmNsYXNzIEJvdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIF90b2tlbjogc3RyaW5nO1xuICBfdmVyaWZ5VG9rZW46IHN0cmluZztcbiAgX3VzZUxvY2FsQ2hhdDogYm9vbGVhbjtcbiAgX3VzZU1lc3NlbmdlcjogYm9vbGVhbjtcbiAgX2luaXQ6IGJvb2xlYW47XG5cbiAgX3ZlcmlmeUluaXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl9pbml0LCAnUGxlYXNlIGluaXRpYWxpemUgdGhlIEJvdCBmaXJzdCcpO1xuICB9XG5cbiAgX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5fdXNlTG9jYWxDaGF0LCAnTm90IGluIGxvY2FsIGNoYXQgbW9kZScpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gIH1cblxuICBpbml0KFxuICAgIHRva2VuOiBzdHJpbmcsXG4gICAgdmVyZnlUb2tlbjogc3RyaW5nLFxuICAgIHVzZUxvY2FsQ2hhdDogYm9vbGVhbiA9IGZhbHNlLFxuICAgIHVzZU1lc3NlbmdlcjogYm9vbGVhbiA9IHRydWUsXG4gICk6IHZvaWQge1xuICAgIHRoaXMuX3Rva2VuID0gdG9rZW47XG4gICAgdGhpcy5fdmVyaWZ5VG9rZW4gPSB2ZXJmeVRva2VuO1xuICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCA9IHVzZUxvY2FsQ2hhdDtcbiAgICB0aGlzLl91c2VNZXNzZW5nZXIgPSB1c2VNZXNzZW5nZXI7XG4gICAgdGhpcy5faW5pdCA9IHRydWU7XG4gIH1cblxuICByb3V0ZXIoKTogUm91dGVyIHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuXG4gICAgbGV0IHJvdXRlciA9IFJvdXRlcigpO1xuICAgIHJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGlmIChyZXEucXVlcnlbJ2h1Yi52ZXJpZnlfdG9rZW4nXSA9PT0gdGhpcy5fdmVyaWZ5VG9rZW4pIHtcbiAgICAgICAgcmVzLnNlbmQocmVxLnF1ZXJ5WydodWIuY2hhbGxlbmdlJ10pO1xuICAgICAgfVxuICAgICAgcmVzLnNlbmQoJ0Vycm9yLCB3cm9uZyB2YWxpZGF0aW9uIHRva2VuJyk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlKHJlcS5ib2R5KTtcbiAgICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gICAgfSk7XG5cbiAgICAvLyBhdHRhY2ggbG9jYWwgY2hhdCByb3V0ZXNcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICByb3V0ZXIgPSBGQkxvY2FsQ2hhdFJvdXRlcyhyb3V0ZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICBnZXRVc2VyUHJvZmlsZShpZDogc3RyaW5nKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgIHJldHVybiBycCh7XG4gICAgICB1cmk6ICdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi42LycgKyBpZCxcbiAgICAgIHFzOiB7XG4gICAgICAgIGFjY2Vzc190b2tlbjogdGhpcy5fdG9rZW4sXG4gICAgICAgIGZpZWxkczogJ2ZpcnN0X25hbWUsbGFzdF9uYW1lLHByb2ZpbGVfcGljLGxvY2FsZSx0aW1lem9uZSxnZW5kZXInLFxuICAgICAgfSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVNZXNzYWdlKGRhdGE6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmIChkYXRhLm9iamVjdCAhPT0gJ3BhZ2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGF0YS5lbnRyeS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgZW50cnkubWVzc2FnaW5nLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIGhhbmRsZSBtZXNzYWdlc1xuICAgICAgICBpZiAoZXZlbnQubWVzc2FnZSkge1xuICAgICAgICAgIC8vIFNpbmNlIGEgbWVzc2FnZSBjb250YWluaW5nIGEgcXVpY2tfcmVwbHkgY2FuIGFsc28gY29udGFpbiB0ZXh0XG4gICAgICAgICAgLy8gYW5kIGF0dGFjaG1lbnQsIGNoZWNrIGZvciBxdWlja19yZXBseSBmaXJzdFxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnF1aWNrX3JlcGx5KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3F1aWNrX3JlcGx5JywgZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXZlbnQubWVzc2FnZS50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3RleHQnLCBldmVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5tZXNzYWdlLmF0dGFjaG1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2F0dGFjaG1lbnRzJywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBwb3N0YmFja1xuICAgICAgICBpZiAoZXZlbnQucG9zdGJhY2sgJiYgZXZlbnQucG9zdGJhY2sucGF5bG9hZCkge1xuICAgICAgICAgIHRoaXMuZW1pdCgncG9zdGJhY2snLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSGFuZGxlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIGlmIChldmVudC5vcHRpbiAmJiBldmVudC5vcHRpbi5yZWYpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ29wdGluJywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBtZXNzYWdlIGRlbGl2ZXJ5XG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmQgQVBJc1xuICAgKi9cbiAgc2VuZChyZWNpcGllbnRJRDogc3RyaW5nLCBtZXNzYWdlRGF0YTogTWVzc2FnZSk6IFByb21pc2Uge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5zZW5kKFxuICAgICAgcmVjaXBpZW50SUQsXG4gICAgICB0aGlzLl90b2tlbixcbiAgICAgIHttZXNzYWdlOiBtZXNzYWdlRGF0YX0sXG4gICAgICB0aGlzLl91c2VMb2NhbENoYXQsXG4gICAgICB0aGlzLl91c2VNZXNzZW5nZXIsXG4gICAgKTtcbiAgfVxuXG4gIHNlbmRTZW5kZXJBY3Rpb24ocmVjaXBpZW50SUQ6IHN0cmluZywgYWN0aW9uOiBTZW5kQWN0aW9uVHlwZSk6IFByb21pc2Uge1xuICAgIHJldHVybiBDaGF0VXRpbHMuc2VuZChcbiAgICAgIHJlY2lwaWVudElELFxuICAgICAgdGhpcy5fdG9rZW4sXG4gICAgICB7c2VuZGVyX2FjdGlvbjogYWN0aW9ufSxcbiAgICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCxcbiAgICAgIHRoaXMuX3VzZU1lc3NlbmdlcixcbiAgICApO1xuICB9XG5cbiAgc2VuZFRleHQocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwge3RleHQ6IHRleHR9KTtcbiAgfVxuXG4gIHNlbmRBdHRhY2htZW50KHJlY2lwaWVudElEOiBzdHJpbmcsIGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnQpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCB7J2F0dGFjaG1lbnQnOiBhdHRhY2htZW50fSk7XG4gIH1cblxuICBzZW5kSW1hZ2UocmVjaXBpZW50SUQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCx0aGlzLmNyZWF0ZUltYWdlQXR0YWNobWVudCh1cmwpKTtcbiAgfVxuXG4gIHNlbmRWaWRlbyhyZWNpcGllbnRJRDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCB0aGlzLmNyZWF0ZVZpZGVvQXR0YWNobWVudCh1cmwpKTtcbiAgfVxuXG4gIHNlbmRGaWxlKHJlY2lwaWVudElEOiBzdHJpbmcsIHVybDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIHRoaXMuY3JlYXRlRmlsZUF0dGFjaG1lbnQodXJsKSk7XG4gIH1cblxuICBzZW5kQXVkaW8ocmVjaXBpZW50SUQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgdGhpcy5jcmVhdGVBdWRpb0F0dGFjaG1lbnQodXJsKSk7XG4gIH1cblxuICBzZW5kQnV0dG9ucyhyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIGJ1dHRvbnM6IEFycmF5PEJ1dHRvbj4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBhdHRhY2htZW50OiBCdXR0b25UZW1wbGF0ZUF0dGFjaG1lbnQgPSB7XG4gICAgICAndHlwZSc6J3RlbXBsYXRlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdidXR0b24nLFxuICAgICAgICAndGV4dCc6IHRleHQsXG4gICAgICAgICdidXR0b25zJzogYnV0dG9ucyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgYXR0YWNobWVudCk7XG4gIH1cblxuICBzZW5kR2VuZXJpY1RlbXBsYXRlKHJlY2lwaWVudElEOiBzdHJpbmcsIGVsZW1lbnRzOiBBcnJheTxHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50RWxlbWVudD4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBhdHRhY2htZW50OiBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50ID0ge1xuICAgICAgJ3R5cGUnOid0ZW1wbGF0ZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3RlbXBsYXRlX3R5cGUnOiAnZ2VuZXJpYycsXG4gICAgICAgICdlbGVtZW50cyc6IGVsZW1lbnRzLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCBhdHRhY2htZW50KTtcbiAgfVxuXG4gIHNlbmRMaXN0VGVtcGxhdGUoXG4gICAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgICBlbGVtZW50czogQXJyYXk8TGlzdFRlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQ+LFxuICAgIHRvcEVsZW1lbnRTdHlsZT86ICdsYXJnZScgfCAnY29tcGFjdCcsXG4gICAgYnV0dG9ucz86IEFycmF5PEJ1dHRvbj5cbiAgKTogUHJvbWlzZSB7XG4gICAgY29uc3QgYXR0YWNobWVudDogTGlzdFRlbXBsYXRlQXR0YWNobWVudCA9IHtcbiAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd0ZW1wbGF0ZV90eXBlJzogJ2xpc3QnLFxuICAgICAgICAnZWxlbWVudHMnOiBlbGVtZW50cyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGlmICh0b3BFbGVtZW50U3R5bGUpIHtcbiAgICAgIGF0dGFjaG1lbnQucGF5bG9hZC50b3BfZWxlbWVudF9zdHlsZSA9IHRvcEVsZW1lbnRTdHlsZTtcbiAgICB9XG4gICAgaWYgKGJ1dHRvbnMpIHtcbiAgICAgIGF0dGFjaG1lbnQucGF5bG9hZC5idXR0b25zID0gYnV0dG9ucztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIGF0dGFjaG1lbnQpO1xuICB9XG5cbiAgc2VuZFF1aWNrUmVwbHlXaXRoQXR0YWNobWVudChyZWNpcGllbnRJRDogc3RyaW5nLCBhdHRhY2htZW50OiBPYmplY3QsIHF1aWNrUmVwbHlMaXN0OiBBcnJheTxRdWlja1JlcGx5Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgJ2F0dGFjaG1lbnQnOiBhdHRhY2htZW50LFxuICAgICAgJ3F1aWNrX3JlcGxpZXMnOiBxdWlja1JlcGx5TGlzdCxcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICB9XG5cbiAgc2VuZFF1aWNrUmVwbHlXaXRoVGV4dChyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHF1aWNrUmVwbHlMaXN0OiBBcnJheTxRdWlja1JlcGx5Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgJ3RleHQnOiB0ZXh0LFxuICAgICAgJ3F1aWNrX3JlcGxpZXMnOiBxdWlja1JlcGx5TGlzdCxcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICB9XG5cbiAgLypcbiAgICogSGVscGVycyB0byBjcmVhdGUgYXR0YWNobWVudFxuICAgKi9cbiAgY3JlYXRlUXVpY2tSZXBseSh0ZXh0OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IFRleHRRdWlja1JlcGx5IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2NvbnRlbnRfdHlwZSc6ICd0ZXh0JyxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAncGF5bG9hZCc6IHBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUxvY2F0aW9uUXVpY2tSZXBsYXkoKTogTG9jYXRpb25RdWlja1JlcGx5IHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudF90eXBlOiAnbG9jYXRpb24nLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVDYWxsQnV0dG9uKHRleHQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogQ2FsbEJ1dHRvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3Bob25lX251bWJlcicsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVQb3N0YmFja0J1dHRvbih0ZXh0OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IFBvc3RiYWNrQnV0dG9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAncG9zdGJhY2snLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlU2hhcmVCdXR0b24oKTogU2hhcmVCdXR0b24ge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdlbGVtZW50X3NoYXJlJyxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlVVJMQnV0dG9uKFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBoZWlnaHQ/OiBXZWJ2aWV3SGVpZ2h0UmF0aW8gPSAnZnVsbCcsXG4gICAgdXNlTWVzc2VuZ2VyRXh0ZW5zaW9ucz86IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBmYWxsYmFja1VybD86IHN0cmluZyxcbiAgKTogVVJMQnV0dG9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnd2ViX3VybCcsXG4gICAgICAndXJsJzogdXJsLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICd3ZWJ2aWV3X2hlaWdodF9yYXRpbyc6IGhlaWdodCxcbiAgICAgICdtZXNzZW5nZXJfZXh0ZW5zaW9ucyc6IHVzZU1lc3NlbmdlckV4dGVuc2lvbnMsXG4gICAgICAnZmFsbGJhY2tfdXJsJzogZmFsbGJhY2tVcmwsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUdlbmVyaWNUZW1wbGF0ZUVsZW1lbnQoXG4gICAgdGl0bGU6IHN0cmluZyxcbiAgICBpdGVtVXJsOiA/c3RyaW5nLFxuICAgIGRlZmF1bHRBY3Rpb246ID9PYmplY3QsXG4gICAgaW1hZ2VVcmw6ID9zdHJpbmcsXG4gICAgc3VidGl0bGU6ID9zdHJpbmcsXG4gICAgYnV0dG9uczogP0FycmF5PE9iamVjdD4sXG4gICk6IEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50IHtcbiAgICBpbnZhcmlhbnQoIShpdGVtVXJsICYmIGRlZmF1bHRBY3Rpb24pLCAnT25lIGVsZW1lbnQgY2Fubm90IGhhdmUgYm90aCBkZWZhdWx0X2FjdGlvbiBhbmQgaXRlbV91cmwnKTtcbiAgICBjb25zdCB2YWw6IEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50ID0ge1xuICAgICAgJ3RpdGxlJzogdGl0bGUsXG4gICAgfTtcblxuICAgIGlmIChpdGVtVXJsKSB7XG4gICAgICB2YWwuaXRlbV91cmwgPSBpdGVtVXJsO1xuICAgIH1cbiAgICBpZiAoZGVmYXVsdEFjdGlvbikge1xuICAgICAgdmFsLmRlZmF1bHRfYWN0aW9uID0gZGVmYXVsdEFjdGlvbjtcbiAgICB9XG4gICAgaWYgKGltYWdlVXJsKSB7XG4gICAgICB2YWwuaW1hZ2VfdXJsID0gaW1hZ2VVcmw7XG4gICAgfVxuICAgIGlmIChzdWJ0aXRsZSkge1xuICAgICAgdmFsLnN1YnRpdGxlID0gc3VidGl0bGU7XG4gICAgfVxuICAgIGlmIChidXR0b25zKSB7XG4gICAgICB2YWwuYnV0dG9ucyA9IGJ1dHRvbnM7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBjcmVhdGVJbWFnZUF0dGFjaG1lbnQodXJsOiBzdHJpbmcpOiBNdWx0aW1lZGlhQXR0YWNobWVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ2ltYWdlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndXJsJzogdXJsLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlVmlkZW9BdHRhY2htZW50KHVybDogc3RyaW5nKTogTXVsdGltZWRpYUF0dGFjaG1lbnQge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICd2aWRlbycsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUZpbGVBdHRhY2htZW50KHVybDogc3RyaW5nKTogTXVsdGltZWRpYUF0dGFjaG1lbnQge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdmaWxlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndXJsJzogdXJsLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlQXVkaW9BdHRhY2htZW50KHVybDogc3RyaW5nKTogTXVsdGltZWRpYUF0dGFjaG1lbnQge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdhdWRpbycsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbCBDaGF0IEFQSXMgKGZvciB1bml0IHRlc3RpbmcgcHVycG9zZXMpXG4gICAqL1xuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl91c2VMb2NhbENoYXQpIHtcbiAgICAgIENoYXRVdGlscy5zYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgQ2hhdFV0aWxzLmNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzRm9yVXNlcih1c2VySUQ6IHN0cmluZyk6ID9BcnJheTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKClbdXNlcklEXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCb3QoKTtcbiJdfQ==