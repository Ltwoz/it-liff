import { WebhookRequestBody } from "@line/bot-sdk";
import { Reply } from "./_service/reply";

export async function POST(req: Request) {
  const res: WebhookRequestBody = await req.json();

  if (!res.events)
    return Response.json({ status: 400, message: "Bad Request" });

  try {
    const reply = new Reply();

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

        await reply.sendImage({
          replyToken: event.replyToken,
          originalContentUrl: "https://i.kym-cdn.com/entries/icons/facebook/000/041/972/kaicenat.jpg",
          previewImageUrl: "https://i.kym-cdn.com/entries/icons/facebook/000/041/972/kaicenat.jpg",
        });
      }
    }

    return Response.json({ status: 200, message: "success" });
  } catch (error) {
    throw new Error(`Caught error at webhook with these error : ${error}`);
  }
}
