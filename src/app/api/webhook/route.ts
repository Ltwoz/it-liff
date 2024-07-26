import { WebhookRequestBody } from "@line/bot-sdk";
import { classSchedule } from "./_messages/class-schedule";
import { activitySchedule } from "./_messages/activity-schedule";
import { gradeReport } from "./_messages/grade-report";
import { collegeCalendar } from "./_messages/college-calender"
import { faqHandler } from "./_messages/faq";


export async function POST(req: Request) {
  const res: WebhookRequestBody = await req.json();

  if (!res.events)
    return Response.json({ status: 400, message: "Bad Request" });

  try {
    for (const event of res.events) {
      if (event.type === "message" && event.message.type === "text") {
        const message = event.message.text.toLowerCase();

        switch (message) {
          case "/ตารางเรียน":
            await classSchedule(event);
            break;
          case "/กิจกรรม":
            await activitySchedule(event);
            break;
            case "/ผลการเรียน":
            await gradeReport(event);
            break;
            case "/ปฏิทิน":
            await collegeCalendar(event);
            case "/faq":
            await faqHandler(event);
            break;
          default:
            break;
        }
      }
    }

    return Response.json({ status: 200, message: "success" });
  } catch (error) {
    throw new Error(`Caught error at webhook with these error : ${error}`);
  }
}
