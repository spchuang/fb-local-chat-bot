

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLHFCQUFxQixFQUF6Qjs7QUFFQSxTQUFTLHVCQUFULENBQ0UsV0FERixFQUVFLFdBRkYsRUFHRSxRQUhGLEVBSVE7QUFDTixNQUFJLEVBQUUsZUFBZSxrQkFBakIsQ0FBSixFQUEwQztBQUN4Qyx1QkFBbUIsV0FBbkIsSUFBa0MsRUFBbEM7QUFDRDs7QUFFRCxjQUFZLFFBQVosR0FBdUIsUUFBdkI7QUFDQSxxQkFBbUIsV0FBbkIsRUFBZ0MsSUFBaEMsQ0FBcUMsV0FBckM7QUFDRDs7QUFFRCxJQUFNLFlBQVk7QUFDaEIsTUFEZ0IsZ0JBRWQsV0FGYyxFQUdkLEtBSGMsRUFJZCxXQUpjLEVBS2QsWUFMYyxFQU1MOztBQUVULFFBQUksWUFBSixFQUFrQjtBQUNoQiw4QkFBd0IsV0FBeEIsRUFBcUMsV0FBckMsRUFBa0QsSyxlQUFsRDtBQUNBO0FBQ0Q7O0FBRUQsV0FBTyw4QkFBRztBQUNSLFdBQUssNkNBREc7QUFFUixVQUFJLEVBQUMsY0FBYSxLQUFkLEVBRkk7QUFHUixjQUFRLE1BSEE7QUFJUixZQUFNO0FBQ0osbUJBQVcsRUFBQyxJQUFJLFdBQUwsRUFEUDtBQUVKLGlCQUFTO0FBRkwsT0FKRTtBQVFSLFlBQU07QUFSRSxLQUFILEVBU0osVUFBUyxHQUFULEVBQWMsUUFBZCxFQUF3QjtBQUN6QixVQUFJLEdBQUosRUFBUzs7QUFFUixPQUZELE1BRU8sSUFBSSxTQUFTLElBQVQsQ0FBYyxLQUFsQixFQUF5Qjs7QUFFL0I7QUFDRixLQWZNLENBQVA7QUFnQkQsR0E3QmU7QUErQmhCLHNCQS9CZ0Isa0NBK0JlO0FBQzdCLFdBQU8sa0JBQVA7QUFDRCxHQWpDZTtBQW1DaEIsd0JBbkNnQixvQ0FtQ2U7QUFDN0IseUJBQXFCLEVBQXJCO0FBQ0QsR0FyQ2U7QUF1Q2hCLDhCQXZDZ0Isd0NBdUNhLFFBdkNiLEVBdUMrQixJQXZDL0IsRUF1Q21EO0FBQ2pFLDRCQUF3QixRQUF4QixFQUFrQyxFQUFDLE1BQU0sSUFBUCxFQUFsQyxFQUFnRCxJLGVBQWhEO0FBQ0Q7QUF6Q2UsQ0FBbEI7O0FBNENBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJDaGF0VXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuXG5sZXQgX3VzZXJUb01lc3NhZ2VzTWFwID0ge307XG5cbmZ1bmN0aW9uIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KFxuICByZWNpcGllbnRJRDogc3RyaW5nLFxuICBtZXNzYWdlRGF0YTogT2JqZWN0LFxuICBmcm9tVXNlcjogYm9vbGVhbixcbik6IHZvaWQge1xuICBpZiAoIShyZWNpcGllbnRJRCBpbiBfdXNlclRvTWVzc2FnZXNNYXApKSB7XG4gICAgX3VzZXJUb01lc3NhZ2VzTWFwW3JlY2lwaWVudElEXSA9IFtdO1xuICB9XG4gIC8vIHN0b3JlIGEgc3BlY2lhbCBmbGFnIHRvIGRldGVybWluZSB0aGUgc291cmNlIG9mIG1lc3NhZ2VcbiAgbWVzc2FnZURhdGEuZnJvbVVzZXIgPSBmcm9tVXNlcjtcbiAgX3VzZXJUb01lc3NhZ2VzTWFwW3JlY2lwaWVudElEXS5wdXNoKG1lc3NhZ2VEYXRhKTtcbn1cblxuY29uc3QgQ2hhdFV0aWxzID0ge1xuICBzZW5kKFxuICAgIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gICAgdG9rZW46IHN0cmluZyxcbiAgICBtZXNzYWdlRGF0YTogT2JqZWN0LFxuICAgIHVzZUxvY2FsQ2hhdDogYm9vbGVhbixcbiAgKTogUHJvbWlzZSB7XG4gICAgLy8gVXNlIHRoZSBsb2NhbCBjaGF0IGludGVyZmFjZSBpbnN0ZWFkIG9mIG1ha2luZyBHcmFwaEFQSSBjYWxsXG4gICAgaWYgKHVzZUxvY2FsQ2hhdCkge1xuICAgICAgX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhLCBmYWxzZSAvKiBmcm9tVXNlciAqLyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHJwKHtcbiAgICAgIHVyaTogJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjYvbWUvbWVzc2FnZXMnLFxuICAgICAgcXM6IHthY2Nlc3NfdG9rZW46dG9rZW59LFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHJlY2lwaWVudDoge2lkOiByZWNpcGllbnRJRH0sXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhLFxuICAgICAgfSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgfSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBUT0RPXG4gICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmJvZHkuZXJyb3IpIHtcbiAgICAgICAgLy8gVE9ET1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldExvY2FsQ2hhdE1lc3NhZ2VzKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIF91c2VyVG9NZXNzYWdlc01hcDtcbiAgfSxcblxuICBjbGVhckxvY2FsQ2hhdE1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIF91c2VyVG9NZXNzYWdlc01hcCA9IHt9O1xuICB9LFxuXG4gIHNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQ6IHN0cmluZywgdGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIHt0ZXh0OiB0ZXh0fSwgdHJ1ZSAvKiBmcm9tVXNlciAqLyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRVdGlscztcbiJdfQ==