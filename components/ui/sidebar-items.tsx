import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { type SidebarItem } from "./sidebar";

/**
 * Please check the https://heroui.com/docs/guide/routing to have a seamless router integration
 */
const items: SidebarItem[] = [
    {
        key: "",
        href: "/",
        icon: "solar:home-2-bold-duotone",
        title: "Home",
    },
    {
        key: "orders",
        href: "/orders",
        icon: "solar:box-bold-duotone",
        title: "Orders",
        endContent: (
            <Chip
                classNames={{
                    base: "bg-danger",
                    content: "text-foreground font-bold",
                }}
                size="sm"
                variant="flat"
            >
                3
            </Chip>
        )
    },
    {
        key: "couriers",
        href: "/couriers",
        icon: "solar:delivery-bold-duotone",
        title: "Couriers",
        // endContent: (
        //     <Icon className="text-default-500" icon="solar:add-circle-line-duotone" width={24} />
        // ),
    },
    {
        key: "integrations",
        href: "/integrations",
        icon: "solar:plug-circle-bold-duotone",
        title: "Integrations",
    },
    {
        key: "analyses",
        href: "/analyses",
        icon: "solar:chart-2-bold-duotone",
        title: "Analyses",
    },
    {
        key: "reviews",
        href: "/reviews",
        icon: "solar:star-bold-duotone",
        title: "Reviews",
    },
    {
        key: "marketing",
        href: "/marketing",
        icon: "solar:phone-bold-duotone",
        title: "Marketing",
    }
];

export default items;
