import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

import { poppins } from "@/app/fonts"
import { ToastProvider } from "@/providers/toast-provider";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Delivery Hub",
    description: "An all-in-one platform for restaurants to manage their deliveries and track couriers in real-time. Seamlessly connect with multiple delivery platforms and optimize your workflow.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={poppins.variable}>
            <body className="dark bg-background text-foreground font-poppins antialiased">
                <HeroUIProvider>
                    <ToastProvider />
                    {children}
                </HeroUIProvider>
            </body>
        </html >
    );
}