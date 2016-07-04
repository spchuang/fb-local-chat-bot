

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

;

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
      var messageData = {
        attachment: {
          type: 'image',
          payload: {
            url: imageURL
          }
        }
      };
      return this.send(recipientID, messageData);
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
     * Local Chat APIs (for unit testing purposes)
     */

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
//# sourceMappingURL=data:application/json;base64,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QUdBLGFBQU8sS0FBSyxJQUFMLENBQVUsV0FBVixFQUF1QixXQUF2QixDQUFQO0FBQ0Q7OztnQ0FFVyxXLEVBQXFCLEksRUFBYyxVLEVBQW9DO0FBQ2pGLFVBQU0sY0FBYztBQUNsQixzQkFBYztBQUNaLGtCQUFPLFVBREs7QUFFWixxQkFBVztBQUNULDZCQUFpQixRQURSO0FBRVQsb0JBQVEsSUFGQztBQUdULHVCQUFXO0FBSEY7QUFGQztBQURJLE9BQXBCO0FBVUEsYUFBTyxLQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFdBQXZCLENBQVA7QUFDRDs7O21DQUVvQjs7QUFFcEI7Ozt5Q0FFbUIsSSxFQUFjLE8sRUFBeUI7QUFDMUQsYUFBTztBQUNMLGdCQUFRLFVBREg7QUFFTCxpQkFBUyxJQUZKO0FBR0wsbUJBQVc7QUFITixPQUFQO0FBS0Q7OztvQ0FFZSxJLEVBQWMsRyxFQUFxQjtBQUNqRCxhQUFPO0FBQ0wsZ0JBQVEsU0FESDtBQUVMLGVBQU8sR0FGRjtBQUdMLGlCQUFTO0FBSEosT0FBUDtBQUtEOzs7Ozs7OzsyQ0FNOEI7QUFDN0IsV0FBSyx5QkFBTDtBQUNBLGFBQU8sb0JBQVUsb0JBQVYsRUFBUDtBQUNEOzs7NkNBRThCO0FBQzdCLFdBQUsseUJBQUw7QUFDQSwwQkFBVSxzQkFBVjtBQUNEOzs7Z0RBRTJCLE0sRUFBZ0M7QUFDMUQsV0FBSyx5QkFBTDtBQUNBLGFBQU8sb0JBQVUsb0JBQVYsR0FBaUMsTUFBakMsQ0FBUDtBQUNEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsSUFBSSxHQUFKLEVBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2hhdFV0aWxzIGZyb20gJy4vQ2hhdFV0aWxzJztcbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdldmVudHMnXG5pbXBvcnQgRkJMb2NhbENoYXRSb3V0ZXMgZnJvbSAnLi9GQkxvY2FsQ2hhdFJvdXRlcyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnZXhwcmVzcyc7O1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5jbGFzcyBCb3QgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBfdG9rZW46IHN0cmluZztcbiAgX3ZlcmlmeVRva2VuOiBzdHJpbmc7XG4gIF91c2VMb2NhbENoYXQ6IGJvb2xlYW47XG4gIF9pbml0OiBib29sZWFuO1xuXG4gIF92ZXJpZnlJbml0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5faW5pdCwgJ1BsZWFzZSBpbml0aWFsaXplIHRoZSBCb3QgZmlyc3QnKTtcbiAgfVxuXG4gIF92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTogdm9pZCB7XG4gICAgaW52YXJpYW50KHRoaXMuX3VzZUxvY2FsQ2hhdCwgJ05vdCBpbiBsb2NhbCBjaGF0IG1vZGUnKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW5pdCA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdCh0b2tlbjogc3RyaW5nLCB2ZXJmeVRva2VuOiBzdHJpbmcsIHVzZUxvY2FsQ2hhdDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3Rva2VuID0gdG9rZW47XG4gICAgdGhpcy5fdmVyaWZ5VG9rZW4gPSB2ZXJmeVRva2VuO1xuICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCA9IHVzZUxvY2FsQ2hhdDtcbiAgICB0aGlzLl9pbml0ID0gdHJ1ZTtcbiAgfVxuXG4gIHJvdXRlcigpOiBSb3V0ZXIge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG5cbiAgICBsZXQgcm91dGVyID0gUm91dGVyKCk7XG4gICAgcm91dGVyLmdldCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgaWYgKHJlcS5xdWVyeVsnaHViLnZlcmlmeV90b2tlbiddID09PSB0aGlzLl92ZXJpZnlUb2tlbikge1xuICAgICAgICByZXMuc2VuZChyZXEucXVlcnlbJ2h1Yi5jaGFsbGVuZ2UnXSk7XG4gICAgICB9XG4gICAgICByZXMuc2VuZCgnRXJyb3IsIHdyb25nIHZhbGlkYXRpb24gdG9rZW4nKTtcbiAgICB9KTtcblxuICAgIHJvdXRlci5wb3N0KCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZU1lc3NhZ2UocmVxLmJvZHkpO1xuICAgICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgICB9KTtcblxuICAgIC8vIGF0dGFjaCBsb2NhbCBjaGF0IHJvdXRlc1xuICAgIGlmICh0aGlzLl91c2VMb2NhbENoYXQpIHtcbiAgICAgIHJvdXRlciA9IEZCTG9jYWxDaGF0Um91dGVzKHJvdXRlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfVxuXG4gIGdldFVzZXJQcm9maWxlKCk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcbiAgICAvLyBUT0RPXG4gIH1cblxuICBoYW5kbGVNZXNzYWdlKGRhdGE6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmIChkYXRhLm9iamVjdCAhPT0gJ3BhZ2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGF0YS5lbnRyeS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgZW50cnkubWVzc2FnaW5nLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIGhhbmRsZSBtZXNzYWdlc1xuICAgICAgICBpZiAoZXZlbnQubWVzc2FnZSkge1xuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm1lc3NhZ2UuYXR0YWNobWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnYXR0YWNobWVudHMnLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBvc3RiYWNrXG4gICAgICAgIGlmIChldmVudC5wb3N0YmFjayAmJiBldmVudC5wb3N0YmFjay5wYXlsb2FkKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0YmFjaycsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBoYW5kbGUgbWVzc2FnZSBkZWxpdmVyeSBhbmQgYXV0aGVudGljYXRpb25cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZCBBUElzXG4gICAqL1xuICAgc2VuZChyZWNpcGllbnRJRDogc3RyaW5nLCBtZXNzYWdlRGF0YTogT2JqZWN0KTogUHJvbWlzZSB7XG4gICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgIHJldHVybiBDaGF0VXRpbHMuc2VuZChcbiAgICAgICByZWNpcGllbnRJRCxcbiAgICAgICB0aGlzLl90b2tlbixcbiAgICAgICBtZXNzYWdlRGF0YSxcbiAgICAgICB0aGlzLl91c2VMb2NhbENoYXQsXG4gICAgICk7XG4gICB9XG5cbiAgIHNlbmRJbWFnZShyZWNpcGllbnRJRDogc3RyaW5nLCBpbWFnZVVSTDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgIGF0dGFjaG1lbnQ6IHtcbiAgICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgIHVybDogaW1hZ2VVUkwsXG4gICAgICAgICB9LFxuICAgICAgIH0sXG4gICAgIH07XG4gICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgIH1cblxuICAgc2VuZFRleHQocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgIHRleHQ6dGV4dFxuICAgICB9O1xuICAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gICB9XG5cbiAgIHNlbmRCdXR0b25zKHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgYnV0dG9uTGlzdDogQXJyYXk8T2JqZWN0Pik6IFByb21pc2Uge1xuICAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICAnYXR0YWNobWVudCc6IHtcbiAgICAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICAgICd0ZW1wbGF0ZV90eXBlJzogJ2J1dHRvbicsXG4gICAgICAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICAgICAgJ2J1dHRvbnMnOiBidXR0b25MaXN0LFxuICAgICAgICAgfSxcbiAgICAgICB9LFxuICAgICB9O1xuICAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gICB9XG5cbiAgIHNlbmRUZW1wbGF0ZSgpOiB2b2lkIHtcbiAgICAgLy8gVE9ET1xuICAgfVxuXG4gIGNyZWF0ZVBvc3RiYWNrQnV0dG9uKHRleHQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAncG9zdGJhY2snLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlV2ViQnV0dG9uKHRleHQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICd3ZWJfdXJsJyxcbiAgICAgICd1cmwnOiB1cmwsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9jYWwgQ2hhdCBBUElzIChmb3IgdW5pdCB0ZXN0aW5nIHB1cnBvc2VzKVxuICAgKi9cblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgQ2hhdFV0aWxzLmNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzRm9yVXNlcih1c2VySUQ6IHN0cmluZyk6ID9BcnJheTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKClbdXNlcklEXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCb3QoKTtcbiJdfQ==