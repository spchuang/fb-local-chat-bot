

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBMEJNLEc7Ozs7O3lDQU91QjtBQUN6QiwrQkFBVSxLQUFLLEtBQWYsRUFBc0IsaUNBQXRCO0FBQ0Q7OztnREFFaUM7QUFDaEMsK0JBQVUsS0FBSyxhQUFmLEVBQThCLHdCQUE5QjtBQUNEOzs7QUFFRCxpQkFBYztBQUFBOztBQUFBOztBQUVaLFVBQUssS0FBTCxHQUFhLEtBQWI7QUFGWTtBQUdiOzs7O3lCQUdDLEssRUFDQSxVLEVBR007QUFBQSxVQUZOLFlBRU0seURBRmtCLEtBRWxCO0FBQUEsVUFETixZQUNNLHlEQURrQixJQUNsQjs7QUFDTixXQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLFVBQXBCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLFlBQXJCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLFlBQXJCO0FBQ0EsV0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNEOzs7NkJBRWdCO0FBQUE7O0FBQ2YsV0FBSyxrQkFBTDs7QUFFQSxVQUFJLFNBQVMsc0JBQWI7QUFDQSxhQUFPLEdBQVAsQ0FBVyxHQUFYLEVBQWdCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUM1QixZQUFJLElBQUksS0FBSixDQUFVLGtCQUFWLE1BQWtDLE9BQUssWUFBM0MsRUFBeUQ7QUFDdkQsY0FBSSxJQUFKLENBQVMsSUFBSSxLQUFKLENBQVUsZUFBVixDQUFUO0FBQ0Q7QUFDRCxZQUFJLElBQUosQ0FBUywrQkFBVDtBQUNELE9BTEQ7O0FBT0EsYUFBTyxJQUFQLENBQVksR0FBWixFQUFpQixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDN0IsZUFBSyxhQUFMLENBQW1CLElBQUksSUFBdkI7QUFDQSxZQUFJLFVBQUosQ0FBZSxHQUFmO0FBQ0QsT0FIRDs7O0FBTUEsVUFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDdEIsaUJBQVMsaUNBQWtCLE1BQWxCLEVBQTBCLElBQTFCLENBQVQ7QUFDRDs7QUFFRCxhQUFPLE1BQVA7QUFDRDs7O21DQUVjLEUsRUFBNkI7QUFDMUMsV0FBSyxrQkFBTDtBQUNBLGFBQU8sOEJBQUc7QUFDUixhQUFLLHFDQUFxQyxFQURsQztBQUVSLFlBQUk7QUFDRix3QkFBYyxLQUFLLE1BRGpCO0FBRUYsa0JBQVE7QUFGTixTQUZJO0FBTVIsY0FBTTtBQU5FLE9BQUgsQ0FBUDtBQVFEOzs7a0NBRWEsSSxFQUFvQjtBQUFBOztBQUNoQyxVQUFJLEtBQUssTUFBTCxLQUFnQixNQUFwQixFQUE0QjtBQUMxQjtBQUNEOztBQUVELFdBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsVUFBQyxLQUFELEVBQVc7QUFDNUIsY0FBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLFVBQUMsS0FBRCxFQUFXOztBQUVqQyxjQUFJLE1BQU0sT0FBVixFQUFtQjs7O0FBR2pCLGdCQUFJLE1BQU0sT0FBTixDQUFjLFdBQWxCLEVBQStCO0FBQzdCLHFCQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLEtBQXpCO0FBQ0E7QUFDRDtBQUNELGdCQUFJLE1BQU0sT0FBTixDQUFjLElBQWxCLEVBQXdCO0FBQ3RCLHFCQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLEtBQWxCO0FBQ0QsYUFGRCxNQUVPLElBQUksTUFBTSxPQUFOLENBQWMsV0FBbEIsRUFBK0I7QUFDcEMscUJBQUssSUFBTCxDQUFVLGFBQVYsRUFBeUIsS0FBekI7QUFDRDtBQUNGOzs7QUFHRCxjQUFJLE1BQU0sUUFBTixJQUFrQixNQUFNLFFBQU4sQ0FBZSxPQUFyQyxFQUE4QztBQUM1QyxtQkFBSyxJQUFMLENBQVUsVUFBVixFQUFzQixLQUF0QjtBQUNEOztBQUVELGNBQUksTUFBTSxLQUFOLElBQWUsTUFBTSxLQUFOLENBQVksR0FBL0IsRUFBb0M7QUFDbEMsbUJBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7QUFFRixTQXpCRDtBQTBCRCxPQTNCRDtBQTRCRDs7Ozs7Ozs7eUJBS0ksVyxFQUFxQixXLEVBQStCO0FBQ3ZELFdBQUssa0JBQUw7QUFDQSxhQUFPLG9CQUFVLElBQVYsQ0FDTCxXQURLLEVBRUwsS0FBSyxNQUZBLEVBR0wsRUFBQyxTQUFTLFdBQVYsRUFISyxFQUlMLEtBQUssYUFKQSxFQUtMLEtBQUssYUFMQSxDQUFQO0FBT0Q7OztxQ0FFZ0IsVyxFQUFxQixNLEVBQWlDO0FBQ3JFLGFBQU8sb0JBQVUsSUFBVixDQUNMLFdBREssRUFFTCxLQUFLLE1BRkEsRUFHTCxFQUFDLGVBQWUsTUFBaEIsRUFISyxFQUlMLEtBQUssYUFKQSxFQUtMLEtBQUssYUFMQSxDQUFQO0FBT0Q7OztzQ0FFaUIsYyxFQUE2QztBQUM3RCwwQkFBVSxpQkFBVixDQUE0QixjQUE1QjtBQUNEOzs7NkJBRVEsVyxFQUFxQixJLEVBQXVCO0FBQ25ELGFBQU8sS0FBSyxJQUFMLENBQVUsV0FBVixFQUF1QixFQUFDLE1BQU0sSUFBUCxFQUF2QixDQUFQO0FBQ0Q7OzttQ0FFYyxXLEVBQXFCLFUsRUFBaUM7QUFDbkUsYUFBTyxLQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLEVBQUMsY0FBYyxVQUFmLEVBQXZCLENBQVA7QUFDRDs7OzhCQUVTLFcsRUFBcUIsRyxFQUFzQjtBQUNuRCxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFnQyxLQUFLLHFCQUFMLENBQTJCLEdBQTNCLENBQWhDLENBQVA7QUFDRDs7OzhCQUVTLFcsRUFBcUIsRyxFQUFzQjtBQUNuRCxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFpQyxLQUFLLHFCQUFMLENBQTJCLEdBQTNCLENBQWpDLENBQVA7QUFDRDs7OzZCQUVRLFcsRUFBcUIsRyxFQUFzQjtBQUNsRCxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFpQyxLQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBQWpDLENBQVA7QUFDRDs7OzhCQUVTLFcsRUFBcUIsRyxFQUFzQjtBQUNuRCxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFpQyxLQUFLLHFCQUFMLENBQTJCLEdBQTNCLENBQWpDLENBQVA7QUFDRDs7O2dDQUVXLFcsRUFBcUIsSSxFQUFjLE8sRUFBaUM7QUFDOUUsVUFBTSxhQUF1QztBQUMzQyxnQkFBTyxVQURvQztBQUUzQyxtQkFBVztBQUNULDJCQUFpQixRQURSO0FBRVQsa0JBQVEsSUFGQztBQUdULHFCQUFXO0FBSEY7QUFGZ0MsT0FBN0M7QUFRQSxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFpQyxVQUFqQyxDQUFQO0FBQ0Q7Ozt3Q0FFbUIsVyxFQUFxQixRLEVBQTREO0FBQ25HLFVBQU0sYUFBd0M7QUFDNUMsZ0JBQU8sVUFEcUM7QUFFNUMsbUJBQVc7QUFDVCwyQkFBaUIsU0FEUjtBQUVULHNCQUFZO0FBRkg7QUFGaUMsT0FBOUM7QUFPQSxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFpQyxVQUFqQyxDQUFQO0FBQ0Q7OztxQ0FHQyxXLEVBQ0EsUSxFQUNBLGUsRUFDQSxPLEVBQ1M7QUFDVCxVQUFNLGFBQXFDO0FBQ3pDLGdCQUFPLFVBRGtDO0FBRXpDLG1CQUFXO0FBQ1QsMkJBQWlCLE1BRFI7QUFFVCxzQkFBWTtBQUZIO0FBRjhCLE9BQTNDOztBQVFBLFVBQUksZUFBSixFQUFxQjtBQUNuQixtQkFBVyxPQUFYLENBQW1CLGlCQUFuQixHQUF1QyxlQUF2QztBQUNEO0FBQ0QsVUFBSSxPQUFKLEVBQWE7QUFDWCxtQkFBVyxPQUFYLENBQW1CLE9BQW5CLEdBQTZCLE9BQTdCO0FBQ0Q7QUFDRCxhQUFPLEtBQUssY0FBTCxDQUFvQixXQUFwQixFQUFpQyxVQUFqQyxDQUFQO0FBQ0Q7OztpREFFNEIsVyxFQUFxQixVLEVBQW9CLGMsRUFBNEM7QUFDaEgsVUFBTSxjQUFjO0FBQ2xCLHNCQUFjLFVBREk7QUFFbEIseUJBQWlCO0FBRkMsT0FBcEI7QUFJQSxhQUFPLEtBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsV0FBdkIsQ0FBUDtBQUNEOzs7MkNBRXNCLFcsRUFBcUIsSSxFQUFjLGMsRUFBNEM7QUFDcEcsVUFBTSxjQUFjO0FBQ2xCLGdCQUFRLElBRFU7QUFFbEIseUJBQWlCO0FBRkMsT0FBcEI7QUFJQSxhQUFPLEtBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsV0FBdkIsQ0FBUDtBQUNEOzs7Ozs7Ozt5Q0FLb0IsTSxFQUFnQixxQixFQUFnQyxTLEVBQXFEO0FBQ3hILGFBQU87QUFDTCxnQkFBUSxNQURIO0FBRUwsaUNBQXlCLHFCQUZwQjtBQUdMLHlCQUFpQjtBQUhaLE9BQVA7QUFLRDs7O3lDQUVvQixLLEVBQWUsUyxFQUErRDtBQUNqRyxhQUFPO0FBQ0wsZUFBTyxLQURGO0FBRUwsY0FBTSxRQUZEO0FBR0wseUJBQWlCO0FBSFosT0FBUDtBQUtEOzs7Ozs7OztxQ0FLZ0IsSSxFQUFjLE8sRUFBaUM7QUFDOUQsYUFBTztBQUNMLHdCQUFnQixNQURYO0FBRUwsaUJBQVMsSUFGSjtBQUdMLG1CQUFXO0FBSE4sT0FBUDtBQUtEOzs7Z0RBRStDO0FBQzlDLGFBQU87QUFDTCxzQkFBYztBQURULE9BQVA7QUFHRDs7O3FDQUVnQixJLEVBQWMsTyxFQUE2QjtBQUMxRCxhQUFPO0FBQ0wsZ0JBQVEsY0FESDtBQUVMLGlCQUFTLElBRko7QUFHTCxtQkFBVztBQUhOLE9BQVA7QUFLRDs7O3lDQUVvQixJLEVBQWMsTyxFQUFpQztBQUNsRSxhQUFPO0FBQ0wsZ0JBQVEsVUFESDtBQUVMLGlCQUFTLElBRko7QUFHTCxtQkFBVztBQUhOLE9BQVA7QUFLRDs7O3dDQUVnQztBQUMvQixhQUFPO0FBQ0wsZ0JBQVE7QUFESCxPQUFQO0FBR0Q7OztvQ0FHQyxJLEVBQ0EsRyxFQUlXO0FBQUEsVUFIWCxNQUdXLHlEQUhtQixNQUduQjtBQUFBLFVBRlgsc0JBRVcseURBRndCLEtBRXhCO0FBQUEsVUFEWCxXQUNXOztBQUNYLGFBQU87QUFDTCxnQkFBUSxTQURIO0FBRUwsZUFBTyxHQUZGO0FBR0wsaUJBQVMsSUFISjtBQUlMLGdDQUF3QixNQUpuQjtBQUtMLGdDQUF3QixzQkFMbkI7QUFNTCx3QkFBZ0I7QUFOWCxPQUFQO0FBUUQ7OztpREFHQyxLLEVBQ0EsTyxFQUNBLGEsRUFDQSxRLEVBQ0EsUSxFQUNBLE8sRUFDa0M7QUFDbEMsK0JBQVUsRUFBRSxXQUFXLGFBQWIsQ0FBVixFQUF1QywwREFBdkM7QUFDQSxVQUFNLE1BQXdDO0FBQzVDLGlCQUFTO0FBRG1DLE9BQTlDOztBQUlBLFVBQUksT0FBSixFQUFhO0FBQ1gsWUFBSSxRQUFKLEdBQWUsT0FBZjtBQUNEO0FBQ0QsVUFBSSxhQUFKLEVBQW1CO0FBQ2pCLFlBQUksY0FBSixHQUFxQixhQUFyQjtBQUNEO0FBQ0QsVUFBSSxRQUFKLEVBQWM7QUFDWixZQUFJLFNBQUosR0FBZ0IsUUFBaEI7QUFDRDtBQUNELFVBQUksUUFBSixFQUFjO0FBQ1osWUFBSSxRQUFKLEdBQWUsUUFBZjtBQUNEO0FBQ0QsVUFBSSxPQUFKLEVBQWE7QUFDWCxZQUFJLE9BQUosR0FBYyxPQUFkO0FBQ0Q7QUFDRCxhQUFPLEdBQVA7QUFDRDs7OzBDQUVxQixHLEVBQW1DO0FBQ3ZELGFBQU87QUFDTCxnQkFBUSxPQURIO0FBRUwsbUJBQVc7QUFDVCxpQkFBTztBQURFO0FBRk4sT0FBUDtBQU1EOzs7MENBRXFCLEcsRUFBbUM7QUFDdkQsYUFBTztBQUNMLGdCQUFRLE9BREg7QUFFTCxtQkFBVztBQUNULGlCQUFPO0FBREU7QUFGTixPQUFQO0FBTUQ7Ozt5Q0FFb0IsRyxFQUFtQztBQUN0RCxhQUFPO0FBQ0wsZ0JBQVEsTUFESDtBQUVMLG1CQUFXO0FBQ1QsaUJBQU87QUFERTtBQUZOLE9BQVA7QUFNRDs7OzBDQUVxQixHLEVBQW1DO0FBQ3ZELGFBQU87QUFDTCxnQkFBUSxPQURIO0FBRUwsbUJBQVc7QUFDVCxpQkFBTztBQURFO0FBRk4sT0FBUDtBQU1EOzs7Ozs7OztpREFLNEIsUSxFQUFrQixJLEVBQW9CO0FBQ2pFLFVBQUksS0FBSyxhQUFULEVBQXdCO0FBQ3RCLDRCQUFVLDRCQUFWLENBQXVDLFFBQXZDLEVBQWlELElBQWpEO0FBQ0Q7QUFDRjs7OzJDQUU4QjtBQUM3QixXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixFQUFQO0FBQ0Q7Ozs2Q0FFOEI7QUFDN0IsV0FBSyx5QkFBTDtBQUNBLDBCQUFVLHNCQUFWO0FBQ0Q7OztnREFFMkIsTSxFQUFnQztBQUMxRCxXQUFLLHlCQUFMO0FBQ0EsYUFBTyxvQkFBVSxvQkFBVixHQUFpQyxNQUFqQyxDQUFQO0FBQ0Q7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFJLEdBQUosRUFBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDaGF0VXRpbHMgZnJvbSAnLi9DaGF0VXRpbHMnO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ2V2ZW50cydcbmltcG9ydCBGQkxvY2FsQ2hhdFJvdXRlcyBmcm9tICcuL0ZCTG9jYWxDaGF0Um91dGVzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIE11bHRpbWVkaWFBdHRhY2htZW50LFxuICBCdXR0b25UZW1wbGF0ZUF0dGFjaG1lbnQsXG4gIEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50LFxuICBHZW5lcmljVGVtcGxhdGVBdHRhY2htZW50LFxuICBMaXN0VGVtcGxhdGVBdHRhY2htZW50RWxlbWVudCxcbiAgTGlzdFRlbXBsYXRlQXR0YWNobWVudCxcbiAgUXVpY2tSZXBseSxcbiAgVVJMQnV0dG9uLFxuICBQb3N0YmFja0J1dHRvbixcbiAgQ2FsbEJ1dHRvbixcbiAgU2hhcmVCdXR0b24sXG4gIFRleHRRdWlja1JlcGx5LFxuICBMb2NhdGlvblF1aWNrUmVwbHksXG4gIEF0dGFjaG1lbnQsXG4gIEJ1dHRvbixcbiAgTWVzc2FnZSxcbiAgV2Vidmlld0hlaWdodFJhdGlvLFxuICBTZW5kQWN0aW9uVHlwZSxcbiAgUGVyc2lzdGVudE1lbnUsXG4gIFBlcnNpc3Rlbk1lbnVJdGVtLFxuICBOZXN0ZWRQZXJzaXN0ZW50TWVudUl0ZW0sXG59IGZyb20gJy4vdHlwZSc7XG5cbmNsYXNzIEJvdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIF90b2tlbjogc3RyaW5nO1xuICBfdmVyaWZ5VG9rZW46IHN0cmluZztcbiAgX3VzZUxvY2FsQ2hhdDogYm9vbGVhbjtcbiAgX3VzZU1lc3NlbmdlcjogYm9vbGVhbjtcbiAgX2luaXQ6IGJvb2xlYW47XG5cbiAgX3ZlcmlmeUluaXRPclRocm93KCk6IHZvaWQge1xuICAgIGludmFyaWFudCh0aGlzLl9pbml0LCAnUGxlYXNlIGluaXRpYWxpemUgdGhlIEJvdCBmaXJzdCcpO1xuICB9XG5cbiAgX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpOiB2b2lkIHtcbiAgICBpbnZhcmlhbnQodGhpcy5fdXNlTG9jYWxDaGF0LCAnTm90IGluIGxvY2FsIGNoYXQgbW9kZScpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gIH1cblxuICBpbml0KFxuICAgIHRva2VuOiBzdHJpbmcsXG4gICAgdmVyZnlUb2tlbjogc3RyaW5nLFxuICAgIHVzZUxvY2FsQ2hhdDogYm9vbGVhbiA9IGZhbHNlLFxuICAgIHVzZU1lc3NlbmdlcjogYm9vbGVhbiA9IHRydWUsXG4gICk6IHZvaWQge1xuICAgIHRoaXMuX3Rva2VuID0gdG9rZW47XG4gICAgdGhpcy5fdmVyaWZ5VG9rZW4gPSB2ZXJmeVRva2VuO1xuICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCA9IHVzZUxvY2FsQ2hhdDtcbiAgICB0aGlzLl91c2VNZXNzZW5nZXIgPSB1c2VNZXNzZW5nZXI7XG4gICAgdGhpcy5faW5pdCA9IHRydWU7XG4gIH1cblxuICByb3V0ZXIoKTogUm91dGVyIHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuXG4gICAgbGV0IHJvdXRlciA9IFJvdXRlcigpO1xuICAgIHJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICAgIGlmIChyZXEucXVlcnlbJ2h1Yi52ZXJpZnlfdG9rZW4nXSA9PT0gdGhpcy5fdmVyaWZ5VG9rZW4pIHtcbiAgICAgICAgcmVzLnNlbmQocmVxLnF1ZXJ5WydodWIuY2hhbGxlbmdlJ10pO1xuICAgICAgfVxuICAgICAgcmVzLnNlbmQoJ0Vycm9yLCB3cm9uZyB2YWxpZGF0aW9uIHRva2VuJyk7XG4gICAgfSk7XG5cbiAgICByb3V0ZXIucG9zdCgnLycsIChyZXEsIHJlcykgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlKHJlcS5ib2R5KTtcbiAgICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gICAgfSk7XG5cbiAgICAvLyBhdHRhY2ggbG9jYWwgY2hhdCByb3V0ZXNcbiAgICBpZiAodGhpcy5fdXNlTG9jYWxDaGF0KSB7XG4gICAgICByb3V0ZXIgPSBGQkxvY2FsQ2hhdFJvdXRlcyhyb3V0ZXIsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICBnZXRVc2VyUHJvZmlsZShpZDogc3RyaW5nKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICB0aGlzLl92ZXJpZnlJbml0T3JUaHJvdygpO1xuICAgIHJldHVybiBycCh7XG4gICAgICB1cmk6ICdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi42LycgKyBpZCxcbiAgICAgIHFzOiB7XG4gICAgICAgIGFjY2Vzc190b2tlbjogdGhpcy5fdG9rZW4sXG4gICAgICAgIGZpZWxkczogJ2ZpcnN0X25hbWUsbGFzdF9uYW1lLHByb2ZpbGVfcGljLGxvY2FsZSx0aW1lem9uZSxnZW5kZXInLFxuICAgICAgfSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVNZXNzYWdlKGRhdGE6IE9iamVjdCk6IHZvaWQge1xuICAgIGlmIChkYXRhLm9iamVjdCAhPT0gJ3BhZ2UnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGF0YS5lbnRyeS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgZW50cnkubWVzc2FnaW5nLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIGhhbmRsZSBtZXNzYWdlc1xuICAgICAgICBpZiAoZXZlbnQubWVzc2FnZSkge1xuICAgICAgICAgIC8vIFNpbmNlIGEgbWVzc2FnZSBjb250YWluaW5nIGEgcXVpY2tfcmVwbHkgY2FuIGFsc28gY29udGFpbiB0ZXh0XG4gICAgICAgICAgLy8gYW5kIGF0dGFjaG1lbnQsIGNoZWNrIGZvciBxdWlja19yZXBseSBmaXJzdFxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnF1aWNrX3JlcGx5KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3F1aWNrX3JlcGx5JywgZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXZlbnQubWVzc2FnZS50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3RleHQnLCBldmVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC5tZXNzYWdlLmF0dGFjaG1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2F0dGFjaG1lbnRzJywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBwb3N0YmFja1xuICAgICAgICBpZiAoZXZlbnQucG9zdGJhY2sgJiYgZXZlbnQucG9zdGJhY2sucGF5bG9hZCkge1xuICAgICAgICAgIHRoaXMuZW1pdCgncG9zdGJhY2snLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSGFuZGxlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIGlmIChldmVudC5vcHRpbiAmJiBldmVudC5vcHRpbi5yZWYpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ29wdGluJywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBtZXNzYWdlIGRlbGl2ZXJ5XG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmQgQVBJc1xuICAgKi9cbiAgc2VuZChyZWNpcGllbnRJRDogc3RyaW5nLCBtZXNzYWdlRGF0YTogTWVzc2FnZSk6IFByb21pc2Uge1xuICAgIHRoaXMuX3ZlcmlmeUluaXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5zZW5kKFxuICAgICAgcmVjaXBpZW50SUQsXG4gICAgICB0aGlzLl90b2tlbixcbiAgICAgIHttZXNzYWdlOiBtZXNzYWdlRGF0YX0sXG4gICAgICB0aGlzLl91c2VMb2NhbENoYXQsXG4gICAgICB0aGlzLl91c2VNZXNzZW5nZXIsXG4gICAgKTtcbiAgfVxuXG4gIHNlbmRTZW5kZXJBY3Rpb24ocmVjaXBpZW50SUQ6IHN0cmluZywgYWN0aW9uOiBTZW5kQWN0aW9uVHlwZSk6IFByb21pc2Uge1xuICAgIHJldHVybiBDaGF0VXRpbHMuc2VuZChcbiAgICAgIHJlY2lwaWVudElELFxuICAgICAgdGhpcy5fdG9rZW4sXG4gICAgICB7c2VuZGVyX2FjdGlvbjogYWN0aW9ufSxcbiAgICAgIHRoaXMuX3VzZUxvY2FsQ2hhdCxcbiAgICAgIHRoaXMuX3VzZU1lc3NlbmdlcixcbiAgICApO1xuICB9XG5cbiAgc2V0UGVyc2lzdGVudE1lbnUobWVudURlZmluaXRpb246IEFycmF5PFBlcnNpc3RlbnRNZW51Pik6IHZvaWQge1xuICAgIENoYXRVdGlscy5zZXRQZXJzaXN0ZW50TWVudShtZW51RGVmaW5pdGlvbik7XG4gIH1cblxuICBzZW5kVGV4dChyZWNpcGllbnRJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCB7dGV4dDogdGV4dH0pO1xuICB9XG5cbiAgc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQ6IHN0cmluZywgYXR0YWNobWVudDogQXR0YWNobWVudCk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmQocmVjaXBpZW50SUQsIHsnYXR0YWNobWVudCc6IGF0dGFjaG1lbnR9KTtcbiAgfVxuXG4gIHNlbmRJbWFnZShyZWNpcGllbnRJRDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELHRoaXMuY3JlYXRlSW1hZ2VBdHRhY2htZW50KHVybCkpO1xuICB9XG5cbiAgc2VuZFZpZGVvKHJlY2lwaWVudElEOiBzdHJpbmcsIHVybDogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIHRoaXMuY3JlYXRlVmlkZW9BdHRhY2htZW50KHVybCkpO1xuICB9XG5cbiAgc2VuZEZpbGUocmVjaXBpZW50SUQ6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBQcm9taXNlIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgdGhpcy5jcmVhdGVGaWxlQXR0YWNobWVudCh1cmwpKTtcbiAgfVxuXG4gIHNlbmRBdWRpbyhyZWNpcGllbnRJRDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCB0aGlzLmNyZWF0ZUF1ZGlvQXR0YWNobWVudCh1cmwpKTtcbiAgfVxuXG4gIHNlbmRCdXR0b25zKHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgYnV0dG9uczogQXJyYXk8QnV0dG9uPik6IFByb21pc2Uge1xuICAgIGNvbnN0IGF0dGFjaG1lbnQ6IEJ1dHRvblRlbXBsYXRlQXR0YWNobWVudCA9IHtcbiAgICAgICd0eXBlJzondGVtcGxhdGUnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd0ZW1wbGF0ZV90eXBlJzogJ2J1dHRvbicsXG4gICAgICAgICd0ZXh0JzogdGV4dCxcbiAgICAgICAgJ2J1dHRvbnMnOiBidXR0b25zLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLnNlbmRBdHRhY2htZW50KHJlY2lwaWVudElELCBhdHRhY2htZW50KTtcbiAgfVxuXG4gIHNlbmRHZW5lcmljVGVtcGxhdGUocmVjaXBpZW50SUQ6IHN0cmluZywgZWxlbWVudHM6IEFycmF5PEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnRFbGVtZW50Pik6IFByb21pc2Uge1xuICAgIGNvbnN0IGF0dGFjaG1lbnQ6IEdlbmVyaWNUZW1wbGF0ZUF0dGFjaG1lbnQgPSB7XG4gICAgICAndHlwZSc6J3RlbXBsYXRlJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndGVtcGxhdGVfdHlwZSc6ICdnZW5lcmljJyxcbiAgICAgICAgJ2VsZW1lbnRzJzogZWxlbWVudHMsXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuc2VuZEF0dGFjaG1lbnQocmVjaXBpZW50SUQsIGF0dGFjaG1lbnQpO1xuICB9XG5cbiAgc2VuZExpc3RUZW1wbGF0ZShcbiAgICByZWNpcGllbnRJRDogc3RyaW5nLFxuICAgIGVsZW1lbnRzOiBBcnJheTxMaXN0VGVtcGxhdGVBdHRhY2htZW50RWxlbWVudD4sXG4gICAgdG9wRWxlbWVudFN0eWxlPzogJ2xhcmdlJyB8ICdjb21wYWN0JyxcbiAgICBidXR0b25zPzogQXJyYXk8QnV0dG9uPlxuICApOiBQcm9taXNlIHtcbiAgICBjb25zdCBhdHRhY2htZW50OiBMaXN0VGVtcGxhdGVBdHRhY2htZW50ID0ge1xuICAgICAgJ3R5cGUnOid0ZW1wbGF0ZScsXG4gICAgICAncGF5bG9hZCc6IHtcbiAgICAgICAgJ3RlbXBsYXRlX3R5cGUnOiAnbGlzdCcsXG4gICAgICAgICdlbGVtZW50cyc6IGVsZW1lbnRzLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgaWYgKHRvcEVsZW1lbnRTdHlsZSkge1xuICAgICAgYXR0YWNobWVudC5wYXlsb2FkLnRvcF9lbGVtZW50X3N0eWxlID0gdG9wRWxlbWVudFN0eWxlO1xuICAgIH1cbiAgICBpZiAoYnV0dG9ucykge1xuICAgICAgYXR0YWNobWVudC5wYXlsb2FkLmJ1dHRvbnMgPSBidXR0b25zO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kQXR0YWNobWVudChyZWNpcGllbnRJRCwgYXR0YWNobWVudCk7XG4gIH1cblxuICBzZW5kUXVpY2tSZXBseVdpdGhBdHRhY2htZW50KHJlY2lwaWVudElEOiBzdHJpbmcsIGF0dGFjaG1lbnQ6IE9iamVjdCwgcXVpY2tSZXBseUxpc3Q6IEFycmF5PFF1aWNrUmVwbHk+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAnYXR0YWNobWVudCc6IGF0dGFjaG1lbnQsXG4gICAgICAncXVpY2tfcmVwbGllcyc6IHF1aWNrUmVwbHlMaXN0LFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gIH1cblxuICBzZW5kUXVpY2tSZXBseVdpdGhUZXh0KHJlY2lwaWVudElEOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgcXVpY2tSZXBseUxpc3Q6IEFycmF5PFF1aWNrUmVwbHk+KTogUHJvbWlzZSB7XG4gICAgY29uc3QgbWVzc2FnZURhdGEgPSB7XG4gICAgICAndGV4dCc6IHRleHQsXG4gICAgICAncXVpY2tfcmVwbGllcyc6IHF1aWNrUmVwbHlMaXN0LFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kKHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSk7XG4gIH1cblxuICAvKlxuICAgKiBIZWxwZXJzIHRvIGNyZWF0ZSBwZXJzaXN0ZW50IG1lbnVcbiAgICovXG4gIGNyZWF0ZVBlcnNpc3RlbnRNZW51KGxvY2FsZTogc3RyaW5nLCBjb21wb3NlcklucHV0RGlzYWJsZWQ6IGJvb2xlYW4sIG1lbnVJdGVtczogQXJyYXk8UGVyc2lzdGVuTWVudUl0ZW0+KTogUGVyc2lzdGVudE1lbnUge1xuICAgIHJldHVybiB7XG4gICAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICAgIGNvbXBvc2VyX2lucHV0X2Rpc2FibGVkOiBjb21wb3NlcklucHV0RGlzYWJsZWQsXG4gICAgICBjYWxsX3RvX2FjdGlvbnM6IG1lbnVJdGVtcyxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlTmVzdGVkTWVudUl0ZW0odGl0bGU6IHN0cmluZywgbWVudUl0ZW1zOiBBcnJheTxQZXJzaXN0ZW5NZW51SXRlbT4pOiBOZXN0ZWRQZXJzaXN0ZW50TWVudUl0ZW0ge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICB0eXBlOiAnbmVzdGVkJyxcbiAgICAgIGNhbGxfdG9fYWN0aW9uczogbWVudUl0ZW1zLFxuICAgIH07XG4gIH1cblxuICAvKlxuICAgKiBIZWxwZXJzIHRvIGNyZWF0ZSBhdHRhY2htZW50XG4gICAqL1xuICBjcmVhdGVRdWlja1JlcGx5KHRleHQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogVGV4dFF1aWNrUmVwbHkge1xuICAgIHJldHVybiB7XG4gICAgICAnY29udGVudF90eXBlJzogJ3RleHQnLFxuICAgICAgJ3RpdGxlJzogdGV4dCxcbiAgICAgICdwYXlsb2FkJzogcGF5bG9hZCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlTG9jYXRpb25RdWlja1JlcGxheSgpOiBMb2NhdGlvblF1aWNrUmVwbHkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50X3R5cGU6ICdsb2NhdGlvbicsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUNhbGxCdXR0b24odGV4dDogc3RyaW5nLCBwYXlsb2FkOiBzdHJpbmcpOiBDYWxsQnV0dG9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAncGhvbmVfbnVtYmVyJyxcbiAgICAgICd0aXRsZSc6IHRleHQsXG4gICAgICAncGF5bG9hZCc6IHBheWxvYWQsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVBvc3RiYWNrQnV0dG9uKHRleHQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogUG9zdGJhY2tCdXR0b24ge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICdwb3N0YmFjaycsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3BheWxvYWQnOiBwYXlsb2FkLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVTaGFyZUJ1dHRvbigpOiBTaGFyZUJ1dHRvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ2VsZW1lbnRfc2hhcmUnLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVVUkxCdXR0b24oXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIHVybDogc3RyaW5nLFxuICAgIGhlaWdodD86IFdlYnZpZXdIZWlnaHRSYXRpbyA9ICdmdWxsJyxcbiAgICB1c2VNZXNzZW5nZXJFeHRlbnNpb25zPzogYm9vbGVhbiA9IGZhbHNlLFxuICAgIGZhbGxiYWNrVXJsPzogc3RyaW5nLFxuICApOiBVUkxCdXR0b24ge1xuICAgIHJldHVybiB7XG4gICAgICAndHlwZSc6ICd3ZWJfdXJsJyxcbiAgICAgICd1cmwnOiB1cmwsXG4gICAgICAndGl0bGUnOiB0ZXh0LFxuICAgICAgJ3dlYnZpZXdfaGVpZ2h0X3JhdGlvJzogaGVpZ2h0LFxuICAgICAgJ21lc3Nlbmdlcl9leHRlbnNpb25zJzogdXNlTWVzc2VuZ2VyRXh0ZW5zaW9ucyxcbiAgICAgICdmYWxsYmFja191cmwnOiBmYWxsYmFja1VybCxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlR2VuZXJpY1RlbXBsYXRlRWxlbWVudChcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGl0ZW1Vcmw6ID9zdHJpbmcsXG4gICAgZGVmYXVsdEFjdGlvbjogP09iamVjdCxcbiAgICBpbWFnZVVybDogP3N0cmluZyxcbiAgICBzdWJ0aXRsZTogP3N0cmluZyxcbiAgICBidXR0b25zOiA/QXJyYXk8T2JqZWN0PixcbiAgKTogR2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQge1xuICAgIGludmFyaWFudCghKGl0ZW1VcmwgJiYgZGVmYXVsdEFjdGlvbiksICdPbmUgZWxlbWVudCBjYW5ub3QgaGF2ZSBib3RoIGRlZmF1bHRfYWN0aW9uIGFuZCBpdGVtX3VybCcpO1xuICAgIGNvbnN0IHZhbDogR2VuZXJpY1RlbXBsYXRlQXR0YWNobWVudEVsZW1lbnQgPSB7XG4gICAgICAndGl0bGUnOiB0aXRsZSxcbiAgICB9O1xuXG4gICAgaWYgKGl0ZW1VcmwpIHtcbiAgICAgIHZhbC5pdGVtX3VybCA9IGl0ZW1Vcmw7XG4gICAgfVxuICAgIGlmIChkZWZhdWx0QWN0aW9uKSB7XG4gICAgICB2YWwuZGVmYXVsdF9hY3Rpb24gPSBkZWZhdWx0QWN0aW9uO1xuICAgIH1cbiAgICBpZiAoaW1hZ2VVcmwpIHtcbiAgICAgIHZhbC5pbWFnZV91cmwgPSBpbWFnZVVybDtcbiAgICB9XG4gICAgaWYgKHN1YnRpdGxlKSB7XG4gICAgICB2YWwuc3VidGl0bGUgPSBzdWJ0aXRsZTtcbiAgICB9XG4gICAgaWYgKGJ1dHRvbnMpIHtcbiAgICAgIHZhbC5idXR0b25zID0gYnV0dG9ucztcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGNyZWF0ZUltYWdlQXR0YWNobWVudCh1cmw6IHN0cmluZyk6IE11bHRpbWVkaWFBdHRhY2htZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3R5cGUnOiAnaW1hZ2UnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVWaWRlb0F0dGFjaG1lbnQodXJsOiBzdHJpbmcpOiBNdWx0aW1lZGlhQXR0YWNobWVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ3ZpZGVvJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndXJsJzogdXJsLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlRmlsZUF0dGFjaG1lbnQodXJsOiBzdHJpbmcpOiBNdWx0aW1lZGlhQXR0YWNobWVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ2ZpbGUnLFxuICAgICAgJ3BheWxvYWQnOiB7XG4gICAgICAgICd1cmwnOiB1cmwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVBdWRpb0F0dGFjaG1lbnQodXJsOiBzdHJpbmcpOiBNdWx0aW1lZGlhQXR0YWNobWVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd0eXBlJzogJ2F1ZGlvJyxcbiAgICAgICdwYXlsb2FkJzoge1xuICAgICAgICAndXJsJzogdXJsLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsIENoYXQgQVBJcyAoZm9yIHVuaXQgdGVzdGluZyBwdXJwb3NlcylcbiAgICovXG4gIHNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQ6IHN0cmluZywgdGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3VzZUxvY2FsQ2hhdCkge1xuICAgICAgQ2hhdFV0aWxzLnNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIHRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzKCk6IE9iamVjdCB7XG4gICAgdGhpcy5fdmVyaWZ5SW5Mb2NhbENoYXRPclRocm93KCk7XG4gICAgcmV0dXJuIENoYXRVdGlscy5nZXRMb2NhbENoYXRNZXNzYWdlcygpO1xuICB9XG5cbiAgY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICB0aGlzLl92ZXJpZnlJbkxvY2FsQ2hhdE9yVGhyb3coKTtcbiAgICBDaGF0VXRpbHMuY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpO1xuICB9XG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXNGb3JVc2VyKHVzZXJJRDogc3RyaW5nKTogP0FycmF5PE9iamVjdD4ge1xuICAgIHRoaXMuX3ZlcmlmeUluTG9jYWxDaGF0T3JUaHJvdygpO1xuICAgIHJldHVybiBDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKVt1c2VySURdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEJvdCgpO1xuIl19