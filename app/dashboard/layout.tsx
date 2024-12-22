'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Map,
    Users,
    Settings,
    LogOut,
    Bike
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Overview',
            href: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Live Map',
            href: '/dashboard/map',
            icon: Map
        },
        {
            name: 'Couriers',
            href: '/dashboard/couriers',
            icon: Bike
        },
        {
            name: 'Team',
            href: '/dashboard/team',
            icon: Users
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Sidebar */}
            <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
                {/* Sidebar container */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 pb-4 border-r border-gray-200 dark:border-gray-800">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            className="h-8 w-auto"
                            src="/logo.png"
                            alt="Logo"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
                                                        isActive
                                                            ? "bg-gray-100 dark:bg-gray-800 text-primary font-semibold"
                                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-x-3"
                                >
                                    <LogOut className="h-6 w-6" />
                                    Sign out
                                </Button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="pl-72">
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 