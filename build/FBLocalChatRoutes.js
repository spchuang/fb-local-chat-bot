

'use strict';

var _ChatUtils = require('./ChatUtils');

var _ChatUtils2 = _interopRequireDefault(_ChatUtils);

var _express = require('express');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _doT = require('doT');

var _doT2 = _interopRequireDefault(_doT);

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
    if (filePath !== '/') {
      res.sendFile(filePath, { root: './localChatWeb' });
      return;
    }
    var baseURL = req.baseUrl;

    // return html
    _fs2.default.readFile(__dirname + '/FBLocalChatWeb.html', 'utf8', function (err, data) {
      if (err) {
        res.send("ERROR");
        return;
      }
      var tempFn = _doT2.default.template(data);
      res.send(tempFn({ baseURL: baseURL }));
    });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFIK0I7OztBQUsvQixJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBQyxNQUFELEVBQTRCO0FBQ3BELFNBQU8sR0FBUCxDQUFXLHdCQUFYLEVBQXFDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNqRCxRQUFJLElBQUosQ0FBUyxvQkFBVSxvQkFBVixFQUFUO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7OztBQUdBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQVBEOztBQVNBLFNBQU8sSUFBUCxDQUFZLHNCQUFaLEVBQW9DLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNoRCxRQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsUUFBMUI7QUFDQSxRQUFNLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBekI7O0FBRUEsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7O0FBRUEsUUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELEdBUEQ7O0FBU0EsU0FBTyxHQUFQLENBQVcsY0FBWCxFQUEyQixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDdkMsUUFBSSxXQUFXLElBQUksR0FBSixDQUFRLE9BQVIsQ0FBZ0IsWUFBaEIsRUFBOEIsRUFBOUIsQ0FBZjtBQUNBLFFBQUksYUFBYSxHQUFqQixFQUFzQjtBQUNwQixVQUFJLFFBQUosQ0FBYSxRQUFiLEVBQXVCLEVBQUMsTUFBTSxnQkFBUCxFQUF2QjtBQUNBO0FBQ0Q7QUFDRCxRQUFNLFVBQVUsSUFBSSxPQUFwQjs7O0FBR0EsaUJBQUcsUUFBSCxDQUFZLFlBQVksc0JBQXhCLEVBQWdELE1BQWhELEVBQXdELFVBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUNyRSxVQUFJLEdBQUosRUFBUztBQUNQLFlBQUksSUFBSixDQUFTLE9BQVQ7QUFDQTtBQUNEO0FBQ0QsVUFBSSxTQUFTLGNBQUksUUFBSixDQUFhLElBQWIsQ0FBYjtBQUNBLFVBQUksSUFBSixDQUFTLE9BQU8sRUFBQyxnQkFBRCxFQUFQLENBQVQ7QUFDRCxLQVBEO0FBUUQsR0FqQkQ7O0FBbUJBLFNBQU8sTUFBUDtBQUNELENBM0NEOztBQTZDQSxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6IkZCTG9jYWxDaGF0Um91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2hhdFV0aWxzIGZyb20gJy4vQ2hhdFV0aWxzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJzs7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGRvVCBmcm9tICdkb1QnO1xuXG5jb25zdCBGQkxvY2FsQ2hhdFJvdXRlcyA9IChyb3V0ZXI6IFJvdXRlcik6IFJvdXRlciA9PiB7XG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvZ2V0TWVzc2FnZXMnLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbihDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3NlbmRNZXNzYWdlJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgbWVzc2FnZSwgJ2JvdGggc2VuZGVySUQgYW5kIG1lc3NhZ2UgYXJlIHJlcXVpcmVkJyk7XG5cbiAgICAvL2F3YWl0IFJlc3BvbnNlSGFuZGxlci5oYW5kbGVUZXh0KHNlbmRlcklELCBtZXNzYWdlKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIC8vYXdhaXQgUmVzcG9uc2VIYW5kbGVyLmhhbmRsZVBvc3RiYWNrKHNlbmRlcklELCBwYXlsb2FkKTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0LyonLCAocmVxLCByZXMpID0+IHtcbiAgICB2YXIgZmlsZVBhdGggPSByZXEudXJsLnJlcGxhY2UoJy9sb2NhbENoYXQnLCAnJyk7XG4gICAgaWYgKGZpbGVQYXRoICE9PSAnLycpIHtcbiAgICAgIHJlcy5zZW5kRmlsZShmaWxlUGF0aCwge3Jvb3Q6ICcuL2xvY2FsQ2hhdFdlYid9KTtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBiYXNlVVJMID0gcmVxLmJhc2VVcmw7XG5cbiAgICAvLyByZXR1cm4gaHRtbFxuICAgIGZzLnJlYWRGaWxlKF9fZGlybmFtZSArICcvRkJMb2NhbENoYXRXZWIuaHRtbCcsICd1dGY4JywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXMuc2VuZChcIkVSUk9SXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdGVtcEZuID0gZG9ULnRlbXBsYXRlKGRhdGEpO1xuICAgICAgcmVzLnNlbmQodGVtcEZuKHtiYXNlVVJMfSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcm91dGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZCTG9jYWxDaGF0Um91dGVzO1xuIl19