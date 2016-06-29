

'use strict';

var _express = require('express');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;


var FBLocalChatRoutes = function FBLocalChatRoutes(router) {
  router.get('/localChat/getMessages', function (req, res) {
    //res.json(MessengerUtils.getLocalChatMessages());
  });

  router.post('/localChat/sendMessage', function (req, res) {
    var senderID = req.body.senderID;
    var message = req.body.message;
    (0, _invariant2.default)(senderID && message, 'both senderID and message are required');

    //await ResponseHandler.handleText(senderID, message);
    res.sendStatus(200);
  });

  router.post('/localChat/postback/', function (req, res) {
    var senderID = req.body.senderID;
    var payload = req.body.payload;

    (0, _invariant2.default)(senderID && payload, 'both senderID and payload are required');
    //await ResponseHandler.handlePostback(senderID, payload);
    res.sendStatus(200);
  });

  router.get('/localChat/*', function (req, res) {
    console.log("HI");
    var filePath = req.url;
    if (filePath === '') {
      filePath = 'intern/index.html';
    }
    res.sendFile(filePath, { root: './public' });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOztBQUNBOzs7Ozs7QUFEK0I7OztBQUcvQixJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBQyxNQUFELEVBQW9CO0FBQzVDLFNBQU8sR0FBUCxDQUFXLHdCQUFYLEVBQXFDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYzs7QUFFbEQsR0FGRDs7QUFJQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7OztBQUdBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQVBEOztBQVNBLFNBQU8sSUFBUCxDQUFZLHNCQUFaLEVBQW9DLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNoRCxRQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsUUFBMUI7QUFDQSxRQUFNLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBekI7O0FBRUEsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7O0FBRUEsUUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELEdBUEQ7O0FBU0EsU0FBTyxHQUFQLENBQVcsY0FBWCxFQUEyQixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDdkMsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLFFBQUksV0FBVyxJQUFJLEdBQW5CO0FBQ0EsUUFBSSxhQUFhLEVBQWpCLEVBQXFCO0FBQ25CLGlCQUFXLG1CQUFYO0FBQ0Q7QUFDRCxRQUFJLFFBQUosQ0FBYSxRQUFiLEVBQXVCLEVBQUMsTUFBTSxVQUFQLEVBQXZCO0FBQ0QsR0FQRDs7QUFTQSxTQUFPLE1BQVA7QUFDRCxDQWpDRDs7QUFtQ0EsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJGQkxvY2FsQ2hhdFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnOztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcblxuY29uc3QgRkJMb2NhbENoYXRSb3V0ZXMgPSAocm91dGVyOiBPYmplY3QpID0+IHtcbiAgcm91dGVyLmdldCgnL2xvY2FsQ2hhdC9nZXRNZXNzYWdlcycsIChyZXEsIHJlcykgPT4ge1xuICAgIC8vcmVzLmpzb24oTWVzc2VuZ2VyVXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3NlbmRNZXNzYWdlJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgbWVzc2FnZSwgJ2JvdGggc2VuZGVySUQgYW5kIG1lc3NhZ2UgYXJlIHJlcXVpcmVkJyk7XG5cbiAgICAvL2F3YWl0IFJlc3BvbnNlSGFuZGxlci5oYW5kbGVUZXh0KHNlbmRlcklELCBtZXNzYWdlKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIC8vYXdhaXQgUmVzcG9uc2VIYW5kbGVyLmhhbmRsZVBvc3RiYWNrKHNlbmRlcklELCBwYXlsb2FkKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0LyonLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkhJXCIpO1xuICAgIHZhciBmaWxlUGF0aCA9IHJlcS51cmw7XG4gICAgaWYgKGZpbGVQYXRoID09PSAnJykge1xuICAgICAgZmlsZVBhdGggPSAnaW50ZXJuL2luZGV4Lmh0bWwnO1xuICAgIH1cbiAgICByZXMuc2VuZEZpbGUoZmlsZVBhdGgsIHtyb290OiAnLi9wdWJsaWMnfSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRkJMb2NhbENoYXRSb3V0ZXM7XG4iXX0=