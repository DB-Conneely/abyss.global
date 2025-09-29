// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const templateParams = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_USER_ID,
          accessToken: process.env.EMAILJS_PRIVATE_KEY, // Add this for strict mode auth
          template_params: templateParams,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailJS error:", errorText); // Debug: Log API response if fails
      throw new Error(
        `EmailJS responded with ${response.status}: ${errorText}`,
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 },
    );
  } catch (error) {
    let message = "Failed to send message.";
    if (
      error instanceof Error &&
      error.message.includes("EmailJS responded with")
    ) {
      message += ` ${error.message}`; // More detailed client message
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
