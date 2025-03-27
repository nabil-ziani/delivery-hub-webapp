"use client";

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Badge,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { signOutAction } from "@/actions/auth";
import Image from "next/image";

const NavbarComponent = () => {
    return (
        <Navbar
            isBordered
            className="bg-background/70 backdrop-blur-md border-b border-divider"
            maxWidth="full"
        >
            <NavbarBrand>
                <Image
                    src="/logo.png"
                    alt="Delivery Hub"
                    width={32}
                    height={32}
                    className="mr-2"
                />
                <p className="font-bold text-inherit">DELIVERY HUB</p>
            </NavbarBrand>

            <NavbarContent justify="center">
                <NavbarItem>
                    <Badge content="5" color="danger">
                        <Button
                            variant="light"
                            startContent={<Icon icon="solar:bell-bold" className="text-xl" />}
                        >
                            Meldingen
                        </Button>
                    </Badge>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        variant="light"
                        startContent={<Icon icon="solar:chart-bold" className="text-xl" />}
                    >
                        Statistieken
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="solar:settings-bold" className="text-xl" />}
                    >
                        Instellingen
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="primary"
                                size="sm"
                                src="https://i.pravatar.cc/150"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Ingelogd als</p>
                                <p className="font-semibold text-default-500">restaurant@deliveryhub.nl</p>
                            </DropdownItem>
                            <DropdownItem key="restaurant_settings">
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:shop-2-bold" />
                                    Restaurant Instellingen
                                </div>
                            </DropdownItem>
                            <DropdownItem key="account_settings">
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:user-id-bold" />
                                    Account Instellingen
                                </div>
                            </DropdownItem>
                            <DropdownItem key="help">
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:question-circle-bold" />
                                    Help & Support
                                </div>
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                onPress={() => signOutAction()}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:logout-2-bold" />
                                    Uitloggen
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavbarComponent