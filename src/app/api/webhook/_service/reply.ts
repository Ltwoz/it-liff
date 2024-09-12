import { messagingApi } from "@line/bot-sdk";
const { MessagingApiClient } = messagingApi;

type Base = {
  replyToken: string;
};

export type MessagesParam = {
  messages: messagingApi.Message[];
} & Base;

export type TextParam = {
  text: string;
} & Base;

export type ImageParam = {
  originalContentUrl: string;
  previewImageUrl: string;
} & Base;

export type TemplateParam = {
  options: messagingApi.Template;
} & Base;

export class Reply {
  private client: messagingApi.MessagingApiClient;

  constructor() {
    this.client = new MessagingApiClient({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
    });
  }

  /**
   * Reply messages.
   * @param MessagesParam
   *
   */
  public async send({ replyToken, messages }: MessagesParam) {
    await this.client.replyMessage({
      replyToken,
      messages: messages,
    });
  }

  /**
   * Reply a text message.
   * @param TextParam
   *
   */
  public async sendText({ replyToken, text }: TextParam) {
    await this.client.replyMessage({
      replyToken,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    });
  }

  /**
   * Reply an image.
   * @param ImageParam
   *
   */
  public async sendImage({
    replyToken,
    originalContentUrl,
    previewImageUrl,
  }: ImageParam) {
    await this.client.replyMessage({
      replyToken,
      messages: [
        {
          type: "image",
          originalContentUrl,
          previewImageUrl,
        },
      ],
    });
  }

  /**
   * Reply a template.
   * @param TemplateParam
   *
   */
  public async sendTemplate({ replyToken, options }: TemplateParam) {
    await this.client.replyMessage({
      replyToken,
      messages: [
        {
          type: "template",
          altText: "template",
          template: options,
        },
      ],
    });
  }
}
