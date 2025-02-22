import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
    const { data, error } = await resend.emails.send({
        from: env.FROM_EMAIL,
        to,
        subject,
        html
    });

    if (error) {
        console.error(error);
    }

    return data;
}