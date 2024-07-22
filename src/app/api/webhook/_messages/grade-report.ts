import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";

export async function gradeReport(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const userId = event.source.userId;

  const link = "https://www.google.co.th/?hl=th";
  const notregisterlink = "https://liff.line.me/2005387694-RmynZd5l";

  const { data: student }: { data: Student | null } = await supabase
    .from("students")
    .select("*")
    .eq("line_uid", userId)
    .single();

  if (!student) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: `คุณยังไม่ได้ลงทะเบียน กรุณาลงทะเบียนผ่านลิ้งนี้: ${notregisterlink}`,
    });

    return;
  }
  
  await reply.sendText({
    replyToken: event.replyToken,
    text: `ดูผลการเรียนได้ที่: ${link}`,
  });

  return;
}
