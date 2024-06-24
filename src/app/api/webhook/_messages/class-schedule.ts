import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";

export async function classSchedule(event: MessageEvent) {
  const reply = new Reply();

  await reply.sendImage({
      replyToken: event.replyToken,
      originalContentUrl: "https://i.kym-cdn.com/entries/icons/facebook/000/041/972/kaicenat.jpg",
      previewImageUrl: "https://i.kym-cdn.com/entries/icons/facebook/000/041/972/kaicenat.jpg",
    });
}