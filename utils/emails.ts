import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRestaurantInviteEmail(email: string, inviteUrl: string) {
    try {
        const templatePath = path.join(process.cwd(), 'templates', 'invite-mail.html');
        const template = fs.readFileSync(templatePath, 'utf-8');

        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate({
            ConfirmationURL: inviteUrl
        });

        const result = await resend.emails.send({
            
            from: 'no-reply@deliverhive.com',
            to: email,
            subject: 'You\'ve been invited to create a DeliverHive account',
            html: html
        });

        return result;
    } catch (error) {
        console.error('Detailed error in sendRestaurantInviteEmail:', error);
        throw error;
    }
} 