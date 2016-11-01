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
    key: 'sendImage',
    value: function sendImage(recipientID, imageURL) {
      return this.send(recipientID, { 'attachment': this.createImageAttachment(imageURL) });
    }
  }, {
    key: 'sendText',
    value: function sendText(recipientID, text) {
      var messageData = {
        text: text
      };
      return this.send(recipientID, messageData);
    }
  }, {
    key: 'sendButtons',
    value: function sendButtons(recipientID, text, buttonList) {
      var messageData = {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'button',
            'text': text,
            'buttons': buttonList
          }
        }
      };
      return this.send(recipientID, messageData);
    }
  }, {
    key: 'sendTemplate',
    value: function sendTemplate() {
      // TODO
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
    key: 'createPostbackButton',
    value: function createPostbackButton(text, payload) {
      return {
        'type': 'postback',
        'title': text,
        'payload': payload
      };
    }
  }, {
    key: 'createWebButton',
    value: function createWebButton(text, url) {
      return {
        'type': 'web_url',
        'url': url,
        'title': text
      };
    }

    /**
     * For 'height' parameter, use 'compact' (1/2 screen), 'tall' (3/4 screen) or 'full'
     */

  }, {
    key: 'createWebviewButton',
    value: function createWebviewButton(text, url, height) {
      return {
        'type': 'web_url',
        'url': url,
        'title': text,
        'webview_height_ratio': height
      };
    }

    /**
     * To use this and enable extension, make sure to whitelist your domain and make sure it's https
     */

  }, {
    key: 'createWebviewButtonWithExtension',
    value: function createWebviewButtonWithExtension(text, url, height) {
      return {
        'type': 'web_url',
        'url': url,
        'title': text,
        'webview_height_ratio': height,
        "messenger_extensions": true
      };
    }
  }, {
    key: 'createImageAttachment',
    value: function createImageAttachment(imageURL) {
      return {
        'type': 'image',
        'payload': {
          'url': imageURL
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
//# sourceMappingURL=data:application/json;base64,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QUFQO0FBS0Q7OztvQ0FFZSxJLEVBQWMsRyxFQUFxQjtBQUNqRCxhQUFPO0FBQ0wsZ0JBQVEsU0FESDtBQUVMLGVBQU8sR0FGRjtBQUdMLGlCQUFTO0FBSEosT0FBUDtBQUtEOztBQUVEOzs7Ozs7d0NBR29CLEksRUFBYyxHLEVBQWEsTSxFQUF3QjtBQUNyRSxhQUFPO0FBQ0wsZ0JBQVEsU0FESDtBQUVMLGVBQU8sR0FGRjtBQUdMLGlCQUFTLElBSEo7QUFJTCxnQ0FBd0I7QUFKbkIsT0FBUDtBQU1EOztBQUVEOzs7Ozs7cURBR2lDLEksRUFBYyxHLEVBQWEsTSxFQUF3QjtBQUNsRixhQUFPO0FBQ0wsZ0JBQVEsU0FESDtBQUVMLGVBQU8sR0FGRjtBQUdMLGlCQUFTLElBSEo7QUFJTCxnQ0FBd0IsTUFKbkI7QUFLTCxnQ0FBd0I7QUFMbkIsT0FBUDtBQU9EOzs7MENBRXFCLFEsRUFBMEI7QUFDOUMsYUFBTztBQUNMLGdCQUFRLE9BREg7QUFFTCxtQkFBVztBQUNULGlCQUFPO0FBREU7QUFGTixPQUFQO0FBTUQ7O0FBRUQ7Ozs7OztpREFHNkIsUSxFQUFrQixJLEVBQW9CO0FBQ2pFLFVBQUksS0FBSyxhQUFULEVBQXdCO0FBQ3RCLDRCQUFVLDRCQUFWLENBQXVDLFFBQXZDLEVBQWlELElBQWpEO0FBQ0Q7QUFDRjs7OzJDQUU4QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixFQUFQO0FBQ0Q7Ozs2Q0FFOEI7QUFDN0IsV0FBSyx5QkFBTDtBQUNBLDBCQUFVLHNCQUFWO0FBQ0Q7OztnREFFMkIsTSxFQUFnQztBQUMxRCxXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixHQUFpQyxNQUFqQyxDQUFQO0FBQ0Q7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFJLEdBQUosRUFBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDaGF0VXRpbHMgZnJvbSAnLi9DaGF0VXRpbHMnO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ2V2ZW50cydcbmltcG9ydCBGQkxvY2FsQ2hhdFJvdXRlcyBmcm9tICcuL0ZCTG9jYWxDaGF0Um91dGVzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcblxuY2xhc3MgQm90IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgX3Rva2VuOiBzdHJpbmc7XG4gIF92ZXJpZnlUb2tlbjogc3RyaW5nO1xuICBfdXNlTG9jYWxDaGF0OiBib29sZWFuO1xuICBfaW5pdDogYm9vbGVhbjtcblxuICBfdmVyaWZ5SW5pdE9yVGhyb3coKTogdm9pZCB7XG4gICAgaW52YXJpYW50KHRoaXMuX2luaXQsICdQbGVhc2UgaW5pdGlhbGl6ZSB0aGUgQm90IGZpcnN0Jyk7XG4gIH1cblxuICBfdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl91c2VMb2NhbENoYXQsICdOb3QgaW4gbG9jYWwgY2hhdCBtb2RlJyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luaXQgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXQodG9rZW46IHN0cmluZywgdmVyZnlUb2tlbjogc3RyaW5nLCB1c2VMb2NhbENoYXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl90b2tlbiA9IHRva2VuO1xuICAgIHRoaXMuX3ZlcmlmeVRva2VuID0gdmVyZnlUb2tlbjtcbiAgICB0aGlzLl91c2VMb2NhbENoYXQgPSB1c2VMb2NhbENoYXQ7XG4gICAgdGhpcy5faW5pdCA9IHRydWU7XG4gIH1cblxuICByb3V0ZXIoKTogUm91dGVyIHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuXG4gICAgbGV0IHJvdXRlciA9IFJvdXRlcigpO1xuICAgIHJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGlmIChyZXEucXVlcnlbJ2h1Yi52ZXJpZnlfdG9rZW4nXSA9PT0gdGhpcy5fdmVyaWZ5VG9rZW4pIHtcbiAgICAgICAgcmVzLnNlbmQocmVxLnF1ZXJ5WydodWIuY2hhbGxlbmdlJ10pO1xuICAgICAgfVxuICAgICAgcmVzLnNlbmQoJ0Vycm9yLCB3cm9uZyB2YWxpZGF0aW9uIHRva2VuJyk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlKHJlcS5ib2R5KTtcbiAgICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gICAgfSk7XG5cbiAgICAvLyBhdHRhY2ggbG9jYWwgY2hhdCByb3V0ZXNcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICByb3V0ZXIgPSBGQkxvY2FsQ2hhdFJvdXRlcyhyb3V0ZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICBnZXRVc2VyUHJvZmlsZSgpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgaGFuZGxlTWVzc2FnZShkYXRhOiBPYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoZGF0YS5vYmplY3QgIT09ICdwYWdlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRhdGEuZW50cnkuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGVudHJ5Lm1lc3NhZ2luZy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAvLyBoYW5kbGUgbWVzc2FnZXNcbiAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UpIHtcbiAgICAgICAgICAvLyBTaW5jZSBhIG1lc3NhZ2UgY29udGFpbmluZyBhIHF1aWNrX3JlcGx5IGNhbiBhbHNvIGNvbnRhaW4gdGV4dFxuICAgICAgICAgIC8vIGFuZCBhdHRhY2htZW50LCBjaGVjayBmb3IgcXVpY2tfcmVwbHkgZmlyc3RcbiAgICAgICAgICBpZiAoZXZlbnQubWVzc2FnZS5xdWlja19yZXBseSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdxdWlja19yZXBseScsIGV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UudGV4dCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0ZXh0JywgZXZlbnQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubWVzc2FnZS5hdHRhY2htZW50cykge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdhdHRhY2htZW50cycsIGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgcG9zdGJhY2tcbiAgICAgICAgaWYgKGV2ZW50LnBvc3RiYWNrICYmIGV2ZW50LnBvc3RiYWNrLnBheWxvYWQpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ3Bvc3RiYWNrJywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEhhbmRsZSBhdXRoZW50aWNhdGlvblxuICAgICAgICBpZiAoZXZlbnQub3B0aW4gJiYgZXZlbnQub3B0aW4ucmVmKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdvcHRpbicsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgbWVzc2FnZSBkZWxpdmVyeVxuICAgICAgfSlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZW5kIEFQSXNcbiAgICovXG4gIHNlbmQocmVjaXBpZW50SUQ6IHN0cmluZywgbWVzc2FnZURhdGE6IE9iamVjdCk6IFByb21pc2Uge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5zZW5kKFxuICAgICAgcmVjaXBpZW50SUQsXG4gICAgICB0aGlzLl90b2tlbixcbiAgICAgIG1lc3NhZ2VEYXRhLFxuICAgICAgdGhpcy5fdXNlTG9jYWxDaGF0LFxuICAgICk7XG4gICB9XG5cbiAgc2VuZEltYWdlKHJlY2lwaWVudElEOiBzdHJpbmcsIGltYWdlVVJMOiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCB7J2F0dGFjaG1lbnQnOiB0aGlzLmNyZWF0ZUltYWdlQXR0YWNobWVudChpbWFnZVVSTCl9KTtcbiAgfVxuXG4gIHNlbmRUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgdGV4dDp0ZXh0LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICAgfVxuXG4gIHNlbmRCdXR0b25zKHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgYnV0dG9uTGlzdDogQXJyYXk8T2JqZWN0Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgJ2F0dGFjaG1lbnQnOiB7XG4gICAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdidXR0b24nLFxuICAgICAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICAgICAnYnV0dG9ucyc6IGJ1dHRvbkxpc3QsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICB9XG5cbiAgc2VuZFRlbXBsYXRlKCk6IHZvaWQge1xuICAgLy8gVE9ET1xuICB9XG5cbiAgc2VuZFF1aWNrUmVwbHlXaXRoQXR0YWNobWVudChyZWNpcGllbnRJRDogc3RyaW5nLCBhdHRhY2htZW50OiBPYmplY3QsIHF1aWNrUmVwbHlMaXN0OiBBcnJheTxPYmplY3Q+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAnYXR0YWNobWVudCc6IGF0dGFjaG1lbnQsXG4gICAgICAncXVpY2tfcmVwbGllcyc6IHF1aWNrUmVwbHlMaXN0LFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gIH1cblxuICBzZW5kUXVpY2tSZXBseVdpdGhUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgcXVpY2tSZXBseUxpc3Q6IEFycmF5PE9iamVjdD4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIGNyZWF0ZVF1aWNrUmVwbHkodGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAnY29udGVudF90eXBlJzogJ3RleHQnLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlUG9zdGJhY2tCdXR0b24odGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdwb3N0YmFjaycsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVXZWJCdXR0b24odGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3dlYl91cmwnLFxuICAgICAgJ3VybCc6IHVybCxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgJ2hlaWdodCcgcGFyYW1ldGVyLCB1c2UgJ2NvbXBhY3QnICgxLzIgc2NyZWVuKSwgJ3RhbGwnICgzLzQgc2NyZWVuKSBvciAnZnVsbCdcbiAgICovXG4gIGNyZWF0ZVdlYnZpZXdCdXR0b24odGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZywgaGVpZ2h0OiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICd3ZWJfdXJsJyxcbiAgICAgICd1cmwnOiB1cmwsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3dlYnZpZXdfaGVpZ2h0X3JhdGlvJzogaGVpZ2h0LFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyB1c2UgdGhpcyBhbmQgZW5hYmxlIGV4dGVuc2lvbiwgbWFrZSBzdXJlIHRvIHdoaXRlbGlzdCB5b3VyIGRvbWFpbiBhbmQgbWFrZSBzdXJlIGl0J3MgaHR0cHNcbiAgICovXG4gIGNyZWF0ZVdlYnZpZXdCdXR0b25XaXRoRXh0ZW5zaW9uKHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmcsIGhlaWdodDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnd2ViX3VybCcsXG4gICAgICAndXJsJzogdXJsLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICd3ZWJ2aWV3X2hlaWdodF9yYXRpbyc6IGhlaWdodCxcbiAgICAgIFwibWVzc2VuZ2VyX2V4dGVuc2lvbnNcIjogdHJ1ZSxcbiAgICB9XG4gIH1cblxuICBjcmVhdGVJbWFnZUF0dGFjaG1lbnQoaW1hZ2VVUkw6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ2ltYWdlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndXJsJzogaW1hZ2VVUkwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9jYWwgQ2hhdCBBUElzIChmb3IgdW5pdCB0ZXN0aW5nIHB1cnBvc2VzKVxuICAgKi9cbiAgc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICBDaGF0VXRpbHMuc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwgdGV4dCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTogT2JqZWN0IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCk7XG4gIH1cblxuICBjbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIENoYXRVdGlscy5jbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk7XG4gIH1cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlc0ZvclVzZXIodXNlcklEOiBzdHJpbmcpOiA/QXJyYXk8T2JqZWN0PiB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5nZXRMb2NhbENoYXRNZXNzYWdlcygpW3VzZXJJRF07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQm90KCk7XG4iXX0=