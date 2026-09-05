"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Sparkles, Send, ArrowRight } from "lucide-react";
import AiResponseView from "./components/ai-response-view";
import ResearchState from "./components/research-state";
import { PropertyResult } from "./components/property-result-card";
import type { BuyerPreferences } from "@/lib/ai/buyer-preferences";
import type { WorkflowStep } from "./components/workflow-progress";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: PropertyResult[];
  propertyIds?: string[];
  userQuery?: string;
  workflowSteps?: WorkflowStep[];
  workflowState?: "Completed" | "Failed";
};

const SUGGESTIONS = [
  "What's available for rent in Greater Noida?",
  "Find me a 2 BHK in Noida under ₹50 lakh",
  "Show me furnished apartments in Gurgaon",
  "Find villas under ₹2 crore",
];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AiBrokerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [preferences, setPreferences] = useState<BuyerPreferences | undefined>(undefined);
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

    const trimmedQuery = content.trim();

    const newMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: trimmedQuery,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const apiMessages = [...messages, newMessage].map((m) => ({
        role: m.role,
        content: m.content,
        propertyIds: m.propertyIds ?? m.properties?.map((property) => property.id),
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      if (data.preferences) {
        setPreferences(data.preferences);
      }

      const assistantMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content: data.reply,
        properties: data.properties,
        propertyIds:
          data.contextPropertyIds ?? data.properties?.map((property: PropertyResult) => property.id),
        userQuery: trimmedQuery,
        workflowSteps: data.workflowSteps,
        workflowState: data.workflowState,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI_BROKER_ERROR:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "Sorry, I couldn't process your request right now. Please try again.";
      const errorMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content: msg,
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

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  return (
    <main className="flex h-[calc(100vh-64px)] flex-col items-center justify-center px-2 sm:px-6 py-2 sm:py-4">
      <div className="flex h-full w-full max-w-4xl lg:max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#e5ddd0] bg-white shadow-sm">
        {/* MESSAGES AREA — scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4.5">
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center text-center px-3 py-3 sm:py-6 my-auto">
              <div className="mb-2 sm:mb-3 rounded-full bg-[#f2ece0] p-2.5 sm:p-3 text-[#b8924a] shadow-xs">
                <Sparkles size={20} className="sm:size-6" />
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-semibold text-[#1e1b17]">
                Your AI Real Estate Partner
              </h2>
              <p className="mt-1 text-xs text-[#7a7268] max-w-md leading-relaxed">
                Search verified listings, compare properties side-by-side, and get data-driven broker insights.
              </p>
              <div className="mt-3.5 sm:mt-4 flex max-w-xl flex-wrap justify-center gap-1.5 sm:gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="flex items-center gap-1 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-3 py-1 text-xs font-medium text-[#1e1b17] transition-all hover:border-[#b8924a] hover:bg-white hover:shadow-xs"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight size={11} className="text-[#b8924a]" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-xl bg-[#1e1b17] px-3.5 py-2 text-xs sm:text-sm text-white shadow-xs">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-[96%] sm:max-w-[90%] rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2.5 sm:p-3.5 shadow-xs">
                      <AiResponseView
                        content={msg.content}
                        properties={msg.properties}
                        userQuery={msg.userQuery}
                        workflowSteps={msg.workflowSteps}
                        workflowState={msg.workflowState}
                        onFollowUpClick={(prompt) => sendMessage(prompt)}
                      />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-full max-w-[96%] sm:max-w-[90%] rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2.5 sm:p-3.5 shadow-xs">
                    <ResearchState userQuery={lastUserMessage?.content} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT COMPOSER */}
        <div className="border-t border-[#e5ddd0] bg-[#faf7f2] p-3 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-3 rounded-xl border border-[#e5ddd0] bg-white p-2 shadow-xs transition-colors focus-within:border-[#b8924a] focus-within:ring-1 focus-within:ring-[#b8924a]"
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask anything about properties (e.g. rent in Greater Noida, compare 2 BHK vs 3 BHK)..."
              className="max-h-28 min-h-[40px] w-full resize-none bg-transparent py-2 pl-3 sm:pl-4 pr-11 text-xs sm:text-sm text-[#1e1b17] outline-none placeholder:text-[#7a7268] disabled:cursor-not-allowed disabled:opacity-50"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="absolute bottom-2 right-2.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[#1e1b17] text-white transition-all hover:bg-[#b8924a] disabled:cursor-not-allowed disabled:bg-[#e5ddd0] disabled:text-[#a39a8c]"
              aria-label="Send message"
            >
              <Send size={14} className={inputValue.trim() && !loading ? "translate-x-[-1px] translate-y-[1px]" : ""} />
            </button>
          </form>
          <div className="mt-1.5 text-center text-[10px] text-[#7a7268]">
            Press <kbd className="rounded border border-[#e5ddd0] bg-white px-1 py-0.5 font-sans">Enter</kbd> to send, <kbd className="rounded border border-[#e5ddd0] bg-white px-1 py-0.5 font-sans">Shift + Enter</kbd> for new line.
          </div>
        </div>
      </div>
    </main>
  );
}
