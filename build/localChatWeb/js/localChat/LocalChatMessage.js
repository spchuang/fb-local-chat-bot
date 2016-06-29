'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _EventStore2 = require('../common/EventStore');

var _EventStore3 = _interopRequireDefault(_EventStore2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var POLLING_INTERVAL = 1500;
var BASE_URL = '';

var LocalChatStore = function (_EventStore) {
  _inherits(LocalChatStore, _EventStore);

  function LocalChatStore() {
    _classCallCheck(this, LocalChatStore);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LocalChatStore).call(this));

    _this._userIDToMessagesMap = {};
    _this.startPolling();
    return _this;
  }

  _createClass(LocalChatStore, [{
    key: 'startPolling',
    value: function startPolling() {
      var _this2 = this;

      // get all the local messages
      var url = BASE_URL + '/intern/localChat/getMessages';
      _jquery2.default.get(url).done(function (res) {
        _this2._userIDToMessagesMap = res;
        _this2.emitChange();
        setTimeout(_this2.startPolling.bind(_this2), POLLING_INTERVAL);
      }).fail(function (res) {
        console.log(res);
        setTimeout(_this2.startPolling.bind(_this2), POLLING_INTERVAL);
      });
    }
  }, {
    key: 'getMessagesForUser',
    value: function getMessagesForUser(userID) {
      if (userID in this._userIDToMessagesMap) {
        return this._userIDToMessagesMap[userID];
      }
      return [];
    }
  }, {
    key: 'sendMessageForUser',
    value: function sendMessageForUser(senderID, message) {
      var url = BASE_URL + '/intern/localChat/sendMessage';
      _jquery2.default.post(url, { senderID: senderID, message: message }).done(function (res) {}).fail(function (res) {
        console.log(res);
      });
    }
  }, {
    key: 'sendPostbackForUser',
    value: function sendPostbackForUser(senderID, payload) {
      var url = BASE_URL + '/intern/localChat/postback';
      _jquery2.default.post(url, { senderID: senderID, payload: payload }).done(function (res) {}).fail(function (res) {});
    }
  }]);

  return LocalChatStore;
}(_EventStore3.default);

var store = new LocalChatStore();

