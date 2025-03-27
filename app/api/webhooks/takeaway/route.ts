import { NextResponse } from 'next/server';
import { TakeawayIntegration } from '@/app/integrations/takeaway';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const headersList = headers();
        const signature = headersList.get('x-takeaway-signature') || '';

        const takeaway = new TakeawayIntegration(
            process.env.TAKEAWAY_API_KEY!,
            process.env.TAKEAWAY_RESTAURANT_ID!,
            process.env.TAKEAWAY_WEBHOOK_SECRET!
        );

        const result = await takeaway.handleWebhook(payload, signature);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 