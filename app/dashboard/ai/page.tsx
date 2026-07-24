"use client";

import { useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";

export default function DashboardAiPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your Locus AI Broker. I can help analyze your property listings, estimate prices, draft descriptions, or assist buyers with questions. What can I do for you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsPending(true);

    // Mock AI response
    setTimeout(() => {
      let reply = "I've analyzed your question. Currently, properties in this neighborhood average ₹65,000 per sq ft. Let me know if you would like me to draft a new listing or check similar listings.";
      if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        reply = "Hello there! How can I assist you with your real estate goals today?";
      } else if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("cost")) {
        reply = "Property pricing trends are moving upward! Rent listings have increased by 8% this quarter, while sales are holding strong. I suggest checking out our Analytics tab for specific graphs.";
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Bot className="h-9 w-9 text-blue-600 animate-pulse" />
          AI Broker Assistant
        </h1>
        <p className="mt-2 text-gray-500">
          Get real-time insights, write descriptions, or negotiate prices using Locus AI.
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* Messages Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  message.role === "user"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {message.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>

              <div
                className={`rounded-2xl px-5 py-3 text-sm leading-relaxed max-w-[70%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gray-50 text-gray-600">
                <Bot size={20} />
              </div>
              <div className="rounded-2xl bg-gray-100 px-5 py-3 text-sm text-gray-400 flex items-center gap-2">
                <Sparkles size={16} className="animate-spin text-blue-500" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="border-t p-4 flex gap-3">
          <input
            type="text"
            placeholder="Ask AI Broker something (e.g. 'Help me set a price for my 3 BHK apartment')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPending}
            className="flex-1 rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400 text-sm"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
