import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";

export async function classSchedule(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const userId = event.source.userId;

  const { data: student }: { data: Student | null } = await supabase
    .from("students")
    .select("*")
    .eq("line_uid", userId)
    .single();

  if (!student) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "คุณยังไม่ได้ลงทะเบียน",
    });

    return;
  }

  const { data: schedule } = await supabase
    .from("class_schedules")
    .select("public_url")
    .eq("level", student.level)
    .single();

  if (!schedule) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบตารางเรียน",
    });

    return;
  }

  await reply.sendImage({
    replyToken: event.replyToken,
    originalContentUrl: schedule.public_url,
    previewImageUrl: schedule.public_url,
  });

  return;
}
