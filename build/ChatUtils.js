'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _userToMessagesMap = {};

function _saveMessageToLocalChat(recipientID, messageData, fromUser) {
  if (!(recipientID in _userToMessagesMap)) {
    _userToMessagesMap[recipientID] = [];
  }
  // store a special flag to determine the source of message
  messageData.fromUser = fromUser;
  _userToMessagesMap[recipientID].push(messageData);
}

var ChatUtils = {
  send: function send(recipientID, token, messageData, useLocalChat) {
    // Use the local chat interface instead of making GraphAPI call
    if (useLocalChat) {
      _saveMessageToLocalChat(recipientID, messageData, false /* fromUser */);
      return;
    }

    return (0, _requestPromise2.default)({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
      body: {
        recipient: { id: recipientID },
        message: messageData
      },
      json: true
    }, function (err, response) {
      if (err) {
        // TODO
      } else if (response.body.error) {
        // TODO
      }
    });
  },
  getLocalChatMessages: function getLocalChatMessages() {
    return _userToMessagesMap;
  },
  clearLocalChatMessages: function clearLocalChatMessages() {
    _userToMessagesMap = {};
  },
  saveSenderMessageToLocalChat: function saveSenderMessageToLocalChat(senderID, text) {
    _saveMessageToLocalChat(senderID, { text: text }, true /* fromUser */);
  }
};

module.exports = ChatUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxxQkFBcUIsRUFBekI7O0FBRUEsU0FBUyx1QkFBVCxDQUNFLFdBREYsRUFFRSxXQUZGLEVBR0UsUUFIRixFQUlRO0FBQ04sTUFBSSxFQUFFLGVBQWUsa0JBQWpCLENBQUosRUFBMEM7QUFDeEMsdUJBQW1CLFdBQW5CLElBQWtDLEVBQWxDO0FBQ0Q7QUFDRDtBQUNBLGNBQVksUUFBWixHQUF1QixRQUF2QjtBQUNBLHFCQUFtQixXQUFuQixFQUFnQyxJQUFoQyxDQUFxQyxXQUFyQztBQUNEOztBQUVELElBQU0sWUFBWTtBQUNoQixNQURnQixnQkFFZCxXQUZjLEVBR2QsS0FIYyxFQUlkLFdBSmMsRUFLZCxZQUxjLEVBTUw7QUFDVDtBQUNBLFFBQUksWUFBSixFQUFrQjtBQUNoQiw4QkFBd0IsV0FBeEIsRUFBcUMsV0FBckMsRUFBa0QsS0FBbEQsQ0FBd0QsY0FBeEQ7QUFDQTtBQUNEOztBQUVELFdBQU8sOEJBQUc7QUFDUixXQUFLLDZDQURHO0FBRVIsVUFBSSxFQUFDLGNBQWEsS0FBZCxFQUZJO0FBR1IsY0FBUSxNQUhBO0FBSVIsWUFBTTtBQUNKLG1CQUFXLEVBQUMsSUFBSSxXQUFMLEVBRFA7QUFFSixpQkFBUztBQUZMLE9BSkU7QUFRUixZQUFNO0FBUkUsS0FBSCxFQVNKLFVBQVMsR0FBVCxFQUFjLFFBQWQsRUFBd0I7QUFDekIsVUFBSSxHQUFKLEVBQVM7QUFDUDtBQUNELE9BRkQsTUFFTyxJQUFJLFNBQVMsSUFBVCxDQUFjLEtBQWxCLEVBQXlCO0FBQzlCO0FBQ0Q7QUFDRixLQWZNLENBQVA7QUFnQkQsR0E3QmU7QUErQmhCLHNCQS9CZ0Isa0NBK0JlO0FBQzdCLFdBQU8sa0JBQVA7QUFDRCxHQWpDZTtBQW1DaEIsd0JBbkNnQixvQ0FtQ2U7QUFDN0IseUJBQXFCLEVBQXJCO0FBQ0QsR0FyQ2U7QUF1Q2hCLDhCQXZDZ0Isd0NBdUNhLFFBdkNiLEVBdUMrQixJQXZDL0IsRUF1Q21EO0FBQ2pFLDRCQUF3QixRQUF4QixFQUFrQyxFQUFDLE1BQU0sSUFBUCxFQUFsQyxFQUFnRCxJQUFoRCxDQUFxRCxjQUFyRDtBQUNEO0FBekNlLENBQWxCOztBQTRDQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiQ2hhdFV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcblxubGV0IF91c2VyVG9NZXNzYWdlc01hcCA9IHt9O1xuXG5mdW5jdGlvbiBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChcbiAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgbWVzc2FnZURhdGE6IE9iamVjdCxcbiAgZnJvbVVzZXI6IGJvb2xlYW4sXG4pOiB2b2lkIHtcbiAgaWYgKCEocmVjaXBpZW50SUQgaW4gX3VzZXJUb01lc3NhZ2VzTWFwKSkge1xuICAgIF91c2VyVG9NZXNzYWdlc01hcFtyZWNpcGllbnRJRF0gPSBbXTtcbiAgfVxuICAvLyBzdG9yZSBhIHNwZWNpYWwgZmxhZyB0byBkZXRlcm1pbmUgdGhlIHNvdXJjZSBvZiBtZXNzYWdlXG4gIG1lc3NhZ2VEYXRhLmZyb21Vc2VyID0gZnJvbVVzZXI7XG4gIF91c2VyVG9NZXNzYWdlc01hcFtyZWNpcGllbnRJRF0ucHVzaChtZXNzYWdlRGF0YSk7XG59XG5cbmNvbnN0IENoYXRVdGlscyA9IHtcbiAgc2VuZChcbiAgICByZWNpcGllbnRJRDogc3RyaW5nLFxuICAgIHRva2VuOiBzdHJpbmcsXG4gICAgbWVzc2FnZURhdGE6IE9iamVjdCxcbiAgICB1c2VMb2NhbENoYXQ6IGJvb2xlYW4sXG4gICk6IFByb21pc2Uge1xuICAgIC8vIFVzZSB0aGUgbG9jYWwgY2hhdCBpbnRlcmZhY2UgaW5zdGVhZCBvZiBtYWtpbmcgR3JhcGhBUEkgY2FsbFxuICAgIGlmICh1c2VMb2NhbENoYXQpIHtcbiAgICAgIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KHJlY2lwaWVudElELCBtZXNzYWdlRGF0YSwgZmFsc2UgLyogZnJvbVVzZXIgKi8pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBycCh7XG4gICAgICB1cmk6ICdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi42L21lL21lc3NhZ2VzJyxcbiAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOnRva2VufSxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keToge1xuICAgICAgICByZWNpcGllbnQ6IHtpZDogcmVjaXBpZW50SUR9LFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlRGF0YSxcbiAgICAgIH0sXG4gICAgICBqc29uOiB0cnVlLFxuICAgIH0sIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gVE9ET1xuICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5ib2R5LmVycm9yKSB7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHJldHVybiBfdXNlclRvTWVzc2FnZXNNYXA7XG4gIH0sXG5cbiAgY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICBfdXNlclRvTWVzc2FnZXNNYXAgPSB7fTtcbiAgfSxcblxuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB7dGV4dDogdGV4dH0sIHRydWUgLyogZnJvbVVzZXIgKi8pO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0VXRpbHM7XG4iXX0=