import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Order } from '@/types/order';

interface FloatingOrdersPanelProps {
    orders: Order[];
    onOrderClick?: (order: Order) => void;
}

export function FloatingOrdersPanel({ orders, onOrderClick }: FloatingOrdersPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getStatusColor = (status: Order['status']) => {
        const colors = {
            PENDING: 'warning',
            ASSIGNED: 'primary',
            PICKED_UP: 'secondary',
            DELIVERED: 'success'
        };
        return colors[status];
    };

    const getPlatformIcon = (platform: Order['platform']) => {
        const icons = {
            TAKEAWAY: 'simple-icons:takeaway',
            UBEREATS: 'simple-icons:ubereats',
            DELIVEROO: 'simple-icons:deliveroo'
        };
        return icons[platform];
    };

    if (isCollapsed) {
        return (
            <Button
                className="fixed right-4 top-20 z-50"
                color="primary"
                size="lg"
                isIconOnly
                onPress={() => setIsCollapsed(false)}
            >
                <div className="relative">
                    <Icon icon="solar:list-bold" className="text-xl" />
                    <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {orders.filter(o => o.status !== 'DELIVERED').length}
                    </span>
                </div>
            </Button>
        );
    }

    return (
        <Card className="fixed right-4 top-20 w-96 z-50 shadow-xl">
            <CardHeader className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Actieve Bestellingen</h4>
                <Button
                    isIconOnly
                    variant="light"
                    onPress={() => setIsCollapsed(true)}
                >
                    <Icon icon="solar:minimize-bold" className="text-xl" />
                </Button>
            </CardHeader>
            <CardBody className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {orders
                    .filter(order => order.status !== 'DELIVERED')
                    .map(order => (
                        <Card
                            key={order.id}
                            className="w-full cursor-pointer hover:scale-[1.02] transition-transform"
                            isPressable
                            onPress={() => onOrderClick?.(order)}
                        >
                            <CardBody className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Icon icon={getPlatformIcon(order.platform)} className="text-xl" />
                                        <span className="font-semibold">{order.id}</span>
                                    </div>
                                    <Chip color={getStatusColor(order.status)} size="sm">
                                        {order.status}
                                    </Chip>
                                </div>
                                <p className="text-sm text-default-500">{order.address}</p>
                                <p className="text-sm">{order.items.join(', ')}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-default-400">{order.orderTime}</span>
                                    <span className="font-semibold">€{order.total.toFixed(2)}</span>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
            </CardBody>
        </Card>
    );
} 