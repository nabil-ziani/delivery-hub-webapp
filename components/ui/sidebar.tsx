"use client"

import { useState } from "react";
import { navigation } from '@/constants';
import { Icon } from '@iconify/react';
import { Link, Button } from "@heroui/react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`fixed left-4 top-20 bg-background border border-divider rounded-lg shadow-xl transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="flex justify-end p-2">
                <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setIsCollapsed(!isCollapsed)}
                >
                    <Icon icon={isCollapsed ? "solar:arrow-right-bold" : "solar:arrow-left-bold"} />
                </Button>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-default-100"
                                }`}
                        >
                            <Icon icon={item.icon} className="text-xl" />
                            {!isCollapsed && item.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Sidebar