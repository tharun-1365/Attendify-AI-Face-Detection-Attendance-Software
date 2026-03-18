import Sidebar from "../components/Sidebar";
import "./globals.css";
import Topbar from "../components/Topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex bg-gray-100">
          <Sidebar />
         <main className="flex-1 p-10">
  <Topbar />
  {children}
</main>
        </div>
      </body>
    </html>
  );
}