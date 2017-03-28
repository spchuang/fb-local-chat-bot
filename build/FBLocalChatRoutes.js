

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

  router.get('/localChat/persistentMenu', function (req, res) {
    res.json(_ChatUtils2.default.getPersistentMenu());
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

  router.post('/localChat/storePersistentMenuWithFacebook', function (req, res) {

    Bot.storePersistentMenu().then(function (data) {
      res.sendStatus(200);
    }).catch(function (data) {
      res.status(data.statusCode).send(data.message);
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBaUIsR0FBakIsRUFBeUM7QUFDakUsU0FBTyxHQUFQLENBQVcsd0JBQVgsRUFBcUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ2pELFFBQUksSUFBSixDQUFTLG9CQUFVLG9CQUFWLEVBQVQ7QUFDRCxHQUZEOztBQUlBLFNBQU8sR0FBUCxDQUFXLDJCQUFYLEVBQXdDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNwRCxRQUFJLElBQUosQ0FBUyxvQkFBVSxpQkFBVixFQUFUO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7O0FBRUEsd0JBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsT0FBakQ7QUFDQSxRQUFNLFFBQVE7QUFDWixjQUFRLEVBQUMsSUFBSSxRQUFMLEVBREk7QUFFWixpQkFBVyxFQUFDLElBQUksUUFBTCxFQUZDO0FBR1osaUJBQVcsS0FBSyxLQUFMLENBQVcsSUFBSSxJQUFKLEtBQWEsSUFBeEIsQ0FIQztBQUlaLGVBQVM7QUFDUCxjQUFNO0FBREM7QUFKRyxLQUFkO0FBUUEsUUFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixLQUFqQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQWhCRDs7QUFrQkEsU0FBTyxJQUFQLENBQVksNENBQVosRUFBMEQsVUFBQyxHQUFELEVBQU0sR0FB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T0FBcEI7OztBQUdBLGlCQUFHLFFBQUgsQ0FBWSxNQUFNLGFBQWxCLEVBQWlDLE1BQWpDLEVBQXlDLFVBQUMsR0FBRCxFQUFNLElBQU4sRUFBZTtBQUN0RCxjQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0EsVUFBSSxHQUFKLEVBQVM7QUFDUCxZQUFJLElBQUosQ0FBUyxPQUFUO0FBQ0E7QUFDRDtBQUNELFVBQUksU0FBUyxjQUFJLFFBQUosQ0FBYSxJQUFiLENBQWI7QUFDQSxVQUFJLElBQUosQ0FBUyxPQUFPLEVBQUMsZ0JBQUQsRUFBUCxDQUFUO0FBQ0QsS0FSRDtBQVNELEdBbkJEOztBQXFCQSxTQUFPLE1BQVA7QUFDRCxDQW5IRDs7QUFxSEEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJGQkxvY2FsQ2hhdFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENoYXRVdGlscyBmcm9tICcuL0NoYXRVdGlscyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IEZCTG9jYWxDaGF0Um91dGVzID0gKHJvdXRlcjogUm91dGVyLCBCb3Q6IE9iamVjdCk6IFJvdXRlciA9PiB7XG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvZ2V0TWVzc2FnZXMnLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbihDaGF0VXRpbHMuZ2V0TG9jYWxDaGF0TWVzc2FnZXMoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvcGVyc2lzdGVudE1lbnUnLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbihDaGF0VXRpbHMuZ2V0UGVyc2lzdGVudE1lbnUoKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3NlbmRNZXNzYWdlJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBtZXNzYWdlID0gcmVxLmJvZHkubWVzc2FnZTtcbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgbWVzc2FnZSwgJ2JvdGggc2VuZGVySUQgYW5kIG1lc3NhZ2UgYXJlIHJlcXVpcmVkJyk7XG5cbiAgICBDaGF0VXRpbHMuc2F2ZVNlbmRlck1lc3NhZ2VUb0xvY2FsQ2hhdChzZW5kZXJJRCwgbWVzc2FnZSk7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICBzZW5kZXI6IHtpZDogc2VuZGVySUR9LFxuICAgICAgcmVjaXBpZW50OiB7aWQ6ICdwYWdlSUQnfSxcbiAgICAgIHRpbWVzdGFtcDogTWF0aC5mbG9vcihuZXcgRGF0ZSgpIC8gMTAwMCksXG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3RleHQnLCBldmVudCk7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgfSk7XG5cbiAgcm91dGVyLnBvc3QoJy9sb2NhbENoYXQvc3RvcmVQZXJzaXN0ZW50TWVudVdpdGhGYWNlYm9vaycsIChyZXEsIHJlcykgPT4ge1xuXG4gICAgQm90LnN0b3JlUGVyc2lzdGVudE1lbnUoKVxuICAgICAgLnRoZW4oKGRhdGE6IE9iamVjdCkgPT4ge1xuICAgICAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZGF0YTogT2JqZWN0KSA9PiB7XG4gICAgICAgIHJlcy5zdGF0dXMoZGF0YS5zdGF0dXNDb2RlKS5zZW5kKGRhdGEubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgcm91dGVyLnBvc3QoJy9sb2NhbENoYXQvb3B0aW4vJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCByZWYgPSByZXEuYm9keS5yZWY7XG5cbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgcmVmLCAnYm90aCBzZW5kZXJJRCBhbmQgcGF5bG9hZCBhcmUgcmVxdWlyZWQnKTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHNlbmRlcjoge2lkOiBzZW5kZXJJRH0sXG4gICAgICByZWNpcGllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIG9wdGluOiB7XG4gICAgICAgIHJlZjogcmVmLFxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCdvcHRpbicsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9wb3N0YmFjay8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWVudDoge2lkOiAncGFnZUlEJ30sXG4gICAgICB0aW1lc3RhbXA6IE1hdGguZmxvb3IobmV3IERhdGUoKSAvIDEwMDApLFxuICAgICAgcG9zdGJhY2s6IHtcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgncG9zdGJhY2snLCBldmVudCk7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgfSk7XG5cbiAgcm91dGVyLnBvc3QoJy9sb2NhbENoYXQvcXVpY2tSZXBseS8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBzZW5kZXJJRCA9IHJlcS5ib2R5LnNlbmRlcklEO1xuICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keS5wYXlsb2FkO1xuICAgIGNvbnN0IHRleHQgPSByZXEuYm9keS50ZXh0XG5cbiAgICBpbnZhcmlhbnQoc2VuZGVySUQgJiYgcGF5bG9hZCwgJ2JvdGggc2VuZGVySUQgYW5kIHBheWxvYWQgYXJlIHJlcXVpcmVkJyk7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICBzZW5kZXI6IHtpZDogc2VuZGVySUR9LFxuICAgICAgcmVjaXBpZW50OiB7aWQ6ICdwYWdlSUQnfSxcbiAgICAgIHRpbWVzdGFtcDogTWF0aC5mbG9vcihuZXcgRGF0ZSgpIC8gMTAwMCksXG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgIHF1aWNrX3JlcGx5OiB7XG4gICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3F1aWNrX3JlcGx5JywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5nZXQoJy9sb2NhbENoYXQvKicsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGRpciA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoX19maWxlbmFtZSksICcuLicsICdsb2NhbENoYXRXZWInKTtcbiAgICB2YXIgZmlsZVBhdGggPSByZXEudXJsLnJlcGxhY2UoJy9sb2NhbENoYXQnLCAnJyk7XG4gICAgaWYgKGZpbGVQYXRoICE9PSAnLycpIHtcbiAgICAgIHJlcy5zZW5kRmlsZShmaWxlUGF0aCwge3Jvb3Q6IGRpcn0pO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGJhc2VVUkwgPSByZXEuYmFzZVVybDtcblxuICAgIC8vIHJldHVybiBodG1sXG4gICAgZnMucmVhZEZpbGUoZGlyICsgJy9pbmRleC5odG1sJywgJ3V0ZjgnLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXMuc2VuZCgnRVJST1InKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHRlbXBGbiA9IGRvdC50ZW1wbGF0ZShkYXRhKTtcbiAgICAgIHJlcy5zZW5kKHRlbXBGbih7YmFzZVVSTH0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJvdXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGQkxvY2FsQ2hhdFJvdXRlcztcbiJdfQ==