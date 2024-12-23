"use client";

import { Button, Card, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { Icon } from "@iconify/react";

const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
});

type WorkingHours = {
    [key in typeof DAYS[number]]: {
        open: string;
        close: string;
    };
};

type HoursStepProps = {
    value: WorkingHours;
    onChange: (hours: WorkingHours) => void;
    isLoading: boolean;
};

export function HoursStep({ value, onChange, isLoading }: HoursStepProps) {
    const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>("monday");

    const handleTimeChange = (type: "open" | "close", time: string) => {
        onChange({
            ...value,
            [selectedDay]: {
                ...value[selectedDay],
                [type]: time,
            },
        });
    };

    const copyToAll = () => {
        const current = value[selectedDay];
        const newHours = { ...value };
        DAYS.forEach((day) => {
            newHours[day] = { ...current };
        });
        onChange(newHours);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row gap-4">
                    <Select
                        label="Day"
                        selectedKeys={[selectedDay]}
                        onChange={(e) => setSelectedDay(e.target.value as typeof DAYS[number])}
                        variant="bordered"
                        isDisabled={isLoading}
                        className="sm:max-w-[200px]"
                    >
                        {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </SelectItem>
                        ))}
                    </Select>
                    <Button
                        variant="bordered"
                        onPress={copyToAll}
                        isDisabled={isLoading}
                        className="w-full sm:w-auto whitespace-nowrap"
                        startContent={<Icon icon="solar:copy-bold" />}
                    >
                        Copy to all days
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Select
                        label="Opening Time"
                        selectedKeys={[value[selectedDay].open]}
                        onChange={(e) => handleTimeChange("open", e.target.value)}
                        variant="bordered"
                        isDisabled={isLoading}
                        className="flex-1"
                    >
                        {HOURS.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Closing Time"
                        selectedKeys={[value[selectedDay].close]}
                        onChange={(e) => handleTimeChange("close", e.target.value)}
                        variant="bordered"
                        isDisabled={isLoading}
                        className="flex-1"
                    >
                        {HOURS.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Opening Hours Overview</h3>
                <div className="space-y-3">
                    {DAYS.map((day) => (
                        <div key={day} className="flex justify-between items-center py-1">
                            <span className="capitalize font-medium">{day}</span>
                            <span className="text-default-600">
                                {value[day].open} - {value[day].close}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
} 