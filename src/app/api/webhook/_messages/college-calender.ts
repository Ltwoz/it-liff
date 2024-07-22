import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";
import { College } from "@/types/college";

export async function collegeCalendar(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const userId = event.source.userId;

  const notregisterlink = "https://liff.line.me/2005387694-RmynZd5l";
  
  const { data: student }: { data: Student | null } = await supabase
    .from("students")
    .select("*")
    .eq("line_uid", userId)
    .single();

  if (!student) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: `คุณยังไม่ได้ลงทะเบียน กรุณาลงทะเบียนผ่านลิ้งนี้: ${notregisterlink}`
    });

    return;
  }

  const { data: calendar }: { data: College | null } = await supabase
    .from("college_calendar")
    .select("public_url")
    .single();

  if (!calendar) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบปฏิทินการศึกษา",
    });

    return;
  }

  await reply.sendImage({
    replyToken: event.replyToken,
    originalContentUrl: calendar.public_url,
    previewImageUrl: calendar.public_url,
  });

  return;
}
