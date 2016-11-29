

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
  send: function send(recipientID, token, messageData, useLocalChat, useMessenger) {
    if (useLocalChat) {
      _saveMessageToLocalChat(recipientID, Object.assign({}, messageData), false /* fromUser */);
    }

    if (useMessenger) {
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
    _saveMessageToLocalChat(senderID, { text: text }, true /* fromUser */);
  }
};

module.exports = ChatUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLHFCQUFxQixFQUF6Qjs7QUFFQSxTQUFTLHVCQUFULENBQ0UsV0FERixFQUVFLFdBRkYsRUFHRSxRQUhGLEVBSVE7QUFDTixNQUFJLEVBQUUsZUFBZSxrQkFBakIsQ0FBSixFQUEwQztBQUN4Qyx1QkFBbUIsV0FBbkIsSUFBa0MsRUFBbEM7QUFDRDs7QUFFRCxjQUFZLFFBQVosR0FBdUIsUUFBdkI7QUFDQSxxQkFBbUIsV0FBbkIsRUFBZ0MsSUFBaEMsQ0FBcUMsV0FBckM7QUFDRDs7QUFFRCxJQUFNLFlBQVk7QUFDaEIsTUFEZ0IsZ0JBRWQsV0FGYyxFQUdkLEtBSGMsRUFJZCxXQUpjLEVBS2QsWUFMYyxFQU1kLFlBTmMsRUFPSjtBQUNWLFFBQUksWUFBSixFQUFrQjtBQUNoQiw4QkFBd0IsV0FBeEIsRUFBcUMsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixXQUFsQixDQUFyQyxFQUFxRSxLLGVBQXJFO0FBQ0Q7O0FBRUQsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLGFBQU8sOEJBQUc7QUFDUixhQUFLLDZDQURHO0FBRVIsWUFBSSxFQUFDLGNBQWEsS0FBZCxFQUZJO0FBR1IsZ0JBQVEsTUFIQTtBQUlSLGNBQU07QUFDSixxQkFBVyxFQUFDLElBQUksV0FBTCxFQURQO0FBRUosbUJBQVM7QUFGTCxTQUpFO0FBUVIsY0FBTTtBQVJFLE9BQUgsRUFTSixVQUFTLEdBQVQsRUFBYyxRQUFkLEVBQXdCO0FBQ3pCLFlBQUksR0FBSixFQUFTOztBQUVSLFNBRkQsTUFFTyxJQUFJLFNBQVMsSUFBVCxDQUFjLEtBQWxCLEVBQXlCOztBQUUvQjtBQUNGLE9BZk0sQ0FBUDtBQWdCRDtBQUNEO0FBQ0QsR0EvQmU7QUFpQ2hCLHNCQWpDZ0Isa0NBaUNlO0FBQzdCLFdBQU8sa0JBQVA7QUFDRCxHQW5DZTtBQXFDaEIsd0JBckNnQixvQ0FxQ2U7QUFDN0IseUJBQXFCLEVBQXJCO0FBQ0QsR0F2Q2U7QUF5Q2hCLDhCQXpDZ0Isd0NBeUNhLFFBekNiLEVBeUMrQixJQXpDL0IsRUF5Q21EO0FBQ2pFLDRCQUF3QixRQUF4QixFQUFrQyxFQUFDLE1BQU0sSUFBUCxFQUFsQyxFQUFnRCxJLGVBQWhEO0FBQ0Q7QUEzQ2UsQ0FBbEI7O0FBOENBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJDaGF0VXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuXG5sZXQgX3VzZXJUb01lc3NhZ2VzTWFwID0ge307XG5cbmZ1bmN0aW9uIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KFxuICByZWNpcGllbnRJRDogc3RyaW5nLFxuICBtZXNzYWdlRGF0YTogT2JqZWN0LFxuICBmcm9tVXNlcjogYm9vbGVhbixcbik6IHZvaWQge1xuICBpZiAoIShyZWNpcGllbnRJRCBpbiBfdXNlclRvTWVzc2FnZXNNYXApKSB7XG4gICAgX3VzZXJUb01lc3NhZ2VzTWFwW3JlY2lwaWVudElEXSA9IFtdO1xuICB9XG4gIC8vIHN0b3JlIGEgc3BlY2lhbCBmbGFnIHRvIGRldGVybWluZSB0aGUgc291cmNlIG9mIG1lc3NhZ2VcbiAgbWVzc2FnZURhdGEuZnJvbVVzZXIgPSBmcm9tVXNlcjtcbiAgX3VzZXJUb01lc3NhZ2VzTWFwW3JlY2lwaWVudElEXS5wdXNoKG1lc3NhZ2VEYXRhKTtcbn1cblxuY29uc3QgQ2hhdFV0aWxzID0ge1xuICBzZW5kKFxuICAgIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gICAgdG9rZW46IHN0cmluZyxcbiAgICBtZXNzYWdlRGF0YTogT2JqZWN0LFxuICAgIHVzZUxvY2FsQ2hhdDogYm9vbGVhbixcbiAgICB1c2VNZXNzZW5nZXI6IGJvb2xlYW4sXG4gICk6ID9Qcm9taXNlIHtcbiAgICBpZiAodXNlTG9jYWxDaGF0KSB7XG4gICAgICBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChyZWNpcGllbnRJRCwgT2JqZWN0LmFzc2lnbih7fSwgbWVzc2FnZURhdGEpLCBmYWxzZSAvKiBmcm9tVXNlciAqLyk7XG4gICAgfVxuXG4gICAgaWYgKHVzZU1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgdXJpOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNi9tZS9tZXNzYWdlcycsXG4gICAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOnRva2VufSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICByZWNpcGllbnQ6IHtpZDogcmVjaXBpZW50SUR9LFxuICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhLFxuICAgICAgICB9LFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgfSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmJvZHkuZXJyb3IpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gX3VzZXJUb01lc3NhZ2VzTWFwO1xuICB9LFxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgX3VzZXJUb01lc3NhZ2VzTWFwID0ge307XG4gIH0sXG5cbiAgc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwge3RleHQ6IHRleHR9LCB0cnVlIC8qIGZyb21Vc2VyICovKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdFV0aWxzO1xuIl19