

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  send: function send(recipientID, token, data, useLocalChat, useMessenger) {
    if (useLocalChat) {
      _saveMessageToLocalChat(recipientID, Object.assign({}, data), false /* fromUser */);
    }

    if (useMessenger) {
      return (0, _requestPromise2.default)({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        body: _extends({
          recipient: { id: recipientID }
        }, data),
        json: true
      }, function (err, response) {
        if (err) {
          // TODO
        } else if (response.body.error) {
          // TODO
        }
      });
    }
    return;
  },
  getLocalChatMessages: function getLocalChatMessages() {
    return _userToMessagesMap;
  },
  clearLocalChatMessages: function clearLocalChatMessages() {
    _userToMessagesMap = {};
  },
  saveSenderMessageToLocalChat: function saveSenderMessageToLocalChat(senderID, text) {
    _saveMessageToLocalChat(senderID, { message: { text: text } }, true /* fromUser */);
  }
};

module.exports = ChatUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUkscUJBQXFCLEVBQXpCOztBQUVBLFNBQVMsdUJBQVQsQ0FDRSxXQURGLEVBRUUsV0FGRixFQUdFLFFBSEYsRUFJUTtBQUNOLE1BQUksRUFBRSxlQUFlLGtCQUFqQixDQUFKLEVBQTBDO0FBQ3hDLHVCQUFtQixXQUFuQixJQUFrQyxFQUFsQztBQUNEOztBQUVELGNBQVksUUFBWixHQUF1QixRQUF2QjtBQUNBLHFCQUFtQixXQUFuQixFQUFnQyxJQUFoQyxDQUFxQyxXQUFyQztBQUNEOztBQUVELElBQU0sWUFBWTtBQUVoQixNQUZnQixnQkFHZCxXQUhjLEVBSWQsS0FKYyxFQUtkLElBTGMsRUFNZCxZQU5jLEVBT2QsWUFQYyxFQVFKO0FBQ1YsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLDhCQUF3QixXQUF4QixFQUFxQyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLElBQWxCLENBQXJDLEVBQThELEssZUFBOUQ7QUFDRDs7QUFFRCxRQUFJLFlBQUosRUFBa0I7QUFDaEIsYUFBTyw4QkFBRztBQUNSLGFBQUssNkNBREc7QUFFUixZQUFJLEVBQUMsY0FBYSxLQUFkLEVBRkk7QUFHUixnQkFBUSxNQUhBO0FBSVI7QUFDRSxxQkFBVyxFQUFDLElBQUksV0FBTDtBQURiLFdBRUssSUFGTCxDQUpRO0FBUVIsY0FBTTtBQVJFLE9BQUgsRUFTSixVQUFTLEdBQVQsRUFBYyxRQUFkLEVBQXdCO0FBQ3pCLFlBQUksR0FBSixFQUFTOztBQUVSLFNBRkQsTUFFTyxJQUFJLFNBQVMsSUFBVCxDQUFjLEtBQWxCLEVBQXlCOztBQUUvQjtBQUNGLE9BZk0sQ0FBUDtBQWdCRDtBQUNEO0FBQ0QsR0FoQ2U7QUFrQ2hCLHNCQWxDZ0Isa0NBa0NlO0FBQzdCLFdBQU8sa0JBQVA7QUFDRCxHQXBDZTtBQXNDaEIsd0JBdENnQixvQ0FzQ2U7QUFDN0IseUJBQXFCLEVBQXJCO0FBQ0QsR0F4Q2U7QUEwQ2hCLDhCQTFDZ0Isd0NBMENhLFFBMUNiLEVBMEMrQixJQTFDL0IsRUEwQ21EO0FBQ2pFLDRCQUF3QixRQUF4QixFQUFrQyxFQUFDLFNBQVMsRUFBQyxNQUFNLElBQVAsRUFBVixFQUFsQyxFQUEyRCxJLGVBQTNEO0FBQ0Q7QUE1Q2UsQ0FBbEI7O0FBK0NBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJDaGF0VXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuXG5sZXQgX3VzZXJUb01lc3NhZ2VzTWFwID0ge307XG5cbmZ1bmN0aW9uIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KFxuICByZWNpcGllbnRJRDogc3RyaW5nLFxuICBtZXNzYWdlRGF0YTogT2JqZWN0LFxuICBmcm9tVXNlcjogYm9vbGVhbixcbik6IHZvaWQge1xuICBpZiAoIShyZWNpcGllbnRJRCBpbiBfdXNlclRvTWVzc2FnZXNNYXApKSB7XG4gICAgX3VzZXJUb01lc3NhZ2VzTWFwW3JlY2lwaWVudElEXSA9IFtdO1xuICB9XG4gIC8vIHN0b3JlIGEgc3BlY2lhbCBmbGFnIHRvIGRldGVybWluZSB0aGUgc291cmNlIG9mIG1lc3NhZ2VcbiAgbWVzc2FnZURhdGEuZnJvbVVzZXIgPSBmcm9tVXNlcjtcbiAgX3VzZXJUb01lc3NhZ2VzTWFwW3JlY2lwaWVudElEXS5wdXNoKG1lc3NhZ2VEYXRhKTtcbn1cblxuY29uc3QgQ2hhdFV0aWxzID0ge1xuXG4gIHNlbmQoXG4gICAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgICB0b2tlbjogc3RyaW5nLFxuICAgIGRhdGE6IE9iamVjdCxcbiAgICB1c2VMb2NhbENoYXQ6IGJvb2xlYW4sXG4gICAgdXNlTWVzc2VuZ2VyOiBib29sZWFuLFxuICApOiA/UHJvbWlzZSB7XG4gICAgaWYgKHVzZUxvY2FsQ2hhdCkge1xuICAgICAgX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQocmVjaXBpZW50SUQsIE9iamVjdC5hc3NpZ24oe30sIGRhdGEpLCBmYWxzZSAvKiBmcm9tVXNlciAqLyk7XG4gICAgfVxuXG4gICAgaWYgKHVzZU1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgdXJpOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNi9tZS9tZXNzYWdlcycsXG4gICAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOnRva2VufSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICByZWNpcGllbnQ6IHtpZDogcmVjaXBpZW50SUR9LFxuICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgIH0sXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgICB9LCBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuYm9keS5lcnJvcikge1xuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfSxcblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHJldHVybiBfdXNlclRvTWVzc2FnZXNNYXA7XG4gIH0sXG5cbiAgY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICBfdXNlclRvTWVzc2FnZXNNYXAgPSB7fTtcbiAgfSxcblxuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB7bWVzc2FnZToge3RleHQ6IHRleHR9fSwgdHJ1ZSAvKiBmcm9tVXNlciAqLyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRVdGlscztcbiJdfQ==