import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";

export async function classSchedule(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  if (event.message.type !== "text") return;

  const levelCode = event.message.text.split("-")[1];

  if (!levelCode) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบระดับชั้น",
    });

    return;
  }

  const { data: schedule } = await supabase
    .from("class_schedules")
    .select("public_url")
    .eq("level", levelCode)
    .single();

  if (!schedule) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบตารางเรียน",
    });

    return;
  }

  console.log("sending...");

  await reply.sendImage({
    replyToken: event.replyToken,
    originalContentUrl: schedule.public_url,
    previewImageUrl: schedule.public_url,
  });

  return;
}
