"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePusherChat } from "@/hooks/use-pusher";
import {
  Send,
  User,
  MessageCircle,
  ArrowLeft,
  Search,
  Box,
  Building2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

type ChatPreview = any;
type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
};

export default function MessagesClient({
  initialChats,
  currentUserId,
}: {
  initialChats: ChatPreview[];
  currentUserId: string;
}) {
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when chat selected
  useEffect(() => {
    if (!activeChat) return;
    fetch(`/api/chats/${activeChat.id}/messages`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch(console.error);
  }, [activeChat]);

  // Pusher real-time updates for active chat
  usePusherChat(activeChat?.id || "", (message) => {
    setMessages((prev) => [...prev, message]);

    // Update the last message in the sidebar
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat?.id ? { ...chat, messages: [message] } : chat
      )
    );
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const content = newMessage;
    setNewMessage("");

    try {
      await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const otherUser = chat.buyerId === currentUserId ? chat.seller : chat.buyer;
    return (
      otherUser.name?.toLowerCase().includes(q) ||
      chat.property?.title?.toLowerCase().includes(q) ||
      chat.property?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-[calc(100svh-5rem-4.5rem)] md:h-[calc(100vh-8rem)] rounded-xl md:rounded-2xl border border-[#e5ddd0] bg-white shadow-xs overflow-hidden">
      {/* ── Left / Mobile First: Chat List ── */}
      <div
        className={clsx(
          "w-full md:w-80 lg:w-96 border-r border-[#e5ddd0] bg-[#faf7f2]/40 flex flex-col shrink-0",
          activeChat ? "hidden md:flex" : "flex"
        )}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#e5ddd0] bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1e1b17]">
              Messages
            </h2>
            <span className="rounded-full bg-[#f2ece0] px-2 py-0.5 text-[10px] font-semibold text-[#b8924a]">
              {chats.length} chats
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative mt-2.5">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7268]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-full border border-[#e5ddd0] bg-[#faf7f2] py-1.5 pl-8 pr-3 text-xs text-[#1e1b17] placeholder:text-[#a39a8c] focus:border-[#b8924a] focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Chat List Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e5ddd0]/60">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-[#7a7268]">
              <MessageCircle className="h-10 w-10 text-[#d5cdc3] mx-auto mb-2" />
              <p className="text-xs font-medium">No conversations found</p>
              <p className="text-[11px] text-[#a39a8c] mt-0.5">
                Inquiries with agents and sellers will appear here.
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const otherUser =
                chat.buyerId === currentUserId ? chat.seller : chat.buyer;
              const lastMessage = chat.messages?.[0];
              const isActive = activeChat?.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={clsx(
                    "locus-touch w-full p-3 sm:p-3.5 text-left flex items-start gap-3 transition-colors",
                    isActive
                      ? "bg-[#f2ece0]/80 border-l-4 border-l-[#b8924a]"
                      : "bg-white hover:bg-[#faf7f2]"
                  )}
                >
                  <div className="relative h-10 w-10 bg-[#f2ece0] rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-[#e5ddd0]">
                    {otherUser.image ? (
                      <img
                        src={otherUser.image}
                        alt={otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-[#7a7268]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-semibold text-xs sm:text-sm text-[#1e1b17] truncate">
                        {otherUser.name}
                      </h3>
                      {lastMessage && (
                        <span className="text-[10px] text-[#7a7268] shrink-0 ml-2">
                          {format(new Date(lastMessage.createdAt), "MMM d")}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-[#b8924a] truncate mb-0.5">
                      {chat.property?.title}
                    </p>
                    <p className="text-xs text-[#7a7268] truncate">
                      {lastMessage?.content || "Tap to open conversation"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right / Active Chat Thread ── */}
      <div
        className={clsx(
          "flex-1 flex flex-col bg-white min-w-0",
          !activeChat ? "hidden md:flex" : "flex"
        )}
      >
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="p-3 sm:p-3.5 border-b border-[#e5ddd0] flex items-center justify-between bg-[#faf7f2]/60 z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Mobile Back button */}
                <button
                  type="button"
                  onClick={() => setActiveChat(null)}
                  className="md:hidden locus-touch flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e5ddd0] bg-white text-[#1e1b17]"
                  aria-label="Back to conversations list"
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="relative h-9 w-9 bg-[#f2ece0] rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-[#e5ddd0]">
                  {(activeChat.buyerId === currentUserId
                    ? activeChat.seller.image
                    : activeChat.buyer.image) ? (
                    <img
                      src={
                        activeChat.buyerId === currentUserId
                          ? activeChat.seller.image
                          : activeChat.buyer.image
                      }
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-[#7a7268]" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-[#1e1b17] truncate">
                    {activeChat.buyerId === currentUserId
                      ? activeChat.seller.name
                      : activeChat.buyer.name}
                  </h3>
                  <Link
                    href={`/properties/${activeChat.property?.id}`}
                    className="text-[11px] text-[#b8924a] hover:underline truncate block"
                  >
                    {activeChat.property?.title} →
                  </Link>
                </div>
              </div>

              {/* Property badge / 3D shortcut */}
              <Link
                href={`/properties/${activeChat.property?.id}`}
                className="locus-touch hidden sm:inline-flex items-center gap-1 rounded-full border border-[#e5ddd0] bg-white px-3 py-1 text-[11px] font-medium text-[#1e1b17] hover:border-[#b8924a]"
              >
                <Building2 size={12} className="text-[#b8924a]" />
                <span>View Listing</span>
              </Link>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#faf7f2]/30">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center p-6">
                  <div className="max-w-xs">
                    <p className="text-xs text-[#7a7268]">
                      Start the conversation regarding{" "}
                      <strong className="text-[#1e1b17]">
                        {activeChat.property?.title}
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={clsx("flex", isMe ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={clsx(
                          "max-w-[82%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-2xs relative text-xs sm:text-sm leading-relaxed",
                          isMe
                            ? "bg-[#1e1b17] text-white rounded-br-2xs"
                            : "bg-white border border-[#e5ddd0] text-[#1e1b17] rounded-bl-2xs"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span
                          className={clsx(
                            "text-[9px] mt-1 block",
                            isMe ? "text-neutral-400 text-right" : "text-[#7a7268]"
                          )}
                        >
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer */}
            <div className="p-2.5 sm:p-3 bg-white border-t border-[#e5ddd0]">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-4 py-2 text-xs sm:text-sm text-[#1e1b17] placeholder:text-[#a39a8c] focus:outline-none focus:border-[#b8924a] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="locus-touch flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e1b17] text-white hover:bg-[#b8924a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#7a7268]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2ece0] text-[#b8924a] mb-3">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#1e1b17]">
              Select a conversation
            </h3>
            <p className="text-xs text-[#7a7268] max-w-xs mt-1">
              Choose a buyer or agent inquiry from the left to start messaging and discussing property details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
