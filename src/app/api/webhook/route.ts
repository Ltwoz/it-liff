import { WebhookRequestBody, messagingApi } from "@line/bot-sdk";

export async function POST(req: Request & { body: WebhookRequestBody }) {
  const { events } = req.body;
  const { MessagingApiClient } = messagingApi;

  const client = new MessagingApiClient({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
  });

  console.log(req);

  try {
  //   for (const event of events) {
  //     if (event.type === "message" && event.message.type === "text") {
  //       const message = event.message.text.toLowerCase();

  //       let replyMessage = "";

  //       switch (message) {
  //         case "/ตารางเรียน":
  //           replyMessage = "ส่งตารางเรียน";
  //           break;
  //         default:
  //           break;
  //       }

  //       return client.replyMessage({
  //         replyToken: event.replyToken,
  //         messages: [
  //           {
  //             type: "text",
  //             text: replyMessage,
  //           },
  //         ],
  //       });
  //     }
  //   }

    return Response.json({ status: 200, message: "Success" });
  } catch (error) {
    throw new Error(`Caught error at webhook with these error : ${error}`);
  }
}
