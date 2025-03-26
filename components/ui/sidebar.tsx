"use client"

import { navigation } from '@/constants';
import { Icon } from '@iconify/react';
import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="w-64 min-h-[calc(100vh-64px)] border-r border-divider">
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
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default Sidebar