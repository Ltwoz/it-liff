import { messagingApi, PostbackEvent } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Activity } from "@/types/activity";

export async function activityPostback(event: PostbackEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const { data: activity }: { data: Activity | null } = await supabase
    .from("activity_schedules")
    .select("*")
    .eq("id", event.postback.data.split("=")[1])
    .eq("is_publish", true)
    .single();

  if (!activity) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบตารางกิจกรรม",
    });

    return;
  }

  const content = `${activity.title}\n\n${activity.description}`;

  await reply.send({
    replyToken: event.replyToken,
    messages: [
      {
        type: "image",
        originalContentUrl: activity.public_url,
        previewImageUrl: activity.public_url,
      },
      {
        type: "text",
        text: content,
      },
    ],
  });

  return;
}
