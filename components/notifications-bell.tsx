"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePusherNotifications } from "@/hooks/use-pusher";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

type Notification = {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
};

export function NotificationsBell() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch initial notifications
  useEffect(() => {
    if (!userId) return;
    fetch("/api/notifications")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then((data) => setNotifications(data))
      .catch(console.error);
  }, [userId]);

  // Handle new real-time notifications
  usePusherNotifications(userId || "", (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return;
    
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );

    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      handleMarkAsRead();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm border-2 border-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-50"
          >
            <div className="flex items-center justify-between border-b bg-gray-50/50 px-4 py-3">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{notifications.length} total</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="mx-auto h-8 w-8 mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.link || "#"}
                      className={clsx(
                        "block p-4 transition-colors hover:bg-gray-50",
                        !notification.isRead && "bg-blue-50/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
