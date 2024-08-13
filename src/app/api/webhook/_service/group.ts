import { messagingApi } from "@line/bot-sdk";
const { MessagingApiClient } = messagingApi;

export type GroupBase = {
  groupId: string;
};

export type TextParam = {
  text: string;
} & GroupBase;

export class Group {
  private client: messagingApi.MessagingApiClient;

  constructor() {
    this.client = new MessagingApiClient({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
    });
  }

  /**
   * Get group summary.
   * @param GroupBase
   *
   */
  public async summary({ groupId }: GroupBase) {
    return await this.client.getGroupSummary(groupId);
  }

  /**
   * Push a text message to a group.
   * @param TextParam
   *
   */
  public async sendText({ groupId, text }: TextParam) {
    await this.client.pushMessage({
      to: groupId,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    });
  }
}
