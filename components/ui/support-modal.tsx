'use client';

import { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            // Here you would implement the actual API call to send the support message
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            onClose();
            // You could show a success toast here
        } catch (error) {
            console.error('Error sending support message:', error);
            // You could show an error toast here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex gap-1">
                    <Icon icon="solar:chat-square-like-bold-duotone" className="text-2xl text-primary" />
                    Contact Support
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <Select
                            label="Category"
                            placeholder="Select a category"
                            selectedKeys={category ? [category] : []}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <SelectItem key="technical" textValue="technical">Technical Issue</SelectItem>
                            <SelectItem key="account" textValue="account">Account Related</SelectItem>
                            <SelectItem key="billing" textValue="billing">Billing Question</SelectItem>
                            <SelectItem key="feature" textValue="feature">Feature Request</SelectItem>
                            <SelectItem key="other" textValue="other">Other</SelectItem>
                        </Select>

                        <Input
                            label="Subject"
                            placeholder="Brief description of your issue"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />

                        <Textarea
                            label="Message"
                            placeholder="Please describe your issue in detail"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            minRows={4}
                        />

                        <div className="rounded-lg bg-default-100 p-4">
                            <h4 className="text-sm font-medium mb-2">Alternative Contact Methods</h4>
                            <div className="space-y-2 text-sm text-default-600">
                                <p className="flex items-center gap-2">
                                    <Icon icon="solar:phone-bold-duotone" />
                                    +31 (0)20 123 4567
                                </p>
                                <p className="flex items-center gap-2">
                                    <Icon icon="solar:letter-bold-duotone" />
                                    support@deliveryhive.com
                                </p>
                                <p className="flex items-center gap-2">
                                    <Icon icon="solar:clock-circle-bold-duotone" />
                                    Available Mon-Fri, 9:00 - 18:00
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Send Message
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
} 