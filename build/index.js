

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
    key: 'initBot',
    value: function initBot(token, verfyToken, useLocalChat) {
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
        router = (0, _FBLocalChatRoutes2.default)(router);
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
    value: function sendTemplate() {}
    // TODO


    /**
     * Local Chat APIs (for tests)
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
//# sourceMappingURL=data:application/json;base64,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QUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFdBQXZCLENBQVA7QUFDRDs7O2dDQUVXLFcsRUFBcUIsSSxFQUFjLFUsRUFBb0M7QUFDakYsVUFBTSxjQUFjO0FBQ2xCLHNCQUFjO0FBQ1osa0JBQU8sVUFESztBQUVaLHFCQUFXO0FBQ1QsNkJBQWlCLFFBRFI7QUFFVCxvQkFBUSxJQUZDO0FBR1QsdUJBQVc7QUFIRjtBQUZDO0FBREksT0FBcEI7QUFVQSxhQUFPLEtBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsV0FBdkIsQ0FBUDtBQUNEOzs7bUNBRW9CLENBRXBCOzs7Ozs7Ozs7OzJDQUs2QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixFQUFQO0FBQ0Q7Ozs2Q0FFOEI7QUFDN0IsV0FBSyx5QkFBTDtBQUNBLDBCQUFVLHNCQUFWO0FBQ0Q7OztnREFFMkIsTSxFQUFnQztBQUMxRCxXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixHQUFpQyxNQUFqQyxDQUFQO0FBQ0Q7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFJLEdBQUosRUFBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDaGF0VXRpbHMgZnJvbSAnLi9DaGF0VXRpbHMnO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ2V2ZW50cydcbmltcG9ydCBGQkxvY2FsQ2hhdFJvdXRlcyBmcm9tICcuL0ZCTG9jYWxDaGF0Um91dGVzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJzs7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5cbmNsYXNzIEJvdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIF90b2tlbjogc3RyaW5nO1xuICBfdmVyaWZ5VG9rZW46IHN0cmluZztcbiAgX3VzZUxvY2FsQ2hhdDogYm9vbGVhbjtcbiAgX2luaXQ6IGJvb2xlYW47XG5cbiAgX3ZlcmlmeUluaXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl9pbml0LCAnUGxlYXNlIGluaXRpYWxpemUgdGhlIEJvdCBmaXJzdCcpO1xuICB9XG5cbiAgX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5fdXNlTG9jYWxDaGF0LCAnTm90IGluIGxvY2FsIGNoYXQgbW9kZScpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gIH1cblxuICBpbml0Qm90KHRva2VuOiBzdHJpbmcsIHZlcmZ5VG9rZW46IHN0cmluZywgdXNlTG9jYWxDaGF0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fdG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLl92ZXJpZnlUb2tlbiA9IHZlcmZ5VG9rZW47XG4gICAgdGhpcy5fdXNlTG9jYWxDaGF0ID0gdXNlTG9jYWxDaGF0O1xuICAgIHRoaXMuX2luaXQgPSB0cnVlO1xuICB9XG5cbiAgcm91dGVyKCk6IFJvdXRlciB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcblxuICAgIGxldCByb3V0ZXIgPSBSb3V0ZXIoKTtcbiAgICByb3V0ZXIuZ2V0KCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBpZiAocmVxLnF1ZXJ5WydodWIudmVyaWZ5X3Rva2VuJ10gPT09IHRoaXMuX3ZlcmlmeVRva2VuKSB7XG4gICAgICAgIHJlcy5zZW5kKHJlcS5xdWVyeVsnaHViLmNoYWxsZW5nZSddKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZW5kKCdFcnJvciwgd3JvbmcgdmFsaWRhdGlvbiB0b2tlbicpO1xuICAgIH0pO1xuXG4gICAgcm91dGVyLnBvc3QoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTWVzc2FnZShyZXEuYm9keSk7XG4gICAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICAgIH0pO1xuXG4gICAgLy8gYXR0YWNoIGxvY2FsIGNoYXQgcm91dGVzXG4gICAgaWYgKHRoaXMuX3VzZUxvY2FsQ2hhdCkge1xuICAgICAgcm91dGVyID0gRkJMb2NhbENoYXRSb3V0ZXMocm91dGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm91dGVyO1xuICB9XG5cbiAgZ2V0VXNlclByb2ZpbGUoKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2UoZGF0YTogT2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKGRhdGEub2JqZWN0ICE9PSAncGFnZScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLmVudHJ5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyeS5tZXNzYWdpbmcuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgLy8gaGFuZGxlIG1lc3NhZ2VzXG4gICAgICAgIGlmIChldmVudC5tZXNzYWdlKSB7XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2UudGV4dCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0ZXh0JywgZXZlbnQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQubWVzc2FnZS5hdHRhY2htZW50cykge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdhdHRhY2htZW50cycsIGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgcG9zdGJhY2tcbiAgICAgICAgaWYgKGV2ZW50LnBvc3RiYWNrICYmIGV2ZW50LnBvc3RiYWNrLnBheWxvYWQpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ3Bvc3RiYWNrJywgZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIG1lc3NhZ2UgZGVsaXZlcnkgYW5kIGF1dGhlbnRpY2F0aW9uXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmQgQVBJc1xuICAgKi9cbiAgIHNlbmQocmVjaXBpZW50SUQ6IHN0cmluZywgbWVzc2FnZURhdGE6IE9iamVjdCk6IFByb21pc2Uge1xuICAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgICByZXR1cm4gQ2hhdFV0aWxzLnNlbmQoXG4gICAgICAgcmVjaXBpZW50SUQsXG4gICAgICAgdGhpcy5fdG9rZW4sXG4gICAgICAgbWVzc2FnZURhdGEsXG4gICAgICAgdGhpcy5fdXNlTG9jYWxDaGF0LFxuICAgICApO1xuICAgfVxuXG4gICBzZW5kSW1hZ2UocmVjaXBpZW50SUQ6IHN0cmluZywgaW1hZ2VVUkw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICBhdHRhY2htZW50OiB7XG4gICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICB1cmw6IGltYWdlVVJMLFxuICAgICAgICAgfSxcbiAgICAgICB9LFxuICAgICB9O1xuICAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gICB9XG5cbiAgIHNlbmRUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IFByb21pc2Uge1xuICAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICB0ZXh0OnRleHRcbiAgICAgfTtcbiAgICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICAgfVxuXG4gICBzZW5kQnV0dG9ucyhyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIGJ1dHRvbkxpc3Q6IEFycmF5PE9iamVjdD4pOiBQcm9taXNlIHtcbiAgICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAgJ2F0dGFjaG1lbnQnOiB7XG4gICAgICAgICAndHlwZSc6J3RlbXBsYXRlJyxcbiAgICAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdidXR0b24nLFxuICAgICAgICAgICAndGV4dCc6IHRleHQsXG4gICAgICAgICAgICdidXR0b25zJzogYnV0dG9uTGlzdCxcbiAgICAgICAgIH0sXG4gICAgICAgfSxcbiAgICAgfTtcbiAgICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICAgfVxuXG4gICBzZW5kVGVtcGxhdGUoKTogdm9pZCB7XG4gICAgIC8vIFRPRE9cbiAgIH1cblxuICAvKipcbiAgICogTG9jYWwgQ2hhdCBBUElzIChmb3IgdGVzdHMpXG4gICAqL1xuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgQ2hhdFV0aWxzLmNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTtcbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzRm9yVXNlcih1c2VySUQ6IHN0cmluZyk6ID9BcnJheTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKClbdXNlcklEXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCb3QoKTtcbiJdfQ==