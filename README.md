# fb-local-chat-bot

Testing your Messenger Bot apps is a pain in the ass - you need to setup ngrok to tunnel to your server (what happens when multiple people work on it?) and writing unit tests are not intuitive.

fb-local-chat-bot is
- a standard library that handles the boilerplate logic to connect with FB APIs
- a local web client to debug the app (see screenshot)
- a set of intuitive APIs for unit testing on messenger bot

# Demo
![](https://github.com/spchuang/fb-local-chat-bot/blob/master/screenshot.gif)

![](https://github.com/spchuang/fb-local-chat-bot/blob/master/screenshot2.png)

## Install
```
npm install fb-local-chat-bot
```

# Code Snippet

## Initialize
```
// app.js
// if useMessenger is false, the plugin will not make graphAPI calls to facebook
// if useLocalChat is true, the plugin will initialize the local chat view.
Bot.init(
  config.FBChatToken || '',
  'SETUP_PLAY_GO_THIS_IS_RIGHT',
  false, // useMessenger
  config.useFBChatLocalTest || false,
);

Bot.on('text', async (event: object) => {
  // do something
});

Bot.on('attachments', async (event: object) => {
  // do something
});

Bot.on('postback', async (event: object) => {
  // do something
});

app.use('/webhook', Bot.router());
// go to http://localhost:5000/webhook/localChat/ for local chat debugging
```

## Send APIs
```
// generic send API
Bot.send(userID, messageData);

// send text
Bot.sendText(userID, "Yo what's up how you doin");

// send image
Bot.sendImage(userID, imageURL);

// send buttons
Bot.sendButtons(
  userID,
  'Some text',
  [
    Bot.createPostbackButton(
      'button 1',
      'BUTTON_TYPE_1',
    ),
    Bot.createPostbackButton(
      'button 2',
      'BUTTON_TYPE_2',
    ),
  ]
);
// Other APIs (see src/index.js for detail)
// Bot.sendVideo
// Bot.sendFile
// Bot.sendAudio
// Bot.sendGenericTemplate
// Bot.sendListTemplate
// Bot.sendQuickReplyWithAttachment
// Bot.sendQuickReplyWithText
```

## Testing APIs
```
// example using mocha
describe('Basic server test', function() {
  this.timeout(1000);
  var server;
  var userID = 'testUser';
  beforeEach(mochaAsync(async () => {
    server = await makeServer(true /* silent */);
  }));

  afterEach(function (done) {
    Bot.clearLocalChatMessages();
    Bot.removeAllListeners();
    server.close(done);
  });

  it('Test help', mochaAsync(async () => {
    await ResponseHandler.handleText(userID, "help");

    let messages = Bot.getLocalChatMessagesForUser(userID);
    expect(messages.length).to.equal(2);
  }));
});

```

## History
- 0.1.4
   - Add persistent menu support
   - Add sender action
- 0.1.3
   - Add general template hscroll
- 0.1.0
   - Add `useMessenger` param
   - Add QuickReply, ListTemplate, GenericTemplate and various buttons
   - Add profile fetching API
