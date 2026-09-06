"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Calendar,
  TrendingDown,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Bell,
  SlidersHorizontal,
} from "lucide-react";

type NotificationCategory = "All" | "Inquiries" | "Updates" | "Offers";

const CATEGORIES: NotificationCategory[] = ["All", "Inquiries", "Updates", "Offers"];

interface NotificationItem {
  id: string;
  category: NotificationCategory;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  link?: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "Updates",
    icon: Heart,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    title: "New property matches",
    description: "5 new luxury villas match your saved search in Gurgaon.",
    time: "2 min ago",
    isUnread: true,
    link: "/properties?city=Gurgaon&propertyType=VILLA",
  },
  {
    id: "notif-2",
    category: "Inquiries",
    icon: Calendar,
    iconColor: "text-[#b8924a]",
    iconBg: "bg-[#fbf6ec]",
    title: "Visit confirmed",
    description: "Your visit to Modern Coastal Villa on 12 Sep at 12:00 PM is confirmed.",
    time: "10 min ago",
    isUnread: true,
    link: "/properties/cmt5ke7q8005juc1447r7t51j",
  },
  {
    id: "notif-3",
    category: "Offers",
    icon: TrendingDown,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Price drop alert",
    description: "A luxury apartment you bookmarked dropped by ₹15 Lakh.",
    time: "1 hour ago",
    isUnread: true,
    link: "/properties",
  },
  {
    id: "notif-4",
    category: "Inquiries",
    icon: MessageSquare,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "New agent message",
    description: "Priya Mehta sent you project details for Sector 57.",
    time: "2 hours ago",
    isUnread: false,
    link: "/dashboard/messages",
  },
  {
    id: "notif-5",
    category: "Updates",
    icon: Sparkles,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "New Launch live",
    description: "Green Valley Residences is now live with 3D interactive twins.",
    time: "5 hours ago",
    isUnread: false,
    link: "/spatial",
  },
  {
    id: "notif-6",
    category: "Updates",
    icon: CheckCircle,
    iconColor: "text-[#1e1b17]",
    iconBg: "bg-[#f2ece0]",
    title: "System update",
    description: "Your buyer preferences and alerts were saved successfully.",
    time: "1 day ago",
    isUnread: false,
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24">
      {/* ── Top Header ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e5ddd0] bg-white/90 px-4 py-3 backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#faf7f2] text-[#1e1b17] shadow-2xs hover:bg-white md:hidden"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-serif text-lg font-bold text-[#1e1b17]">
              Notifications
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          className="text-xs font-semibold text-[#b8924a] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-3 py-3 space-y-3">
        {/* ── Filter Category Chips ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === cat
                  ? "bg-[#1e1b17] text-white shadow-2xs"
                  : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#faf7f2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Notification Rows Feed ── */}
        <div className="rounded-2xl border border-[#e5ddd0] bg-white overflow-hidden divide-y divide-[#f2ece0] shadow-xs">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              const content = (
                <div
                  className={`flex items-start gap-3 p-3.5 transition-colors hover:bg-[#faf7f2] ${
                    item.isUnread ? "bg-[#fbf9f4]" : ""
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs ${
                          item.isUnread ? "font-bold text-[#1e1b17]" : "font-semibold text-[#524b42]"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-[#9a8f7e] shrink-0">{item.time}</span>
                    </div>

                    <p className="text-[11px] text-[#7a7268] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {item.isUnread && (
                    <span className="flex h-2 w-2 rounded-full bg-[#b8924a] shrink-0 mt-1.5" />
                  )}
                </div>
              );

              return item.link ? (
                <Link key={item.id} href={item.link} className="block">
                  {content}
                </Link>
              ) : (
                <div key={item.id}>{content}</div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a]">
                <Bell className="h-5 w-5" />
              </div>
              <p className="font-serif text-sm font-semibold text-[#1e1b17]">
                No notifications in {activeTab}
              </p>
              <p className="text-xs text-[#7a7268]">You are completely caught up!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
