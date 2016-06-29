

'use strict';

var _ChatUtils = require('./ChatUtils');

var _ChatUtils2 = _interopRequireDefault(_ChatUtils);

var _express = require('express');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;


var FBLocalChatRoutes = function FBLocalChatRoutes(router) {
  router.get('/localChat/getMessages', function (req, res) {
    res.json(_ChatUtils2.default.getLocalChatMessages());
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
    var filePath = req.url.replace('/localChat', '');
    if (filePath === '/') {
      filePath = 'index.html';
    }
    res.sendFile(filePath, { root: './localChatWeb' });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUQrQjs7O0FBRy9CLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBNEI7QUFDcEQsU0FBTyxHQUFQLENBQVcsd0JBQVgsRUFBcUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2pELFFBQUksSUFBSixDQUFTLG9CQUFVLG9CQUFWLEVBQVQ7QUFDRCxHQUZEOztBQUlBLFNBQU8sSUFBUCxDQUFZLHdCQUFaLEVBQXNDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNsRCxRQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsUUFBMUI7QUFDQSxRQUFNLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBekI7QUFDQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjs7O0FBR0EsUUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELEdBUEQ7O0FBU0EsU0FBTyxJQUFQLENBQVksc0JBQVosRUFBb0MsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2hELFFBQU0sV0FBVyxJQUFJLElBQUosQ0FBUyxRQUExQjtBQUNBLFFBQU0sVUFBVSxJQUFJLElBQUosQ0FBUyxPQUF6Qjs7QUFFQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjs7QUFFQSxRQUFJLFVBQUosQ0FBZSxHQUFmO0FBQ0QsR0FQRDs7QUFTQSxTQUFPLEdBQVAsQ0FBVyxjQUFYLEVBQTJCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUN2QyxRQUFJLFdBQVcsSUFBSSxHQUFKLENBQVEsT0FBUixDQUFnQixZQUFoQixFQUE4QixFQUE5QixDQUFmO0FBQ0EsUUFBSSxhQUFhLEdBQWpCLEVBQXNCO0FBQ3BCLGlCQUFXLFlBQVg7QUFDRDtBQUNELFFBQUksUUFBSixDQUFhLFFBQWIsRUFBdUIsRUFBQyxNQUFNLGdCQUFQLEVBQXZCO0FBQ0QsR0FORDs7QUFRQSxTQUFPLE1BQVA7QUFDRCxDQWhDRDs7QUFrQ0EsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJGQkxvY2FsQ2hhdFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnZXhwcmVzcyc7O1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5jb25zdCBGQkxvY2FsQ2hhdFJvdXRlcyA9IChyb3V0ZXI6IFJvdXRlcik6IFJvdXRlciA9PiB7XG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvZ2V0TWVzc2FnZXMnLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbihDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3NlbmRNZXNzYWdlJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgbWVzc2FnZSwgJ2JvdGggc2VuZGVySUQgYW5kIG1lc3NhZ2UgYXJlIHJlcXVpcmVkJyk7XG5cbiAgICAvL2F3YWl0IFJlc3BvbnNlSGFuZGxlci5oYW5kbGVUZXh0KHNlbmRlcklELCBtZXNzYWdlKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIC8vYXdhaXQgUmVzcG9uc2VIYW5kbGVyLmhhbmRsZVBvc3RiYWNrKHNlbmRlcklELCBwYXlsb2FkKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0LyonLCAocmVxLCByZXMpID0+IHtcbiAgICB2YXIgZmlsZVBhdGggPSByZXEudXJsLnJlcGxhY2UoJy9sb2NhbENoYXQnLCAnJyk7XG4gICAgaWYgKGZpbGVQYXRoID09PSAnLycpIHtcbiAgICAgIGZpbGVQYXRoID0gJ2luZGV4Lmh0bWwnO1xuICAgIH1cbiAgICByZXMuc2VuZEZpbGUoZmlsZVBhdGgsIHtyb290OiAnLi9sb2NhbENoYXRXZWInfSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRkJMb2NhbENoYXRSb3V0ZXM7XG4iXX0=