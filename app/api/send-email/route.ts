// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Route hit: POST /api/send-email'); // Debug: Confirm route is reached
  console.log('Env vars check:', {
    service: process.env.EMAILJS_SERVICE_ID,
    template: process.env.EMAILJS_TEMPLATE_ID,
    user: process.env.EMAILJS_USER_ID,
    privateKey: process.env.EMAILJS_PRIVATE_KEY, // Debug: Confirm private key loads
  }); // Debug: Check if env loaded

  try {
    const data = await req.json();
    console.log('Received data:', data); // Debug: See incoming form data

    const templateParams = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // Add this for strict mode auth
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS error:', errorText); // Debug: Log API response if fails
      throw new Error(`EmailJS responded with ${response.status}: ${errorText}`);
    }

    console.log('Email sent successfully'); // Debug: Success confirmation
    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error); // Debug: Catch all errors
    let message = 'Failed to send message.';
    if (error instanceof Error && error.message.includes('EmailJS responded with')) {
      message += ` ${error.message}`; // More detailed client message
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}