import { NextResponse } from 'next/server';

const levelMap: Record<string, string> = {
  "1": "ปวช.1",
  "2": "ปวช.2",
  "3": "ปวช.3",
  "4": "ปวส.1 กลุ่ม สายตรง",
  "5": "ปวส.1 กลุ่ม ม.6",
  "6": "ปวส.2 กลุ่ม สายตรง",
  "7": "ปวส.2 กลุ่ม ม.6",
};

export async function POST(request: Request) {
  try {
    const { code, name, level, userId } = await request.json();

    if (!code || !name || !level || !userId) {
      throw new Error('Missing required fields (code, name, level, userId)');
    }

    const levelDescription = levelMap[level] || level;

    const message = `รหัสนักศึกษา: ${code}\nชื่อ-นามสกุล: ${name}\nระดับชั้น: ${levelDescription}`;

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
