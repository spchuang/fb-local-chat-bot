

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


var FBLocalChatRoutes = function FBLocalChatRoutes(router, Bot) {
  router.get('/localChat/getMessages', function (req, res) {
    res.json(_ChatUtils2.default.getLocalChatMessages());
  });

  router.post('/localChat/sendMessage', function (req, res) {
    var senderID = req.body.senderID;
    var message = req.body.message;
    (0, _invariant2.default)(senderID && message, 'both senderID and message are required');

    _ChatUtils2.default.saveSenderMessageToLocalChat(senderID, message);
    var event = {
      sender: { id: senderID },
      recipiient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      message: {
        text: message
      }
    };
    Bot.emit('text', event);
    res.sendStatus(200);
  });

  router.post('/localChat/postback/', function (req, res) {
    var senderID = req.body.senderID;
    var payload = req.body.payload;

    (0, _invariant2.default)(senderID && payload, 'both senderID and payload are required');
    var event = {
      sender: { id: senderID },
      recipiient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      postback: {
        payload: payload
      }
    };
    Bot.emit('postback', event);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFIK0I7OztBQUsvQixJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBQyxNQUFELEVBQWlCLEdBQWpCLEVBQXlDO0FBQ2pFLFNBQU8sR0FBUCxDQUFXLHdCQUFYLEVBQXFDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNqRCxRQUFJLElBQUosQ0FBUyxvQkFBVSxvQkFBVixFQUFUO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7O0FBRUEsd0JBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsT0FBakQ7QUFDQSxRQUFNLFFBQVE7QUFDWixjQUFRLEVBQUMsSUFBSSxRQUFMLEVBREk7QUFFWixrQkFBWSxFQUFDLElBQUksUUFBTCxFQUZBO0FBR1osaUJBQVcsS0FBSyxLQUFMLENBQVcsSUFBSSxJQUFKLEtBQWEsSUFBeEIsQ0FIQztBQUlaLGVBQVM7QUFDUCxjQUFNO0FBREM7QUFKRyxLQUFkO0FBUUEsUUFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixLQUFqQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQWhCRDs7QUFrQkEsU0FBTyxJQUFQLENBQVksc0JBQVosRUFBb0MsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2hELFFBQU0sV0FBVyxJQUFJLElBQUosQ0FBUyxRQUExQjtBQUNBLFFBQU0sVUFBVSxJQUFJLElBQUosQ0FBUyxPQUF6Qjs7QUFFQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjtBQUNBLFFBQU0sUUFBUTtBQUNaLGNBQVEsRUFBQyxJQUFJLFFBQUwsRUFESTtBQUVaLGtCQUFZLEVBQUMsSUFBSSxRQUFMLEVBRkE7QUFHWixpQkFBVyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQUosS0FBYSxJQUF4QixDQUhDO0FBSVosZ0JBQVU7QUFDUixpQkFBUztBQUREO0FBSkUsS0FBZDtBQVFBLFFBQUksSUFBSixDQUFTLFVBQVQsRUFBcUIsS0FBckI7QUFDQSxRQUFJLFVBQUosQ0FBZSxHQUFmO0FBQ0QsR0FmRDs7QUFpQkEsU0FBTyxHQUFQLENBQVcsY0FBWCxFQUEyQixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDdkMsUUFBSSxXQUFXLElBQUksR0FBSixDQUFRLE9BQVIsQ0FBZ0IsWUFBaEIsRUFBOEIsRUFBOUIsQ0FBZjtBQUNBLFFBQUksYUFBYSxHQUFqQixFQUFzQjtBQUNwQixVQUFJLFFBQUosQ0FBYSxRQUFiLEVBQXVCLEVBQUMsTUFBTSxnQkFBUCxFQUF2QjtBQUNBO0FBQ0Q7QUFDRCxRQUFNLFVBQVUsSUFBSSxPQUFwQjs7O0FBR0EsaUJBQUcsUUFBSCxDQUFZLFlBQVksc0JBQXhCLEVBQWdELE1BQWhELEVBQXdELFVBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUNyRSxVQUFJLEdBQUosRUFBUztBQUNQLFlBQUksSUFBSixDQUFTLE9BQVQ7QUFDQTtBQUNEO0FBQ0QsVUFBSSxTQUFTLGNBQUksUUFBSixDQUFhLElBQWIsQ0FBYjtBQUNBLFVBQUksSUFBSixDQUFTLE9BQU8sRUFBQyxnQkFBRCxFQUFQLENBQVQ7QUFDRCxLQVBEO0FBUUQsR0FqQkQ7O0FBbUJBLFNBQU8sTUFBUDtBQUNELENBNUREOztBQThEQSxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6IkZCTG9jYWxDaGF0Um91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2hhdFV0aWxzIGZyb20gJy4vQ2hhdFV0aWxzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJzs7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGRvVCBmcm9tICdkb1QnO1xuXG5jb25zdCBGQkxvY2FsQ2hhdFJvdXRlcyA9IChyb3V0ZXI6IFJvdXRlciwgQm90OiBPYmplY3QpOiBSb3V0ZXIgPT4ge1xuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0L2dldE1lc3NhZ2VzJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLmpzb24oQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCkpO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9zZW5kTWVzc2FnZScsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgbWVzc2FnZSA9IHJlcS5ib2R5Lm1lc3NhZ2U7XG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIG1lc3NhZ2UsICdib3RoIHNlbmRlcklEIGFuZCBtZXNzYWdlIGFyZSByZXF1aXJlZCcpO1xuXG4gICAgQ2hhdFV0aWxzLnNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIG1lc3NhZ2UpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIHBvc3RiYWNrOiB7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3Bvc3RiYWNrJywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvKicsIChyZXEsIHJlcykgPT4ge1xuICAgIHZhciBmaWxlUGF0aCA9IHJlcS51cmwucmVwbGFjZSgnL2xvY2FsQ2hhdCcsICcnKTtcbiAgICBpZiAoZmlsZVBhdGggIT09ICcvJykge1xuICAgICAgcmVzLnNlbmRGaWxlKGZpbGVQYXRoLCB7cm9vdDogJy4vbG9jYWxDaGF0V2ViJ30pO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGJhc2VVUkwgPSByZXEuYmFzZVVybDtcblxuICAgIC8vIHJldHVybiBodG1sXG4gICAgZnMucmVhZEZpbGUoX19kaXJuYW1lICsgJy9GQkxvY2FsQ2hhdFdlYi5odG1sJywgJ3V0ZjgnLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJlcy5zZW5kKFwiRVJST1JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB0ZW1wRm4gPSBkb1QudGVtcGxhdGUoZGF0YSk7XG4gICAgICByZXMuc2VuZCh0ZW1wRm4oe2Jhc2VVUkx9KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRkJMb2NhbENoYXRSb3V0ZXM7XG4iXX0=