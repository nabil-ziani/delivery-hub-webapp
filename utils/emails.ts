import { Eta } from 'eta';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const eta = new Eta({
    views: path.join(process.cwd(), 'templates'),
    cache: true
});

export async function sendRestaurantInviteEmail(email: string, inviteUrl: string) {
    try {
        const templatePath = path.join(process.cwd(), 'templates', 'invite-mail.html');
        console.log('Template path:', templatePath);

        const template = fs.readFileSync(templatePath, 'utf-8');
        console.log('Template loaded successfully');

        const html = eta.renderString(template, {
            SiteURL: process.env.NEXT_PUBLIC_SITE_URL,
            ConfirmationURL: inviteUrl
        });
        console.log('Template compiled successfully');

        console.log('Attempting to send email to:', email);
        const result = await resend.emails.send({
            from: 'no-reply@deliverhive.com',
            to: email,
            subject: 'You\'ve been invited to create a DeliverHive account',
            html: html
        });
        console.log('Email sent successfully:', result);

        return result;
    } catch (error) {
        console.error('Detailed error in sendRestaurantInviteEmail:', error);
        throw error;
    }
} 