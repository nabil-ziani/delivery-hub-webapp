import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(email: string, inviteLink: string) {
    try {
        await resend.emails.send({
            from: 'Your App <onboarding@resend.dev>',
            to: email,
            subject: 'You\'ve been invited to join as a courier',
            html: `
                <p>You've been invited to join as a courier.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}${inviteLink}">Accept Invitation</a>
            `
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
} 