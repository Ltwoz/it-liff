import { MessageEvent, messagingApi } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";
import { Activity } from "@/types/activity";

export async function activitySchedule(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  const { data: activities }: { data: Activity[] | null } = await supabase
    .from("activity_schedules")
    .select("*")
    .eq("is_publish", true);

  if (!activities?.length) {
    await reply.sendText({
      replyToken: event.replyToken,
      text: "ไม่พบตารางกิจกรรม",
    });

    return;
  }

  const columns: messagingApi.CarouselColumn[] = activities.map((activity) => ({
    thumbnailImageUrl: activity.public_url,
    imageBackgroundColor: "#FFFFFF",
    title: activity.title,
    text:
      activity.description.length > 60
        ? `${activity.description.substring(0, 57)}...`
        : activity.description,
    actions: [
      {
        type: "postback",
        label: "อ่านต่อ",
        data: `activity:activityId=${activity.id}`,
      },
    ],
  }));

  await reply.sendTemplate({
    replyToken: event.replyToken,
    options: {
      type: "carousel",
      columns: columns,
      imageAspectRatio: "rectangle",
      imageSize: "cover",
    },
  });

  return;
}
