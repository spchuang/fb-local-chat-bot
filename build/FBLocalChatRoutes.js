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
      var tempFn = _doT2.default.template(data);
      res.send(tempFn({ baseURL: baseURL }));
    });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBQyxNQUFELEVBQWlCLEdBQWpCLEVBQXlDO0FBQ2pFLFNBQU8sR0FBUCxDQUFXLHdCQUFYLEVBQXFDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNqRCxRQUFJLElBQUosQ0FBUyxvQkFBVSxvQkFBVixFQUFUO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7O0FBRUEsd0JBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsT0FBakQ7QUFDQSxRQUFNLFFBQVE7QUFDWixjQUFRLEVBQUMsSUFBSSxRQUFMLEVBREk7QUFFWixpQkFBVyxFQUFDLElBQUksUUFBTCxFQUZDO0FBR1osaUJBQVcsS0FBSyxLQUFMLENBQVcsSUFBSSxJQUFKLEtBQWEsSUFBeEIsQ0FIQztBQUlaLGVBQVM7QUFDUCxjQUFNO0FBREM7QUFKRyxLQUFkO0FBUUEsUUFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixLQUFqQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQWhCRDs7QUFrQkEsU0FBTyxJQUFQLENBQVksc0JBQVosRUFBb0MsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2hELFFBQU0sV0FBVyxJQUFJLElBQUosQ0FBUyxRQUExQjtBQUNBLFFBQU0sVUFBVSxJQUFJLElBQUosQ0FBUyxPQUF6Qjs7QUFFQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjtBQUNBLFFBQU0sUUFBUTtBQUNaLGNBQVEsRUFBQyxJQUFJLFFBQUwsRUFESTtBQUVaLGlCQUFXLEVBQUMsSUFBSSxRQUFMLEVBRkM7QUFHWixpQkFBVyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQUosS0FBYSxJQUF4QixDQUhDO0FBSVosZ0JBQVU7QUFDUixpQkFBUztBQUREO0FBSkUsS0FBZDtBQVFBLFFBQUksSUFBSixDQUFTLFVBQVQsRUFBcUIsS0FBckI7QUFDQSxRQUFJLFVBQUosQ0FBZSxHQUFmO0FBQ0QsR0FmRDs7QUFpQkEsU0FBTyxJQUFQLENBQVksd0JBQVosRUFBc0MsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2xELFFBQU0sV0FBVyxJQUFJLElBQUosQ0FBUyxRQUExQjtBQUNBLFFBQU0sVUFBVSxJQUFJLElBQUosQ0FBUyxPQUF6QjtBQUNBLFFBQU0sT0FBTyxJQUFJLElBQUosQ0FBUyxJQUF0Qjs7QUFFQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjtBQUNBLFFBQU0sUUFBUTtBQUNaLGNBQVEsRUFBQyxJQUFJLFFBQUwsRUFESTtBQUVaLGlCQUFXLEVBQUMsSUFBSSxRQUFMLEVBRkM7QUFHWixpQkFBVyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQUosS0FBYSxJQUF4QixDQUhDO0FBSVosZUFBUztBQUNQLGNBQU0sSUFEQztBQUVQLHFCQUFhO0FBQ1gsbUJBQVM7QUFERTtBQUZOO0FBSkcsS0FBZDtBQVdBLFFBQUksSUFBSixDQUFTLGFBQVQsRUFBd0IsS0FBeEI7QUFDQSxRQUFJLFVBQUosQ0FBZSxHQUFmO0FBQ0QsR0FuQkQ7O0FBcUJBLFNBQU8sR0FBUCxDQUFXLGNBQVgsRUFBMkIsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ3ZDLFFBQU0sTUFBTSxlQUFLLElBQUwsQ0FBVSxlQUFLLE9BQUwsQ0FBYSxVQUFiLENBQVYsRUFBb0MsSUFBcEMsRUFBMEMsY0FBMUMsQ0FBWjtBQUNBLFFBQUksV0FBVyxJQUFJLEdBQUosQ0FBUSxPQUFSLENBQWdCLFlBQWhCLEVBQThCLEVBQTlCLENBQWY7QUFDQSxRQUFJLGFBQWEsR0FBakIsRUFBc0I7QUFDcEIsVUFBSSxRQUFKLENBQWEsUUFBYixFQUF1QixFQUFDLE1BQU0sR0FBUCxFQUF2QjtBQUNBO0FBQ0Q7QUFDRCxRQUFNLFVBQVUsSUFBSSxPQUFwQjs7QUFFQTtBQUNBLGlCQUFHLFFBQUgsQ0FBWSxNQUFNLGFBQWxCLEVBQWlDLE1BQWpDLEVBQXlDLFVBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUN0RCxjQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0EsVUFBSSxHQUFKLEVBQVM7QUFDUCxZQUFJLElBQUosQ0FBUyxPQUFUO0FBQ0E7QUFDRDtBQUNELFVBQUksU0FBUyxjQUFJLFFBQUosQ0FBYSxJQUFiLENBQWI7QUFDQSxVQUFJLElBQUosQ0FBUyxPQUFPLEVBQUMsZ0JBQUQsRUFBUCxDQUFUO0FBQ0QsS0FSRDtBQVNELEdBbkJEOztBQXFCQSxTQUFPLE1BQVA7QUFDRCxDQW5GRDs7QUFxRkEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJGQkxvY2FsQ2hhdFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGRvVCBmcm9tICdkb1QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IEZCTG9jYWxDaGF0Um91dGVzID0gKHJvdXRlcjogUm91dGVyLCBCb3Q6IE9iamVjdCk6IFJvdXRlciA9PiB7XG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvZ2V0TWVzc2FnZXMnLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbihDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3NlbmRNZXNzYWdlJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgbWVzc2FnZSwgJ2JvdGggc2VuZGVySUQgYW5kIG1lc3NhZ2UgYXJlIHJlcXVpcmVkJyk7XG5cbiAgICBDaGF0VXRpbHMuc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwgbWVzc2FnZSk7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICBzZW5kZXI6IHtpZDogc2VuZGVySUR9LFxuICAgICAgcmVjaXBpZW50OiB7aWQ6ICdwYWdlSUQnfSxcbiAgICAgIHRpbWVzdGFtcDogTWF0aC5mbG9vcihuZXcgRGF0ZSgpIC8gMTAwMCksXG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3RleHQnLCBldmVudCk7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgfSk7XG5cbiAgcm91dGVyLnBvc3QoJy9sb2NhbENoYXQvcG9zdGJhY2svJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBwYXlsb2FkID0gcmVxLmJvZHkucGF5bG9hZDtcblxuICAgIGludmFyaWFudChzZW5kZXJJRCAmJiBwYXlsb2FkLCAnYm90aCBzZW5kZXJJRCBhbmQgcGF5bG9hZCBhcmUgcmVxdWlyZWQnKTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHNlbmRlcjoge2lkOiBzZW5kZXJJRH0sXG4gICAgICByZWNpcGllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIHBvc3RiYWNrOiB7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3Bvc3RiYWNrJywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3F1aWNrUmVwbHkvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBwYXlsb2FkID0gcmVxLmJvZHkucGF5bG9hZDtcbiAgICBjb25zdCB0ZXh0ID0gcmVxLmJvZHkudGV4dFxuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWVudDoge2lkOiAncGFnZUlEJ30sXG4gICAgICB0aW1lc3RhbXA6IE1hdGguZmxvb3IobmV3IERhdGUoKSAvIDEwMDApLFxuICAgICAgbWVzc2FnZToge1xuICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICBxdWlja19yZXBseToge1xuICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCdxdWlja19yZXBseScsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0LyonLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBkaXIgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpLCAnLi4nLCAnbG9jYWxDaGF0V2ViJyk7XG4gICAgdmFyIGZpbGVQYXRoID0gcmVxLnVybC5yZXBsYWNlKCcvbG9jYWxDaGF0JywgJycpO1xuICAgIGlmIChmaWxlUGF0aCAhPT0gJy8nKSB7XG4gICAgICByZXMuc2VuZEZpbGUoZmlsZVBhdGgsIHtyb290OiBkaXJ9KTtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBiYXNlVVJMID0gcmVxLmJhc2VVcmw7XG5cbiAgICAvLyByZXR1cm4gaHRtbFxuICAgIGZzLnJlYWRGaWxlKGRpciArICcvaW5kZXguaHRtbCcsICd1dGY4JywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmVzLnNlbmQoJ0VSUk9SJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB0ZW1wRm4gPSBkb1QudGVtcGxhdGUoZGF0YSk7XG4gICAgICByZXMuc2VuZCh0ZW1wRm4oe2Jhc2VVUkx9KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRkJMb2NhbENoYXRSb3V0ZXM7XG4iXX0=