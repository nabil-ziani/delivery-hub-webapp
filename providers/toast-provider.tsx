"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: "var(--nextui-background)",
                    color: "var(--nextui-foreground)",
                    border: "1px solid var(--nextui-border-medium)",
                    fontSize: "14px",
                },
                success: {
                    iconTheme: {
                        primary: "var(--nextui-success)",
                        secondary: "white",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "var(--nextui-danger)",
                        secondary: "white",
                    },
                },
                duration: 4000,
            }}
        />
    );
} 