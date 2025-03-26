"use client";

import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch } from "@heroui/react";
import { useState } from "react";
import { Icon } from "@iconify/react";

const DAYS = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
});

type DaySchedule = {
    isOpen: boolean;
    open: string;
    close: string;
};

type WorkingHours = {
    [key in typeof DAYS[number]["key"]]: DaySchedule;
};

type HoursStepProps = {
    value: WorkingHours;
    onChange: (hours: WorkingHours) => void;
    isLoading: boolean;
};

export function HoursStep({ value, onChange, isLoading }: HoursStepProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]["key"]>("monday");
    const [tempSchedule, setTempSchedule] = useState<DaySchedule>(value[selectedDay]);

    const handleDayClick = (day: typeof DAYS[number]["key"]) => {
        setSelectedDay(day);
        setTempSchedule(value[day]);
        onOpen();
    };

    const handleTimeChange = (type: "open" | "close", time: string) => {
        setTempSchedule(prev => ({
            ...prev,
            [type]: time,
        }));
    };

    const handleToggleDay = () => {
        setTempSchedule(prev => ({
            ...prev,
            isOpen: !prev.isOpen,
        }));
    };

    const handleSave = () => {
        onChange({
            ...value,
            [selectedDay]: tempSchedule,
        });
        onClose();
    };

    const copySchedule = (schedule: DaySchedule, days: typeof DAYS[number]["key"][]) => {
        const newHours = { ...value };
        days.forEach((key) => {
            newHours[key] = { ...schedule };
        });
        onChange(newHours);
    };

    return (
        <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">Opening Hours</h3>
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="flat"
                            startContent={<Icon icon="solar:copy-bold" />}
                        >
                            Quick Actions
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Quick actions">
                        <DropdownItem
                            key="all"
                            description="Apply current schedule to all days"
                            onPress={() => copySchedule(value[selectedDay], DAYS.map(d => d.key))}
                        >
                            Set for all days
                        </DropdownItem>
                        <DropdownItem
                            key="weekdays"
                            description="Apply current schedule to Monday-Friday"
                            onPress={() => copySchedule(value[selectedDay], DAYS.map(d => d.key).filter(d => d !== "saturday" && d !== "sunday"))}
                        >
                            Set for weekdays
                        </DropdownItem>
                        <DropdownItem
                            key="weekend"
                            description="Apply current schedule to Saturday-Sunday"
                            onPress={() => copySchedule(value[selectedDay], ["saturday", "sunday"])}
                        >
                            Set for weekend
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            {/* Days overview */}
            <div className="w-full flex flex-col gap-2">
                {DAYS.map(({ key, label }) => (
                    <Card
                        key={key}
                        isPressable
                        onPress={() => handleDayClick(key)}
                        className="border border-divider hover:border-primary transition-colors"
                    >
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${value[key].isOpen ? 'bg-success' : 'bg-danger'}`} />
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

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="sm">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <h3 className="text-xl">
                                    {DAYS.find(d => d.key === selectedDay)?.label}
                                </h3>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-8">
                                    <Switch
                                        size="lg"
                                        isSelected={tempSchedule.isOpen}
                                        onValueChange={handleToggleDay}
                                        isDisabled={isLoading}
                                        classNames={{
                                            wrapper: "mx-auto"
                                        }}
                                    >
                                        {tempSchedule.isOpen ? "Open" : "Closed"}
                                    </Switch>

                                    {tempSchedule.isOpen && (
                                        <div className="space-y-4">
                                            <Select
                                                label="Opening Time"
                                                selectedKeys={[tempSchedule.open]}
                                                onChange={(e) => handleTimeChange("open", e.target.value)}
                                                variant="bordered"
                                                isDisabled={isLoading}
                                            >
                                                {HOURS.map((hour) => (
                                                    <SelectItem key={hour.value} textValue={hour.value}>
                                                        {hour.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                label="Closing Time"
                                                selectedKeys={[tempSchedule.close]}
                                                onChange={(e) => handleTimeChange("close", e.target.value)}
                                                variant="bordered"
                                                isDisabled={isLoading}
                                            >
                                                {HOURS.map((hour) => (
                                                    <SelectItem key={hour.value} textValue={hour.value}>
                                                        {hour.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleSave}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
} 