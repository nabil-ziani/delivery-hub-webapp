'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Chip,
    Divider,
    Avatar,
    Tabs,
    Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";

interface Order {
    id: string;
    external_id: string;
    platform: 'TAKEAWAY' | 'UBEREATS' | 'DELIVEROO';
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
    customer_name: string;
    customer_phone: string;
    address: string;
    lat?: number;
    lng?: number;
    items: any[];
    total: number;
    courier_id?: string;
    estimated_delivery_time?: string;
    created_at: string;
    raw_data: any;
}

const statusColorMap = {
    PENDING: "warning",
    ASSIGNED: "primary",
    PICKED_UP: "secondary",
    DELIVERED: "success",
    CANCELLED: "danger",
} as const;

const platformIconMap = {
    TAKEAWAY: "simple-icons:takeaway",
    UBEREATS: "simple-icons:ubereats",
    DELIVEROO: "simple-icons:deliveroo",
} as const;

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("details");
    const supabase = createClient();

    useEffect(() => {
        fetchOrder();

        // Subscribe to realtime updates
        const channel = supabase
            .channel(`order-${params.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'deliveries',
                    filter: `external_id=eq.${params.id}`
                },
                () => {
                    fetchOrder();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('deliveries')
                .select('*')
                .eq('external_id', params.id)
                .single();

            if (error) throw error;
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading order details...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-default-500">
                <Icon icon="solar:box-bold-duotone" className="text-6xl mb-4" />
                <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                <p className="mb-4">The order you're looking for doesn't exist or has been deleted.</p>
                <Button
                    color="primary"
                    variant="flat"
                    onPress={() => router.push('/orders')}
                    startContent={<Icon icon="solar:arrow-left-bold-duotone" />}
                >
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => router.push('/orders')}
                        >
                            <Icon icon="solar:arrow-left-bold-duotone" className="text-xl" />
                        </Button>
                        <h1 className="text-2xl font-bold">Order #{order.external_id}</h1>
                        <Icon icon={platformIconMap[order.platform]} className="text-xl" />
                    </div>
                    <p className="text-default-500">
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                <Chip
                    color={statusColorMap[order.status]}
                    size="lg"
                    variant="flat"
                >
                    {order.status}
                </Chip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Order Details</h3>
                        </CardHeader>
                        <CardBody>
                            <Tabs
                                selectedKey={selectedTab}
                                onSelectionChange={setSelectedTab as any}
                            >
                                <Tab
                                    key="details"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <Icon icon="solar:clipboard-list-bold-duotone" />
                                            Details
                                        </div>
                                    }
                                >
                                    <div className="py-4">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-sm font-medium text-default-500 mb-2">Items</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item: any, index: number) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="text-sm text-default-500">
                                                                    Quantity: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <p className="font-medium">
                                                                €{(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold">Total</p>
                                                <p className="font-bold">€{order.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab
                                    key="raw"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <Icon icon="solar:code-bold-duotone" />
                                            Raw Data
                                        </div>
                                    }
                                >
                                    <div className="py-4">
                                        <pre className="bg-default-100 p-4 rounded-lg overflow-auto">
                                            {JSON.stringify(order.raw_data, null, 2)}
                                        </pre>
                                    </div>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>

                    {order.lat && order.lng && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Delivery Route</h3>
                            </CardHeader>
                            <CardBody>
                                {/* Add DeliveryMap component here */}
                            </CardBody>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Customer</h3>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-default-500">Name</p>
                                    <p className="font-medium">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Phone</p>
                                    <p className="font-medium">{order.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-default-500">Address</p>
                                    <p className="font-medium">{order.address}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {order.courier_id ? (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Courier</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size="lg"
                                        src="https://i.pravatar.cc/150"
                                    />
                                    <div>
                                        <p className="font-medium">John Doe</p>
                                        <p className="text-sm text-default-500">Online</p>
                                    </div>
                                </div>
                                {order.estimated_delivery_time && (
                                    <div className="mt-4">
                                        <p className="text-sm text-default-500">Estimated Delivery</p>
                                        <p className="font-medium">
                                            {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ) : (
                        order.status === 'PENDING' && (
                            <Card>
                                <CardBody>
                                    <div className="text-center">
                                        <Icon
                                            icon="solar:user-plus-bold-duotone"
                                            className="text-4xl text-default-500 mb-2"
                                        />
                                        <p className="text-default-500 mb-4">No courier assigned yet</p>
                                        <Button
                                            color="primary"
                                            fullWidth
                                            startContent={<Icon icon="solar:user-plus-bold-duotone" />}
                                        >
                                            Assign Courier
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </div>
    );
} 