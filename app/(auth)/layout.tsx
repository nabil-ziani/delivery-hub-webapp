import "@/app/globals.css";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {children}
    </main>
  )
}