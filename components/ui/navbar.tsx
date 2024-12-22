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
} from "@nextui-org/react";
import { signOutAction } from "@/actions/auth";

const NavbarComponent = () => {
    return (
        <Navbar isBordered className="w-full">
            <NavbarBrand>
                <p className="font-bold text-inherit">DELIVERY HIVE</p>
            </NavbarBrand>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="primary"
                                size="sm"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">user@example.com</p>
                            </DropdownItem>
                            <DropdownItem key="settings">My Settings</DropdownItem>
                            <DropdownItem key="help_and_feedback">
                                Help & Feedback
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                onPress={() => signOutAction()}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavbarComponent