import { JoinEvent } from "@line/bot-sdk";
import { createClient } from "@/lib/supabase/server";
import { Group } from "../_service/group";

export async function joinedHandler(event: JoinEvent) {
  const service = new Group();
  const supabase = createClient();

  if (event.type === "join" && event.source.type === "group") {
    const groupId = event.source.groupId;

    const summary = await service.summary({ groupId });

    const { data: group } = await supabase
      .from("groups")
      .insert({
        name: summary.groupName,
        image: summary.pictureUrl,
        gid: summary.groupId,
      })
      .select("*")
      .single();

    console.log("inserted result : ", group);
  }

  return;
}
