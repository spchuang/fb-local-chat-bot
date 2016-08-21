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
//# sourceMappingURL=data:application/json;base64,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O0FBQzlDLGFBQU87QUFDTCxnQkFBUSxPQURIO0FBRUwsbUJBQVc7QUFDVCxpQkFBTztBQURFO0FBRk4sT0FBUDtBQU1EOztBQUVEOzs7Ozs7aURBRzZCLFEsRUFBa0IsSSxFQUFvQjtBQUNqRSxVQUFJLEtBQUssYUFBVCxFQUF3QjtBQUN0Qiw0QkFBVSw0QkFBVixDQUF1QyxRQUF2QyxFQUFpRCxJQUFqRDtBQUNEO0FBQ0Y7OzsyQ0FFOEI7QUFDN0IsV0FBSyx5QkFBTDtBQUNBLGFBQU8sb0JBQVUsb0JBQVYsRUFBUDtBQUNEOzs7NkNBRThCO0FBQzdCLFdBQUsseUJBQUw7QUFDQSwwQkFBVSxzQkFBVjtBQUNEOzs7Z0RBRTJCLE0sRUFBZ0M7QUFDMUQsV0FBSyx5QkFBTDtBQUNBLGFBQU8sb0JBQVUsb0JBQVYsR0FBaUMsTUFBakMsQ0FBUDtBQUNEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsSUFBSSxHQUFKLEVBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2hhdFV0aWxzIGZyb20gJy4vQ2hhdFV0aWxzJztcbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdldmVudHMnXG5pbXBvcnQgRkJMb2NhbENoYXRSb3V0ZXMgZnJvbSAnLi9GQkxvY2FsQ2hhdFJvdXRlcyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5cbmNsYXNzIEJvdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIF90b2tlbjogc3RyaW5nO1xuICBfdmVyaWZ5VG9rZW46IHN0cmluZztcbiAgX3VzZUxvY2FsQ2hhdDogYm9vbGVhbjtcbiAgX2luaXQ6IGJvb2xlYW47XG5cbiAgX3ZlcmlmeUluaXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl9pbml0LCAnUGxlYXNlIGluaXRpYWxpemUgdGhlIEJvdCBmaXJzdCcpO1xuICB9XG5cbiAgX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5fdXNlTG9jYWxDaGF0LCAnTm90IGluIGxvY2FsIGNoYXQgbW9kZScpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gIH1cblxuICBpbml0KHRva2VuOiBzdHJpbmcsIHZlcmZ5VG9rZW46IHN0cmluZywgdXNlTG9jYWxDaGF0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fdG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLl92ZXJpZnlUb2tlbiA9IHZlcmZ5VG9rZW47XG4gICAgdGhpcy5fdXNlTG9jYWxDaGF0ID0gdXNlTG9jYWxDaGF0O1xuICAgIHRoaXMuX2luaXQgPSB0cnVlO1xuICB9XG5cbiAgcm91dGVyKCk6IFJvdXRlciB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcblxuICAgIGxldCByb3V0ZXIgPSBSb3V0ZXIoKTtcbiAgICByb3V0ZXIuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBpZiAocmVxLnF1ZXJ5WydodWIudmVyaWZ5X3Rva2VuJ10gPT09IHRoaXMuX3ZlcmlmeVRva2VuKSB7XG4gICAgICAgIHJlcy5zZW5kKHJlcS5xdWVyeVsnaHViLmNoYWxsZW5nZSddKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZW5kKCdFcnJvciwgd3JvbmcgdmFsaWRhdGlvbiB0b2tlbicpO1xuICAgIH0pO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTWVzc2FnZShyZXEuYm9keSk7XG4gICAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICAgIH0pO1xuXG4gICAgLy8gYXR0YWNoIGxvY2FsIGNoYXQgcm91dGVzXG4gICAgaWYgKHRoaXMuX3VzZUxvY2FsQ2hhdCkge1xuICAgICAgcm91dGVyID0gRkJMb2NhbENoYXRSb3V0ZXMocm91dGVyLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9XG5cbiAgZ2V0VXNlclByb2ZpbGUoKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2UoZGF0YTogT2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKGRhdGEub2JqZWN0ICE9PSAncGFnZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLmVudHJ5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyeS5tZXNzYWdpbmcuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgLy8gaGFuZGxlIG1lc3NhZ2VzXG4gICAgICAgIGlmIChldmVudC5tZXNzYWdlKSB7XG4gICAgICAgICAgLy8gU2luY2UgYSBtZXNzYWdlIGNvbnRhaW5pbmcgYSBxdWlja19yZXBseSBjYW4gYWxzbyBjb250YWluIHRleHRcbiAgICAgICAgICAvLyBhbmQgYXR0YWNobWVudCwgY2hlY2sgZm9yIHF1aWNrX3JlcGx5IGZpcnN0XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UucXVpY2tfcmVwbHkpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncXVpY2tfcmVwbHknLCBldmVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm1lc3NhZ2UuYXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYXR0YWNobWVudHMnLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBvc3RiYWNrXG4gICAgICAgIGlmIChldmVudC5wb3N0YmFjayAmJiBldmVudC5wb3N0YmFjay5wYXlsb2FkKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0YmFjaycsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgbWVzc2FnZSBkZWxpdmVyeSBhbmQgYXV0aGVudGljYXRpb25cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZCBBUElzXG4gICAqL1xuICBzZW5kKHJlY2lwaWVudElEOiBzdHJpbmcsIG1lc3NhZ2VEYXRhOiBPYmplY3QpOiBQcm9taXNlIHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuc2VuZChcbiAgICAgIHJlY2lwaWVudElELFxuICAgICAgdGhpcy5fdG9rZW4sXG4gICAgICBtZXNzYWdlRGF0YSxcbiAgICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCxcbiAgICApO1xuICAgfVxuXG4gIHNlbmRJbWFnZShyZWNpcGllbnRJRDogc3RyaW5nLCBpbWFnZVVSTDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgdGhpcy5jcmVhdGVJbWFnZUF0dGFjaG1lbnQoaW1hZ2VVUkwpKTtcbiAgfVxuXG4gIHNlbmRUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgdGV4dDp0ZXh0LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICAgfVxuXG4gIHNlbmRCdXR0b25zKHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgYnV0dG9uTGlzdDogQXJyYXk8T2JqZWN0Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgJ2F0dGFjaG1lbnQnOiB7XG4gICAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdidXR0b24nLFxuICAgICAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICAgICAnYnV0dG9ucyc6IGJ1dHRvbkxpc3QsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICB9XG5cbiAgc2VuZFRlbXBsYXRlKCk6IHZvaWQge1xuICAgLy8gVE9ET1xuICB9XG5cbiAgc2VuZFF1aWNrUmVwbHlXaXRoQXR0YWNobWVudChyZWNpcGllbnRJRDogc3RyaW5nLCBhdHRhY2htZW50OiBPYmplY3QsIHF1aWNrUmVwbHlMaXN0OiBBcnJheTxPYmplY3Q+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAnYXR0YWNobWVudCc6IGF0dGFjaG1lbnQsXG4gICAgICAncXVpY2tfcmVwbGllcyc6IHF1aWNrUmVwbHlMaXN0LFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gIH1cblxuICBzZW5kUXVpY2tSZXBseVdpdGhUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgcXVpY2tSZXBseUxpc3Q6IEFycmF5PE9iamVjdD4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIGNyZWF0ZVF1aWNrUmVwbHkodGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAnY29udGVudF90eXBlJzogJ3RleHQnLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlUG9zdGJhY2tCdXR0b24odGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdwb3N0YmFjaycsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVXZWJCdXR0b24odGV4dDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3dlYl91cmwnLFxuICAgICAgJ3VybCc6IHVybCxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUltYWdlQXR0YWNobWVudChpbWFnZVVSTDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnaW1hZ2UnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiBpbWFnZVVSTCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbCBDaGF0IEFQSXMgKGZvciB1bml0IHRlc3RpbmcgcHVycG9zZXMpXG4gICAqL1xuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl91c2VMb2NhbENoYXQpIHtcbiAgICAgIENoYXRVdGlscy5zYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgQ2hhdFV0aWxzLmNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzRm9yVXNlcih1c2VySUQ6IHN0cmluZyk6ID9BcnJheTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKClbdXNlcklEXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCb3QoKTtcbiJdfQ==