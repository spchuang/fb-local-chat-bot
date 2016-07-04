import LocalChatContainer from './src/LocalChatContainer.jsx';
import LocalChatStore from './src/LocalChatStore.js';
import ReactDOM from 'react-dom';
import React from 'react';

window.init = (baseURL: string) => {
  LocalChatStore.setBaseUrl(baseURL);
  LocalChatStore.startPolling();

  let ID = null;
  while (ID === null) {
    ID = prompt("Please enter a User ID", "1234");
  }

  ReactDOM.render(<LocalChatContainer userID={ID}/>, document.getElementById('fb-local-chat-root'));
}
