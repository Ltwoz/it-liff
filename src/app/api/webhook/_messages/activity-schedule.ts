import { MessageEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Student } from "@/types/student";
import { Activity } from "@/types/activity";

export async function activitySchedule(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const { data: activity }: { data: Activity | null } = await supabase
    .from("activity_schedule")
    .select("public_url")
    .single();

  if (!activity) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบตารางกิจกรรม",
    });

    return;
  }

  await reply.sendImage({
    replyToken: event.replyToken,
    originalContentUrl: activity.public_url,
    previewImageUrl: activity.public_url,
  });

  return;
}
