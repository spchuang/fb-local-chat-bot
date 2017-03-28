

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
    this._persistentMenu = persistentMenu;
  },
  getPersistentMenu: function getPersistentMenu() {
    return this._persistentMenu;
  }
};

module.exports = ChatUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQU1BLElBQUkscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsU0FBUyx1QkFBVCxDQUNFLFdBREYsRUFFRSxXQUZGLEVBR0UsUUFIRixFQUlRO0FBQ04sTUFBSSxFQUFFLGVBQWUsa0JBQWpCLENBQUosRUFBMEM7QUFDeEMsdUJBQW1CLFdBQW5CLElBQWtDLEVBQWxDO0FBQ0Q7O0FBRUQsY0FBWSxRQUFaLEdBQXVCLFFBQXZCO0FBQ0EscUJBQW1CLFdBQW5CLEVBQWdDLElBQWhDLENBQXFDLFdBQXJDO0FBQ0Q7O0FBRUQsSUFBTSxZQUFZO0FBQ2hCLHFCQURnQiwrQkFDSSxLQURKLEVBQzRCO0FBQzFDLFdBQU8sOEJBQUc7QUFDUixXQUFLLHNEQURHO0FBRVIsVUFBSSxFQUFDLGNBQWMsS0FBZixFQUZJO0FBR1IsY0FBUSxNQUhBO0FBSVIsWUFBTTtBQUNKLHlCQUFpQjtBQURiLE9BSkU7QUFPUixZQUFNO0FBUEUsS0FBSCxDQUFQO0FBU0QsR0FYZTtBQWFoQixNQWJnQixnQkFjZCxXQWRjLEVBZWQsS0FmYyxFQWdCZCxJQWhCYyxFQWlCZCxZQWpCYyxFQWtCZCxZQWxCYyxFQW1CSjtBQUNWLFFBQUksWUFBSixFQUFrQjtBQUNoQiw4QkFBd0IsV0FBeEIsRUFBcUMsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixJQUFsQixDQUFyQyxFQUE4RCxLLGVBQTlEO0FBQ0Q7O0FBRUQsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLGFBQU8sOEJBQUc7QUFDUixhQUFLLDZDQURHO0FBRVIsWUFBSSxFQUFDLGNBQWEsS0FBZCxFQUZJO0FBR1IsZ0JBQVEsTUFIQTtBQUlSO0FBQ0UscUJBQVcsRUFBQyxJQUFJLFdBQUw7QUFEYixXQUVLLElBRkwsQ0FKUTtBQVFSLGNBQU07QUFSRSxPQUFILEVBU0osVUFBUyxHQUFULEVBQWMsUUFBZCxFQUF3QjtBQUN6QixZQUFJLEdBQUosRUFBUzs7QUFFUixTQUZELE1BRU8sSUFBSSxTQUFTLElBQVQsQ0FBYyxLQUFsQixFQUF5Qjs7QUFFL0I7QUFDRixPQWZNLENBQVA7QUFnQkQ7QUFDRDtBQUNELEdBM0NlO0FBNkNoQixzQkE3Q2dCLGtDQTZDZTtBQUM3QixXQUFPLGtCQUFQO0FBQ0QsR0EvQ2U7QUFpRGhCLHdCQWpEZ0Isb0NBaURlO0FBQzdCLHlCQUFxQixFQUFyQjtBQUNELEdBbkRlO0FBcURoQiw4QkFyRGdCLHdDQXFEYSxRQXJEYixFQXFEK0IsSUFyRC9CLEVBcURtRDtBQUNqRSw0QkFBd0IsUUFBeEIsRUFBa0MsRUFBQyxTQUFTLEVBQUMsTUFBTSxJQUFQLEVBQVYsRUFBbEMsRUFBMkQsSSxlQUEzRDtBQUNELEdBdkRlO0FBeURoQixtQkF6RGdCLDZCQXlERSxjQXpERixFQXlEK0M7QUFDN0QsU0FBSyxlQUFMLEdBQXVCLGNBQXZCO0FBQ0QsR0EzRGU7QUE2RGhCLG1CQTdEZ0IsK0JBNkQyQjtBQUN6QyxXQUFPLEtBQUssZUFBWjtBQUNEO0FBL0RlLENBQWxCOztBQWtFQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiQ2hhdFV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcblxuaW1wb3J0IHR5cGUge1xuICBQZXJzaXN0ZW50TWVudSxcbn0gZnJvbSAnLi90eXBlJztcblxubGV0IF91c2VyVG9NZXNzYWdlc01hcCA9IHt9O1xubGV0IF9wZXJzaXN0ZW50TWVudSA9IFtdO1xuXG5mdW5jdGlvbiBfc2F2ZU1lc3NhZ2VUb0xvY2FsQ2hhdChcbiAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgbWVzc2FnZURhdGE6IE9iamVjdCxcbiAgZnJvbVVzZXI6IGJvb2xlYW4sXG4pOiB2b2lkIHtcbiAgaWYgKCEocmVjaXBpZW50SUQgaW4gX3VzZXJUb01lc3NhZ2VzTWFwKSkge1xuICAgIF91c2VyVG9NZXNzYWdlc01hcFtyZWNpcGllbnRJRF0gPSBbXTtcbiAgfVxuICAvLyBzdG9yZSBhIHNwZWNpYWwgZmxhZyB0byBkZXRlcm1pbmUgdGhlIHNvdXJjZSBvZiBtZXNzYWdlXG4gIG1lc3NhZ2VEYXRhLmZyb21Vc2VyID0gZnJvbVVzZXI7XG4gIF91c2VyVG9NZXNzYWdlc01hcFtyZWNpcGllbnRJRF0ucHVzaChtZXNzYWdlRGF0YSk7XG59XG5cbmNvbnN0IENoYXRVdGlscyA9IHtcbiAgc3RvcmVQZXJzaXN0ZW50TWVudSh0b2tlbjogc3RyaW5nKTogUHJvbWlzZSB7XG4gICAgcmV0dXJuIHJwKHtcbiAgICAgIHVyaTogJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YyLjYvbWUvbWVzc2VuZ2VyX3Byb2ZpbGUnLFxuICAgICAgcXM6IHthY2Nlc3NfdG9rZW46IHRva2VufSxcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keToge1xuICAgICAgICBwZXJzaXN0ZW50X21lbnU6IF9wZXJzaXN0ZW50TWVudSxcbiAgICAgIH0sXG4gICAgICBqc29uOiB0cnVlLFxuICAgIH0pO1xuICB9LFxuXG4gIHNlbmQoXG4gICAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgICB0b2tlbjogc3RyaW5nLFxuICAgIGRhdGE6IE9iamVjdCxcbiAgICB1c2VMb2NhbENoYXQ6IGJvb2xlYW4sXG4gICAgdXNlTWVzc2VuZ2VyOiBib29sZWFuLFxuICApOiA/UHJvbWlzZSB7XG4gICAgaWYgKHVzZUxvY2FsQ2hhdCkge1xuICAgICAgX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQocmVjaXBpZW50SUQsIE9iamVjdC5hc3NpZ24oe30sIGRhdGEpLCBmYWxzZSAvKiBmcm9tVXNlciAqLyk7XG4gICAgfVxuXG4gICAgaWYgKHVzZU1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgdXJpOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNi9tZS9tZXNzYWdlcycsXG4gICAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOnRva2VufSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICByZWNpcGllbnQ6IHtpZDogcmVjaXBpZW50SUR9LFxuICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgIH0sXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgICB9LCBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuYm9keS5lcnJvcikge1xuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfSxcblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHJldHVybiBfdXNlclRvTWVzc2FnZXNNYXA7XG4gIH0sXG5cbiAgY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICBfdXNlclRvTWVzc2FnZXNNYXAgPSB7fTtcbiAgfSxcblxuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB7bWVzc2FnZToge3RleHQ6IHRleHR9fSwgdHJ1ZSAvKiBmcm9tVXNlciAqLyk7XG4gIH0sXG5cbiAgc2V0UGVyc2lzdGVudE1lbnUocGVyc2lzdGVudE1lbnU6IEFycmF5PFBlcnNpc3RlbnRNZW51Pik6IHZvaWQge1xuICAgIHRoaXMuX3BlcnNpc3RlbnRNZW51ID0gcGVyc2lzdGVudE1lbnU7XG4gIH0sXG5cbiAgZ2V0UGVyc2lzdGVudE1lbnUoKTogQXJyYXk8UGVyc2lzdGVudE1lbnU+IHtcbiAgICByZXR1cm4gdGhpcy5fcGVyc2lzdGVudE1lbnU7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRVdGlscztcbiJdfQ==