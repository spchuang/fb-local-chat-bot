// @flow

export type Text = {
  text: string,
};

type Payload = {
  url: string,
  is_reusable?: boolean,
};

export type MultimediaAttachment = {
  type: 'audio' | 'file' | 'image' | 'video',
  payload: Payload,
};

export type SendActionType =
  'mark_seen' | 'typing_on' | 'typing_off';

export type PersistentMenu = {
  locale: string,
  composer_input_disabled: boolean,
  call_to_actions: Array<PersistenMenuItem>,
};

export type NestedPersistentMenuItem = {
  title: string,
  type: 'nested',
  call_to_actions: Array<PersistenMenuItem>,
};

export type PersistenMenuItem =
  PostbackButton |
  URLButton |
  NestedPersistentMenuItem;

export type ButtonTemplateAttachment = {
  type: 'template',
  payload: {
    template_type: 'button',
    text: string,
    buttons: Array<Button>,
  },
};

export type GenericTemplateAttachmentElement = {
  title: string,
  item_url?: string,
  default_action?: Object,
  image_url?: string,
  subtitle?: string,
  buttons?: Array<Button>,
};

export type GenericTemplateAttachment = {
  type: 'template',
  payload: {
    template_type: 'generic',
    elements: Array<GenericTemplateAttachmentElement>,
  },
};

export type ListTemplateAttachmentElement = {
  title: string,
  subtitle?: string,
  image_url?: string,
  default_action?: Object,
  buttons?: Array<Button>,
};

export type ListTemplateAttachment = {
  type: 'template',
  payload: {
    template_type: 'list',
    elements: Array<ListTemplateAttachmentElement>,
    top_element_style?: 'large' | 'compact',
    buttons?: Array<Button>,
  },
}

export type Attachment =
  MultimediaAttachment | ButtonTemplateAttachment | GenericTemplateAttachment | ListTemplateAttachment;

export type TextQuickReply = {
  content_type: 'text',
  title: string,
  payload: string,
  image_url?: string,
}

export type LocationQuickReply = {
  content_type: 'location',
  image_url?: string,
};

export type QuickReply = TextQuickReply | LocationQuickReply;

export type WebviewHeightRatio = 'compact' | 'tall' | 'full';

export type URLButton = {
  type: 'web_url',
  title: string,
  url: string,
  webview_height_ratio?: WebviewHeightRatio,
  messenger_extensions?: boolean,
  fallback_url?: string,
};

export type PostbackButton = {
  type: 'postback',
  title: string,
  payload: string,
};

export type CallButton = {
  type: 'phone_number',
  title: string,
  payload: string,
};

export type ShareButton = {
  type: 'element_share',
};

export type Button =
  URLButton | PostbackButton | CallButton | ShareButton;

export type Message = {
  text: string,
  quick_replies?: Array<QuickReply>,
  metadata?: string,
} | {
  attachment: Attachment,
  quick_replies?: Array<QuickReply>,
  metadata?: string,
};
