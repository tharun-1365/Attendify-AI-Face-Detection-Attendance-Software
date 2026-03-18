"use client";

import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/students") return "Students";
    if (pathname === "/teachers") return "Teachers";
    if (pathname === "/attendance") return "Attendance";
    if (pathname === "/analytics") return "Analytics";
    return "Admin";
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-semibold text-gray-800">
        {getTitle()}
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
          A
        </div>
      </div>
    </div>
  );
}