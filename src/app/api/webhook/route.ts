import { WebhookRequestBody, MessageEvent } from "@line/bot-sdk";

import { debounce } from "./_utils/debounce";
import { classSchedule } from "./_messages/class-schedule";
import { activitySchedule } from "./_messages/activity-schedule";
import { gradeReport } from "./_messages/grade-report";
import { collegeCalendar } from "./_messages/college-calender";
import { faqHandler } from "./_messages/faq";

const debounceTime = 1000;

const handleEvents = debounce(async (event: MessageEvent) => {
  if (event.message.type !== "text") return;

  const message = event.message.text.toLowerCase();

  if (message.startsWith("/cs")) {
    await classSchedule(event);
  } else {
    switch (message) {
      case "/กิจกรรม":
        await activitySchedule(event);
        break;
      case "/ผลการเรียน":
        await gradeReport(event);
        break;
      case "/ปฏิทิน":
        await collegeCalendar(event);
        break;
      case "/faq":
        await faqHandler(event);
        break;
      default:
        break;
    }
  }
}, debounceTime);

export async function POST(req: Request) {
  const res: WebhookRequestBody = await req.json();

  if (!res.events)
    return Response.json({ status: 400, message: "Bad Request" });

  try {
    for (const event of res.events) {
      if (event.type === "message" && event.message.type === "text") {
        // await handleEvents(event);
        const message = event.message.text.toLowerCase();

        if (message.startsWith("/cs")) {
          await classSchedule(event);
        } else {
          switch (message) {
            case "/กิจกรรม":
              await activitySchedule(event);
              break;
            case "/ผลการเรียน":
              await gradeReport(event);
              break;
            case "/ปฏิทิน":
              await collegeCalendar(event);
              break;
            case "/faq":
              await faqHandler(event);
              break;
            default:
              break;
          }
        }
      }
    }

    return Response.json({ status: 200, message: "success" });
  } catch (error) {
    throw new Error(`Caught error at webhook with these error : ${error}`);
  }
}
