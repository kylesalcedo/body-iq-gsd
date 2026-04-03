"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search";

const navItems = [
  { label: "Exercise Finder", href: "/finder", icon: "🔍" },
  { label: "Regions", href: "/regions", icon: "🗺️" },
  { label: "Joints", href: "/joints", icon: "🔗" },
  { label: "Movements", href: "/movements", icon: "↔️" },
  { label: "Muscles", href: "/muscles", icon: "💪" },
  { label: "Functional Tasks", href: "/tasks", icon: "🎯" },
  { label: "Exercises", href: "/exercises", icon: "🏋️" },
  { label: "Sources", href: "/sources", icon: "📚" },
  { label: "API Reference", href: "/api-docs", icon: "⚡" },
  { label: "Validation Queue", href: "/validation", icon: "✅" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🦴</span>
          <span className="font-bold text-gray-900">Body IQ</span>
          <span className="text-xs text-gray-500">Explorer</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-gray-100">
        <SearchBar />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <p className="text-xs text-gray-400">
          Movement Knowledge Engine
        </p>
      </div>
    </aside>
  );
}
