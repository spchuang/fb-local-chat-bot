

'use strict';

var _bluebird = require('bluebird');

var _express = require('express');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;


var FBLocalChatRoutes = function FBLocalChatRoutes(router) {
  router.get('/localChat/getMessages', function (req, res) {
    //res.json(MessengerUtils.getLocalChatMessages());
  });

  router.post('/localChat/sendMessage', function () {
    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(req, res) {
      var senderID, message;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              senderID = req.body.senderID;
              message = req.body.message;

              (0, _invariant2.default)(senderID && message, 'both senderID and message are required');

              //await ResponseHandler.handleText(senderID, message);
              res.sendStatus(200);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));
    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  }());

  router.post('/localChat/postback/', function () {
    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(req, res) {
      var senderID, payload;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              senderID = req.body.senderID;
              payload = req.body.payload;


              (0, _invariant2.default)(senderID && payload, 'both senderID and payload are required');
              //await ResponseHandler.handlePostback(senderID, payload);
              res.sendStatus(200);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));
    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  }());

  router.get('/localChat/*', function (req, res) {
    var filePath = req.url;
    if (filePath === '') {
      filePath = 'intern/index.html';
    }
    res.sendFile(filePath, { root: './public' });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBRUE7O0FBQ0E7Ozs7OztBQUQrQjs7O0FBRy9CLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBb0I7QUFDNUMsU0FBTyxHQUFQLENBQVcsd0JBQVgsRUFBcUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjOztBQUVsRCxHQUZEOztBQUlBLFNBQU8sSUFBUCxDQUFZLHdCQUFaO0FBQUEsK0RBQXNDLGlCQUFPLEdBQVAsRUFBWSxHQUFaO0FBQUEsVUFDOUIsUUFEOEIsRUFFOUIsT0FGOEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUM5QixzQkFEOEIsR0FDbkIsSUFBSSxJQUFKLENBQVMsUUFEVTtBQUU5QixxQkFGOEIsR0FFcEIsSUFBSSxJQUFKLENBQVMsT0FGVzs7QUFHcEMsdUNBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7OztBQUdBLGtCQUFJLFVBQUosQ0FBZSxHQUFmOztBQU5vQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUF0QztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVNBLFNBQU8sSUFBUCxDQUFZLHNCQUFaO0FBQUEsK0RBQW9DLGtCQUFPLEdBQVAsRUFBWSxHQUFaO0FBQUEsVUFDNUIsUUFENEIsRUFFNUIsT0FGNEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUM1QixzQkFENEIsR0FDakIsSUFBSSxJQUFKLENBQVMsUUFEUTtBQUU1QixxQkFGNEIsR0FFbEIsSUFBSSxJQUFKLENBQVMsT0FGUzs7O0FBSWxDLHVDQUFVLFlBQVksT0FBdEIsRUFBK0Isd0NBQS9COztBQUVBLGtCQUFJLFVBQUosQ0FBZSxHQUFmOztBQU5rQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVNBLFNBQU8sR0FBUCxDQUFXLGNBQVgsRUFBMkIsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ3ZDLFFBQUksV0FBVyxJQUFJLEdBQW5CO0FBQ0EsUUFBSSxhQUFhLEVBQWpCLEVBQXFCO0FBQ25CLGlCQUFXLG1CQUFYO0FBQ0Q7QUFDRCxRQUFJLFFBQUosQ0FBYSxRQUFiLEVBQXVCLEVBQUMsTUFBTSxVQUFQLEVBQXZCO0FBQ0QsR0FORDs7QUFRQSxTQUFPLE1BQVA7QUFDRCxDQWhDRDs7QUFrQ0EsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJGQkxvY2FsQ2hhdFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnOztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcblxuY29uc3QgRkJMb2NhbENoYXRSb3V0ZXMgPSAocm91dGVyOiBPYmplY3QpID0+IHtcbiAgcm91dGVyLmdldCgnL2xvY2FsQ2hhdC9nZXRNZXNzYWdlcycsIChyZXEsIHJlcykgPT4ge1xuICAgIC8vcmVzLmpzb24oTWVzc2VuZ2VyVXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3NlbmRNZXNzYWdlJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgbWVzc2FnZSwgJ2JvdGggc2VuZGVySUQgYW5kIG1lc3NhZ2UgYXJlIHJlcXVpcmVkJyk7XG5cbiAgICAvL2F3YWl0IFJlc3BvbnNlSGFuZGxlci5oYW5kbGVUZXh0KHNlbmRlcklELCBtZXNzYWdlKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIC8vYXdhaXQgUmVzcG9uc2VIYW5kbGVyLmhhbmRsZVBvc3RiYWNrKHNlbmRlcklELCBwYXlsb2FkKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0LyonLCAocmVxLCByZXMpID0+IHtcbiAgICB2YXIgZmlsZVBhdGggPSByZXEudXJsO1xuICAgIGlmIChmaWxlUGF0aCA9PT0gJycpIHtcbiAgICAgIGZpbGVQYXRoID0gJ2ludGVybi9pbmRleC5odG1sJztcbiAgICB9XG4gICAgcmVzLnNlbmRGaWxlKGZpbGVQYXRoLCB7cm9vdDogJy4vcHVibGljJ30pO1xuICB9KTtcblxuICByZXR1cm4gcm91dGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZCTG9jYWxDaGF0Um91dGVzO1xuIl19