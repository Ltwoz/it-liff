import { messagingApi } from "@line/bot-sdk";
import { NextResponse } from "next/server";
const { MessagingApiClient } = messagingApi;

export async function POST(req: Request) {
  try {
    const { groupId } = await req.json();

    const client = new MessagingApiClient({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
    });

    await client.leaveGroup(groupId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
