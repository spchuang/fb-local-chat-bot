

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _userToMessagesMap = {};
var _persistentMenu = [];

function _saveMessageToLocalChat(recipientID, messageData, fromUser) {
  if (!(recipientID in _userToMessagesMap)) {
    _userToMessagesMap[recipientID] = [];
  }
  // store a special flag to determine the source of message
  messageData.fromUser = fromUser;
  _userToMessagesMap[recipientID].push(messageData);
}

var ChatUtils = {
  storePersistentMenu: function storePersistentMenu(token) {
    return (0, _requestPromise2.default)({
      uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
      qs: { access_token: token },
      method: 'POST',
      body: {
        persistent_menu: _persistentMenu
      },
      json: true
    });
  },
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
  },
  setPersistentMenu: function setPersistentMenu(persistentMenu) {
    _persistentMenu = persistentMenu;
  },
  getPersistentMenu: function getPersistentMenu() {
    return _persistentMenu;
  }
};

module.exports = ChatUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQU1BLElBQUkscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsU0FBUyx1QkFBVCxDQUNFLFdBREYsRUFFRSxXQUZGLEVBR0UsUUFIRixFQUlRO0FBQ04sTUFBSSxFQUFFLGVBQWUsa0JBQWpCLENBQUosRUFBMEM7QUFDeEMsdUJBQW1CLFdBQW5CLElBQWtDLEVBQWxDO0FBQ0Q7O0FBRUQsY0FBWSxRQUFaLEdBQXVCLFFBQXZCO0FBQ0EscUJBQW1CLFdBQW5CLEVBQWdDLElBQWhDLENBQXFDLFdBQXJDO0FBQ0Q7O0FBRUQsSUFBTSxZQUFZO0FBQ2hCLHFCQURnQiwrQkFDSSxLQURKLEVBQzRCO0FBQzFDLFdBQU8sOEJBQUc7QUFDUixXQUFLLHNEQURHO0FBRVIsVUFBSSxFQUFDLGNBQWMsS0FBZixFQUZJO0FBR1IsY0FBUSxNQUhBO0FBSVIsWUFBTTtBQUNKLHlCQUFpQjtBQURiLE9BSkU7QUFPUixZQUFNO0FBUEUsS0FBSCxDQUFQO0FBU0QsR0FYZTtBQWFoQixNQWJnQixnQkFjZCxXQWRjLEVBZWQsS0FmYyxFQWdCZCxJQWhCYyxFQWlCZCxZQWpCYyxFQWtCZCxZQWxCYyxFQW1CSjtBQUNWLFFBQUksWUFBSixFQUFrQjtBQUNoQiw4QkFBd0IsV0FBeEIsRUFBcUMsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixJQUFsQixDQUFyQyxFQUE4RCxLLGVBQTlEO0FBQ0Q7O0FBRUQsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLGFBQU8sOEJBQUc7QUFDUixhQUFLLDZDQURHO0FBRVIsWUFBSSxFQUFDLGNBQWEsS0FBZCxFQUZJO0FBR1IsZ0JBQVEsTUFIQTtBQUlSO0FBQ0UscUJBQVcsRUFBQyxJQUFJLFdBQUw7QUFEYixXQUVLLElBRkwsQ0FKUTtBQVFSLGNBQU07QUFSRSxPQUFILEVBU0osVUFBUyxHQUFULEVBQWMsUUFBZCxFQUF3QjtBQUN6QixZQUFJLEdBQUosRUFBUzs7QUFFUixTQUZELE1BRU8sSUFBSSxTQUFTLElBQVQsQ0FBYyxLQUFsQixFQUF5Qjs7QUFFL0I7QUFDRixPQWZNLENBQVA7QUFnQkQ7QUFDRDtBQUNELEdBM0NlO0FBNkNoQixzQkE3Q2dCLGtDQTZDZTtBQUM3QixXQUFPLGtCQUFQO0FBQ0QsR0EvQ2U7QUFpRGhCLHdCQWpEZ0Isb0NBaURlO0FBQzdCLHlCQUFxQixFQUFyQjtBQUNELEdBbkRlO0FBcURoQiw4QkFyRGdCLHdDQXFEYSxRQXJEYixFQXFEK0IsSUFyRC9CLEVBcURtRDtBQUNqRSw0QkFBd0IsUUFBeEIsRUFBa0MsRUFBQyxTQUFTLEVBQUMsTUFBTSxJQUFQLEVBQVYsRUFBbEMsRUFBMkQsSSxlQUEzRDtBQUNELEdBdkRlO0FBeURoQixtQkF6RGdCLDZCQXlERSxjQXpERixFQXlEK0M7QUFDN0Qsc0JBQWtCLGNBQWxCO0FBQ0QsR0EzRGU7QUE2RGhCLG1CQTdEZ0IsK0JBNkQyQjtBQUN6QyxXQUFPLGVBQVA7QUFDRDtBQS9EZSxDQUFsQjs7QUFrRUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6IkNoYXRVdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgUGVyc2lzdGVudE1lbnUsXG59IGZyb20gJy4vdHlwZSc7XG5cbmxldCBfdXNlclRvTWVzc2FnZXNNYXAgPSB7fTtcbmxldCBfcGVyc2lzdGVudE1lbnUgPSBbXTtcblxuZnVuY3Rpb24gX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQoXG4gIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gIG1lc3NhZ2VEYXRhOiBPYmplY3QsXG4gIGZyb21Vc2VyOiBib29sZWFuLFxuKTogdm9pZCB7XG4gIGlmICghKHJlY2lwaWVudElEIGluIF91c2VyVG9NZXNzYWdlc01hcCkpIHtcbiAgICBfdXNlclRvTWVzc2FnZXNNYXBbcmVjaXBpZW50SURdID0gW107XG4gIH1cbiAgLy8gc3RvcmUgYSBzcGVjaWFsIGZsYWcgdG8gZGV0ZXJtaW5lIHRoZSBzb3VyY2Ugb2YgbWVzc2FnZVxuICBtZXNzYWdlRGF0YS5mcm9tVXNlciA9IGZyb21Vc2VyO1xuICBfdXNlclRvTWVzc2FnZXNNYXBbcmVjaXBpZW50SURdLnB1c2gobWVzc2FnZURhdGEpO1xufVxuXG5jb25zdCBDaGF0VXRpbHMgPSB7XG4gIHN0b3JlUGVyc2lzdGVudE1lbnUodG9rZW46IHN0cmluZyk6IFByb21pc2Uge1xuICAgIHJldHVybiBycCh7XG4gICAgICB1cmk6ICdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS92Mi42L21lL21lc3Nlbmdlcl9wcm9maWxlJyxcbiAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOiB0b2tlbn0sXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcGVyc2lzdGVudF9tZW51OiBfcGVyc2lzdGVudE1lbnUsXG4gICAgICB9LFxuICAgICAganNvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfSxcblxuICBzZW5kKFxuICAgIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gICAgdG9rZW46IHN0cmluZyxcbiAgICBkYXRhOiBPYmplY3QsXG4gICAgdXNlTG9jYWxDaGF0OiBib29sZWFuLFxuICAgIHVzZU1lc3NlbmdlcjogYm9vbGVhbixcbiAgKTogP1Byb21pc2Uge1xuICAgIGlmICh1c2VMb2NhbENoYXQpIHtcbiAgICAgIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KHJlY2lwaWVudElELCBPYmplY3QuYXNzaWduKHt9LCBkYXRhKSwgZmFsc2UgLyogZnJvbVVzZXIgKi8pO1xuICAgIH1cblxuICAgIGlmICh1c2VNZXNzZW5nZXIpIHtcbiAgICAgIHJldHVybiBycCh7XG4gICAgICAgIHVyaTogJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjYvbWUvbWVzc2FnZXMnLFxuICAgICAgICBxczoge2FjY2Vzc190b2tlbjp0b2tlbn0sXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgcmVjaXBpZW50OiB7aWQ6IHJlY2lwaWVudElEfSxcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICB9LFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgfSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmJvZHkuZXJyb3IpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gX3VzZXJUb01lc3NhZ2VzTWFwO1xuICB9LFxuXG4gIGNsZWFyTG9jYWxDaGF0TWVzc2FnZXMoKTogdm9pZCB7XG4gICAgX3VzZXJUb01lc3NhZ2VzTWFwID0ge307XG4gIH0sXG5cbiAgc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwge21lc3NhZ2U6IHt0ZXh0OiB0ZXh0fX0sIHRydWUgLyogZnJvbVVzZXIgKi8pO1xuICB9LFxuXG4gIHNldFBlcnNpc3RlbnRNZW51KHBlcnNpc3RlbnRNZW51OiBBcnJheTxQZXJzaXN0ZW50TWVudT4pOiB2b2lkIHtcbiAgICBfcGVyc2lzdGVudE1lbnUgPSBwZXJzaXN0ZW50TWVudTtcbiAgfSxcblxuICBnZXRQZXJzaXN0ZW50TWVudSgpOiBBcnJheTxQZXJzaXN0ZW50TWVudT4ge1xuICAgIHJldHVybiBfcGVyc2lzdGVudE1lbnU7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRVdGlscztcbiJdfQ==