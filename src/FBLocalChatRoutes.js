// @flow

'use strict';

import ChatUtils from './ChatUtils';
import {Router} from 'express';
import invariant from 'invariant';
import fs from 'fs';
import dot from 'dot';
import path from 'path';

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
      recipient: {id: 'pageID'},
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
      recipient: {id: 'pageID'},
      timestamp: Math.floor(new Date() / 1000),
      postback: {
        payload: payload,
      },
    };
    Bot.emit('postback', event);
    res.sendStatus(200);
  });

  router.post('/localChat/quickReply/', (req, res) => {
    const senderID = req.body.senderID;
    const payload = req.body.payload;
    const text = req.body.text

    invariant(senderID && payload, 'both senderID and payload are required');
    const event = {
      sender: {id: senderID},
      recipient: {id: 'pageID'},
      timestamp: Math.floor(new Date() / 1000),
      message: {
        text: text,
        quick_reply: {
          payload: payload
        }
      },
    };
    Bot.emit('quick_reply', event);
    res.sendStatus(200);
  });

  router.get('/localChat/*', (req, res) => {
    const dir = path.join(path.dirname(__filename), '..', 'localChatWeb');
    var filePath = req.url.replace('/localChat', '');
    if (filePath !== '/') {
      res.sendFile(filePath, {root: dir});
      return
    }
    const baseURL = req.baseUrl;

    // return html
    fs.readFile(dir + '/index.html', 'utf8', (err, data) => {
      console.log(err);
      if (err) {
        res.send('ERROR');
        return;
      }
      var tempFn = dot.template(data);
      res.send(tempFn({baseURL}));
    });
  });

  return router;
}

module.exports = FBLocalChatRoutes;
