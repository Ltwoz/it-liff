import { messagingApi } from "@line/bot-sdk";
const { MessagingApiClient } = messagingApi;

export type TextParam = {
  replyToken: string;
  text: string;
};

export type ImageParam = {
  replyToken: string;
  originalContentUrl: string;
  previewImageUrl: string;
};

export class Reply {
  private client: messagingApi.MessagingApiClient;

  constructor() {
    this.client = new MessagingApiClient({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
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
}
