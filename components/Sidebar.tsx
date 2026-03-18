"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `block cursor-pointer ${
      pathname === path
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-600">Attendify</h2>

      <nav className="mt-8 space-y-4">
        <Link href="/" className={linkStyle("/")}>
          Dashboard
        </Link>

        <Link href="/students" className={linkStyle("/students")}>
          Students
        </Link>

        <Link href="/teachers" className={linkStyle("/teachers")}>
          Teachers
        </Link>

        <Link href="/attendance" className={linkStyle("/attendance")}>
          Attendance
        </Link>

        <Link href="/analytics" className={linkStyle("/analytics")}>
          Analytics
        </Link>
      </nav>
    </aside>
  );
}