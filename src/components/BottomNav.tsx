"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, User, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
  { href: "/scan", label: "Scan", icon: ScanLine, primary: true },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-sage-100 bg-white/80 backdrop-blur-xl dark:border-sage-800 dark:bg-sage-900/80 safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-1 pt-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6 flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg shadow-sage-500/30 dark:bg-sage-400"
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
                <span className="mt-0.5 text-[10px] font-medium text-sage-600 dark:text-sage-400">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors",
                isActive
                  ? "text-sage-600 dark:text-sage-400"
                  : "text-sage-400 dark:text-sage-500"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 h-0.5 w-6 rounded-full bg-sage-500 dark:bg-sage-400"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
