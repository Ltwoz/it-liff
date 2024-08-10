import { MessageEvent, TextEventMessage } from "@line/bot-sdk";
import { Reply } from "../_service/reply";
import { createClient } from "@/lib/supabase/server";

export async function faqHandler(event: MessageEvent) {
  const reply = new Reply();
  const supabase = createClient();

  if (event.message.type === "text") {
    const messageText = (event.message as TextEventMessage).text.trim();

    const { data: faqs, error } = await supabase
      .from("faq")
      .select("id, question, answer")
      .eq("is_active", true).order('id', { ascending: true })

    if (error || !faqs || faqs.length === 0) {
      await reply.sendText({
        replyToken: event.replyToken,
        text: "ไม่พบคำถามที่พบบ่อยในขณะนี้",
      });
      return;
    }

    const faqQuestions = faqs
      .map((faq, index) => `${index + 1}. ${faq.question}`)
      .join("\n");

    const selectedIndex = parseInt(messageText, 10) - 1;
    const selectedFaq = faqs[selectedIndex];

    if (selectedFaq) {
      await reply.sendText({
        replyToken: event.replyToken,
        text: selectedFaq.answer,
      });
    } else {
      if (messageText === "/faq") {
        await reply.sendText({
          replyToken: event.replyToken,
          text: `โปรดเลือกคำถามที่พบบ่อย\n(พิมตัวเลข เช่น "1")\n${faqQuestions}`,
        });
      } 
      else {
        return;
      }
    }
  }

  return;
}
