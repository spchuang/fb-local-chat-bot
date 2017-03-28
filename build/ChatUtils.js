

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGF0VXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQU1BLElBQUkscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsU0FBUyx1QkFBVCxDQUNFLFdBREYsRUFFRSxXQUZGLEVBR0UsUUFIRixFQUlRO0FBQ04sTUFBSSxFQUFFLGVBQWUsa0JBQWpCLENBQUosRUFBMEM7QUFDeEMsdUJBQW1CLFdBQW5CLElBQWtDLEVBQWxDO0FBQ0Q7O0FBRUQsY0FBWSxRQUFaLEdBQXVCLFFBQXZCO0FBQ0EscUJBQW1CLFdBQW5CLEVBQWdDLElBQWhDLENBQXFDLFdBQXJDO0FBQ0Q7O0FBRUQsSUFBTSxZQUFZO0FBQ2hCLE1BRGdCLGdCQUVkLFdBRmMsRUFHZCxLQUhjLEVBSWQsSUFKYyxFQUtkLFlBTGMsRUFNZCxZQU5jLEVBT0o7QUFDVixRQUFJLFlBQUosRUFBa0I7QUFDaEIsOEJBQXdCLFdBQXhCLEVBQXFDLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsSUFBbEIsQ0FBckMsRUFBOEQsSyxlQUE5RDtBQUNEOztBQUVELFFBQUksWUFBSixFQUFrQjtBQUNoQixhQUFPLDhCQUFHO0FBQ1IsYUFBSyw2Q0FERztBQUVSLFlBQUksRUFBQyxjQUFhLEtBQWQsRUFGSTtBQUdSLGdCQUFRLE1BSEE7QUFJUjtBQUNFLHFCQUFXLEVBQUMsSUFBSSxXQUFMO0FBRGIsV0FFSyxJQUZMLENBSlE7QUFRUixjQUFNO0FBUkUsT0FBSCxFQVNKLFVBQVMsR0FBVCxFQUFjLFFBQWQsRUFBd0I7QUFDekIsWUFBSSxHQUFKLEVBQVM7O0FBRVIsU0FGRCxNQUVPLElBQUksU0FBUyxJQUFULENBQWMsS0FBbEIsRUFBeUI7O0FBRS9CO0FBQ0YsT0FmTSxDQUFQO0FBZ0JEO0FBQ0Q7QUFDRCxHQS9CZTtBQWlDaEIsc0JBakNnQixrQ0FpQ2U7QUFDN0IsV0FBTyxrQkFBUDtBQUNELEdBbkNlO0FBcUNoQix3QkFyQ2dCLG9DQXFDZTtBQUM3Qix5QkFBcUIsRUFBckI7QUFDRCxHQXZDZTtBQXlDaEIsOEJBekNnQix3Q0F5Q2EsUUF6Q2IsRUF5QytCLElBekMvQixFQXlDbUQ7QUFDakUsNEJBQXdCLFFBQXhCLEVBQWtDLEVBQUMsU0FBUyxFQUFDLE1BQU0sSUFBUCxFQUFWLEVBQWxDLEVBQTJELEksZUFBM0Q7QUFDRCxHQTNDZTtBQTZDaEIsbUJBN0NnQiw2QkE2Q0UsY0E3Q0YsRUE2QytDO0FBQzdELFNBQUssZUFBTCxHQUF1QixjQUF2QjtBQUNELEdBL0NlO0FBaURoQixtQkFqRGdCLCtCQWlEMkI7QUFDekMsV0FBTyxLQUFLLGVBQVo7QUFDRDtBQW5EZSxDQUFsQjs7QUFzREEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6IkNoYXRVdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgUGVyc2lzdGVudE1lbnUsXG59IGZyb20gJy4vdHlwZSc7XG5cbmxldCBfdXNlclRvTWVzc2FnZXNNYXAgPSB7fTtcbmxldCBfcGVyc2lzdGVudE1lbnUgPSBbXTtcblxuZnVuY3Rpb24gX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQoXG4gIHJlY2lwaWVudElEOiBzdHJpbmcsXG4gIG1lc3NhZ2VEYXRhOiBPYmplY3QsXG4gIGZyb21Vc2VyOiBib29sZWFuLFxuKTogdm9pZCB7XG4gIGlmICghKHJlY2lwaWVudElEIGluIF91c2VyVG9NZXNzYWdlc01hcCkpIHtcbiAgICBfdXNlclRvTWVzc2FnZXNNYXBbcmVjaXBpZW50SURdID0gW107XG4gIH1cbiAgLy8gc3RvcmUgYSBzcGVjaWFsIGZsYWcgdG8gZGV0ZXJtaW5lIHRoZSBzb3VyY2Ugb2YgbWVzc2FnZVxuICBtZXNzYWdlRGF0YS5mcm9tVXNlciA9IGZyb21Vc2VyO1xuICBfdXNlclRvTWVzc2FnZXNNYXBbcmVjaXBpZW50SURdLnB1c2gobWVzc2FnZURhdGEpO1xufVxuXG5jb25zdCBDaGF0VXRpbHMgPSB7XG4gIHNlbmQoXG4gICAgcmVjaXBpZW50SUQ6IHN0cmluZyxcbiAgICB0b2tlbjogc3RyaW5nLFxuICAgIGRhdGE6IE9iamVjdCxcbiAgICB1c2VMb2NhbENoYXQ6IGJvb2xlYW4sXG4gICAgdXNlTWVzc2VuZ2VyOiBib29sZWFuLFxuICApOiA/UHJvbWlzZSB7XG4gICAgaWYgKHVzZUxvY2FsQ2hhdCkge1xuICAgICAgX3NhdmVNZXNzYWdlVG9Mb2NhbENoYXQocmVjaXBpZW50SUQsIE9iamVjdC5hc3NpZ24oe30sIGRhdGEpLCBmYWxzZSAvKiBmcm9tVXNlciAqLyk7XG4gICAgfVxuXG4gICAgaWYgKHVzZU1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuIHJwKHtcbiAgICAgICAgdXJpOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNi9tZS9tZXNzYWdlcycsXG4gICAgICAgIHFzOiB7YWNjZXNzX3Rva2VuOnRva2VufSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICByZWNpcGllbnQ6IHtpZDogcmVjaXBpZW50SUR9LFxuICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgIH0sXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgICB9LCBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuYm9keS5lcnJvcikge1xuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfSxcblxuICBnZXRMb2NhbENoYXRNZXNzYWdlcygpOiBPYmplY3Qge1xuICAgIHJldHVybiBfdXNlclRvTWVzc2FnZXNNYXA7XG4gIH0sXG5cbiAgY2xlYXJMb2NhbENoYXRNZXNzYWdlcygpOiB2b2lkIHtcbiAgICBfdXNlclRvTWVzc2FnZXNNYXAgPSB7fTtcbiAgfSxcblxuICBzYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklEOiBzdHJpbmcsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIF9zYXZlTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCB7bWVzc2FnZToge3RleHQ6IHRleHR9fSwgdHJ1ZSAvKiBmcm9tVXNlciAqLyk7XG4gIH0sXG5cbiAgc2V0UGVyc2lzdGVudE1lbnUocGVyc2lzdGVudE1lbnU6IEFycmF5PFBlcnNpc3RlbnRNZW51Pik6IHZvaWQge1xuICAgIHRoaXMuX3BlcnNpc3RlbnRNZW51ID0gcGVyc2lzdGVudE1lbnU7XG4gIH0sXG5cbiAgZ2V0UGVyc2lzdGVudE1lbnUoKTogQXJyYXk8UGVyc2lzdGVudE1lbnU+IHtcbiAgICByZXR1cm4gdGhpcy5fcGVyc2lzdGVudE1lbnU7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXRVdGlscztcbiJdfQ==