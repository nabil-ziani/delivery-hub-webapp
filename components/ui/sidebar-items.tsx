import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { type SidebarItem, SidebarItemType } from "./sidebar";

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
    },
    {
        key: "integrations",
        type: SidebarItemType.Nest,
        icon: "solar:plug-circle-bold-duotone",
        title: "Integrations",
        items: [
            {
                key: "integrations-takeaway",
                href: "/integrations/takeaway",
                title: "Takeaway.com",
            },
            {
                key: "integrations-ubereats",
                href: "/integrations/ubereats",
                title: "Uber Eats",
            },
            {
                key: "integrations-deliveroo",
                href: "/integrations/deliveroo",
                title: "Deliveroo",
            }
        ]
    }
];

export default items;
