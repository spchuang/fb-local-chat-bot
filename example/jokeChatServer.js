const Bot = require('../build');
const express = require('express');
const bodyParser = require('body-parser')
const Promise = require('bluebird');

const JOKE = "Did you know photons had mass? I didn't even know they were Catholic.";
const PostBackTypes = {
  TELL_JOKE: 'TELL_JOKE',
  TELL_ANOTHER_JOKE: 'TELL_ANOTHER_JOKE',
  LIST_JOKES: 'LIST_JOKES',
};
const QuickReplyTypes = {
  JOKE1: 'JOKE1',
  JOKE2: 'JOKE2',
  JOKE3: 'JOKE3',
  JOKE4: 'JOKE4',
};

function makeServer() {
  // initialize Bot and define event handlers
  Bot.init('<TOKEN>', '<VERIFY_TOKEN>', true /*useLocalChat*/);

  Bot.on('text', (event) => {
    const senderID = event.sender.id;
    Bot.sendButtons(
      senderID,
      'Hello, how are you?',
      [
        Bot.createPostbackButton('Tell me a joke', PostBackTypes.TELL_JOKE),
        Bot.createPostbackButton('Show list of jokes', PostBackTypes.LIST_JOKES)
      ]
    );
  });

  Bot.on('postback', event => {
    const senderID = event.sender.id;
    switch(event.postback.payload) {
      case PostBackTypes.TELL_JOKE:
        Bot.sendText(senderID, JOKE);
        Bot.sendButtons(
          senderID,
          'Ha. Ha. Ha. What else may I do for you?',
          [Bot.createPostbackButton('Tell me another joke', PostBackTypes.TELL_ANOTHER_JOKE)]
        );
        break;
      case PostBackTypes.TELL_ANOTHER_JOKE:
        Bot.sendText(senderID, 'Sorry, I only know one joke');
        break;
      case PostBackTypes.LIST_JOKES:
        Bot.sendQuickReplyWithText(
            senderID,
            'Select a joke',
            [
              Bot.createQuickReply('Joke 1',QuickReplyTypes.JOKE1),
              Bot.createQuickReply('Joke 2',QuickReplyTypes.JOKE2),
              Bot.createQuickReply('Joke 3',QuickReplyTypes.JOKE3),
              Bot.createQuickReply('Joke 4',QuickReplyTypes.JOKE4),
            ]
        );
        break;
    }
  });

  Bot.on('quick_reply', event => {
    const senderID = event.sender.id;
    Bot.sendText(senderID, 'You asked for ' + event.message.text);
  });

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.use('/chat', Bot.router());

  var server = app.listen(5000);
  return server;
}

module.exports = makeServer;
