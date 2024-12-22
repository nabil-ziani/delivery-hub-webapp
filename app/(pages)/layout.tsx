import NavbarComponent from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NavbarComponent />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}