module.exports = store;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9sb2NhbENoYXRXZWIvanMvbG9jYWxDaGF0L0xvY2FsQ2hhdE1lc3NhZ2UuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLG1CQUFtQixJQUF6QjtBQUNBLElBQU0sV0FBVyxFQUFqQjs7SUFFTSxjOzs7QUFHSiw0QkFBYztBQUFBOztBQUFBOztBQUVaLFVBQUssb0JBQUwsR0FBNEIsRUFBNUI7QUFDQSxVQUFLLFlBQUw7QUFIWTtBQUliOzs7O21DQUVvQjtBQUFBOzs7QUFFbkIsVUFBTSxNQUFNLFdBQVcsK0JBQXZCO0FBQ0EsdUJBQUUsR0FBRixDQUFNLEdBQU4sRUFDRyxJQURILENBQ1EsVUFBQyxHQUFELEVBQWlCO0FBQ3JCLGVBQUssb0JBQUwsR0FBNEIsR0FBNUI7QUFDQSxlQUFLLFVBQUw7QUFDQSxtQkFBVyxPQUFLLFlBQUwsQ0FBa0IsSUFBbEIsUUFBWCxFQUF5QyxnQkFBekM7QUFDRCxPQUxILEVBTUcsSUFOSCxDQU1RLFVBQUMsR0FBRCxFQUFpQjtBQUNyQixnQkFBUSxHQUFSLENBQVksR0FBWjtBQUNBLG1CQUFXLE9BQUssWUFBTCxDQUFrQixJQUFsQixRQUFYLEVBQXlDLGdCQUF6QztBQUNELE9BVEg7QUFVRDs7O3VDQUVrQixNLEVBQStCO0FBQ2hELFVBQUksVUFBVSxLQUFLLG9CQUFuQixFQUF5QztBQUN2QyxlQUFPLEtBQUssb0JBQUwsQ0FBMEIsTUFBMUIsQ0FBUDtBQUNEO0FBQ0QsYUFBTyxFQUFQO0FBQ0Q7Ozt1Q0FFa0IsUSxFQUFrQixPLEVBQXVCO0FBQzFELFVBQU0sTUFBTSxXQUFXLCtCQUF2QjtBQUNBLHVCQUFFLElBQUYsQ0FBTyxHQUFQLEVBQVksRUFBQyxVQUFVLFFBQVgsRUFBcUIsU0FBUyxPQUE5QixFQUFaLEVBQ0csSUFESCxDQUNRLFVBQUMsR0FBRCxFQUFpQixDQUN0QixDQUZILEVBR0csSUFISCxDQUdRLFVBQUMsR0FBRCxFQUFpQjtBQUNyQixnQkFBUSxHQUFSLENBQVksR0FBWjtBQUNELE9BTEg7QUFNRDs7O3dDQUVtQixRLEVBQWtCLE8sRUFBdUI7QUFDM0QsVUFBTSxNQUFNLFdBQVcsNEJBQXZCO0FBQ0EsdUJBQUUsSUFBRixDQUFPLEdBQVAsRUFBWSxFQUFDLFVBQVUsUUFBWCxFQUFxQixTQUFTLE9BQTlCLEVBQVosRUFDRyxJQURILENBQ1EsVUFBQyxHQUFELEVBQWlCLENBQ3RCLENBRkgsRUFHRyxJQUhILENBR1EsVUFBQyxHQUFELEVBQWlCLENBRXRCLENBTEg7QUFNRDs7Ozs7O0FBR0gsSUFBTSxRQUFRLElBQUksY0FBSixFQUFkOztBQUVBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJMb2NhbENoYXRNZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBFdmVudFN0b3JlIGZyb20gJy4uL2NvbW1vbi9FdmVudFN0b3JlJztcblxuY29uc3QgUE9MTElOR19JTlRFUlZBTCA9IDE1MDA7XG5jb25zdCBCQVNFX1VSTCA9ICcnO1xuXG5jbGFzcyBMb2NhbENoYXRTdG9yZSBleHRlbmRzIEV2ZW50U3RvcmUge1xuICBfdXNlcklEVG9NZXNzYWdlc01hcDogT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdXNlcklEVG9NZXNzYWdlc01hcCA9IHt9O1xuICAgIHRoaXMuc3RhcnRQb2xsaW5nKCk7XG4gIH1cblxuICBzdGFydFBvbGxpbmcoKTogdm9pZCB7XG4gICAgLy8gZ2V0IGFsbCB0aGUgbG9jYWwgbWVzc2FnZXNcbiAgICBjb25zdCB1cmwgPSBCQVNFX1VSTCArICcvaW50ZXJuL2xvY2FsQ2hhdC9nZXRNZXNzYWdlcyc7XG4gICAgJC5nZXQodXJsKVxuICAgICAgLmRvbmUoKHJlczogT2JqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuX3VzZXJJRFRvTWVzc2FnZXNNYXAgPSByZXM7XG4gICAgICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc3RhcnRQb2xsaW5nLmJpbmQodGhpcyksIFBPTExJTkdfSU5URVJWQUwpXG4gICAgICB9KVxuICAgICAgLmZhaWwoKHJlczogT2JqZWN0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5zdGFydFBvbGxpbmcuYmluZCh0aGlzKSwgUE9MTElOR19JTlRFUlZBTClcbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0TWVzc2FnZXNGb3JVc2VyKHVzZXJJRDogc3RyaW5nKTogQXJyYXk8T2JqZWN0PiB7XG4gICAgaWYgKHVzZXJJRCBpbiB0aGlzLl91c2VySURUb01lc3NhZ2VzTWFwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXNlcklEVG9NZXNzYWdlc01hcFt1c2VySURdO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBzZW5kTWVzc2FnZUZvclVzZXIoc2VuZGVySUQ6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgdXJsID0gQkFTRV9VUkwgKyAnL2ludGVybi9sb2NhbENoYXQvc2VuZE1lc3NhZ2UnO1xuICAgICQucG9zdCh1cmwsIHtzZW5kZXJJRDogc2VuZGVySUQsIG1lc3NhZ2U6IG1lc3NhZ2V9KVxuICAgICAgLmRvbmUoKHJlczogT2JqZWN0KSA9PiB7XG4gICAgICB9KVxuICAgICAgLmZhaWwoKHJlczogT2JqZWN0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHNlbmRQb3N0YmFja0ZvclVzZXIoc2VuZGVySUQ6IHN0cmluZywgcGF5bG9hZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgdXJsID0gQkFTRV9VUkwgKyAnL2ludGVybi9sb2NhbENoYXQvcG9zdGJhY2snO1xuICAgICQucG9zdCh1cmwsIHtzZW5kZXJJRDogc2VuZGVySUQsIHBheWxvYWQ6IHBheWxvYWR9KVxuICAgICAgLmRvbmUoKHJlczogT2JqZWN0KSA9PiB7XG4gICAgICB9KVxuICAgICAgLmZhaWwoKHJlczogT2JqZWN0KSA9PiB7XG5cbiAgICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IHN0b3JlID0gbmV3IExvY2FsQ2hhdFN0b3JlKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iXX0=