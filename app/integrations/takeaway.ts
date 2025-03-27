import { createClient } from "@/utils/supabase/server";

interface TakeawayOrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface TakeawayCustomer {
    name: string;
    address: string;
    phone: string;
    lat?: number;
    lng?: number;
}

interface TakeawayOrder {
    id: string;
    status: string;
    items: TakeawayOrderItem[];
    customer: TakeawayCustomer;
    created_at: string;
    total: number;
    estimated_delivery_time?: string;
    courier_id?: string;
}

export class TakeawayIntegration {
    private apiKey: string;
    private restaurantId: string;
    private webhookSecret: string;

    constructor(apiKey: string, restaurantId: string, webhookSecret: string) {
        this.apiKey = apiKey;
        this.restaurantId = restaurantId;
        this.webhookSecret = webhookSecret;
    }

    async syncOrders() {
        try {
            // Fetch orders from Takeaway API
            const orders = await this.fetchOrders();

            // Get Supabase client
            const supabase = await createClient();

            // Process each order
            for (const order of orders) {
                // Convert address to coordinates using geocoding service
                const coordinates = await this.geocodeAddress(order.customer.address);

                // Prepare order data
                const orderData = {
                    external_id: order.id,
                    platform: 'takeaway',
                    restaurant_id: this.restaurantId,
                    status: this.mapOrderStatus(order.status),
                    customer_name: order.customer.name,
                    customer_phone: order.customer.phone,
                    address: order.customer.address,
                    lat: coordinates?.lat,
                    lng: coordinates?.lng,
                    items: order.items,
                    total: order.total,
                    raw_data: order,
                    estimated_delivery_time: order.estimated_delivery_time,
                    courier_id: order.courier_id,
                    created_at: order.created_at
                };

                // Upsert order to avoid duplicates
                const { error } = await supabase
                    .from('deliveries')
                    .upsert(orderData, {
                        onConflict: 'external_id',
                        ignoreDuplicates: false
                    });

                if (error) {
                    console.error('Error syncing order:', error);
                }
            }
        } catch (error) {
            console.error('Error in syncOrders:', error);
            throw error;
        }
    }

    async handleWebhook(payload: any, signature: string) {
        try {
            // Verify webhook signature
            if (!this.verifyWebhookSignature(payload, signature)) {
                throw new Error('Invalid webhook signature');
            }

            const order = payload.order as TakeawayOrder;
            const supabase = await createClient();

            // Update order status
            const { error } = await supabase
                .from('deliveries')
                .update({
                    status: this.mapOrderStatus(order.status),
                    courier_id: order.courier_id,
                    estimated_delivery_time: order.estimated_delivery_time,
                    raw_data: order
                })
                .eq('external_id', order.id)
                .eq('platform', 'takeaway');

            if (error) {
                console.error('Error updating order:', error);
                throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('Error in handleWebhook:', error);
            throw error;
        }
    }

    private async fetchOrders(): Promise<TakeawayOrder[]> {
        try {
            const response = await fetch(`https://api.takeaway.com/v2/restaurants/${this.restaurantId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    private async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data[0]) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }

            return null;
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    }

    private mapOrderStatus(takeawayStatus: string): string {
        const statusMap: { [key: string]: string } = {
            'RECEIVED': 'PENDING',
            'ACCEPTED': 'PENDING',
            'PREPARING': 'PENDING',
            'READY_FOR_PICKUP': 'PENDING',
            'PICKED_UP': 'PICKED_UP',
            'ON_THE_WAY': 'PICKED_UP',
            'DELIVERED': 'DELIVERED',
            'CANCELLED': 'CANCELLED'
        };

        return statusMap[takeawayStatus] || 'PENDING';
    }

    private verifyWebhookSignature(payload: any, signature: string): boolean {
        // Implement signature verification based on Takeaway's documentation
        // This is a placeholder - replace with actual verification logic
        return true;
    }
}