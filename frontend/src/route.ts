import { NextRequest, NextResponse } from "next/server";
const WEBHOOK = process.env.WEBHOOK;

export async function POST(request: NextRequest) {
  try {
    const { type, message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const webhookUrl = `${WEBHOOK}?query_format=${type}`;
    console.log("Message Sent :", message.trim());
    const apiResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    const response = await apiResponse.json();

    console.log("Chat API response:", response);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
