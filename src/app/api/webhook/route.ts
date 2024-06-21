import { WebhookRequestBody, messagingApi } from "@line/bot-sdk";

export async function POST(req: Request) {
  const { MessagingApiClient } = messagingApi;

  const client = new MessagingApiClient({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
  });

  const res: WebhookRequestBody = await req.json();

  if (!res.events) return Response.json({ status: 400, message: "Bad Request" });

  try {
    console.log(res.events);
    for (const event of res.events) {
      if (event.type === "message" && event.message.type === "text") {
        const message = event.message.text.toLowerCase();

        let replyMessage = "";

        switch (message) {
          case "/ตารางเรียน":
            replyMessage = "ส่งตารางเรียนจาก Webhook";
            break;
          default:
            break;
        }

        client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: replyMessage,
            },
          ],
        });
      }
    }

    return Response.json({ status: 200, message: "Success" });
  } catch (error) {
    throw new Error(`Caught error at webhook with these error : ${error}`);
  }
}
