'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Card,
    CardHeader,
    CardBody,
    Button,
    Chip,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Selection,
    SortDescriptor,
    Pagination,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";

interface Order {
    id: string;
    external_id: string;
    platform: 'TAKEAWAY' | 'UBEREATS' | 'DELIVEROO';
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
    customer_name: string;
    address: string;
    total: number;
    created_at: string;
    courier_id?: string;
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [platformFilter, setPlatformFilter] = useState<Selection>("all");
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "created_at",
        direction: "descending",
    });

    const rowsPerPage = 10;
    const supabase = createClient();

    useEffect(() => {
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
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('deliveries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer_name.toLowerCase().includes(filterValue.toLowerCase()) ||
            order.address.toLowerCase().includes(filterValue.toLowerCase()) ||
            order.external_id.toLowerCase().includes(filterValue.toLowerCase());

        const matchesStatus = statusFilter === "all" || (statusFilter as unknown as string) === order.status;
        const matchesPlatform = platformFilter === "all" || (platformFilter as unknown as string) === order.platform;

        return matchesSearch && matchesStatus && matchesPlatform;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const first = a[sortDescriptor.column as keyof Order];
        const second = b[sortDescriptor.column as keyof Order];
        const cmp = first! < second! ? -1 : first! > second! ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    const pages = Math.ceil(sortedOrders.length / rowsPerPage);
    const items = sortedOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Orders</h2>
                        <p className="text-default-500">Manage and track all your delivery orders</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            color="primary"
                            startContent={<Icon icon="solar:refresh-bold-duotone" />}
                            onPress={fetchOrders}
                        >
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-between items-center gap-3 mb-3">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder="Search by customer, address or order ID..."
                            startContent={<Icon className="text-default-400" icon="solar:magnifer-bold-duotone" />}
                            value={filterValue}
                            onValueChange={setFilterValue}
                        />
                        <div className="flex gap-3">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        endContent={<Icon icon="solar:alt-arrow-down-bold-duotone" />}
                                        variant="flat"
                                    >
                                        Status
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="single"
                                    onSelectionChange={setStatusFilter}
                                >
                                    <DropdownItem key="all">All</DropdownItem>
                                    <DropdownItem key="PENDING">Pending</DropdownItem>
                                    <DropdownItem key="ASSIGNED">Assigned</DropdownItem>
                                    <DropdownItem key="PICKED_UP">Picked Up</DropdownItem>
                                    <DropdownItem key="DELIVERED">Delivered</DropdownItem>
                                    <DropdownItem key="CANCELLED">Cancelled</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        endContent={<Icon icon="solar:alt-arrow-down-bold-duotone" />}
                                        variant="flat"
                                    >
                                        Platform
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={platformFilter}
                                    selectionMode="single"
                                    onSelectionChange={setPlatformFilter}
                                >
                                    <DropdownItem key="all">All</DropdownItem>
                                    <DropdownItem key="TAKEAWAY">Takeaway.com</DropdownItem>
                                    <DropdownItem key="UBEREATS">Uber Eats</DropdownItem>
                                    <DropdownItem key="DELIVEROO">Deliveroo</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                    <Table
                        aria-label="Orders table"
                        isHeaderSticky
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        }
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader>
                            <TableColumn key="platform" allowsSorting>Platform</TableColumn>
                            <TableColumn key="external_id" allowsSorting>Order ID</TableColumn>
                            <TableColumn key="customer_name" allowsSorting>Customer</TableColumn>
                            <TableColumn key="address">Address</TableColumn>
                            <TableColumn key="total" allowsSorting>Total</TableColumn>
                            <TableColumn key="created_at" allowsSorting>Time</TableColumn>
                            <TableColumn key="status" allowsSorting>Status</TableColumn>
                            <TableColumn key="actions">Actions</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={items}
                            isLoading={loading}
                            loadingContent={
                                <div className="h-[400px] flex items-center justify-center">
                                    Loading orders...
                                </div>
                            }
                            emptyContent={
                                <div className="h-[400px] flex flex-col items-center justify-center text-default-500">
                                    <Icon icon="solar:box-bold-duotone" className="text-4xl mb-2" />
                                    <p>No orders found</p>
                                </div>
                            }
                        >
                            {(order) => (
                                <TableRow key={order.external_id}>
                                    <TableCell>
                                        <Icon icon={platformIconMap[order.platform]} className="text-xl" />
                                    </TableCell>
                                    <TableCell>{order.external_id}</TableCell>
                                    <TableCell>{order.customer_name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{order.address}</TableCell>
                                    <TableCell>€{order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            color={statusColorMap[order.status]}
                                            size="sm"
                                            variant="flat"
                                        >
                                            {order.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() => window.location.href = `/orders/${order.external_id}`}
                                            >
                                                <Icon icon="solar:eye-bold-duotone" className="text-lg" />
                                            </Button>
                                            {order.status === 'PENDING' && (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="primary"
                                                >
                                                    <Icon icon="solar:user-plus-bold-duotone" className="text-lg" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
} 