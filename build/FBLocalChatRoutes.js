

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

  router.post('/localChat/optin/', function (req, res) {
    var senderID = req.body.senderID;
    var ref = req.body.ref;

    (0, _invariant2.default)(senderID && ref, 'both senderID and payload are required');
    var event = {
      sender: { id: senderID },
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      optin: {
        ref: ref
      }
    };
    Bot.emit('optin', event);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBaUIsR0FBakIsRUFBeUM7QUFDakUsU0FBTyxHQUFQLENBQVcsd0JBQVgsRUFBcUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2pELFFBQUksSUFBSixDQUFTLG9CQUFVLG9CQUFWLEVBQVQ7QUFDRCxHQUZEOztBQUlBLFNBQU8sSUFBUCxDQUFZLHdCQUFaLEVBQXNDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNsRCxRQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsUUFBMUI7QUFDQSxRQUFNLFVBQVUsSUFBSSxJQUFKLENBQVMsT0FBekI7QUFDQSw2QkFBVSxZQUFZLE9BQXRCLEVBQStCLHdDQUEvQjs7QUFFQSx3QkFBVSw0QkFBVixDQUF1QyxRQUF2QyxFQUFpRCxPQUFqRDtBQUNBLFFBQU0sUUFBUTtBQUNaLGNBQVEsRUFBQyxJQUFJLFFBQUwsRUFESTtBQUVaLGlCQUFXLEVBQUMsSUFBSSxRQUFMLEVBRkM7QUFHWixpQkFBVyxLQUFLLEtBQUwsQ0FBVyxJQUFJLElBQUosS0FBYSxJQUF4QixDQUhDO0FBSVosZUFBUztBQUNQLGNBQU07QUFEQztBQUpHLEtBQWQ7QUFRQSxRQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLEtBQWpCO0FBQ0EsUUFBSSxVQUFKLENBQWUsR0FBZjtBQUNELEdBaEJEOztBQWtCQSxTQUFPLElBQVAsQ0FBWSxtQkFBWixFQUFpQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDN0MsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxNQUFNLElBQUksSUFBSixDQUFTLEdBQXJCOztBQUVBLDZCQUFVLFlBQVksR0FBdEIsRUFB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c291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2hhdFV0aWxzIGZyb20gJy4vQ2hhdFV0aWxzJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgRkJMb2NhbENoYXRSb3V0ZXMgPSAocm91dGVyOiBSb3V0ZXIsIEJvdDogT2JqZWN0KTogUm91dGVyID0+IHtcbiAgcm91dGVyLmdldCgnL2xvY2FsQ2hhdC9nZXRNZXNzYWdlcycsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5qc29uKENoYXRVdGlscy5nZXRMb2NhbENoYXRNZXNzYWdlcygpKTtcbiAgfSk7XG5cbiAgcm91dGVyLnBvc3QoJy9sb2NhbENoYXQvc2VuZE1lc3NhZ2UnLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSByZXEuYm9keS5tZXNzYWdlO1xuICAgIGludmFyaWFudChzZW5kZXJJRCAmJiBtZXNzYWdlLCAnYm90aCBzZW5kZXJJRCBhbmQgbWVzc2FnZSBhcmUgcmVxdWlyZWQnKTtcblxuICAgIENoYXRVdGlscy5zYXZlU2VuZGVyTWVzc2FnZVRvTG9jYWxDaGF0KHNlbmRlcklELCBtZXNzYWdlKTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHNlbmRlcjoge2lkOiBzZW5kZXJJRH0sXG4gICAgICByZWNpcGllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgndGV4dCcsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9vcHRpbi8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHJlZiA9IHJlcS5ib2R5LnJlZjtcblxuICAgIGludmFyaWFudChzZW5kZXJJRCAmJiByZWYsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWVudDoge2lkOiAncGFnZUlEJ30sXG4gICAgICB0aW1lc3RhbXA6IE1hdGguZmxvb3IobmV3IERhdGUoKSAvIDEwMDApLFxuICAgICAgb3B0aW46IHtcbiAgICAgICAgcmVmOiByZWYsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ29wdGluJywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3Bvc3RiYWNrLycsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5LnBheWxvYWQ7XG5cbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgcGF5bG9hZCwgJ2JvdGggc2VuZGVySUQgYW5kIHBheWxvYWQgYXJlIHJlcXVpcmVkJyk7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICBzZW5kZXI6IHtpZDogc2VuZGVySUR9LFxuICAgICAgcmVjaXBpZW50OiB7aWQ6ICdwYWdlSUQnfSxcbiAgICAgIHRpbWVzdGFtcDogTWF0aC5mbG9vcihuZXcgRGF0ZSgpIC8gMTAwMCksXG4gICAgICBwb3N0YmFjazoge1xuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCdwb3N0YmFjaycsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9xdWlja1JlcGx5LycsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5LnBheWxvYWQ7XG4gICAgY29uc3QgdGV4dCA9IHJlcS5ib2R5LnRleHRcblxuICAgIGludmFyaWFudChzZW5kZXJJRCAmJiBwYXlsb2FkLCAnYm90aCBzZW5kZXJJRCBhbmQgcGF5bG9hZCBhcmUgcmVxdWlyZWQnKTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHNlbmRlcjoge2lkOiBzZW5kZXJJRH0sXG4gICAgICByZWNpcGllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgcXVpY2tfcmVwbHk6IHtcbiAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgncXVpY2tfcmVwbHknLCBldmVudCk7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgfSk7XG5cbiAgcm91dGVyLmdldCgnL2xvY2FsQ2hhdC8qJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgZGlyID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKSwgJy4uJywgJ2xvY2FsQ2hhdFdlYicpO1xuICAgIHZhciBmaWxlUGF0aCA9IHJlcS51cmwucmVwbGFjZSgnL2xvY2FsQ2hhdCcsICcnKTtcbiAgICBpZiAoZmlsZVBhdGggIT09ICcvJykge1xuICAgICAgcmVzLnNlbmRGaWxlKGZpbGVQYXRoLCB7cm9vdDogZGlyfSk7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgYmFzZVVSTCA9IHJlcS5iYXNlVXJsO1xuXG4gICAgLy8gcmV0dXJuIGh0bWxcbiAgICBmcy5yZWFkRmlsZShkaXIgKyAnL2luZGV4Lmh0bWwnLCAndXRmOCcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJlcy5zZW5kKCdFUlJPUicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdGVtcEZuID0gZG90LnRlbXBsYXRlKGRhdGEpO1xuICAgICAgcmVzLnNlbmQodGVtcEZuKHtiYXNlVVJMfSkpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcm91dGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZCTG9jYWxDaGF0Um91dGVzO1xuIl19