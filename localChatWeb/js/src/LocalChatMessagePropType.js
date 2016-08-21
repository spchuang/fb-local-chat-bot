/*
 * @flow
 */

'use strict';

import {PropTypes} from 'react';

// for reference: https://developers.facebook.com/docs/messenger-platform/send-api-reference
/*
 * For now we only support 3 types of messages
 * 1. text Only
 * 2. image
 * 3. button template
 * 4. quick reply with text/image
 */
const TextMessagePropType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  fromUser: PropTypes.bool.isRequired,
});

const ImagePropType = PropTypes.shape({
  type: PropTypes.oneOf(['image']).isRequired,
  payload: PropTypes.shape({
    url: PropTypes.string.isRequired,
  })
});

const ImageMessagePropType = PropTypes.shape({
  text: PropTypes.string,
  attachment: ImagePropType.isRequired,
  fromUser: PropTypes.bool.isRequired,
});

const ButtonPropType = PropTypes.shape({
  type: PropTypes.oneOf(['web_url', 'postback']).isRequired,
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  payload: PropTypes.string,
});

const ButtonsTemplateMessagePropType = PropTypes.shape({
  text: PropTypes.string,
  attachment: PropTypes.shape({
    type: PropTypes.oneOf(['template']).isRequired,
    payload: PropTypes.shape({
      "template_type": PropTypes.oneOf(['button']).isRequired,
      "text": PropTypes.string,
      "buttons": PropTypes.arrayOf(ButtonPropType),
    }).isRequired,
  }),
  fromUser: PropTypes.bool.isRequired,
});

const QuickRepliesPropType = PropTypes.shape({
  content_type: PropTypes.oneOf(['text']).isRequired,
  title: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
});

const QuickReplyMessageWithTextPropType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  quick_replies: PropTypes.arrayOf(QuickRepliesPropType),
  fromUser: PropTypes.bool.isRequired,
});

const QuickReplyMessageWithImagePropType = PropTypes.shape({
  attachment: ImagePropType.isRequired,
  quick_replies: PropTypes.arrayOf(QuickRepliesPropType),
  fromUser: PropTypes.bool.isRequired,
});

const LocalChatMessagePropType = PropTypes.oneOfType([
  TextMessagePropType,
  ImageMessagePropType,
  ButtonsTemplateMessagePropType,
  QuickReplyMessageWithTextPropType,
  QuickReplyMessageWithImagePropType,
]);

module.exports = LocalChatMessagePropType;
