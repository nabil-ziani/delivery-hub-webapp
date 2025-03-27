"use client";

import {
    Navbar,
    NavbarContent,
    NavbarItem,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Card,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { signOutAction } from "@/actions/auth";
import { useState } from "react";
import { useSidebarStore } from "@/store/sidebar";

const NavbarComponent = () => {
    const [theme, setTheme] = useState('light');

    const isExpanded = useSidebarStore((state) => state.isExpanded);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <Card
            className={`fixed top-4 z-50 shadow-xl bg-default-100 transition-all duration-300 ${isExpanded ? 'left-[calc(20rem)]' : 'left-[calc(7rem)]'
                } right-4`}
        >
            <Navbar maxWidth="full" className="bg-default-100">
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button
                            isIconOnly
                            variant="flat"
                            onPress={toggleTheme}
                            className="text-default-500 mx-1"
                        >
                            <Icon
                                icon={theme === 'light'
                                    ? "solar:moon-stars-bold-duotone"
                                    : "solar:sun-bold-duotone"
                                }
                                className={`text-xl ${theme === 'light' ? 'text-primary' : 'text-warning'}`}
                            />
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
                            <DropdownMenu aria-label="Profile Actions" variant="faded">
                                <DropdownItem
                                    key="restaurant_settings"
                                    description="Beheer je restaurant instellingen"
                                    startContent={
                                        <Icon
                                            icon="solar:shop-2-bold-duotone"
                                            className="text-xl text-primary flex-shrink-0"
                                        />
                                    }
                                >
                                    Restaurant Instellingen
                                </DropdownItem>
                                <DropdownItem
                                    key="account_settings"
                                    description="Beheer je account gegevens"
                                    startContent={
                                        <Icon
                                            icon="solar:user-id-bold-duotone"
                                            className="text-xl text-primary flex-shrink-0"
                                        />
                                    }
                                >
                                    Account Instellingen
                                </DropdownItem>
                                <DropdownItem
                                    key="help"
                                    showDivider
                                    description="Hulp nodig? Wij staan voor je klaar"
                                    startContent={
                                        <Icon
                                            icon="solar:question-circle-bold-duotone"
                                            className="text-xl text-primary flex-shrink-0"
                                        />
                                    }
                                >
                                    Help & Support
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    className="text-danger"
                                    color="danger"
                                    description="Veilig uitloggen uit je account"
                                    startContent={
                                        <Icon
                                            icon="solar:logout-2-bold-duotone"
                                            className="text-xl text-danger flex-shrink-0"
                                        />
                                    }
                                    onPress={() => signOutAction()}
                                >
                                    Uitloggen
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </Card>
    );
};

export default NavbarComponent;