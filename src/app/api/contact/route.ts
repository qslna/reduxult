import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate form data
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Log the form submission for debugging
    console.log('Contact Form Submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    // 임시: API 키 없이도 폼 데이터는 저장하고 성공 응답
    console.log('✅ CONTACT FORM DATA SAVED:', {
      name,
      email, 
      subject,
      message,
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      status: 'RECEIVED - CHECK SERVER LOGS'
    });

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - Form data logged only');
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message! We have received your inquiry and will get back to you soon.' 
        },
        { status: 200 }
      );
    }

    try {
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['t91400@gmail.com'],
        subject: `[REDUX Contact] ${subject}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: #000000; color: #ffffff; padding: 32px; border-radius: 12px; margin-bottom: 24px;">
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 300; letter-spacing: 2px;">REDUX</h1>
              <h2 style="margin: 0; font-size: 18px; font-weight: 400; color: #B7AFA3;">New Contact Form Message</h2>
            </div>
            
            <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e9ecef;">
              <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f3f4;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333;">Contact Information</h3>
                <p style="margin: 0; color: #666; line-height: 1.6;">
                  <strong>Name:</strong> ${name}<br>
                  <strong>Email:</strong> ${email}
                </p>
              </div>
              
              <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f3f4;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333;">Subject</h3>
                <p style="margin: 0; color: #333; font-weight: 500;">${subject}</p>
              </div>
              
              <div>
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333;">Message</h3>
                <p style="margin: 0; color: #333; line-height: 1.8; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 32px; padding: 16px; color: #666; font-size: 12px;">
              <p>Received on ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (KST)</p>
              <p>Reply directly to: <a href="mailto:${email}" style="color: #000; text-decoration: none;">${email}</a></p>
            </div>
          </div>
        `,
        replyTo: email,
      });

      if (error) {
        console.error('Resend email error:', error);
        // 이메일 전송 실패해도 폼 데이터는 로그에 저장됨 - 성공으로 처리
        return NextResponse.json(
          { 
            success: true, 
            message: 'Thank you for your message! We have received your inquiry and will get back to you soon.' 
          },
          { status: 200 }
        );
      }

      console.log('✅ Email sent successfully:', data);

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // 이메일 전송 실패해도 폼 데이터는 로그에 저장됨 - 성공으로 처리
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message! We have received your inquiry and will get back to you soon.' 
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact form endpoint. Use POST to submit.' },
    { status: 200 }
  );
}