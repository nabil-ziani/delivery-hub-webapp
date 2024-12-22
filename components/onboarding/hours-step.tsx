"use client";

import { Button, Card, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

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
        <div className="space-y-4">
            <div className="flex gap-4">
                <Select
                    label="Day"
                    selectedKeys={[selectedDay]}
                    onChange={(e) => setSelectedDay(e.target.value as typeof DAYS[number])}
                    variant="bordered"
                    isDisabled={isLoading}
                >
                    {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </SelectItem>
                    ))}
                </Select>
                <Button
                    variant="flat"
                    onPress={copyToAll}
                    isDisabled={isLoading}
                >
                    Copy to all days
                </Button>
            </div>

            <div className="flex gap-4">
                <Select
                    label="Opening Time"
                    selectedKeys={[value[selectedDay].open]}
                    onChange={(e) => handleTimeChange("open", e.target.value)}
                    variant="bordered"
                    isDisabled={isLoading}
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
                >
                    {HOURS.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                            {hour.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Opening Hours Overview</h3>
                <div className="space-y-2">
                    {DAYS.map((day) => (
                        <div key={day} className="flex justify-between items-center">
                            <span className="capitalize">{day}</span>
                            <span className="text-default-500">
                                {value[day].open} - {value[day].close}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
} 