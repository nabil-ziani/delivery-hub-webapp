"use client";

import React from "react";
import { Button, Spacer, useDisclosure, Tooltip, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";

import SidebarDrawer from "./sidebar-drawer";
import sidebarItems from "./sidebar-items";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Image from "next/image";

export default function Component() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const isMobile = useMediaQuery("(max-width: 768px)");

    const onToggle = React.useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);


    const pathname = usePathname();
    const currentPath = pathname.split("/")?.[1]

    return (
        <Card className="bg-secondary-foreground fixed left-4 top-20 h-[calc(100vh-6rem)] z-50 shadow-xl">
            <SidebarDrawer
                className={cn("min-w-[288px] rounded-lg", { "min-w-[76px]": isCollapsed })}
                hideCloseButton={false}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <div
                    className={cn(
                        "will-change relative flex h-full w-72 flex-col bg-default-100 p-6 transition-width ",
                        {
                            "w-[83px] items-center px-[6px] py-6": isCollapsed,
                        },
                    )}
                >
                    <div
                        className={cn("flex items-center gap-3 pl-2", {
                            "justify-center gap-0 pl-0": isCollapsed,
                        })}
                    >
                        <Image
                            src="/logo.png"
                            alt="Delivery Hub"
                            width={32}
                            height={32}
                            className="mr-2"
                        />
                        <span
                            className={cn("w-full text-small font-bold uppercase opacity-100", {
                                "w-0 opacity-0": isCollapsed,
                            })}
                        >
                            Delivery Hive
                        </span>
                        <div className={cn("flex-end flex", { hidden: isCollapsed })}>
                            <Icon
                                className="cursor-pointer [&>g]:stroke-[1px]"
                                icon="solar:round-alt-arrow-left-line-duotone"
                                width={24}
                                onClick={isMobile ? onOpenChange : onToggle}
                            />
                        </div>
                    </div>

                    <Spacer y={6} />

                    <Sidebar
                        defaultSelectedKey=""
                        selectedKeys={[currentPath]}
                        iconClassName="group-data-[selected=true]:text-default-50"
                        isCompact={isCollapsed}
                        itemClasses={{
                            base: "px-3 mb-2 rounded-large data-[selected=true]:!bg-foreground",
                            title: "group-data-[selected=true]:text-default-50",
                        }}
                        items={sidebarItems}
                    />

                    <Spacer y={8} />

                    <div
                        className={cn("mt-auto flex flex-col", {
                            "items-center": isCollapsed,
                        })}
                    >
                        {isCollapsed && (
                            <Button
                                isIconOnly
                                className="flex h-10 w-10 text-default-600"
                                size="sm"
                                variant="light"
                            >
                                <Icon
                                    className="cursor-pointer [&>g]:stroke-[1px]"
                                    height={24}
                                    icon="solar:round-alt-arrow-right-line-duotone"
                                    width={24}
                                    onClick={onToggle}
                                />
                            </Button>
                        )}
                        <Tooltip content="Support" isDisabled={!isCollapsed} placement="right">
                            <Button
                                fullWidth
                                className={cn(
                                    "justify-start truncate text-default-600 data-[hover=true]:text-foreground",
                                    {
                                        "justify-center": isCollapsed,
                                    },
                                )}
                                isIconOnly={isCollapsed}
                                startContent={
                                    isCollapsed ? null : (
                                        <Icon
                                            className="flex-none text-default-600"
                                            icon="solar:info-circle-line-duotone"
                                            width={24}
                                        />
                                    )
                                }
                                variant="light"
                            >
                                {isCollapsed ? (
                                    <Icon
                                        className="text-default-500"
                                        icon="solar:info-circle-line-duotone"
                                        width={24}
                                    />
                                ) : (
                                    "Support"
                                )}
                            </Button>
                        </Tooltip>
                        <Tooltip content="Log Out" isDisabled={!isCollapsed} placement="right">
                            <Button
                                className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                    "justify-center": isCollapsed,
                                })}
                                isIconOnly={isCollapsed}
                                startContent={
                                    isCollapsed ? null : (
                                        <Icon
                                            className="flex-none rotate-180 text-default-500"
                                            icon="solar:minus-circle-line-duotone"
                                            width={24}
                                        />
                                    )
                                }
                                variant="light"
                            >
                                {isCollapsed ? (
                                    <Icon
                                        className="rotate-180 text-default-500"
                                        icon="solar:minus-circle-line-duotone"
                                        width={24}
                                    />
                                ) : (
                                    "Log Out"
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </SidebarDrawer>
        </Card>
    );
}