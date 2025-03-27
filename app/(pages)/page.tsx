'use client';

import { useState, useEffect } from 'react';
import { Modal } from "@heroui/react";
import { DeliveryMap } from "@/components/map/delivery-map";
import { FloatingOrdersPanel } from "@/components/orders/floating-orders-panel";
import { createClient } from "@/utils/supabase/client";

// Extended interface that includes both map delivery requirements and additional order info
interface Order {
  id: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';
  address: string;
  lat?: number;
  lng?: number;
  // Additional order information
  customerName: string;
  orderTime: string;
  items: string[];
  total: number;
  platform: 'TAKEAWAY' | 'UBEREATS' | 'DELIVEROO';
}

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of orders
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('deliveries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliveries'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    // Transform data to match Order interface
    setOrders(data.map((delivery: any) => ({
      id: delivery.external_id,
      status: delivery.status,
      address: delivery.address,
      customerName: delivery.customer_name,
      orderTime: new Date(delivery.created_at).toLocaleString(),
      items: delivery.items,
      total: delivery.total,
      platform: delivery.platform,
      lat: delivery.lat,
      lng: delivery.lng
    })));
  };

  const handleOrderClick = (delivery: { id: string; status: Order['status']; address: string; lat: number; lng: number }) => {
    const order = orders.find(o => o.id === delivery.id);
    if (order) {
      setSelectedOrder(order);
    }
  };

  return (
    <div className="h-[100vh]">
      <DeliveryMap
        className="w-full h-full"
        zoom={13}
        deliveries={orders.filter(o => o.lat && o.lng).map(o => ({
          id: o.id,
          status: o.status,
          address: o.address,
          lat: o.lat!,
          lng: o.lng!
        }))}
        onMarkerClick={handleOrderClick}
      />

      <FloatingOrdersPanel
        orders={orders}
        onOrderClick={setSelectedOrder}
      />

      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          size="lg"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-default-500">Order ID</p>
                <p className="font-semibold">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Klant</p>
                <p className="font-semibold">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Adres</p>
                <p className="font-semibold">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Items</p>
                <ul className="list-disc list-inside">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-default-500">Totaal</p>
                <p className="font-semibold">€{selectedOrder.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}