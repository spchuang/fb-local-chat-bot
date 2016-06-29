// @flow

'use strict';

import ChatUtils from './ChatUtils';
import {Router} from 'express';;
import invariant from 'invariant';

const FBLocalChatRoutes = (router: Router): Router => {
  router.get('/localChat/getMessages', (req, res) => {
    res.json(ChatUtils.getLocalChatMessages());
  });

  router.post('/localChat/sendMessage', (req, res) => {
    const senderID = req.body.senderID;
    const message = req.body.message;
    invariant(senderID && message, 'both senderID and message are required');

    //await ResponseHandler.handleText(senderID, message);
    res.sendStatus(200);
  });

  router.post('/localChat/postback/', (req, res) => {
    const senderID = req.body.senderID;
    const payload = req.body.payload;

    invariant(senderID && payload, 'both senderID and payload are required');
    //await ResponseHandler.handlePostback(senderID, payload);
    res.sendStatus(200);
  });

  router.get('/localChat/*', (req, res) => {
    var filePath = req.url.replace('/localChat', '');
    if (filePath === '/') {
      filePath = 'index.html';
    }
    res.sendFile(filePath, {root: './localChatWeb'});
  });

  return router;
}

module.exports = FBLocalChatRoutes;
