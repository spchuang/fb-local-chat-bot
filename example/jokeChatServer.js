const Bot = require('../build');
const express = require('express');
const bodyParser = require('body-parser')
const Promise = require('bluebird');

const JOKE = "Did you know photons had mass? I didn't even know they were Catholic.";
const RiddleImageUrl ="http://tinyurl.com/he9tsph";
const PostBackTypes = {
  TELL_JOKE: 'TELL_JOKE',
  TELL_ANOTHER_JOKE: 'TELL_ANOTHER_JOKE',
  LIST_JOKES: 'LIST_JOKES',
  TELL_RIDDLE: 'TELL_RIDDLE',
  MORE_BUTTONS: 'MORE_BUTTONS',
  SHOW_HSCROLL: 'SHOW_HSCROLL',
  SEND_SENDER_ACTION_TYPING_ON: 'SEND_SENDER_ACTION_TYPING_ON',
};
const QuickReplyTypes = {
  TELL_JOKE: 'TELL_JOKE',
  WRONG_ANSWER: 'WRONG_ANSWER',
  CORRECT_ANSWER: 'CORRECT_ANSWER',
}
const catImage = 'http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg';
// Create 10 Quick Replies, Joke 1, Joke 2, ...
const JokeQuickReplies = [...Array(10).keys()].map(x => Bot.createQuickReply(`Joke ${x+1}`, 'TELL_JOKE'));

function makeServer() {
  // initialize Bot and define event handlers
  Bot.init('<TOKEN>', '<VERIFY_TOKEN>', true /*useLocalChat*/, false /*useMessenger*/);

  Bot.on('text', (event) => {
    const senderID = event.sender.id;
    Bot.sendButtons(
      senderID,
      'Hello, how are you?',
      [
        Bot.createPostbackButton('Tell me a joke', PostBackTypes.TELL_JOKE),
        Bot.createPostbackButton('Show list of jokes', PostBackTypes.LIST_JOKES),
        Bot.createPostbackButton('Solve a riddle', PostBackTypes.TELL_RIDDLE),
        Bot.createURLButton('Open website for jokes', 'http://jokes.cc.com/', 'tall'),
        Bot.createPostbackButton('More buttons', PostBackTypes.MORE_BUTTONS),
        Bot.createPostbackButton('Show hscroll', PostBackTypes.SHOW_HSCROLL),
        Bot.createPostbackButton('Show typing on action', PostBackTypes.SEND_SENDER_ACTION_TYPING_ON),
      ]
    );
  });

  const menuItems = [
    Bot.createPostbackButton('Tell me a joke', PostBackTypes.TELL_JOKE),
    Bot.createPostbackButton('Show list of jokes', PostBackTypes.LIST_JOKES),
    Bot.createURLButton('Open website for jokes', 'http://jokes.cc.com/', 'tall'),
    Bot.createNestedMenuItem('more', [
      Bot.createPostbackButton('More buttons', PostBackTypes.MORE_BUTTONS),
      Bot.createPostbackButton('Show hscroll', PostBackTypes.SHOW_HSCROLL),
      Bot.createNestedMenuItem('Even more stuff', [
        Bot.createPostbackButton('More buttons', PostBackTypes.MORE_BUTTONS),
        Bot.createPostbackButton('Show hscroll', PostBackTypes.SHOW_HSCROLL),
        Bot.createPostbackButton('Show typing on action', PostBackTypes.SEND_SENDER_ACTION_TYPING_ON),
      ]),
    ]),
  ];

  Bot.setPersistentMenu(
    [
      Bot.createPersistentMenu('default', false, menuItems),
      Bot.createPersistentMenu('cn', false, menuItems),
      Bot.createPersistentMenu('jp', false, menuItems),
    ]
  );

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
            JokeQuickReplies
        );
        break;
      case PostBackTypes.TELL_RIDDLE:
        Bot.sendQuickReplyWithAttachment(
          senderID,
          Bot.createImageAttachment(RiddleImageUrl),
          [
            Bot.createQuickReply('97', QuickReplyTypes.WRONG_ANSWER),
            Bot.createQuickReply('87', QuickReplyTypes.CORRECT_ANSWER),
            Bot.createQuickReply('89', QuickReplyTypes.WRONG_ANSWER),
            Bot.createQuickReply('91', QuickReplyTypes.WRONG_ANSWER),
          ]
        )
        break;
      case PostBackTypes.MORE_BUTTONS:
        Bot.sendButtons(
          senderID,
          'More buttons?',
          [
            Bot.createCallButton('Call Sam', '+12345678'),
            Bot.createShareButton(),
          ]
        );
        break;
      case PostBackTypes.SHOW_HSCROLL:
        const elements = [
          Bot.createGenericTemplateElement(
            'This is a cool hscroll 1',
            null,
            null,
            catImage,
            null,
            [
              Bot.createPostbackButton('button1', ''),
              Bot.createPostbackButton('button2', ''),
            ]
          ),
          Bot.createGenericTemplateElement(
            'This is a cool hscroll 2',
            null,
            null,
            catImage,
            null,
            [
              Bot.createPostbackButton('button1', ''),
              Bot.createPostbackButton('button2', ''),
            ]
          ),
        ];

        Bot.sendGenericTemplate(
          senderID,
          elements
        );
        break;
      case PostBackTypes.SEND_SENDER_ACTION_TYPING_ON:
        Bot.sendSenderAction(senderID, 'typing_on');
        break;
    }
  });

  Bot.on('quick_reply', event => {
    const senderID = event.sender.id;
    switch(event.message.quick_reply.payload) {
      case QuickReplyTypes.TELL_JOKE:
        Bot.sendText(senderID, 'You asked for ' + event.message.text);
        break;
      case QuickReplyTypes.WRONG_ANSWER:
        Bot.sendText(senderID, 'Wrong answer... :(');
        break;
      case QuickReplyTypes.CORRECT_ANSWER:
        Bot.sendText(senderID, 'Correct answer! :)');
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
