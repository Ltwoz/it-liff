import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { College } from "@/types/college";

export async function collegeCalendar(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

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
