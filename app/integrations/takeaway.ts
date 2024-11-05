/*
import { createClient } from "@/utils/supabase/server";

interface TakeawayOrder {
    id: string;
    status: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    customer: {
        name: string;
        address: string;
        phone: string;
    };
    created_at: string;
}

export class TakeawayIntegration {
    private apiKey: string;
    private restaurantId: string;

    constructor(apiKey: string, restaurantId: string) {
        this.apiKey = apiKey;
        this.restaurantId = restaurantId;
    }

    async syncOrders() {
        // Fetch orders from Takeaway API
        const orders = await this.fetchOrders();

        // Store in your database
        const supabase = await createClient();
        await supabase.from('external_orders').insert(
            orders.map((order: any) => ({
                external_id: order.id,
                platform: 'takeaway',
                restaurant_id: this.restaurantId,
                status: order.status,
                data: order
            }))
        );
    }

    // Webhook handler for real-time orders
    async handleWebhook(payload: any) {
        // Process incoming order
    }
} 
*/