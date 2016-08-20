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
            //Since a message containing a quick_reply can also contain text
            //and attachment, check for quick_reply first
            if (event.message.quick_reply) {
              _this3.emit('quick_reply', event);
              return; //Continue to next event
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
          // TODO: handle message delivery and authentication
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
      return this.send(recipientID, this.createImageAttachment(imageURL));
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
  }, {
    key: 'createImageAttachment',
    value: function createImageAttachment(imageURL) {
      return {
        'attachment': {
          'type': 'image',
          'payload': {
            'url': imageURL
          }
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
//# sourceMappingURL=data:application/json;base64,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Q0FFcUIsUSxFQUEwQjtBQUM5QyxhQUFPO0FBQ0wsc0JBQWM7QUFDWixrQkFBUSxPQURJO0FBRVoscUJBQVc7QUFDVCxtQkFBTztBQURFO0FBRkM7QUFEVCxPQUFQO0FBUUQ7O0FBRUQ7Ozs7OztpREFHNkIsUSxFQUFrQixJLEVBQW9CO0FBQ2pFLFVBQUksS0FBSyxhQUFULEVBQXdCO0FBQ3RCLDRCQUFVLDRCQUFWLENBQXVDLFFBQXZDLEVBQWlELElBQWpEO0FBQ0Q7QUFDRjs7OzJDQUU4QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixFQUFQO0FBQ0Q7Ozs2Q0FFOEI7QUFDN0IsV0FBSyx5QkFBTDtBQUNBLDBCQUFVLHNCQUFWO0FBQ0Q7OztnREFFMkIsTSxFQUFnQztBQUMxRCxXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixHQUFpQyxNQUFqQyxDQUFQO0FBQ0Q7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFJLEdBQUosRUFBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDaGF0VXRpbHMgZnJvbSAnLi9DaGF0VXRpbHMnO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ2V2ZW50cydcbmltcG9ydCBGQkxvY2FsQ2hhdFJvdXRlcyBmcm9tICcuL0ZCTG9jYWxDaGF0Um91dGVzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcblxuY2xhc3MgQm90IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgX3Rva2VuOiBzdHJpbmc7XG4gIF92ZXJpZnlUb2tlbjogc3RyaW5nO1xuICBfdXNlTG9jYWxDaGF0OiBib29sZWFuO1xuICBfaW5pdDogYm9vbGVhbjtcblxuICBfdmVyaWZ5SW5pdE9yVGhyb3coKTogdm9pZCB7XG4gICAgaW52YXJpYW50KHRoaXMuX2luaXQsICdQbGVhc2UgaW5pdGlhbGl6ZSB0aGUgQm90IGZpcnN0Jyk7XG4gIH1cblxuICBfdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl91c2VMb2NhbENoYXQsICdOb3QgaW4gbG9jYWwgY2hhdCBtb2RlJyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luaXQgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXQodG9rZW46IHN0cmluZywgdmVyZnlUb2tlbjogc3RyaW5nLCB1c2VMb2NhbENoYXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl90b2tlbiA9IHRva2VuO1xuICAgIHRoaXMuX3ZlcmlmeVRva2VuID0gdmVyZnlUb2tlbjtcbiAgICB0aGlzLl91c2VMb2NhbENoYXQgPSB1c2VMb2NhbENoYXQ7XG4gICAgdGhpcy5faW5pdCA9IHRydWU7XG4gIH1cblxuICByb3V0ZXIoKTogUm91dGVyIHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuXG4gICAgbGV0IHJvdXRlciA9IFJvdXRlcigpO1xuICAgIHJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGlmIChyZXEucXVlcnlbJ2h1Yi52ZXJpZnlfdG9rZW4nXSA9PT0gdGhpcy5fdmVyaWZ5VG9rZW4pIHtcbiAgICAgICAgcmVzLnNlbmQocmVxLnF1ZXJ5WydodWIuY2hhbGxlbmdlJ10pO1xuICAgICAgfVxuICAgICAgcmVzLnNlbmQoJ0Vycm9yLCB3cm9uZyB2YWxpZGF0aW9uIHRva2VuJyk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlKHJlcS5ib2R5KTtcbiAgICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gICAgfSk7XG5cbiAgICAvLyBhdHRhY2ggbG9jYWwgY2hhdCByb3V0ZXNcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICByb3V0ZXIgPSBGQkxvY2FsQ2hhdFJvdXRlcyhyb3V0ZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICBnZXRVc2VyUHJvZmlsZSgpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgaGFuZGxlTWVzc2FnZShkYXRhOiBPYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoZGF0YS5vYmplY3QgIT09ICdwYWdlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRhdGEuZW50cnkuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGVudHJ5Lm1lc3NhZ2luZy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAvLyBoYW5kbGUgbWVzc2FnZXNcbiAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UpIHtcbiAgICAgICAgICAvL1NpbmNlIGEgbWVzc2FnZSBjb250YWluaW5nIGEgcXVpY2tfcmVwbHkgY2FuIGFsc28gY29udGFpbiB0ZXh0XG4gICAgICAgICAgLy9hbmQgYXR0YWNobWVudCwgY2hlY2sgZm9yIHF1aWNrX3JlcGx5IGZpcnN0XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UucXVpY2tfcmVwbHkpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncXVpY2tfcmVwbHknLCBldmVudCk7XG4gICAgICAgICAgICByZXR1cm47IC8vQ29udGludWUgdG8gbmV4dCBldmVudFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXZlbnQubWVzc2FnZS50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3RleHQnLCBldmVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5tZXNzYWdlLmF0dGFjaG1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2F0dGFjaG1lbnRzJywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBwb3N0YmFja1xuICAgICAgICBpZiAoZXZlbnQucG9zdGJhY2sgJiYgZXZlbnQucG9zdGJhY2sucGF5bG9hZCkge1xuICAgICAgICAgIHRoaXMuZW1pdCgncG9zdGJhY2snLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIG1lc3NhZ2UgZGVsaXZlcnkgYW5kIGF1dGhlbnRpY2F0aW9uXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmQgQVBJc1xuICAgKi9cbiAgc2VuZChyZWNpcGllbnRJRDogc3RyaW5nLCBtZXNzYWdlRGF0YTogT2JqZWN0KTogUHJvbWlzZSB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLnNlbmQoXG4gICAgICByZWNpcGllbnRJRCxcbiAgICAgIHRoaXMuX3Rva2VuLFxuICAgICAgbWVzc2FnZURhdGEsXG4gICAgICB0aGlzLl91c2VMb2NhbENoYXQsXG4gICAgKTtcbiAgIH1cblxuICBzZW5kSW1hZ2UocmVjaXBpZW50SUQ6IHN0cmluZywgaW1hZ2VVUkw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIHRoaXMuY3JlYXRlSW1hZ2VBdHRhY2htZW50KGltYWdlVVJMKSk7XG4gIH1cblxuICBzZW5kVGV4dChyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgIHRleHQ6dGV4dCxcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgIH1cblxuICBzZW5kQnV0dG9ucyhyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIGJ1dHRvbkxpc3Q6IEFycmF5PE9iamVjdD4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICdhdHRhY2htZW50Jzoge1xuICAgICAgICAndHlwZSc6J3RlbXBsYXRlJyxcbiAgICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICAgJ3RlbXBsYXRlX3R5cGUnOiAnYnV0dG9uJyxcbiAgICAgICAgICAndGV4dCc6IHRleHQsXG4gICAgICAgICAgJ2J1dHRvbnMnOiBidXR0b25MaXN0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIHNlbmRUZW1wbGF0ZSgpOiB2b2lkIHtcbiAgIC8vIFRPRE9cbiAgfVxuXG4gIHNlbmRRdWlja1JlcGx5V2l0aEF0dGFjaG1lbnQocmVjaXBpZW50SUQ6IHN0cmluZywgYXR0YWNobWVudDogT2JqZWN0LCBxdWlja1JlcGx5TGlzdDogQXJyYXk8T2JqZWN0Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgJ2F0dGFjaG1lbnQnOiBhdHRhY2htZW50LFxuICAgICAgJ3F1aWNrX3JlcGxpZXMnOiBxdWlja1JlcGx5TGlzdCxcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICB9XG5cbiAgc2VuZFF1aWNrUmVwbHlXaXRoVGV4dChyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHF1aWNrUmVwbHlMaXN0OiBBcnJheTxPYmplY3Q+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAndGV4dCc6IHRleHQsXG4gICAgICAncXVpY2tfcmVwbGllcyc6IHF1aWNrUmVwbHlMaXN0LFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gIH1cblxuICBjcmVhdGVRdWlja1JlcGx5KHRleHQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2NvbnRlbnRfdHlwZSc6ICd0ZXh0JyxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAncGF5bG9hZCc6IHBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVBvc3RiYWNrQnV0dG9uKHRleHQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAncG9zdGJhY2snLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlV2ViQnV0dG9uKHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICd3ZWJfdXJsJyxcbiAgICAgICd1cmwnOiB1cmwsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVJbWFnZUF0dGFjaG1lbnQoaW1hZ2VVUkw6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdhdHRhY2htZW50Jzoge1xuICAgICAgICAndHlwZSc6ICdpbWFnZScsXG4gICAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAgICd1cmwnOiBpbWFnZVVSTCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbCBDaGF0IEFQSXMgKGZvciB1bml0IHRlc3RpbmcgcHVycG9zZXMpXG4gICAqL1xuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl91c2VMb2NhbENoYXQpIHtcbiAgICAgIENoYXRVdGlscy5zYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgQ2hhdFV0aWxzLmNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzRm9yVXNlcih1c2VySUQ6IHN0cmluZyk6ID9BcnJheTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKClbdXNlcklEXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCb3QoKTtcbiJdfQ==