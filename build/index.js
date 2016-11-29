

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
    value: function init(token, verfyToken, useLocalChat) {
      this._token = token;
      this._verifyToken = verfyToken;
      this._useLocalChat = useLocalChat;
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
    value: function getUserProfile() {
      this._verifyInitOrThrow();
      // TODO
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
      return _ChatUtils2.default.send(recipientID, this._token, messageData, this._useLocalChat);
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
//# sourceMappingURL=data:application/json;base64,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O0FBQ3RELGFBQU87QUFDTCxnQkFBUSxNQURIO0FBRUwsbUJBQVc7QUFDVCxpQkFBTztBQURFO0FBRk4sT0FBUDtBQU1EOzs7MENBRXFCLEcsRUFBbUM7QUFDdkQsYUFBTztBQUNMLGdCQUFRLE9BREg7QUFFTCxtQkFBVztBQUNULGlCQUFPO0FBREU7QUFGTixPQUFQO0FBTUQ7Ozs7Ozs7O2lEQUs0QixRLEVBQWtCLEksRUFBb0I7QUFDakUsVUFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDdEIsNEJBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsSUFBakQ7QUFDRDtBQUNGOzs7MkNBRThCO0FBQzdCLFdBQUsseUJBQUw7QUFDQSxhQUFPLG9CQUFVLG9CQUFWLEVBQVA7QUFDRDs7OzZDQUU4QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsMEJBQVUsc0JBQVY7QUFDRDs7O2dEQUUyQixNLEVBQWdDO0FBQzFELFdBQUsseUJBQUw7QUFDQSxhQUFPLG9CQUFVLG9CQUFWLEdBQWlDLE1BQWpDLENBQVA7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLElBQUksR0FBSixFQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IEZCTG9jYWxDaGF0Um91dGVzIGZyb20gJy4vRkJMb2NhbENoYXRSb3V0ZXMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIE11bHRpbWVkaWFBdHRhY2htZW50LFxuICBCdXR0b25UZW1wbGF0ZUF0dGFjaG1lbnQsXG4gIEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50LFxuICBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50LFxuICBMaXN0VGVtcGxhdGVBdHRhY2htZW50RWxlbWVudCxcbiAgTGlzdFRlbXBsYXRlQXR0YWNobWVudCxcbiAgUXVpY2tSZXBseSxcbiAgVVJMQnV0dG9uLFxuICBQb3N0YmFja0J1dHRvbixcbiAgQ2FsbEJ1dHRvbixcbiAgU2hhcmVCdXR0b24sXG4gIFRleHRRdWlja1JlcGx5LFxuICBMb2NhdGlvblF1aWNrUmVwbHksXG4gIEF0dGFjaG1lbnQsXG4gIEJ1dHRvbixcbiAgTWVzc2FnZSxcbn0gZnJvbSAnLi90eXBlJztcblxudHlwZSB3ZWJVUkxIZWlnaHQgPSAnY29tcGFjdCcgfCAndGFsbCcgfCAnZnVsbCc7XG5cbmNsYXNzIEJvdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIF90b2tlbjogc3RyaW5nO1xuICBfdmVyaWZ5VG9rZW46IHN0cmluZztcbiAgX3VzZUxvY2FsQ2hhdDogYm9vbGVhbjtcbiAgX2luaXQ6IGJvb2xlYW47XG5cbiAgX3ZlcmlmeUluaXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl9pbml0LCAnUGxlYXNlIGluaXRpYWxpemUgdGhlIEJvdCBmaXJzdCcpO1xuICB9XG5cbiAgX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5fdXNlTG9jYWxDaGF0LCAnTm90IGluIGxvY2FsIGNoYXQgbW9kZScpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gIH1cblxuICBpbml0KHRva2VuOiBzdHJpbmcsIHZlcmZ5VG9rZW46IHN0cmluZywgdXNlTG9jYWxDaGF0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fdG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLl92ZXJpZnlUb2tlbiA9IHZlcmZ5VG9rZW47XG4gICAgdGhpcy5fdXNlTG9jYWxDaGF0ID0gdXNlTG9jYWxDaGF0O1xuICAgIHRoaXMuX2luaXQgPSB0cnVlO1xuICB9XG5cbiAgcm91dGVyKCk6IFJvdXRlciB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcblxuICAgIGxldCByb3V0ZXIgPSBSb3V0ZXIoKTtcbiAgICByb3V0ZXIuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBpZiAocmVxLnF1ZXJ5WydodWIudmVyaWZ5X3Rva2VuJ10gPT09IHRoaXMuX3ZlcmlmeVRva2VuKSB7XG4gICAgICAgIHJlcy5zZW5kKHJlcS5xdWVyeVsnaHViLmNoYWxsZW5nZSddKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZW5kKCdFcnJvciwgd3JvbmcgdmFsaWRhdGlvbiB0b2tlbicpO1xuICAgIH0pO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTWVzc2FnZShyZXEuYm9keSk7XG4gICAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICAgIH0pO1xuXG4gICAgLy8gYXR0YWNoIGxvY2FsIGNoYXQgcm91dGVzXG4gICAgaWYgKHRoaXMuX3VzZUxvY2FsQ2hhdCkge1xuICAgICAgcm91dGVyID0gRkJMb2NhbENoYXRSb3V0ZXMocm91dGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9XG5cbiAgZ2V0VXNlclByb2ZpbGUoKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2UoZGF0YTogT2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKGRhdGEub2JqZWN0ICE9PSAncGFnZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLmVudHJ5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyeS5tZXNzYWdpbmcuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgLy8gaGFuZGxlIG1lc3NhZ2VzXG4gICAgICAgIGlmIChldmVudC5tZXNzYWdlKSB7XG4gICAgICAgICAgLy8gU2luY2UgYSBtZXNzYWdlIGNvbnRhaW5pbmcgYSBxdWlja19yZXBseSBjYW4gYWxzbyBjb250YWluIHRleHRcbiAgICAgICAgICAvLyBhbmQgYXR0YWNobWVudCwgY2hlY2sgZm9yIHF1aWNrX3JlcGx5IGZpcnN0XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UucXVpY2tfcmVwbHkpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncXVpY2tfcmVwbHknLCBldmVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm1lc3NhZ2UuYXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYXR0YWNobWVudHMnLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBvc3RiYWNrXG4gICAgICAgIGlmIChldmVudC5wb3N0YmFjayAmJiBldmVudC5wb3N0YmFjay5wYXlsb2FkKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0YmFjaycsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBIYW5kbGUgYXV0aGVudGljYXRpb25cbiAgICAgICAgaWYgKGV2ZW50Lm9wdGluICYmIGV2ZW50Lm9wdGluLnJlZikge1xuICAgICAgICAgIHRoaXMuZW1pdCgnb3B0aW4nLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIG1lc3NhZ2UgZGVsaXZlcnlcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZCBBUElzXG4gICAqL1xuICBzZW5kKHJlY2lwaWVudElEOiBzdHJpbmcsIG1lc3NhZ2VEYXRhOiBNZXNzYWdlKTogUHJvbWlzZSB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLnNlbmQoXG4gICAgICByZWNpcGllbnRJRCxcbiAgICAgIHRoaXMuX3Rva2VuLFxuICAgICAgbWVzc2FnZURhdGEsXG4gICAgICB0aGlzLl91c2VMb2NhbENoYXQsXG4gICAgKTtcbiAgfVxuXG4gIHNlbmRUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIHt0ZXh0OiB0ZXh0fSk7XG4gIH1cblxuICBzZW5kQXR0YWNobWVudChyZWNpcGllbnRJRDogc3RyaW5nLCBhdHRhY2htZW50OiBBdHRhY2htZW50KTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgeydhdHRhY2htZW50JzogYXR0YWNobWVudH0pO1xuICB9XG5cbiAgc2VuZEltYWdlKHJlY2lwaWVudElEOiBzdHJpbmcsIHVybDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsdGhpcy5jcmVhdGVJbWFnZUF0dGFjaG1lbnQodXJsKSk7XG4gIH1cblxuICBzZW5kVmlkZW8ocmVjaXBpZW50SUQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgdGhpcy5jcmVhdGVWaWRlb0F0dGFjaG1lbnQodXJsKSk7XG4gIH1cblxuICBzZW5kRmlsZShyZWNpcGllbnRJRDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCB0aGlzLmNyZWF0ZUZpbGVBdHRhY2htZW50KHVybCkpO1xuICB9XG5cbiAgc2VuZEF1ZGlvKHJlY2lwaWVudElEOiBzdHJpbmcsIHVybDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIHRoaXMuY3JlYXRlQXVkaW9BdHRhY2htZW50KHVybCkpO1xuICB9XG5cbiAgc2VuZEJ1dHRvbnMocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nLCBidXR0b25zOiBBcnJheTxCdXR0b24+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgYXR0YWNobWVudDogQnV0dG9uVGVtcGxhdGVBdHRhY2htZW50ID0ge1xuICAgICAgJ3R5cGUnOid0ZW1wbGF0ZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3RlbXBsYXRlX3R5cGUnOiAnYnV0dG9uJyxcbiAgICAgICAgJ3RleHQnOiB0ZXh0LFxuICAgICAgICAnYnV0dG9ucyc6IGJ1dHRvbnMsXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIGF0dGFjaG1lbnQpO1xuICB9XG5cbiAgc2VuZEdlbmVyaWNUZW1wbGF0ZShyZWNpcGllbnRJRDogc3RyaW5nLCBlbGVtZW50czogQXJyYXk8R2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQ+KTogdm9pZCB7XG4gICAgY29uc3QgYXR0YWNobWVudDogR2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudCA9IHtcbiAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd0ZW1wbGF0ZV90eXBlJzogJ2dlbmVyaWMnLFxuICAgICAgICAnZWxlbWVudHMnOiBlbGVtZW50cyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgYXR0YWNobWVudCk7XG4gIH1cblxuICBzZW5kTGlzdFRlbXBsYXRlKFxuICAgIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gICAgZWxlbWVudHM6IEFycmF5PExpc3RUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50PixcbiAgICB0b3BFbGVtZW50U3R5bGU/OiAnbGFyZ2UnIHwgJ2NvbXBhY3QnLFxuICAgIGJ1dHRvbnM/OiBBcnJheTxCdXR0b24+XG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGF0dGFjaG1lbnQ6IExpc3RUZW1wbGF0ZUF0dGFjaG1lbnQgPSB7XG4gICAgICAndHlwZSc6J3RlbXBsYXRlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdsaXN0JyxcbiAgICAgICAgJ2VsZW1lbnRzJzogZWxlbWVudHMsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBpZiAodG9wRWxlbWVudFN0eWxlKSB7XG4gICAgICBhdHRhY2htZW50LnBheWxvYWQudG9wX2VsZW1lbnRfc3R5bGUgPSB0b3BFbGVtZW50U3R5bGU7XG4gICAgfVxuICAgIGlmIChidXR0b25zKSB7XG4gICAgICBhdHRhY2htZW50LnBheWxvYWQuYnV0dG9ucyA9IGJ1dHRvbnM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCBhdHRhY2htZW50KTtcbiAgfVxuXG4gIHNlbmRRdWlja1JlcGx5V2l0aEF0dGFjaG1lbnQocmVjaXBpZW50SUQ6IHN0cmluZywgYXR0YWNobWVudDogT2JqZWN0LCBxdWlja1JlcGx5TGlzdDogQXJyYXk8UXVpY2tSZXBseT4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICdhdHRhY2htZW50JzogYXR0YWNobWVudCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIHNlbmRRdWlja1JlcGx5V2l0aFRleHQocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nLCBxdWlja1JlcGx5TGlzdDogQXJyYXk8UXVpY2tSZXBseT4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIC8qXG4gICAqIEhlbHBlcnMgdG8gY3JlYXRlIGF0dGFjaG1lbnRcbiAgICovXG4gIGNyZWF0ZVF1aWNrUmVwbHkodGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBUZXh0UXVpY2tSZXBseSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdjb250ZW50X3R5cGUnOiAndGV4dCcsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVMb2NhdGlvblF1aWNrUmVwbGF5KCk6IExvY2F0aW9uUXVpY2tSZXBseSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRfdHlwZTogJ2xvY2F0aW9uJyxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlQ2FsbEJ1dHRvbih0ZXh0OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IENhbGxCdXR0b24ge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdwaG9uZV9udW1iZXInLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlUG9zdGJhY2tCdXR0b24odGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBQb3N0YmFja0J1dHRvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3Bvc3RiYWNrJyxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAncGF5bG9hZCc6IHBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVNoYXJlQnV0dG9uKCk6IFNoYXJlQnV0dG9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnZWxlbWVudF9zaGFyZScsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVVSTEJ1dHRvbihcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgaGVpZ2h0Pzogd2ViVVJMSGVpZ2h0ID0gJ2Z1bGwnLFxuICAgIHVzZU1lc3NlbmdlckV4dGVuc2lvbnM/OiBib29sZWFuID0gZmFsc2UsXG4gICAgZmFsbGJhY2tVcmw/OiBzdHJpbmcsXG4gICk6IFVSTEJ1dHRvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3dlYl91cmwnLFxuICAgICAgJ3VybCc6IHVybCxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAnd2Vidmlld19oZWlnaHRfcmF0aW8nOiBoZWlnaHQsXG4gICAgICAnbWVzc2VuZ2VyX2V4dGVuc2lvbnMnOiB1c2VNZXNzZW5nZXJFeHRlbnNpb25zLFxuICAgICAgJ2ZhbGxiYWNrX3VybCc6IGZhbGxiYWNrVXJsLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVHZW5lcmljVGVtcGxhdGVFbGVtZW50KFxuICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgaXRlbVVybDogP3N0cmluZyxcbiAgICBkZWZhdWx0QWN0aW9uOiA/T2JqZWN0LFxuICAgIGltYWdlVXJsOiA/c3RyaW5nLFxuICAgIHN1YnRpdGxlOiA/c3RyaW5nLFxuICAgIGJ1dHRvbnM6ID9BcnJheTxPYmplY3Q+LFxuICApOiBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50RWxlbWVudCB7XG4gICAgaW52YXJpYW50KCEoaXRlbVVybCAmJiBkZWZhdWx0QWN0aW9uKSwgJ09uZSBlbGVtZW50IGNhbm5vdCBoYXZlIGJvdGggZGVmYXVsdF9hY3Rpb24gYW5kIGl0ZW1fdXJsJyk7XG4gICAgY29uc3QgdmFsOiBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50RWxlbWVudCA9IHtcbiAgICAgICd0aXRsZSc6IHRpdGxlLFxuICAgIH07XG5cbiAgICBpZiAoaXRlbVVybCkge1xuICAgICAgdmFsLml0ZW1fdXJsID0gaXRlbVVybDtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHRBY3Rpb24pIHtcbiAgICAgIHZhbC5kZWZhdWx0X2FjdGlvbiA9IGRlZmF1bHRBY3Rpb247XG4gICAgfVxuICAgIGlmIChpbWFnZVVybCkge1xuICAgICAgdmFsLmltYWdlX3VybCA9IGltYWdlVXJsO1xuICAgIH1cbiAgICBpZiAoc3VidGl0bGUpIHtcbiAgICAgIHZhbC5zdWJ0aXRsZSA9IHN1YnRpdGxlO1xuICAgIH1cbiAgICBpZiAoYnV0dG9ucykge1xuICAgICAgdmFsLmJ1dHRvbnMgPSBidXR0b25zO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgY3JlYXRlSW1hZ2VBdHRhY2htZW50KHVybDogc3RyaW5nKTogTXVsdGltZWRpYUF0dGFjaG1lbnQge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdpbWFnZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVZpZGVvQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAndmlkZW8nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVGaWxlQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnZmlsZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUF1ZGlvQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnYXVkaW8nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9jYWwgQ2hhdCBBUElzIChmb3IgdW5pdCB0ZXN0aW5nIHB1cnBvc2VzKVxuICAgKi9cbiAgc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICBDaGF0VXRpbHMuc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwgdGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTogT2JqZWN0IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCk7XG4gIH1cblxuICBjbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIENoYXRVdGlscy5jbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk7XG4gIH1cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlc0ZvclVzZXIodXNlcklEOiBzdHJpbmcpOiA/QXJyYXk8T2JqZWN0PiB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5nZXRMb2NhbENoYXRNZXNzYWdlcygpW3VzZXJJRF07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQm90KCk7XG4iXX0=