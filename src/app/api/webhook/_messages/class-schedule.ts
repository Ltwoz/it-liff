import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Students } from "@/types/students";

export async function classSchedule(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const userId = event.source.userId;

  const { data }: { data: Students[] | null } = await supabase
    .from("students")
    .select("*")
    .eq("line_uid", userId);

  if (!data?.length) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "คุณยังไม่ได้ลงทะเบียน",
    });
  }

  

  // ทำฟังก์ชั่นเช็คว่าเป็นนักศึกษาชั้นไหน
  // โดยเอา userId ไป query หาใน database

  // await reply.sendImage({
  //     replyToken: event.replyToken,
  //     originalContentUrl: "https://i.kym-cdn.com/entries/icons/facebook/000/041/972/kaicenat.jpg",
  //     previewImageUrl: "https://i.kym-cdn.com/entries/icons/facebook/000/041/972/kaicenat.jpg",
  //   });
}
