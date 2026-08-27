"use client";

import { useState, useEffect, useRef } from "react";
import { usePusherChat } from "@/hooks/use-pusher";
import { Send, User, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import Image from "next/image";

type ChatPreview = any; // Simplifying for brevity, should map to the Prisma query type
type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
};

export default function MessagesClient({ 
  initialChats, 
  currentUserId 
}: { 
  initialChats: ChatPreview[], 
  currentUserId: string 
}) {
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when chat selected
  useEffect(() => {
    if (!activeChat) return;
    fetch(`/api/chats/${activeChat.id}/messages`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(console.error);
  }, [activeChat]);

  // Pusher real-time updates for active chat
  usePusherChat(activeChat?.id || "", (message) => {
    setMessages(prev => [...prev, message]);
    
    // Update the last message in the sidebar
    setChats(prev => prev.map(chat => 
      chat.id === activeChat?.id 
        ? { ...chat, messages: [message] } 
        : chat
    ));
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const content = newMessage;
    setNewMessage("");

    // Optimistic UI update could go here

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

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Sidebar: Chat List */}
      <div className="w-1/3 border-r bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No messages yet.</div>
          ) : (
            chats.map((chat) => {
              const otherUser = chat.buyerId === currentUserId ? chat.seller : chat.buyer;
              const lastMessage = chat.messages[0];
              const isActive = activeChat?.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={clsx(
                    "w-full p-4 border-b text-left flex items-start gap-3 transition hover:bg-gray-100",
                    isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : "bg-white"
                  )}
                >
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {otherUser.image ? (
                      <img src={otherUser.image} alt={otherUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-sm truncate">{otherUser.name}</h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {format(new Date(lastMessage.createdAt), "MMM d")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 truncate mb-1">{chat.property.title}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {(activeChat.buyerId === currentUserId ? activeChat.seller.image : activeChat.buyer.image) ? (
                    <img src={activeChat.buyerId === currentUserId ? activeChat.seller.image : activeChat.buyer.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {activeChat.buyerId === currentUserId ? activeChat.seller.name : activeChat.buyer.name}
                  </h3>
                  <p className="text-xs text-gray-500">{activeChat.property.title}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                const showAvatar = idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId;
                
                return (
                  <div key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                    <div className={clsx(
                      "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative",
                      isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white border text-gray-900 rounded-bl-none"
                    )}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className={clsx(
                        "text-[10px] mt-1 block",
                        isMe ? "text-blue-100 text-right" : "text-gray-400"
                      )}>
                        {format(new Date(msg.createdAt), "h:mm a")}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle className="h-16 w-16 mb-4 text-gray-200" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Temporary import for the empty state icon
import { MessageCircle } from "lucide-react";
