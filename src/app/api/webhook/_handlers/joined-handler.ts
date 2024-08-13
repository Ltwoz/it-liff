import { JoinEvent } from "@line/bot-sdk";
import { createClient } from "@/lib/supabase/server";
import { Group } from "../_service/group";

export async function joinedHandler(event: JoinEvent) {
  const service = new Group();
  const supabase = createClient();

  if (event.type === "join" && event.source.type === "group") {
    try {
      const groupId = event.source.groupId;

      const summary = await service.summary({ groupId });

      console.log("summary : ", summary);

      const { data: group } = await supabase
        .from("groups")
        .insert({
          name: summary.groupName,
          image: summary.pictureUrl,
          gid: summary.groupId,
        })
        .select()
        .single();

      console.log(group);
    } catch (error) {
      throw new Error(
        `Caught error at webhook/joined-handler with these error : ${error}`
      );
    }
  }

  return;
}
