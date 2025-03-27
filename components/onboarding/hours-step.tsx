"use client";

import { Button, Card, CardBody, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch } from "@heroui/react";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { DAYS } from "@/constants";
import { TimeSelectionModal } from "./time-selection-modal";

type DayKey = typeof DAYS[number]["key"];

type DaySchedule = {
    isOpen: boolean;
    open: string;
    close: string;
};

type WorkingHours = {
    [key in DayKey]: DaySchedule;
};

type HoursStepProps = {
    value: WorkingHours;
    onChange: (hours: WorkingHours) => void;
    isLoading: boolean;
};

type QuickSetupType = "all" | "weekdays" | "weekend";

export function HoursStep({ value, onChange, isLoading }: HoursStepProps) {
    const [selectedDay, setSelectedDay] = useState<DayKey>("monday");
    const [quickSetupType, setQuickSetupType] = useState<QuickSetupType | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDayClick = (day: DayKey) => {
        if (!value[day].isOpen) return;
        setSelectedDay(day);
        setQuickSetupType(null);
        onOpen();
    };

    const handleToggleDay = (day: DayKey, isOpen: boolean) => {
        const newHours = { ...value };
        newHours[day] = { ...newHours[day], isOpen };
        onChange(newHours);
    };

    const handleTimeChange = (type: "open" | "close", time: string) => {
        const newHours = { ...value };
        newHours[selectedDay] = { ...newHours[selectedDay], [type]: time };
        onChange(newHours);
    };

    const handleQuickSetup = (type: QuickSetupType) => {
        setQuickSetupType(type);
        setSelectedDay("monday"); // Default day for preview
        onOpen();
    };

    const handleSave = () => {
        if (!quickSetupType) {
            onClose();
            return;
        }

        const newHours = { ...value };
        const daysToUpdate = quickSetupType === "all"
            ? DAYS.map(d => d.key)
            : quickSetupType === "weekdays"
                ? DAYS.map(d => d.key).filter(d => d !== "saturday" && d !== "sunday")
                : ["saturday", "sunday"];

        daysToUpdate.forEach((key) => {
            newHours[key as DayKey] = {
                ...value[selectedDay],
                isOpen: true
            };
        });

        onChange(newHours);
        onClose();
    };

    const getModalTitle = () => {
        if (!quickSetupType) {
            return `${DAYS.find(d => d.key === selectedDay)?.label} Hours`;
        }
        return quickSetupType === "all"
            ? "Set Hours for All Days"
            : quickSetupType === "weekdays"
                ? "Set Hours for Weekdays"
                : "Set Hours for Weekend";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">Opening Hours</h3>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="flat" startContent={<Icon icon="solar:copy-bold" />}>
                            Quick Setup
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Quick setup options">
                        <DropdownItem key="all" description="Set hours for all days at once" onPress={() => handleQuickSetup("all")}>
                            Set for all days
                        </DropdownItem>
                        <DropdownItem key="weekdays" description="Set hours for Monday-Friday" onPress={() => handleQuickSetup("weekdays")}>
                            Set for weekdays
                        </DropdownItem>
                        <DropdownItem key="weekend" description="Set hours for Saturday-Sunday" onPress={() => handleQuickSetup("weekend")}>
                            Set for weekend
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="w-full flex flex-col gap-2">
                {DAYS.map(({ key, label }) => (
                    <Card key={key} isPressable={value[key].isOpen} onPress={() => handleDayClick(key)} className={`border border-divider ${value[key].isOpen ? 'hover:border-primary transition-colors' : ''}`}>
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Switch
                                        size="sm"
                                        color="success"
                                        isSelected={value[key].isOpen}
                                        onValueChange={(isOpen) => handleToggleDay(key, isOpen)}
                                        isDisabled={isLoading}
                                    />
                                    <span className="text-lg">{label}</span>
                                </div>
                                {value[key].isOpen ? (
                                    <div className="flex items-center gap-2">
                                        <Icon icon="solar:clock-circle-bold" className="text-default-400" />
                                        <span className="text-default-500">
                                            {value[key].open} - {value[key].close}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-danger flex items-center gap-2">
                                        <Icon icon="solar:lock-bold" />
                                        Closed
                                    </span>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <TimeSelectionModal
                isOpen={isOpen}
                onClose={onClose}
                selectedDay={selectedDay}
                value={quickSetupType ? { [selectedDay]: value[selectedDay] } : value}
                handleTimeChange={handleTimeChange}
                title={getModalTitle()}
                onSave={quickSetupType ? handleSave : undefined}
            />
        </div>
    );
} 