import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Students } from "@/types/students";

export async function classSchedule(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const userId = event.source.userId;

  const { data: students }: { data: Students[] | null } = await supabase
    .from("students")
    .select("*")
    .eq("line_uid", userId);

  if (!students?.length) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "คุณยังไม่ได้ลงทะเบียน",
    });

    return;
  }

  const { data: schedules } = await supabase
    .from("class_schedules")
    .select("public_url")
    .eq("level", students[0].level);

  if (!schedules?.length) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบตารางเรียน",
    });

    return;
  }

  await reply.sendImage({
    replyToken: event.replyToken,
    originalContentUrl: schedules[0].public_url,
    previewImageUrl: schedules[0].public_url,
  });

  return;
}
