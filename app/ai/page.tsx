"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Send,
  ArrowRight,
  ArrowLeft,
  Clock,
  MoreHorizontal,
  Home,
  Scale,
  MapPin,
  Box,
  TrendingUp,
  MessageSquareMore,
  ChevronRight,
  Mic,
  MicOff,
  User,
} from "lucide-react";
import AiResponseView from "./components/ai-response-view";
import ResearchState from "./components/research-state";
import { PropertyResult } from "./components/property-result-card";
import type { BuyerPreferences } from "@/lib/ai/buyer-preferences";
import type { WorkflowStep } from "./components/workflow-progress";
import { useVoiceAgent } from "@/hooks/use-voice-agent";

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

const POPULAR_QUESTIONS = [
  "Show me villas in Gurgaon under ₹2 Cr",
  "Compare Sector 56 vs Sector 57",
  "What's a good area for investment?",
  "Show me properties with a pool",
];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AiBrokerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [preferences, setPreferences] = useState<BuyerPreferences | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Live Voice Agent Integration
  const {
    isSupported: isVoiceSupported,
    isListening,
    isSpeaking,
    isVoiceOutputEnabled,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
  } = useVoiceAgent({
    onFinalTranscript: (text) => {
      if (text.trim() && !loading) {
        sendMessage(text);
      }
    },
    autoSpeak: true,
  });

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isListening && interimTranscript) {
      setInputValue(interimTranscript);
    }
  }, [isListening, interimTranscript]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
    }
  }, [inputValue]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    if (isListening) stopListening();
    if (isSpeaking) stopSpeaking();

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

      if (data.reply && isVoiceOutputEnabled) {
        speak(data.reply);
      }
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

      if (isVoiceOutputEnabled) {
        speak(msg);
      }
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
    <main className="mx-auto flex h-[calc(100svh-5rem-env(safe-area-inset-bottom))] md:h-[calc(100vh-4rem)] w-full max-w-md flex-col bg-[#faf7f2] sm:max-w-2xl lg:max-w-4xl overflow-hidden">
      {/* ── TOP APP HEADER BAR (Matches Design Board) ── */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-[#e5ddd0] bg-[#faf7f2]/95 px-4 backdrop-blur-md">
        {messages.length === 0 ? (
          <>
            {/* Left: History Button */}
            <button
              type="button"
              onClick={() => {}}
              className="locus-touch flex h-9 w-9 items-center justify-center rounded-full text-[#7a7268] transition hover:bg-black/5 hover:text-[#1e1b17]"
              aria-label="Conversation history"
            >
              <Clock size={18} />
            </button>

            {/* Center: Title & Subtitle */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 font-serif text-base font-bold tracking-tight text-[#1e1b17]">
                <Sparkles size={14} className="text-[#b8924a]" />
                <span>AI Broker</span>
              </div>
              <span className="text-[10px] text-[#7a7268]">
                Your personal real estate assistant
              </span>
            </div>

            {/* Right: Options Button */}
            <button
              type="button"
              onClick={() => {}}
              className="locus-touch flex h-9 w-9 items-center justify-center rounded-full text-[#7a7268] transition hover:bg-black/5 hover:text-[#1e1b17]"
              aria-label="More options"
            >
              <MoreHorizontal size={18} />
            </button>
          </>
        ) : (
          <>
            {/* Left: Back Button to Reset */}
            <button
              type="button"
              onClick={() => setMessages([])}
              className="locus-touch flex h-9 w-9 items-center justify-center rounded-full text-[#7a7268] transition hover:bg-black/5 hover:text-[#1e1b17]"
              aria-label="Back to welcome"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Center: Title with Online status */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 font-serif text-base font-bold tracking-tight text-[#1e1b17]">
                <Sparkles size={14} className="text-[#b8924a]" />
                <span>AI Broker</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#7a7268]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </div>
            </div>

            {/* Right: Options Button */}
            <button
              type="button"
              onClick={() => {}}
              className="locus-touch flex h-9 w-9 items-center justify-center rounded-full text-[#7a7268] transition hover:bg-black/5 hover:text-[#1e1b17]"
              aria-label="More options"
            >
              <MoreHorizontal size={18} />
            </button>
          </>
        )}
      </header>

      {/* ── SCROLLABLE MAIN CONTENT ── */}
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3 sm:px-6 overscroll-contain"
      >
        {messages.length === 0 ? (
          /* ── 1. WELCOME / EMPTY STATE (Left Screen of Design Board) ── */
          <div className="space-y-4 pb-24 animate-in fade-in duration-300">
            {/* Hero Welcome Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e5ddd0] bg-gradient-to-br from-[#fbf8f3] via-[#f7f2ea] to-[#f2ece0] p-4 shadow-xs sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 z-10">
                  <span className="text-xs font-medium text-[#7a7268]">
                    Hi there! 👋
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1b17] mt-0.5">
                    I&apos;m Locus AI
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-[#7a7268] max-w-[210px] sm:max-w-sm">
                    Ask me anything about properties, locations, prices or take a 3D tour. I&apos;m here to help you find your perfect home.
                  </p>
                </div>

                {/* Villa Illustration & Badge */}
                <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36">
                  {/* Floating speech pill */}
                  <div className="absolute -top-1 -right-1 z-10 rounded-lg border border-[#e5ddd0] bg-[#faf7f2]/95 px-2 py-1 text-[8px] font-semibold text-[#7a7268] shadow-2xs backdrop-blur-2xs text-center leading-tight">
                    Smarter<br />Searches<br />Happier Homes
                  </div>
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#e5ddd0] bg-white shadow-xs">
                    <Image
                      src="/locus-ai-hero.jpg"
                      alt="Modern luxury villa render"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 144px"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2x3 Feature Intent Cards Grid ── */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* Card 1: Find properties */}
              <button
                type="button"
                onClick={() => sendMessage("Show me 3 BHK apartments in Gurgaon under ₹2 Cr")}
                className="locus-touch flex items-start gap-2.5 rounded-xl border border-[#e5ddd0] bg-white p-3 text-left shadow-2xs transition-all hover:border-[#b8924a] hover:bg-[#faf7f2] active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2ece0] text-[#b8924a]">
                  <Home size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#1e1b17]">Find properties</h3>
                  <p className="text-[10px] text-[#7a7268] mt-0.5 truncate">e.g. 3 BHK in Gurgaon</p>
                </div>
              </button>

              {/* Card 2: Compare properties */}
              <button
                type="button"
                onClick={() => sendMessage("Compare Sector 56 vs Sector 57")}
                className="locus-touch flex items-start gap-2.5 rounded-xl border border-[#e5ddd0] bg-white p-3 text-left shadow-2xs transition-all hover:border-[#b8924a] hover:bg-[#faf7f2] active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2ece0] text-[#b8924a]">
                  <Scale size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#1e1b17]">Compare properties</h3>
                  <p className="text-[10px] text-[#7a7268] mt-0.5 truncate">Side by side analysis</p>
                </div>
              </button>

              {/* Card 3: Explore an area */}
              <button
                type="button"
                onClick={() => sendMessage("Tell me about Sector 80 Gurgaon - schools, metro, amenities")}
                className="locus-touch flex items-start gap-2.5 rounded-xl border border-[#e5ddd0] bg-white p-3 text-left shadow-2xs transition-all hover:border-[#b8924a] hover:bg-[#faf7f2] active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2ece0] text-[#b8924a]">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#1e1b17]">Explore an area</h3>
                  <p className="text-[10px] text-[#7a7268] mt-0.5 truncate">Schools, metro, amenities</p>
                </div>
              </button>

              {/* Card 4: Take a 3D tour */}
              <button
                type="button"
                onClick={() => sendMessage("Take me on a 3D tour of available villas")}
                className="locus-touch flex items-start gap-2.5 rounded-xl border border-[#e5ddd0] bg-white p-3 text-left shadow-2xs transition-all hover:border-[#b8924a] hover:bg-[#faf7f2] active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2ece0] text-[#b8924a]">
                  <Box size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#1e1b17]">Take a 3D tour</h3>
                  <p className="text-[10px] text-[#7a7268] mt-0.5 truncate">Walk through homes</p>
                </div>
              </button>

              {/* Card 5: Investment insights */}
              <button
                type="button"
                onClick={() => sendMessage("What are the best investment areas for high ROI in Gurgaon?")}
                className="locus-touch flex items-start gap-2.5 rounded-xl border border-[#e5ddd0] bg-white p-3 text-left shadow-2xs transition-all hover:border-[#b8924a] hover:bg-[#faf7f2] active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2ece0] text-[#b8924a]">
                  <TrendingUp size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#1e1b17]">Investment insights</h3>
                  <p className="text-[10px] text-[#7a7268] mt-0.5 truncate">Price trends &amp; ROI</p>
                </div>
              </button>

              {/* Card 6: Ask anything */}
              <button
                type="button"
                onClick={() => textareaRef.current?.focus()}
                className="locus-touch flex items-start gap-2.5 rounded-xl border border-[#e5ddd0] bg-white p-3 text-left shadow-2xs transition-all hover:border-[#b8924a] hover:bg-[#faf7f2] active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2ece0] text-[#b8924a]">
                  <MessageSquareMore size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#1e1b17]">Ask anything</h3>
                  <p className="text-[10px] text-[#7a7268] mt-0.5 truncate">Get instant answers</p>
                </div>
              </button>
            </div>

            {/* ── Popular Questions Section ── */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-2">
                <h2 className="font-serif text-sm font-bold text-[#1e1b17]">
                  Popular questions
                </h2>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-xs text-[#7a7268] hover:text-[#1e1b17]"
                >
                  See all
                </button>
              </div>

              <div className="space-y-2">
                {POPULAR_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="locus-touch flex w-full items-center justify-between rounded-xl border border-[#e5ddd0] bg-white px-3.5 py-3 text-left text-xs font-medium text-[#1e1b17] shadow-2xs transition-colors hover:border-[#b8924a] hover:bg-[#faf7f2]"
                  >
                    <span>{q}</span>
                    <ChevronRight size={15} className="text-[#a39a8c] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── 2. ACTIVE CONVERSATION STREAM (Right Screen of Design Board) ── */
          <div className="space-y-4 pb-28">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 items-start ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e1b17] text-white shadow-xs mt-0.5">
                    <Sparkles size={14} className="text-[#b8924a]" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-tr-xs border border-[#e6dcce] bg-[#f4ede2] px-3.5 py-2.5 text-xs sm:text-sm text-[#1e1b17] shadow-2xs leading-relaxed"
                      : "rounded-2xl rounded-tl-xs border border-[#e5ddd0] bg-white p-3.5 shadow-2xs w-full"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <AiResponseView
                      content={msg.content}
                      properties={msg.properties}
                      userQuery={msg.userQuery}
                      workflowSteps={msg.workflowSteps}
                      workflowState={msg.workflowState}
                      onFollowUpClick={(prompt) => sendMessage(prompt)}
                    />
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2ece0] border border-[#e5ddd0] text-[#7a7268] mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-start justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e1b17] text-white shadow-xs mt-0.5">
                  <Sparkles size={14} className="text-[#b8924a]" />
                </div>
                <div className="w-full max-w-[88%] sm:max-w-[80%] rounded-2xl rounded-tl-xs border border-[#e5ddd0] bg-white p-3.5 shadow-2xs">
                  <ResearchState userQuery={lastUserMessage?.content} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── FLOATING PILL INPUT COMPOSER (Matching Mockup) ── */}
      <div className="sticky bottom-0 z-20 border-t border-[#e5ddd0]/70 bg-[#faf7f2]/95 px-3 py-2 sm:px-4 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
          {/* Pill Container */}
          <div className="flex items-center gap-2 rounded-full border border-[#e5ddd0] bg-white px-2 py-1.5 shadow-sm transition-all focus-within:border-[#b8924a] focus-within:ring-2 focus-within:ring-[#b8924a]/20">
            {/* Sparkle Icon */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a] ml-1">
              <Sparkles size={13} />
            </div>

            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={
                isListening
                  ? "Listening to your voice…"
                  : messages.length === 0
                  ? "Ask Locus AI anything..."
                  : "Ask a follow-up..."
              }
              className="max-h-24 min-h-[34px] w-full resize-none bg-transparent py-1.5 text-xs sm:text-sm text-[#1e1b17] outline-none placeholder:text-[#7a7268] disabled:cursor-not-allowed disabled:opacity-50"
              rows={1}
            />

            {/* Voice Mic Toggle */}
            {isVoiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`locus-touch flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-[#7a7268] hover:text-[#1e1b17]"
                }`}
                title={isListening ? "Stop listening" : "Speak with voice"}
                aria-label="Voice input"
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
            )}

            {/* Send Action Button (Solid Gold/Bronze circle) */}
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="locus-touch flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b8924a] text-white shadow-xs transition-all hover:bg-[#9a7738] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={13} className={inputValue.trim() ? "translate-x-[-0.5px] translate-y-[0.5px]" : ""} />
            </button>
          </div>

          {/* Subtext Prompt Hint */}
          <p className="mt-1.5 text-center text-[10px] text-[#7a7268]">
            Try: &ldquo;Find 3 BHK apartments near Golf Course Road&rdquo;
          </p>
        </form>
      </div>
    </main>
  );
}
