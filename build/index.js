

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
    key: 'setPersistentMenu',
    value: function setPersistentMenu(menuDefinition) {
      _ChatUtils2.default.setPersistentMenu(menuDefinition);
    }
  }, {
    key: 'storePersistentMenu',
    value: function storePersistentMenu() {
      return _ChatUtils2.default.storePersistentMenu(this._token);
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
     * Helpers to create persistent menu
     */

  }, {
    key: 'createPersistentMenu',
    value: function createPersistentMenu(locale, composerInputDisabled, menuItems) {
      return {
        locale: locale,
        composer_input_disabled: composerInputDisabled,
        call_to_actions: menuItems
      };
    }
  }, {
    key: 'createNestedMenuItem',
    value: function createNestedMenuItem(title, menuItems) {
      return {
        title: title,
        type: 'nested',
        call_to_actions: menuItems
      };
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
//# sourceMappingURL=data:application/json;base64,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d0I7QUFDdEIsNEJBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsSUFBakQ7QUFDRDtBQUNGOzs7MkNBRThCO0FBQzdCLFdBQUsseUJBQUw7QUFDQSxhQUFPLG9CQUFVLG9CQUFWLEVBQVA7QUFDRDs7OzZDQUU4QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsMEJBQVUsc0JBQVY7QUFDRDs7O2dEQUUyQixNLEVBQWdDO0FBQzFELFdBQUsseUJBQUw7QUFDQSxhQUFPLG9CQUFVLG9CQUFWLEdBQWlDLE1BQWpDLENBQVA7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLElBQUksR0FBSixFQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IEZCTG9jYWxDaGF0Um91dGVzIGZyb20gJy4vRkJMb2NhbENoYXRSb3V0ZXMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgTXVsdGltZWRpYUF0dGFjaG1lbnQsXG4gIEJ1dHRvblRlbXBsYXRlQXR0YWNobWVudCxcbiAgR2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQsXG4gIEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnQsXG4gIExpc3RUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50LFxuICBMaXN0VGVtcGxhdGVBdHRhY2htZW50LFxuICBRdWlja1JlcGx5LFxuICBVUkxCdXR0b24sXG4gIFBvc3RiYWNrQnV0dG9uLFxuICBDYWxsQnV0dG9uLFxuICBTaGFyZUJ1dHRvbixcbiAgVGV4dFF1aWNrUmVwbHksXG4gIExvY2F0aW9uUXVpY2tSZXBseSxcbiAgQXR0YWNobWVudCxcbiAgQnV0dG9uLFxuICBNZXNzYWdlLFxuICBXZWJ2aWV3SGVpZ2h0UmF0aW8sXG4gIFNlbmRBY3Rpb25UeXBlLFxuICBQZXJzaXN0ZW50TWVudSxcbiAgUGVyc2lzdGVuTWVudUl0ZW0sXG4gIE5lc3RlZFBlcnNpc3RlbnRNZW51SXRlbSxcbn0gZnJvbSAnLi90eXBlJztcblxuY2xhc3MgQm90IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgX3Rva2VuOiBzdHJpbmc7XG4gIF92ZXJpZnlUb2tlbjogc3RyaW5nO1xuICBfdXNlTG9jYWxDaGF0OiBib29sZWFuO1xuICBfdXNlTWVzc2VuZ2VyOiBib29sZWFuO1xuICBfaW5pdDogYm9vbGVhbjtcblxuICBfdmVyaWZ5SW5pdE9yVGhyb3coKTogdm9pZCB7XG4gICAgaW52YXJpYW50KHRoaXMuX2luaXQsICdQbGVhc2UgaW5pdGlhbGl6ZSB0aGUgQm90IGZpcnN0Jyk7XG4gIH1cblxuICBfdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl91c2VMb2NhbENoYXQsICdOb3QgaW4gbG9jYWwgY2hhdCBtb2RlJyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luaXQgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXQoXG4gICAgdG9rZW46IHN0cmluZyxcbiAgICB2ZXJmeVRva2VuOiBzdHJpbmcsXG4gICAgdXNlTG9jYWxDaGF0OiBib29sZWFuID0gZmFsc2UsXG4gICAgdXNlTWVzc2VuZ2VyOiBib29sZWFuID0gdHJ1ZSxcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5fdG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLl92ZXJpZnlUb2tlbiA9IHZlcmZ5VG9rZW47XG4gICAgdGhpcy5fdXNlTG9jYWxDaGF0ID0gdXNlTG9jYWxDaGF0O1xuICAgIHRoaXMuX3VzZU1lc3NlbmdlciA9IHVzZU1lc3NlbmdlcjtcbiAgICB0aGlzLl9pbml0ID0gdHJ1ZTtcbiAgfVxuXG4gIHJvdXRlcigpOiBSb3V0ZXIge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG5cbiAgICBsZXQgcm91dGVyID0gUm91dGVyKCk7XG4gICAgcm91dGVyLmdldCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgaWYgKHJlcS5xdWVyeVsnaHViLnZlcmlmeV90b2tlbiddID09PSB0aGlzLl92ZXJpZnlUb2tlbikge1xuICAgICAgICByZXMuc2VuZChyZXEucXVlcnlbJ2h1Yi5jaGFsbGVuZ2UnXSk7XG4gICAgICB9XG4gICAgICByZXMuc2VuZCgnRXJyb3IsIHdyb25nIHZhbGlkYXRpb24gdG9rZW4nKTtcbiAgICB9KTtcblxuICAgIHJvdXRlci5wb3N0KCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZU1lc3NhZ2UocmVxLmJvZHkpO1xuICAgICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgICB9KTtcblxuICAgIC8vIGF0dGFjaCBsb2NhbCBjaGF0IHJvdXRlc1xuICAgIGlmICh0aGlzLl91c2VMb2NhbENoYXQpIHtcbiAgICAgIHJvdXRlciA9IEZCTG9jYWxDaGF0Um91dGVzKHJvdXRlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfVxuXG4gIGdldFVzZXJQcm9maWxlKGlkOiBzdHJpbmcpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgcmV0dXJuIHJwKHtcbiAgICAgIHVyaTogJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjYvJyArIGlkLFxuICAgICAgcXM6IHtcbiAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLl90b2tlbixcbiAgICAgICAgZmllbGRzOiAnZmlyc3RfbmFtZSxsYXN0X25hbWUscHJvZmlsZV9waWMsbG9jYWxlLHRpbWV6b25lLGdlbmRlcicsXG4gICAgICB9LFxuICAgICAganNvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2UoZGF0YTogT2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKGRhdGEub2JqZWN0ICE9PSAncGFnZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLmVudHJ5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyeS5tZXNzYWdpbmcuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgLy8gaGFuZGxlIG1lc3NhZ2VzXG4gICAgICAgIGlmIChldmVudC5tZXNzYWdlKSB7XG4gICAgICAgICAgLy8gU2luY2UgYSBtZXNzYWdlIGNvbnRhaW5pbmcgYSBxdWlja19yZXBseSBjYW4gYWxzbyBjb250YWluIHRleHRcbiAgICAgICAgICAvLyBhbmQgYXR0YWNobWVudCwgY2hlY2sgZm9yIHF1aWNrX3JlcGx5IGZpcnN0XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UucXVpY2tfcmVwbHkpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncXVpY2tfcmVwbHknLCBldmVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm1lc3NhZ2UuYXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYXR0YWNobWVudHMnLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBvc3RiYWNrXG4gICAgICAgIGlmIChldmVudC5wb3N0YmFjayAmJiBldmVudC5wb3N0YmFjay5wYXlsb2FkKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0YmFjaycsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBIYW5kbGUgYXV0aGVudGljYXRpb25cbiAgICAgICAgaWYgKGV2ZW50Lm9wdGluICYmIGV2ZW50Lm9wdGluLnJlZikge1xuICAgICAgICAgIHRoaXMuZW1pdCgnb3B0aW4nLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIG1lc3NhZ2UgZGVsaXZlcnlcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZCBBUElzXG4gICAqL1xuICBzZW5kKHJlY2lwaWVudElEOiBzdHJpbmcsIG1lc3NhZ2VEYXRhOiBNZXNzYWdlKTogUHJvbWlzZSB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLnNlbmQoXG4gICAgICByZWNpcGllbnRJRCxcbiAgICAgIHRoaXMuX3Rva2VuLFxuICAgICAge21lc3NhZ2U6IG1lc3NhZ2VEYXRhfSxcbiAgICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCxcbiAgICAgIHRoaXMuX3VzZU1lc3NlbmdlcixcbiAgICApO1xuICB9XG5cbiAgc2VuZFNlbmRlckFjdGlvbihyZWNpcGllbnRJRDogc3RyaW5nLCBhY3Rpb246IFNlbmRBY3Rpb25UeXBlKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIENoYXRVdGlscy5zZW5kKFxuICAgICAgcmVjaXBpZW50SUQsXG4gICAgICB0aGlzLl90b2tlbixcbiAgICAgIHtzZW5kZXJfYWN0aW9uOiBhY3Rpb259LFxuICAgICAgdGhpcy5fdXNlTG9jYWxDaGF0LFxuICAgICAgdGhpcy5fdXNlTWVzc2VuZ2VyLFxuICAgICk7XG4gIH1cblxuICBzZXRQZXJzaXN0ZW50TWVudShtZW51RGVmaW5pdGlvbjogQXJyYXk8UGVyc2lzdGVudE1lbnU+KTogdm9pZCB7XG4gICAgQ2hhdFV0aWxzLnNldFBlcnNpc3RlbnRNZW51KG1lbnVEZWZpbml0aW9uKTtcbiAgfVxuXG4gIHN0b3JlUGVyc2lzdGVudE1lbnUoKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIENoYXRVdGlscy5zdG9yZVBlcnNpc3RlbnRNZW51KHRoaXMuX3Rva2VuKTtcbiAgfVxuXG4gIHNlbmRUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIHt0ZXh0OiB0ZXh0fSk7XG4gIH1cblxuICBzZW5kQXR0YWNobWVudChyZWNpcGllbnRJRDogc3RyaW5nLCBhdHRhY2htZW50OiBBdHRhY2htZW50KTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgeydhdHRhY2htZW50JzogYXR0YWNobWVudH0pO1xuICB9XG5cbiAgc2VuZEltYWdlKHJlY2lwaWVudElEOiBzdHJpbmcsIHVybDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsdGhpcy5jcmVhdGVJbWFnZUF0dGFjaG1lbnQodXJsKSk7XG4gIH1cblxuICBzZW5kVmlkZW8ocmVjaXBpZW50SUQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgdGhpcy5jcmVhdGVWaWRlb0F0dGFjaG1lbnQodXJsKSk7XG4gIH1cblxuICBzZW5kRmlsZShyZWNpcGllbnRJRDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCB0aGlzLmNyZWF0ZUZpbGVBdHRhY2htZW50KHVybCkpO1xuICB9XG5cbiAgc2VuZEF1ZGlvKHJlY2lwaWVudElEOiBzdHJpbmcsIHVybDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIHRoaXMuY3JlYXRlQXVkaW9BdHRhY2htZW50KHVybCkpO1xuICB9XG5cbiAgc2VuZEJ1dHRvbnMocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nLCBidXR0b25zOiBBcnJheTxCdXR0b24+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgYXR0YWNobWVudDogQnV0dG9uVGVtcGxhdGVBdHRhY2htZW50ID0ge1xuICAgICAgJ3R5cGUnOid0ZW1wbGF0ZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3RlbXBsYXRlX3R5cGUnOiAnYnV0dG9uJyxcbiAgICAgICAgJ3RleHQnOiB0ZXh0LFxuICAgICAgICAnYnV0dG9ucyc6IGJ1dHRvbnMsXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIGF0dGFjaG1lbnQpO1xuICB9XG5cbiAgc2VuZEdlbmVyaWNUZW1wbGF0ZShyZWNpcGllbnRJRDogc3RyaW5nLCBlbGVtZW50czogQXJyYXk8R2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQ+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgYXR0YWNobWVudDogR2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudCA9IHtcbiAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd0ZW1wbGF0ZV90eXBlJzogJ2dlbmVyaWMnLFxuICAgICAgICAnZWxlbWVudHMnOiBlbGVtZW50cyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgYXR0YWNobWVudCk7XG4gIH1cblxuICBzZW5kTGlzdFRlbXBsYXRlKFxuICAgIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gICAgZWxlbWVudHM6IEFycmF5PExpc3RUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50PixcbiAgICB0b3BFbGVtZW50U3R5bGU/OiAnbGFyZ2UnIHwgJ2NvbXBhY3QnLFxuICAgIGJ1dHRvbnM/OiBBcnJheTxCdXR0b24+XG4gICk6IFByb21pc2Uge1xuICAgIGNvbnN0IGF0dGFjaG1lbnQ6IExpc3RUZW1wbGF0ZUF0dGFjaG1lbnQgPSB7XG4gICAgICAndHlwZSc6J3RlbXBsYXRlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdsaXN0JyxcbiAgICAgICAgJ2VsZW1lbnRzJzogZWxlbWVudHMsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBpZiAodG9wRWxlbWVudFN0eWxlKSB7XG4gICAgICBhdHRhY2htZW50LnBheWxvYWQudG9wX2VsZW1lbnRfc3R5bGUgPSB0b3BFbGVtZW50U3R5bGU7XG4gICAgfVxuICAgIGlmIChidXR0b25zKSB7XG4gICAgICBhdHRhY2htZW50LnBheWxvYWQuYnV0dG9ucyA9IGJ1dHRvbnM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCBhdHRhY2htZW50KTtcbiAgfVxuXG4gIHNlbmRRdWlja1JlcGx5V2l0aEF0dGFjaG1lbnQocmVjaXBpZW50SUQ6IHN0cmluZywgYXR0YWNobWVudDogT2JqZWN0LCBxdWlja1JlcGx5TGlzdDogQXJyYXk8UXVpY2tSZXBseT4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICdhdHRhY2htZW50JzogYXR0YWNobWVudCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIHNlbmRRdWlja1JlcGx5V2l0aFRleHQocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nLCBxdWlja1JlcGx5TGlzdDogQXJyYXk8UXVpY2tSZXBseT4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIC8qXG4gICAqIEhlbHBlcnMgdG8gY3JlYXRlIHBlcnNpc3RlbnQgbWVudVxuICAgKi9cbiAgY3JlYXRlUGVyc2lzdGVudE1lbnUobG9jYWxlOiBzdHJpbmcsIGNvbXBvc2VySW5wdXREaXNhYmxlZDogYm9vbGVhbiwgbWVudUl0ZW1zOiBBcnJheTxQZXJzaXN0ZW5NZW51SXRlbT4pOiBQZXJzaXN0ZW50TWVudSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvY2FsZTogbG9jYWxlLFxuICAgICAgY29tcG9zZXJfaW5wdXRfZGlzYWJsZWQ6IGNvbXBvc2VySW5wdXREaXNhYmxlZCxcbiAgICAgIGNhbGxfdG9fYWN0aW9uczogbWVudUl0ZW1zLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVOZXN0ZWRNZW51SXRlbSh0aXRsZTogc3RyaW5nLCBtZW51SXRlbXM6IEFycmF5PFBlcnNpc3Rlbk1lbnVJdGVtPik6IE5lc3RlZFBlcnNpc3RlbnRNZW51SXRlbSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHR5cGU6ICduZXN0ZWQnLFxuICAgICAgY2FsbF90b19hY3Rpb25zOiBtZW51SXRlbXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIEhlbHBlcnMgdG8gY3JlYXRlIGF0dGFjaG1lbnRcbiAgICovXG4gIGNyZWF0ZVF1aWNrUmVwbHkodGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBUZXh0UXVpY2tSZXBseSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdjb250ZW50X3R5cGUnOiAndGV4dCcsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVMb2NhdGlvblF1aWNrUmVwbGF5KCk6IExvY2F0aW9uUXVpY2tSZXBseSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRfdHlwZTogJ2xvY2F0aW9uJyxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlQ2FsbEJ1dHRvbih0ZXh0OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IENhbGxCdXR0b24ge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdwaG9uZV9udW1iZXInLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlUG9zdGJhY2tCdXR0b24odGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBQb3N0YmFja0J1dHRvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3Bvc3RiYWNrJyxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAncGF5bG9hZCc6IHBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVNoYXJlQnV0dG9uKCk6IFNoYXJlQnV0dG9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnZWxlbWVudF9zaGFyZScsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVVSTEJ1dHRvbihcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgaGVpZ2h0PzogV2Vidmlld0hlaWdodFJhdGlvID0gJ2Z1bGwnLFxuICAgIHVzZU1lc3NlbmdlckV4dGVuc2lvbnM/OiBib29sZWFuID0gZmFsc2UsXG4gICAgZmFsbGJhY2tVcmw/OiBzdHJpbmcsXG4gICk6IFVSTEJ1dHRvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3dlYl91cmwnLFxuICAgICAgJ3VybCc6IHVybCxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAnd2Vidmlld19oZWlnaHRfcmF0aW8nOiBoZWlnaHQsXG4gICAgICAnbWVzc2VuZ2VyX2V4dGVuc2lvbnMnOiB1c2VNZXNzZW5nZXJFeHRlbnNpb25zLFxuICAgICAgJ2ZhbGxiYWNrX3VybCc6IGZhbGxiYWNrVXJsLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVHZW5lcmljVGVtcGxhdGVFbGVtZW50KFxuICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgaXRlbVVybDogP3N0cmluZyxcbiAgICBkZWZhdWx0QWN0aW9uOiA/T2JqZWN0LFxuICAgIGltYWdlVXJsOiA/c3RyaW5nLFxuICAgIHN1YnRpdGxlOiA/c3RyaW5nLFxuICAgIGJ1dHRvbnM6ID9BcnJheTxPYmplY3Q+LFxuICApOiBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50RWxlbWVudCB7XG4gICAgaW52YXJpYW50KCEoaXRlbVVybCAmJiBkZWZhdWx0QWN0aW9uKSwgJ09uZSBlbGVtZW50IGNhbm5vdCBoYXZlIGJvdGggZGVmYXVsdF9hY3Rpb24gYW5kIGl0ZW1fdXJsJyk7XG4gICAgY29uc3QgdmFsOiBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50RWxlbWVudCA9IHtcbiAgICAgICd0aXRsZSc6IHRpdGxlLFxuICAgIH07XG5cbiAgICBpZiAoaXRlbVVybCkge1xuICAgICAgdmFsLml0ZW1fdXJsID0gaXRlbVVybDtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHRBY3Rpb24pIHtcbiAgICAgIHZhbC5kZWZhdWx0X2FjdGlvbiA9IGRlZmF1bHRBY3Rpb247XG4gICAgfVxuICAgIGlmIChpbWFnZVVybCkge1xuICAgICAgdmFsLmltYWdlX3VybCA9IGltYWdlVXJsO1xuICAgIH1cbiAgICBpZiAoc3VidGl0bGUpIHtcbiAgICAgIHZhbC5zdWJ0aXRsZSA9IHN1YnRpdGxlO1xuICAgIH1cbiAgICBpZiAoYnV0dG9ucykge1xuICAgICAgdmFsLmJ1dHRvbnMgPSBidXR0b25zO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgY3JlYXRlSW1hZ2VBdHRhY2htZW50KHVybDogc3RyaW5nKTogTXVsdGltZWRpYUF0dGFjaG1lbnQge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdpbWFnZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVZpZGVvQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAndmlkZW8nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVGaWxlQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnZmlsZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUF1ZGlvQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnYXVkaW8nLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9jYWwgQ2hhdCBBUElzIChmb3IgdW5pdCB0ZXN0aW5nIHB1cnBvc2VzKVxuICAgKi9cbiAgc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICBDaGF0VXRpbHMuc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwgdGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTogT2JqZWN0IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCk7XG4gIH1cblxuICBjbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIENoYXRVdGlscy5jbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk7XG4gIH1cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlc0ZvclVzZXIodXNlcklEOiBzdHJpbmcpOiA/QXJyYXk8T2JqZWN0PiB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5nZXRMb2NhbENoYXRNZXNzYWdlcygpW3VzZXJJRF07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQm90KCk7XG4iXX0=