

'use strict';

var _ChatUtils = require('./ChatUtils');

var _ChatUtils2 = _interopRequireDefault(_ChatUtils);

var _express = require('express');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _dot = require('dot');

var _dot2 = _interopRequireDefault(_dot);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      recipient: { id: 'pageID' },
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
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      postback: {
        payload: payload
      }
    };
    Bot.emit('postback', event);
    res.sendStatus(200);
  });

  router.post('/localChat/quickReply/', function (req, res) {
    var senderID = req.body.senderID;
    var payload = req.body.payload;
    var text = req.body.text;

    (0, _invariant2.default)(senderID && payload, 'both senderID and payload are required');
    var event = {
      sender: { id: senderID },
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      message: {
        text: text,
        quick_reply: {
          payload: payload
        }
      }
    };
    Bot.emit('quick_reply', event);
    res.sendStatus(200);
  });

  router.get('/localChat/*', function (req, res) {
    var dir = _path2.default.join(_path2.default.dirname(__filename), '..', 'localChatWeb');
    var filePath = req.url.replace('/localChat', '');
    if (filePath !== '/') {
      res.sendFile(filePath, { root: dir });
      return;
    }
    var baseURL = req.baseUrl;

    // return html
    _fs2.default.readFile(dir + '/index.html', 'utf8', function (err, data) {
      console.log(err);
      if (err) {
        res.send('ERROR');
        return;
      }
      var tempFn = _dot2.default.template(data);
      res.send(tempFn({ baseURL: baseURL }));
    });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBaUIsR0FBakIsRUFBeUM7QUFDakUsU0FBTyxHQUFQLENBQVcsd0JBQVgsRUFBcUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2pELFFBQUksSUFBSixDQUFTLG9CQUFVLG9CQUFWLEVBQVQ7QUFDRCxHQUZEOztBQUlBLFNBQU8sSUFBUCxDQUFZLHdCQUFaLEVBQXNDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNsRCxRQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsUUFBMUI7QUFDQSxRQUFNLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBekI7QUFDQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjs7QUFFQSx3QkFBVSw0QkFBVixDQUF1QyxRQUF2QyxFQUFpRCxPQUFqRDtBQUNBLFFBQU0sUUFBUTtBQUNaLGNBQVEsRUFBQyxJQUFJLFFBQUwsRUFESTtBQUVaLGlCQUFXLEVBQUMsSUFBSSxRQUFMLEVBRkM7QUFHWixpQkFBVyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQUosS0FBYSxJQUF4QixDQUhDO0FBSVosZUFBUztBQUNQLGNBQU07QUFEQztBQUpHLEtBQWQ7QUFRQSxRQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLEtBQWpCO0FBQ0EsUUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELEdBaEJEOztBQWtCQSxTQUFPLElBQVAsQ0FBWSxzQkFBWixFQUFvQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDaEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCOztBQUVBLDZCQUFVLFlBQVksT0FBdEIsRUFBK0Isd0NBQS9CO0FBQ0EsUUFBTSxRQUFRO0FBQ1osY0FBUSxFQUFDLElBQUksUUFBTCxFQURJO0FBRVosaUJBQVcsRUFBQyxJQUFJLFFBQUwsRUFGQztBQUdaLGlCQUFXLEtBQUssS0FBTCxDQUFXLElBQUksSUFBSixLQUFhLElBQXhCLENBSEM7QUFJWixnQkFBVTtBQUNSLGlCQUFTO0FBREQ7QUFKRSxLQUFkO0FBUUEsUUFBSSxJQUFKLENBQVMsVUFBVCxFQUFxQixLQUFyQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQWZEOztBQWlCQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsUUFBTSxPQUFPLElBQUksSUFBSixDQUFTLElBQXRCOztBQUVBLDZCQUFVLFlBQVksT0FBdEIsRUFBK0Isd0NBQS9CO0FBQ0EsUUFBTSxRQUFRO0FBQ1osY0FBUSxFQUFDLElBQUksUUFBTCxFQURJO0FBRVosaUJBQVcsRUFBQyxJQUFJLFFBQUwsRUFGQztBQUdaLGlCQUFXLEtBQUssS0FBTCxDQUFXLElBQUksSUFBSixLQUFhLElBQXhCLENBSEM7QUFJWixlQUFTO0FBQ1AsY0FBTSxJQURDO0FBRVAscUJBQWE7QUFDWCxtQkFBUztBQURFO0FBRk47QUFKRyxLQUFkO0FBV0EsUUFBSSxJQUFKLENBQVMsYUFBVCxFQUF3QixLQUF4QjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQW5CRDs7QUFxQkEsU0FBTyxHQUFQLENBQVcsY0FBWCxFQUEyQixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDdkMsUUFBTSxNQUFNLGVBQUssSUFBTCxDQUFVLGVBQUssT0FBTCxDQUFhLFVBQWIsQ0FBVixFQUFvQyxJQUFwQyxFQUEwQyxjQUExQyxDQUFaO0FBQ0EsUUFBSSxXQUFXLElBQUksR0FBSixDQUFRLE9BQVIsQ0FBZ0IsWUFBaEIsRUFBOEIsRUFBOUIsQ0FBZjtBQUNBLFFBQUksYUFBYSxHQUFqQixFQUFzQjtBQUNwQixVQUFJLFFBQUosQ0FBYSxRQUFiLEVBQXVCLEVBQUMsTUFBTSxHQUFQLEVBQXZCO0FBQ0E7QUFDRDtBQUNELFFBQU0sVUFBVSxJQUFJLE9BQXBCOzs7QUFHQSxpQkFBRyxRQUFILENBQVksTUFBTSxhQUFsQixFQUFpQyxNQUFqQyxFQUF5QyxVQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDdEQsY0FBUSxHQUFSLENBQVksR0FBWjtBQUNBLFVBQUksR0FBSixFQUFTO0FBQ1AsWUFBSSxJQUFKLENBQVMsT0FBVDtBQUNBO0FBQ0Q7QUFDRCxVQUFJLFNBQVMsY0FBSSxRQUFKLENBQWEsSUFBYixDQUFiO0FBQ0EsVUFBSSxJQUFKLENBQVMsT0FBTyxFQUFDLGdCQUFELEVBQVAsQ0FBVDtBQUNELEtBUkQ7QUFTRCxHQW5CRDs7QUFxQkEsU0FBTyxNQUFQO0FBQ0QsQ0FuRkQ7O0FBcUZBLE9BQU8sT0FBUCxHQUFpQixpQkFBakIiLCJmaWxlIjoiRkJMb2NhbENoYXRSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDaGF0VXRpbHMgZnJvbSAnLi9DaGF0VXRpbHMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBkb3QgZnJvbSAnZG90JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBGQkxvY2FsQ2hhdFJvdXRlcyA9IChyb3V0ZXI6IFJvdXRlciwgQm90OiBPYmplY3QpOiBSb3V0ZXIgPT4ge1xuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0L2dldE1lc3NhZ2VzJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLmpzb24oQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCkpO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9zZW5kTWVzc2FnZScsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgbWVzc2FnZSA9IHJlcS5ib2R5Lm1lc3NhZ2U7XG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIG1lc3NhZ2UsICdib3RoIHNlbmRlcklEIGFuZCBtZXNzYWdlIGFyZSByZXF1aXJlZCcpO1xuXG4gICAgQ2hhdFV0aWxzLnNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIG1lc3NhZ2UpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWVudDoge2lkOiAncGFnZUlEJ30sXG4gICAgICB0aW1lc3RhbXA6IE1hdGguZmxvb3IobmV3IERhdGUoKSAvIDEwMDApLFxuICAgICAgbWVzc2FnZToge1xuICAgICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCd0ZXh0JywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3Bvc3RiYWNrLycsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5LnBheWxvYWQ7XG5cbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgcGF5bG9hZCwgJ2JvdGggc2VuZGVySUQgYW5kIHBheWxvYWQgYXJlIHJlcXVpcmVkJyk7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICBzZW5kZXI6IHtpZDogc2VuZGVySUR9LFxuICAgICAgcmVjaXBpZW50OiB7aWQ6ICdwYWdlSUQnfSxcbiAgICAgIHRpbWVzdGFtcDogTWF0aC5mbG9vcihuZXcgRGF0ZSgpIC8gMTAwMCksXG4gICAgICBwb3N0YmFjazoge1xuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCdwb3N0YmFjaycsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9xdWlja1JlcGx5LycsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5LnBheWxvYWQ7XG4gICAgY29uc3QgdGV4dCA9IHJlcS5ib2R5LnRleHRcblxuICAgIGludmFyaWFudChzZW5kZXJJRCAmJiBwYXlsb2FkLCAnYm90aCBzZW5kZXJJRCBhbmQgcGF5bG9hZCBhcmUgcmVxdWlyZWQnKTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHNlbmRlcjoge2lkOiBzZW5kZXJJRH0sXG4gICAgICByZWNpcGllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgcXVpY2tfcmVwbHk6IHtcbiAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgncXVpY2tfcmVwbHknLCBldmVudCk7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgfSk7XG5cbiAgcm91dGVyLmdldCgnL2xvY2FsQ2hhdC8qJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgZGlyID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKSwgJy4uJywgJ2xvY2FsQ2hhdFdlYicpO1xuICAgIHZhciBmaWxlUGF0aCA9IHJlcS51cmwucmVwbGFjZSgnL2xvY2FsQ2hhdCcsICcnKTtcbiAgICBpZiAoZmlsZVBhdGggIT09ICcvJykge1xuICAgICAgcmVzLnNlbmRGaWxlKGZpbGVQYXRoLCB7cm9vdDogZGlyfSk7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgYmFzZVVSTCA9IHJlcS5iYXNlVXJsO1xuXG4gICAgLy8gcmV0dXJuIGh0bWxcbiAgICBmcy5yZWFkRmlsZShkaXIgKyAnL2luZGV4Lmh0bWwnLCAndXRmOCcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJlcy5zZW5kKCdFUlJPUicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdGVtcEZuID0gZG90LnRlbXBsYXRlKGRhdGEpO1xuICAgICAgcmVzLnNlbmQodGVtcEZuKHtiYXNlVVJMfSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcm91dGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZCTG9jYWxDaGF0Um91dGVzO1xuIl19