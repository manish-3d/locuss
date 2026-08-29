"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Sparkles, Send, ArrowRight } from "lucide-react";
import PropertyCard from "@/features/home/components/property-card";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: any[];
};

const SUGGESTIONS = [
  "Find me a 2 BHK in Noida under ₹50 lakh",
  "Show me furnished apartments in Gurgaon",
  "Find villas under ₹2 crore",
  "What's available for rent in Greater Noida?",
];

export default function AiBrokerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const apiMessages = [...messages, newMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        properties: data.properties,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI_BROKER_ERROR:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your request right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    sendMessage(inputValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <main className="flex h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-6">
      <div className="flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#e5ddd0] bg-white shadow-xl">
        {/* MESSAGES AREA — scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-full bg-[#f2ece0] p-4 text-[#b8924a]">
                <Sparkles size={32} />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#1e1b17]">
                How can I help you today?
              </h2>
              <p className="mt-2 text-[#7a7268]">
                Try one of these searches to get started:
              </p>
              <div className="mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="flex items-center gap-2 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-5 py-2.5 text-sm font-medium text-[#1e1b17] transition-colors hover:border-[#b8924a] hover:bg-white"
                  >
                    {suggestion}
                    <ArrowRight size={14} className="text-[#b8924a]" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-5 md:max-w-[75%] ${
                      msg.role === "user"
                        ? "bg-[#1e1b17] text-white"
                        : "bg-[#faf7f2] text-[#1e1b17] border border-[#e5ddd0]"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b8924a]">
                        <Sparkles size={12} />
                        Locus AI
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed text-[0.95rem] md:text-base">
                      {msg.content}
                    </div>

                    {msg.properties && msg.properties.length > 0 && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {msg.properties.filter(Boolean).map((property) => (
                          <div key={property.id} className="w-full">
                            <PropertyCard
                              id={property.id}
                              title={property.title}
                              location={`${property.city}${property.state ? `, ${property.state}` : ""}`}
                              price={property.price}
                              bedrooms={property.bedrooms || 0}
                              bathrooms={property.bathrooms || 0}
                              image={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-5 md:max-w-[75%]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b8924a]">
                      <Sparkles size={12} />
                      Locus AI
                    </div>
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[#b8924a] [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[#b8924a] [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[#b8924a]"></div>
                      <span className="ml-2 text-sm text-[#7a7268]">
                        Finding the right homes...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT COMPOSER */}
        <div className="border-t border-[#e5ddd0] bg-[#faf7f2] p-4 md:p-6">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-3 rounded-xl border border-[#e5ddd0] bg-white p-2 shadow-sm transition-colors focus-within:border-[#b8924a] focus-within:ring-1 focus-within:ring-[#b8924a]"
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Tell Locus what you're looking for..."
              className="max-h-32 min-h-[44px] w-full resize-none bg-transparent py-3 pl-4 pr-12 text-[#1e1b17] outline-none placeholder:text-[#7a7268] disabled:cursor-not-allowed disabled:opacity-50"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="absolute bottom-2.5 right-3 flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-lg bg-[#1e1b17] text-white transition-all hover:bg-[#b8924a] disabled:cursor-not-allowed disabled:bg-[#e5ddd0] disabled:text-[#a39a8c]"
              aria-label="Send message"
            >
              <Send size={18} className={inputValue.trim() && !loading ? "translate-x-[-1px] translate-y-[1px]" : ""} />
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-[#7a7268]">
            Press <kbd className="rounded border border-[#e5ddd0] bg-white px-1.5 py-0.5 font-sans shadow-sm">Enter</kbd> to send, <kbd className="rounded border border-[#e5ddd0] bg-white px-1.5 py-0.5 font-sans shadow-sm">Shift + Enter</kbd> for new line.
          </div>
        </div>
      </div>
    </main>
  );
}
