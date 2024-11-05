import "./globals.css";

import { ThemeProvider } from "next-themes";

import { poppins } from "@/app/fonts"
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Delivery Hub",
  description: "An all-in-one platform for restaurants to manage their deliveries and track couriers in real-time. Seamlessly connect with multiple delivery platforms and optimize your workflow.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="bg-background text-foreground font-poppins antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}