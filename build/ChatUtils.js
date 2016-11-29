

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
      _saveMessageToLocalChat(recipientID, messageData, false /* fromUser */);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLHFCQUFxQixFQUF6Qjs7QUFFQSxTQUFTLHVCQUFULENBQ0UsV0FERixFQUVFLFdBRkYsRUFHRSxRQUhGLEVBSVE7QUFDTixNQUFJLEVBQUUsZUFBZSxrQkFBakIsQ0FBSixFQUEwQztBQUN4Qyx1QkFBbUIsV0FBbkIsSUFBa0MsRUFBbEM7QUFDRDs7QUFFRCxjQUFZLFFBQVosR0FBdUIsUUFBdkI7QUFDQSxxQkFBbUIsV0FBbkIsRUFBZ0MsSUFBaEMsQ0FBcUMsV0FBckM7QUFDRDs7QUFFRCxJQUFNLFlBQVk7QUFDaEIsTUFEZ0IsZ0JBRWQsV0FGYyxFQUdkLEtBSGMsRUFJZCxXQUpjLEVBS2QsWUFMYyxFQU1kLFlBTmMsRUFPSjtBQUNWLFFBQUksWUFBSixFQUFrQjtBQUNoQiw4QkFBd0IsV0FBeEIsRUFBcUMsV0FBckMsRUFBa0QsSyxlQUFsRDtBQUNEOztBQUVELFFBQUksWUFBSixFQUFrQjtBQUNoQixhQUFPLDhCQUFHO0FBQ1IsYUFBSyw2Q0FERztBQUVSLFlBQUksRUFBQyxjQUFhLEtBQWQsRUFGSTtBQUdSLGdCQUFRLE1BSEE7QUFJUixjQUFNO0FBQ0oscUJBQVcsRUFBQyxJQUFJLFdBQUwsRUFEUDtBQUVKLG1CQUFTO0FBRkwsU0FKRTtBQVFSLGNBQU07QUFSRSxPQUFILEVBU0osVUFBUyxHQUFULEVBQWMsUUFBZCxFQUF3QjtBQUN6QixZQUFJLEdBQUosRUFBUzs7QUFFUixTQUZELE1BRU8sSUFBSSxTQUFTLElBQVQsQ0FBYyxLQUFsQixFQUF5Qjs7QUFFL0I7QUFDRixPQWZNLENBQVA7QUFnQkQ7QUFDRDtBQUNELEdBL0JlO0FBaUNoQixzQkFqQ2dCLGtDQWlDZTtBQUM3QixXQUFPLGtCQUFQO0FBQ0QsR0FuQ2U7QUFxQ2hCLHdCQXJDZ0Isb0NBcUNlO0FBQzdCLHlCQUFxQixFQUFyQjtBQUNELEdBdkNlO0FBeUNoQiw4QkF6Q2dCLHdDQXlDYSxRQXpDYixFQXlDK0IsSUF6Qy9CLEVBeUNtRDtBQUNqRSw0QkFBd0IsUUFBeEIsRUFBa0MsRUFBQyxNQUFNLElBQVAsRUFBbEMsRUFBZ0QsSSxlQUFoRDtBQUNEO0FBM0NlLENBQWxCOztBQThDQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiQ2hhdFV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcblxubGV0IF91c2VyVG9NZXNzYWdlc01hcCA9IHt9O1xuXG5mdW5jdGlvbiBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChcbiAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgbWVzc2FnZURhdGE6IE9iamVjdCxcbiAgZnJvbVVzZXI6IGJvb2xlYW4sXG4pOiB2b2lkIHtcbiAgaWYgKCEocmVjaXBpZW50SUQgaW4gX3VzZXJUb01lc3NhZ2VzTWFwKSkge1xuICAgIF91c2VyVG9NZXNzYWdlc01hcFtyZWNpcGllbnRJRF0gPSBbXTtcbiAgfVxuICAvLyBzdG9yZSBhIHNwZWNpYWwgZmxhZyB0byBkZXRlcm1pbmUgdGhlIHNvdXJjZSBvZiBtZXNzYWdlXG4gIG1lc3NhZ2VEYXRhLmZyb21Vc2VyID0gZnJvbVVzZXI7XG4gIF91c2VyVG9NZXNzYWdlc01hcFtyZWNpcGllbnRJRF0ucHVzaChtZXNzYWdlRGF0YSk7XG59XG5cbmNvbnN0IENoYXRVdGlscyA9IHtcbiAgc2VuZChcbiAgICByZWNpcGllbnRJRDogc3RyaW5nLFxuICAgIHRva2VuOiBzdHJpbmcsXG4gICAgbWVzc2FnZURhdGE6IE9iamVjdCxcbiAgICB1c2VMb2NhbENoYXQ6IGJvb2xlYW4sXG4gICAgdXNlTWVzc2VuZ2VyOiBib29sZWFuLFxuICApOiA/UHJvbWlzZSB7XG4gICAgaWYgKHVzZUxvY2FsQ2hhdCkge1xuICAgICAgX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQocmVjaXBpZW50SUQsIG1lc3NhZ2VEYXRhLCBmYWxzZSAvKiBmcm9tVXNlciAqLyk7XG4gICAgfVxuXG4gICAgaWYgKHVzZU1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgdXJpOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNi9tZS9tZXNzYWdlcycsXG4gICAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOnRva2VufSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICByZWNpcGllbnQ6IHtpZDogcmVjaXBpZW50SUR9LFxuICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhLFxuICAgICAgICB9LFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgfSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmJvZHkuZXJyb3IpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gX3VzZXJUb01lc3NhZ2VzTWFwO1xuICB9LFxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgX3VzZXJUb01lc3NhZ2VzTWFwID0ge307XG4gIH0sXG5cbiAgc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwge3RleHQ6IHRleHR9LCB0cnVlIC8qIGZyb21Vc2VyICovKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdFV0aWxzO1xuIl19