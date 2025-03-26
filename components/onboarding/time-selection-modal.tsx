import { Button, ModalFooter } from '@heroui/react'
import { DAYS, HOURS } from '@/constants';
import { Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from '@heroui/react'
import React from 'react'

interface TimeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDay: string;
    value: any;
    handleTimeChange: (type: "open" | "close", time: string) => void;
    title?: string;
    onSave?: () => void;
}

export const TimeSelectionModal = ({
    isOpen,
    onClose,
    selectedDay,
    value,
    handleTimeChange,
    title,
    onSave,
}: TimeSelectionModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h3 className="text-xl">
                                {title || `${DAYS.find(d => d.key === selectedDay)?.label} Hours`}
                            </h3>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <Select
                                    label="Opening Time"
                                    selectedKeys={[value[selectedDay].open]}
                                    onChange={(e) => handleTimeChange("open", e.target.value)}
                                    className="w-full"
                                    popoverProps={{
                                        placement: "bottom"
                                    }}
                                >
                                    {HOURS.map((hour) => (
                                        <SelectItem key={hour.value}>
                                            {hour.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Closing Time"
                                    selectedKeys={[value[selectedDay].close]}
                                    onChange={(e) => handleTimeChange("close", e.target.value)}
                                    className="w-full"
                                >
                                    {HOURS.map((hour) => (
                                        <SelectItem key={hour.value}>
                                            {hour.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            {onSave && (
                                <Button color="primary" onPress={onSave}>
                                    Apply
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}