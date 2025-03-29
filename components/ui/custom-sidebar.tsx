"use client";

import React from "react";
import { Button, Spacer, useDisclosure, Tooltip, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";
import { useSidebarStore } from "@/store/sidebar";
import { signOutAction } from "@/actions/auth";

import SidebarDrawer from "./sidebar-drawer";
import sidebarItems from "./sidebar-items";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Image from "next/image";
import { SupportModal } from "./support-modal";

export default function Component() {
    const { isOpen, onOpenChange } = useDisclosure();
    const { isExpanded, toggle } = useSidebarStore();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { isOpen: isSupportOpen, onOpen: onSupportOpen, onClose: onSupportClose } = useDisclosure();

    const pathname = usePathname();
    const currentPath = pathname.split("/")?.[1]

    return (
        <>
            <Card className="h-[calc(100vh-2rem)] bg-default-100 transition-[width] duration-300">
                <SidebarDrawer
                    className={cn("min-w-[288px] rounded-lg", { "min-w-[76px]": !isExpanded })}
                    hideCloseButton={false}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                >
                    <div
                        className={cn(
                            "will-change relative flex h-full w-72 flex-col bg-default-100 p-6 transition-[width] duration-300",
                            {
                                "w-[83px] items-center px-[6px] py-6": !isExpanded,
                            },
                        )}
                    >
                        <div
                            className={cn("flex items-center gap-3 pl-2", {
                                "justify-center gap-0 pl-0": !isExpanded,
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
                                    "w-0 opacity-0": !isExpanded,
                                })}
                            >
                                DeliveryHive
                            </span>
                            <div className={cn("flex-end flex", { hidden: !isExpanded })}>
                                <Icon
                                    className="cursor-pointer [&>g]:stroke-[1px]"
                                    icon="solar:round-alt-arrow-left-line-duotone"
                                    width={24}
                                    onClick={isMobile ? onOpenChange : toggle}
                                />
                            </div>
                        </div>

                        <Spacer y={6} />

                        <Sidebar
                            defaultSelectedKey=""
                            selectedKeys={[currentPath]}
                            iconClassName="group-data-[selected=true]:text-default-50"
                            isCompact={!isExpanded}
                            itemClasses={{
                                base: "px-3 mb-2 rounded-large data-[selected=true]:!bg-foreground",
                                title: "group-data-[selected=true]:text-default-50",
                            }}
                            items={sidebarItems}
                        />

                        <Spacer y={8} />

                        <div
                            className={cn("mt-auto flex flex-col", {
                                "items-center": !isExpanded,
                            })}
                        >
                            {!isExpanded && (
                                <Button
                                    isIconOnly
                                    className="flex h-10 w-10 text-default-600"
                                    size="sm"
                                    variant="light"
                                    onPress={toggle}
                                >
                                    <Icon
                                        className="cursor-pointer [&>g]:stroke-[1px]"
                                        height={24}
                                        icon="solar:round-alt-arrow-right-line-duotone"
                                        width={24}
                                    />
                                </Button>
                            )}
                            <Tooltip content="Support" isDisabled={isExpanded} placement="right">
                                <Button
                                    fullWidth
                                    className={cn(
                                        "justify-start truncate text-default-600 data-[hover=true]:text-foreground",
                                        {
                                            "justify-center": !isExpanded,
                                        },
                                    )}
                                    isIconOnly={!isExpanded}
                                    startContent={
                                        !isExpanded ? null : (
                                            <Icon
                                                className="flex-none text-default-600"
                                                icon="solar:info-circle-bold-duotone"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onPress={onSupportOpen}
                                >
                                    {!isExpanded ? (
                                        <Icon
                                            className="text-default-500"
                                            icon="solar:info-circle-bold-duotone"
                                            width={24}
                                        />
                                    ) : (
                                        "Support"
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="Log Out" isDisabled={isExpanded} placement="right">
                                <Button
                                    className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                        "justify-center": !isExpanded,
                                    })}
                                    isIconOnly={!isExpanded}
                                    startContent={
                                        !isExpanded ? null : (
                                            <Icon
                                                className="flex-none text-default-500"
                                                icon="solar:logout-2-bold-duotone"
                                                width={24}
                                            />
                                        )
                                    }
                                    variant="light"
                                    onPress={() => signOutAction()}
                                >
                                    {!isExpanded ? (
                                        <Icon
                                            className="text-default-500"
                                            icon="solar:logout-2-bold-duotone"
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
            <SupportModal isOpen={isSupportOpen} onClose={onSupportClose} />
        </>
    );
}