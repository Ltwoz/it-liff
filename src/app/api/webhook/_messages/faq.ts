import { MessageEvent, TextEventMessage } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";

const faqQuestions = `โปรดเลือกคำถามที่พบบ่อย\n(พิมตัวเลข เช่น "1")\n1. คำถามที่ 1\n2. คำถามที่ 2\n3. คำถามที่ 3`;

const faqAnswers: { [key: string]: string } = {
  "1": "คำตอบสำหรับคำถามที่ 1",
  "2": "คำตอบสำหรับคำถามที่ 2",
  "3": "คำตอบสำหรับคำถามที่ 3",
};

export async function faqHandler(event: MessageEvent) {
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

  if (event.message.type === "text") {
    const messageText = (event.message as TextEventMessage).text.trim();
    const answer = faqAnswers[messageText];

    if (answer) {
      await reply.sendText({
        replyToken: event.replyToken,
        text: answer,
      });
    } else {
      await reply.sendText({
        replyToken: event.replyToken,
        text: faqQuestions,
      });
    }
  } else {
    await reply.sendText({
      replyToken: event.replyToken,
      text: faqQuestions,
    });
  }

  return;
}
