

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUorQjs7O0FBTS9CLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBaUIsR0FBakIsRUFBeUM7QUFDakUsU0FBTyxHQUFQLENBQVcsd0JBQVgsRUFBcUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2pELFFBQUksSUFBSixDQUFTLG9CQUFVLG9CQUFWLEVBQVQ7QUFDRCxHQUZEOztBQUlBLFNBQU8sSUFBUCxDQUFZLHdCQUFaLEVBQXNDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNsRCxRQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsUUFBMUI7QUFDQSxRQUFNLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBekI7QUFDQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjs7QUFFQSx3QkFBVSw0QkFBVixDQUF1QyxRQUF2QyxFQUFpRCxPQUFqRDtBQUNBLFFBQU0sUUFBUTtBQUNaLGNBQVEsRUFBQyxJQUFJLFFBQUwsRUFESTtBQUVaLGtCQUFZLEVBQUMsSUFBSSxRQUFMLEVBRkE7QUFHWixpQkFBVyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQUosS0FBYSxJQUF4QixDQUhDO0FBSVosZUFBUztBQUNQLGNBQU07QUFEQztBQUpHLEtBQWQ7QUFRQSxRQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLEtBQWpCO0FBQ0EsUUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELEdBaEJEOztBQWtCQSxTQUFPLElBQVAsQ0FBWSxzQkFBWixFQUFvQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDaEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCOztBQUVBLDZCQUFVLFlBQVksT0FBdEIsRUFBK0Isd0NBQS9CO0FBQ0EsUUFBTSxRQUFRO0FBQ1osY0FBUSxFQUFDLElBQUksUUFBTCxFQURJO0FBRVosa0JBQVksRUFBQyxJQUFJLFFBQUwsRUFGQTtBQUdaLGlCQUFXLEtBQUssS0FBTCxDQUFXLElBQUksSUFBSixLQUFhLElBQXhCLENBSEM7QUFJWixnQkFBVTtBQUNSLGlCQUFTO0FBREQ7QUFKRSxLQUFkO0FBUUEsUUFBSSxJQUFKLENBQVMsVUFBVCxFQUFxQixLQUFyQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQWZEOztBQWlCQSxTQUFPLEdBQVAsQ0FBVyxjQUFYLEVBQTJCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUN2QyxRQUFNLE1BQU0sZUFBSyxJQUFMLENBQVUsZUFBSyxPQUFMLENBQWEsVUFBYixDQUFWLEVBQW9DLElBQXBDLEVBQTBDLGNBQTFDLENBQVo7QUFDQSxRQUFJLFdBQVcsSUFBSSxHQUFKLENBQVEsT0FBUixDQUFnQixZQUFoQixFQUE4QixFQUE5QixDQUFmO0FBQ0EsUUFBSSxhQUFhLEdBQWpCLEVBQXNCO0FBQ3BCLFVBQUksUUFBSixDQUFhLFFBQWIsRUFBdUIsRUFBQyxNQUFNLEdBQVAsRUFBdkI7QUFDQTtBQUNEO0FBQ0QsUUFBTSxVQUFVLElBQUksT0FBcEI7OztBQUdBLGlCQUFHLFFBQUgsQ0FBWSxNQUFNLGFBQWxCLEVBQWlDLE1BQWpDLEVBQXlDLFVBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUN0RCxjQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0EsVUFBSSxHQUFKLEVBQVM7QUFDUCxZQUFJLElBQUosQ0FBUyxPQUFUO0FBQ0E7QUFDRDtBQUNELFVBQUksU0FBUyxjQUFJLFFBQUosQ0FBYSxJQUFiLENBQWI7QUFDQSxVQUFJLElBQUosQ0FBUyxPQUFPLEVBQUMsZ0JBQUQsRUFBUCxDQUFUO0FBQ0QsS0FSRDtBQVNELEdBbkJEOztBQXFCQSxTQUFPLE1BQVA7QUFDRCxDQTlERDs7QUFnRUEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJGQkxvY2FsQ2hhdFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnZXhwcmVzcyc7O1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBkb1QgZnJvbSAnZG9UJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBGQkxvY2FsQ2hhdFJvdXRlcyA9IChyb3V0ZXI6IFJvdXRlciwgQm90OiBPYmplY3QpOiBSb3V0ZXIgPT4ge1xuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0L2dldE1lc3NhZ2VzJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLmpzb24oQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCkpO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9zZW5kTWVzc2FnZScsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgbWVzc2FnZSA9IHJlcS5ib2R5Lm1lc3NhZ2U7XG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIG1lc3NhZ2UsICdib3RoIHNlbmRlcklEIGFuZCBtZXNzYWdlIGFyZSByZXF1aXJlZCcpO1xuXG4gICAgQ2hhdFV0aWxzLnNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIG1lc3NhZ2UpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIHBvc3RiYWNrOiB7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3Bvc3RiYWNrJywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvKicsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGRpciA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoX19maWxlbmFtZSksICcuLicsICdsb2NhbENoYXRXZWInKTtcbiAgICB2YXIgZmlsZVBhdGggPSByZXEudXJsLnJlcGxhY2UoJy9sb2NhbENoYXQnLCAnJyk7XG4gICAgaWYgKGZpbGVQYXRoICE9PSAnLycpIHtcbiAgICAgIHJlcy5zZW5kRmlsZShmaWxlUGF0aCwge3Jvb3Q6IGRpcn0pO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGJhc2VVUkwgPSByZXEuYmFzZVVybDtcblxuICAgIC8vIHJldHVybiBodG1sXG4gICAgZnMucmVhZEZpbGUoZGlyICsgJy9pbmRleC5odG1sJywgJ3V0ZjgnLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXMuc2VuZChcIkVSUk9SXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdGVtcEZuID0gZG9ULnRlbXBsYXRlKGRhdGEpO1xuICAgICAgcmVzLnNlbmQodGVtcEZuKHtiYXNlVVJMfSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcm91dGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZCTG9jYWxDaGF0Um91dGVzO1xuIl19