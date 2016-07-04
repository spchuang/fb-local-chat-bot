// @flow

'use strict';

import ChatUtils from './ChatUtils';
import {Router} from 'express';;
import invariant from 'invariant';
import fs from 'fs';
import doT from 'doT';

const FBLocalChatRoutes = (router: Router, Bot: Object): Router => {
  router.get('/localChat/getMessages', (req, res) => {
    res.json(ChatUtils.getLocalChatMessages());
  });

  router.post('/localChat/sendMessage', (req, res) => {
    const senderID = req.body.senderID;
    const message = req.body.message;
    invariant(senderID && message, 'both senderID and message are required');

    ChatUtils.saveSenderMessageToLocalChat(senderID, message);
    const event = {
      sender: {id: senderID},
      recipiient: {id: 'pageID'},
      timestamp: Math.floor(new Date() / 1000),
      message: {
        text: message,
      },
    };
    Bot.emit('text', event);
    res.sendStatus(200);
  });

  router.post('/localChat/postback/', (req, res) => {
    const senderID = req.body.senderID;
    const payload = req.body.payload;

    invariant(senderID && payload, 'both senderID and payload are required');
    const event = {
      sender: {id: senderID},
      recipiient: {id: 'pageID'},
      timestamp: Math.floor(new Date() / 1000),
      postback: {
        payload: payload,
      },
    };
    Bot.emit('postback', event);
    res.sendStatus(200);
  });

  router.get('/localChat/*', (req, res) => {
    var filePath = req.url.replace('/localChat', '');
    if (filePath !== '/') {
      res.sendFile(filePath, {root: './localChatWeb'});
      return
    }
    const baseURL = req.baseUrl;

    // return html
    fs.readFile(__dirname + '/FBLocalChatWeb.html', 'utf8', (err, data) => {
      if (err) {
        res.send("ERROR");
        return;
      }
      var tempFn = doT.template(data);
      res.send(tempFn({baseURL}));
    });
  });

  return router;
}

module.exports = FBLocalChatRoutes;
