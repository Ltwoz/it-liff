import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, name, level, userId } = await request.json();

    if (!code || !name || !level || !userId) {
      throw new Error('Missing required fields (code, name, level, userId)');
    }

    const message = `รหัสนักศึกษา: ${code}\nชื่อ-นามสกุล: ${name}\nระดับชั้น: ${level}`;

    const accessToken = process.env.LINE_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('LINE OA access token is not defined');
    }

    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to LINE OA');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error sending message' });
  }
}
