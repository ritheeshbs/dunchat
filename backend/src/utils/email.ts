import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, subject: string, text: string, invitationToken?: string) {
    const htmlContent = invitationToken ? `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${subject}</h2>
            <p>${text}</p>
            <div style="margin: 30px 0;">
                <a href="https://dunchat.com/join?token=${invitationToken}" 
                   style="background-color: #007bff; 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 4px;
                          display: inline-block;">
                    Join Workspace
                </a>
            </div>
            <p style="color: #666; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:<br>
            https://dunchat.com/join?token=${invitationToken}</p>
        </div>
    ` : text;

    await resend.emails.send({  
        from: process.env.FROM_EMAIL!,
        to: to,
        replyTo: process.env.REPLY_TO_EMAIL!,
        subject: subject,
        text: text,
        html: htmlContent
    });
}