const Bot = require('../build');
const express = require('express');
const bodyParser = require('body-parser')
const Promise = require('bluebird');

const JOKE = "Did you know photons had mass? I didn't even know they were Catholic.";
const PostBackTypes = {
  TELL_JOKE: 'TELL_JOKE',
  TELL_ANOTHER_JOKE: 'TELL_ANOTHER_JOKE',
};

function makeServer() {
  // initialize Bot and define event handlers
  Bot.init('<TOKEN>', '<VERIFY_TOKEN>', true /*useLocalChat*/);

  Bot.on('text', (event) => {
    const senderID = event.sender.id;
    Bot.sendButtons(
      senderID,
      'Hello, how are you?',
      [Bot.createPostbackButton('Tell me a joke', PostBackTypes.TELL_JOKE)]
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
    }
  });

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.use('/chat', Bot.router());

  var server = app.listen(5000);
  return server;
}

module.exports = makeServer;
