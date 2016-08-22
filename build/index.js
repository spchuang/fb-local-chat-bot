

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLEc7Ozs7O3lDQU11QjtBQUN6QiwrQkFBVSxLQUFLLEtBQWYsRUFBc0IsaUNBQXRCO0FBQ0Q7OztnREFFaUM7QUFDaEMsK0JBQVUsS0FBSyxhQUFmLEVBQThCLHdCQUE5QjtBQUNEOzs7QUFFRCxpQkFBYztBQUFBOztBQUFBOztBQUVaLFVBQUssS0FBTCxHQUFhLEtBQWI7QUFGWTtBQUdiOzs7O3lCQUVJLEssRUFBZSxVLEVBQW9CLFksRUFBNkI7QUFDbkUsV0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFdBQUssWUFBTCxHQUFvQixVQUFwQjtBQUNBLFdBQUssYUFBTCxHQUFxQixZQUFyQjtBQUNBLFdBQUssS0FBTCxHQUFhLElBQWI7QUFDRDs7OzZCQUVnQjtBQUFBOztBQUNmLFdBQUssa0JBQUw7O0FBRUEsVUFBSSxTQUFTLHNCQUFiO0FBQ0EsYUFBTyxHQUFQLENBQVcsR0FBWCxFQUFnQixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDNUIsWUFBSSxJQUFJLEtBQUosQ0FBVSxrQkFBVixNQUFrQyxPQUFLLFlBQTNDLEVBQXlEO0FBQ3ZELGNBQUksSUFBSixDQUFTLElBQUksS0FBSixDQUFVLGVBQVYsQ0FBVDtBQUNEO0FBQ0QsWUFBSSxJQUFKLENBQVMsK0JBQVQ7QUFDRCxPQUxEOztBQU9BLGFBQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQzdCLGVBQUssYUFBTCxDQUFtQixJQUFJLElBQXZCO0FBQ0EsWUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELE9BSEQ7OztBQU1BLFVBQUksS0FBSyxhQUFULEVBQXdCO0FBQ3RCLGlCQUFTLGlDQUFrQixNQUFsQixFQUEwQixJQUExQixDQUFUO0FBQ0Q7O0FBRUQsYUFBTyxNQUFQO0FBQ0Q7OztxQ0FFaUM7QUFDaEMsV0FBSyxrQkFBTDs7QUFFRDs7O2tDQUVhLEksRUFBb0I7QUFBQTs7QUFDaEMsVUFBSSxLQUFLLE1BQUwsS0FBZ0IsTUFBcEIsRUFBNEI7QUFDMUI7QUFDRDs7QUFFRCxXQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFVBQUMsS0FBRCxFQUFXO0FBQzVCLGNBQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixVQUFDLEtBQUQsRUFBVzs7QUFFakMsY0FBSSxNQUFNLE9BQVYsRUFBbUI7OztBQUdqQixnQkFBSSxNQUFNLE9BQU4sQ0FBYyxXQUFsQixFQUErQjtBQUM3QixxQkFBSyxJQUFMLENBQVUsYUFBVixFQUF5QixLQUF6QjtBQUNBO0FBQ0Q7QUFDRCxnQkFBSSxNQUFNLE9BQU4sQ0FBYyxJQUFsQixFQUF3QjtBQUN0QixxQkFBSyxJQUFMLENBQVUsTUFBVixFQUFrQixLQUFsQjtBQUNELGFBRkQsTUFFTyxJQUFJLE1BQU0sT0FBTixDQUFjLFdBQWxCLEVBQStCO0FBQ3BDLHFCQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLEtBQXpCO0FBQ0Q7QUFDRjs7O0FBR0QsY0FBSSxNQUFNLFFBQU4sSUFBa0IsTUFBTSxRQUFOLENBQWUsT0FBckMsRUFBOEM7QUFDNUMsbUJBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsS0FBdEI7QUFDRDs7QUFFRixTQXJCRDtBQXNCRCxPQXZCRDtBQXdCRDs7Ozs7Ozs7eUJBS0ksVyxFQUFxQixXLEVBQThCO0FBQ3RELFdBQUssa0JBQUw7QUFDQSxhQUFPLG9CQUFVLElBQVYsQ0FDTCxXQURLLEVBRUwsS0FBSyxNQUZBLEVBR0wsV0FISyxFQUlMLEtBQUssYUFKQSxDQUFQO0FBTUE7Ozs4QkFFUSxXLEVBQXFCLFEsRUFBMkI7QUFDeEQsYUFBTyxLQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLEVBQUMsY0FBYyxLQUFLLHFCQUFMLENBQTJCLFFBQTNCLENBQWYsRUFBdkIsQ0FBUDtBQUNEOzs7NkJBRVEsVyxFQUFxQixJLEVBQXVCO0FBQ25ELFVBQU0sY0FBYztBQUNsQixjQUFLO0FBRGEsT0FBcEI7QUFHQSxhQUFPLEtBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsV0FBdkIsQ0FBUDtBQUNBOzs7Z0NBRVUsVyxFQUFxQixJLEVBQWMsVSxFQUFvQztBQUNqRixVQUFNLGNBQWM7QUFDbEIsc0JBQWM7QUFDWixrQkFBTyxVQURLO0FBRVoscUJBQVc7QUFDVCw2QkFBaUIsUUFEUjtBQUVULG9CQUFRLElBRkM7QUFHVCx1QkFBVztBQUhGO0FBRkM7QUFESSxPQUFwQjtBQVVBLGFBQU8sS0FBSyxJQUFMLENBQVUsV0FBVixFQUF1QixXQUF2QixDQUFQO0FBQ0Q7OzttQ0FFb0I7O0FBRXBCOzs7aURBRTRCLFcsRUFBcUIsVSxFQUFvQixjLEVBQXdDO0FBQzVHLFVBQU0sY0FBYztBQUNsQixzQkFBYyxVQURJO0FBRWxCLHlCQUFpQjtBQUZDLE9BQXBCO0FBSUEsYUFBTyxLQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFdBQXZCLENBQVA7QUFDRDs7OzJDQUVzQixXLEVBQXFCLEksRUFBYyxjLEVBQXdDO0FBQ2hHLFVBQU0sY0FBYztBQUNsQixnQkFBUSxJQURVO0FBRWxCLHlCQUFpQjtBQUZDLE9BQXBCO0FBSUEsYUFBTyxLQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFdBQXZCLENBQVA7QUFDRDs7O3FDQUVnQixJLEVBQWMsTyxFQUF5QjtBQUN0RCxhQUFPO0FBQ0wsd0JBQWdCLE1BRFg7QUFFTCxpQkFBUyxJQUZKO0FBR0wsbUJBQVc7QUFITixPQUFQO0FBS0Q7Ozt5Q0FFb0IsSSxFQUFjLE8sRUFBeUI7QUFDMUQsYUFBTztBQUNMLGdCQUFRLFVBREg7QUFFTCxpQkFBUyxJQUZKO0FBR0wsbUJBQVc7QUFITixPQUFQO0FBS0Q7OztvQ0FFZSxJLEVBQWMsRyxFQUFxQjtBQUNqRCxhQUFPO0FBQ0wsZ0JBQVEsU0FESDtBQUVMLGVBQU8sR0FGRjtBQUdMLGlCQUFTO0FBSEosT0FBUDtBQUtEOzs7MENBRXFCLFEsRUFBMEI7QUFDOUMsYUFBTztBQUNMLGdCQUFRLE9BREg7QUFFTCxtQkFBVztBQUNULGlCQUFPO0FBREU7QUFGTixPQUFQO0FBTUQ7Ozs7Ozs7O2lEQUs0QixRLEVBQWtCLEksRUFBb0I7QUFDakUsVUFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDdEIsNEJBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsSUFBakQ7QUFDRDtBQUNGOzs7MkNBRThCO0FBQzdCLFdBQUsseUJBQUw7QUFDQSxhQUFPLG9CQUFVLG9CQUFWLEVBQVA7QUFDRDs7OzZDQUU4QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsMEJBQVUsc0JBQVY7QUFDRDs7O2dEQUUyQixNLEVBQWdDO0FBQzFELFdBQUsseUJBQUw7QUFDQSxhQUFPLG9CQUFVLG9CQUFWLEdBQWlDLE1BQWpDLENBQVA7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLElBQUksR0FBSixFQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IEZCTG9jYWxDaGF0Um91dGVzIGZyb20gJy4vRkJMb2NhbENoYXRSb3V0ZXMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5jbGFzcyBCb3QgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBfdG9rZW46IHN0cmluZztcbiAgX3ZlcmlmeVRva2VuOiBzdHJpbmc7XG4gIF91c2VMb2NhbENoYXQ6IGJvb2xlYW47XG4gIF9pbml0OiBib29sZWFuO1xuXG4gIF92ZXJpZnlJbml0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5faW5pdCwgJ1BsZWFzZSBpbml0aWFsaXplIHRoZSBCb3QgZmlyc3QnKTtcbiAgfVxuXG4gIF92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTogdm9pZCB7XG4gICAgaW52YXJpYW50KHRoaXMuX3VzZUxvY2FsQ2hhdCwgJ05vdCBpbiBsb2NhbCBjaGF0IG1vZGUnKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW5pdCA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdCh0b2tlbjogc3RyaW5nLCB2ZXJmeVRva2VuOiBzdHJpbmcsIHVzZUxvY2FsQ2hhdDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3Rva2VuID0gdG9rZW47XG4gICAgdGhpcy5fdmVyaWZ5VG9rZW4gPSB2ZXJmeVRva2VuO1xuICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCA9IHVzZUxvY2FsQ2hhdDtcbiAgICB0aGlzLl9pbml0ID0gdHJ1ZTtcbiAgfVxuXG4gIHJvdXRlcigpOiBSb3V0ZXIge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG5cbiAgICBsZXQgcm91dGVyID0gUm91dGVyKCk7XG4gICAgcm91dGVyLmdldCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgaWYgKHJlcS5xdWVyeVsnaHViLnZlcmlmeV90b2tlbiddID09PSB0aGlzLl92ZXJpZnlUb2tlbikge1xuICAgICAgICByZXMuc2VuZChyZXEucXVlcnlbJ2h1Yi5jaGFsbGVuZ2UnXSk7XG4gICAgICB9XG4gICAgICByZXMuc2VuZCgnRXJyb3IsIHdyb25nIHZhbGlkYXRpb24gdG9rZW4nKTtcbiAgICB9KTtcblxuICAgIHJvdXRlci5wb3N0KCcvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZU1lc3NhZ2UocmVxLmJvZHkpO1xuICAgICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgICB9KTtcblxuICAgIC8vIGF0dGFjaCBsb2NhbCBjaGF0IHJvdXRlc1xuICAgIGlmICh0aGlzLl91c2VMb2NhbENoYXQpIHtcbiAgICAgIHJvdXRlciA9IEZCTG9jYWxDaGF0Um91dGVzKHJvdXRlciwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfVxuXG4gIGdldFVzZXJQcm9maWxlKCk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcbiAgICAvLyBUT0RPXG4gIH1cblxuICBoYW5kbGVNZXNzYWdlKGRhdGE6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmIChkYXRhLm9iamVjdCAhPT0gJ3BhZ2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGF0YS5lbnRyeS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgZW50cnkubWVzc2FnaW5nLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIGhhbmRsZSBtZXNzYWdlc1xuICAgICAgICBpZiAoZXZlbnQubWVzc2FnZSkge1xuICAgICAgICAgIC8vIFNpbmNlIGEgbWVzc2FnZSBjb250YWluaW5nIGEgcXVpY2tfcmVwbHkgY2FuIGFsc28gY29udGFpbiB0ZXh0XG4gICAgICAgICAgLy8gYW5kIGF0dGFjaG1lbnQsIGNoZWNrIGZvciBxdWlja19yZXBseSBmaXJzdFxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnF1aWNrX3JlcGx5KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3F1aWNrX3JlcGx5JywgZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXZlbnQubWVzc2FnZS50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3RleHQnLCBldmVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5tZXNzYWdlLmF0dGFjaG1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2F0dGFjaG1lbnRzJywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBwb3N0YmFja1xuICAgICAgICBpZiAoZXZlbnQucG9zdGJhY2sgJiYgZXZlbnQucG9zdGJhY2sucGF5bG9hZCkge1xuICAgICAgICAgIHRoaXMuZW1pdCgncG9zdGJhY2snLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIG1lc3NhZ2UgZGVsaXZlcnkgYW5kIGF1dGhlbnRpY2F0aW9uXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmQgQVBJc1xuICAgKi9cbiAgc2VuZChyZWNpcGllbnRJRDogc3RyaW5nLCBtZXNzYWdlRGF0YTogT2JqZWN0KTogUHJvbWlzZSB7XG4gICAgdGhpcy5fdmVyaWZ5SW5pdE9yVGhyb3coKTtcbiAgICByZXR1cm4gQ2hhdFV0aWxzLnNlbmQoXG4gICAgICByZWNpcGllbnRJRCxcbiAgICAgIHRoaXMuX3Rva2VuLFxuICAgICAgbWVzc2FnZURhdGEsXG4gICAgICB0aGlzLl91c2VMb2NhbENoYXQsXG4gICAgKTtcbiAgIH1cblxuICBzZW5kSW1hZ2UocmVjaXBpZW50SUQ6IHN0cmluZywgaW1hZ2VVUkw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIHsnYXR0YWNobWVudCc6IHRoaXMuY3JlYXRlSW1hZ2VBdHRhY2htZW50KGltYWdlVVJMKX0pO1xuICB9XG5cbiAgc2VuZFRleHQocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICB0ZXh0OnRleHQsXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gICB9XG5cbiAgc2VuZEJ1dHRvbnMocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nLCBidXR0b25MaXN0OiBBcnJheTxPYmplY3Q+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAnYXR0YWNobWVudCc6IHtcbiAgICAgICAgJ3R5cGUnOid0ZW1wbGF0ZScsXG4gICAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAgICd0ZW1wbGF0ZV90eXBlJzogJ2J1dHRvbicsXG4gICAgICAgICAgJ3RleHQnOiB0ZXh0LFxuICAgICAgICAgICdidXR0b25zJzogYnV0dG9uTGlzdCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gIH1cblxuICBzZW5kVGVtcGxhdGUoKTogdm9pZCB7XG4gICAvLyBUT0RPXG4gIH1cblxuICBzZW5kUXVpY2tSZXBseVdpdGhBdHRhY2htZW50KHJlY2lwaWVudElEOiBzdHJpbmcsIGF0dGFjaG1lbnQ6IE9iamVjdCwgcXVpY2tSZXBseUxpc3Q6IEFycmF5PE9iamVjdD4pOiBQcm9taXNlIHtcbiAgICBjb25zdCBtZXNzYWdlRGF0YSA9IHtcbiAgICAgICdhdHRhY2htZW50JzogYXR0YWNobWVudCxcbiAgICAgICdxdWlja19yZXBsaWVzJzogcXVpY2tSZXBseUxpc3QsXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhKTtcbiAgfVxuXG4gIHNlbmRRdWlja1JlcGx5V2l0aFRleHQocmVjaXBpZW50SUQ6IHN0cmluZywgdGV4dDogc3RyaW5nLCBxdWlja1JlcGx5TGlzdDogQXJyYXk8T2JqZWN0Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0ge1xuICAgICAgJ3RleHQnOiB0ZXh0LFxuICAgICAgJ3F1aWNrX3JlcGxpZXMnOiBxdWlja1JlcGx5TGlzdCxcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZChyZWNpcGllbnRJRCwgbWVzc2FnZURhdGEpO1xuICB9XG5cbiAgY3JlYXRlUXVpY2tSZXBseSh0ZXh0OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdjb250ZW50X3R5cGUnOiAndGV4dCcsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVQb3N0YmFja0J1dHRvbih0ZXh0OiBzdHJpbmcsIHBheWxvYWQ6IHN0cmluZyk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3Bvc3RiYWNrJyxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAncGF5bG9hZCc6IHBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVdlYkJ1dHRvbih0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnd2ViX3VybCcsXG4gICAgICAndXJsJzogdXJsLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlSW1hZ2VBdHRhY2htZW50KGltYWdlVVJMOiBzdHJpbmcpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdpbWFnZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3VybCc6IGltYWdlVVJMLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsIENoYXQgQVBJcyAoZm9yIHVuaXQgdGVzdGluZyBwdXJwb3NlcylcbiAgICovXG4gIHNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQ6IHN0cmluZywgdGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3VzZUxvY2FsQ2hhdCkge1xuICAgICAgQ2hhdFV0aWxzLnNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIHRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzKCk6IE9iamVjdCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5nZXRMb2NhbENoYXRNZXNzYWdlcygpO1xuICB9XG5cbiAgY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICBDaGF0VXRpbHMuY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpO1xuICB9XG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXNGb3JVc2VyKHVzZXJJRDogc3RyaW5nKTogP0FycmF5PE9iamVjdD4ge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKVt1c2VySURdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEJvdCgpO1xuIl19