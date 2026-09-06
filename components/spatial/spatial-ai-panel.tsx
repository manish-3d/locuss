"use client";

import React, { useState, useRef, useEffect } from "react";
import type { RoomNode, PropertyRoomGraph } from "@/lib/spatial";
import {
  Sparkles,
  Send,
  Compass,
  ArrowRight,
  Bot,
  User,
  Loader2,
  Info,
  RotateCcw,
  Volume2,
} from "lucide-react";
import WorkflowProgress, {
  type WorkflowStep,
} from "@/app/ai/components/workflow-progress";
import { useVoiceAgent } from "@/hooks/use-voice-agent";
import { VoiceAgentIndicator } from "@/components/ai/voice-agent-indicator";

interface SpatialAiPanelProps {
  graph: PropertyRoomGraph;
  currentRoom: RoomNode | null;
  onNavigateToRoom: (roomId: string) => void;
  onStartTour: (route?: string[]) => void;
  isTourActive?: boolean;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  workflowSteps?: WorkflowStep[];
  workflowState?: "Completed" | "Failed";
  roomAction?: {
    roomId: string;
    roomName: string;
  };
}

const QUICK_PROMPTS = [
  "Take me to the balcony",
  "Give me a quick tour",
  "What connects to the kitchen?",
  "Show me the master bedroom",
  "Describe the living room layout",
];

export function SpatialAiPanel({
  graph,
  currentRoom,
  onNavigateToRoom,
  onStartTour,
  isTourActive = false,
  className = "",
}: SpatialAiPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Welcome to the 3D property digital twin of **${graph.propertyName}**. I'm your Live Voice AI Broker. You can speak or type spatial commands (e.g. *"Take me to the balcony"* or *"Give me a tour"*).`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Voice Agent Integration
  const {
    isSupported: isVoiceSupported,
    isListening,
    isSpeaking,
    isVoiceOutputEnabled,
    status: voiceStatus,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    toggleVoiceOutput,
  } = useVoiceAgent({
    onFinalTranscript: (text) => {
      if (text.trim() && !isLoading) {
        handleSendMessage(text);
      }
    },
    autoSpeak: true,
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sync interim voice transcript with input
  useEffect(() => {
    if (isListening && interimTranscript) {
      setInput(interimTranscript);
    }
  }, [isListening, interimTranscript]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    if (isListening) {
      stopListening();
    }
    if (isSpeaking) {
      stopSpeaking();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          currentRoomId: currentRoom?.id,
          spatialPropertyId: graph.propertyId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get spatial response");
      }

      // If the AI invoked a spatial navigation action, execute it in the 3D scene!
      if (data.spatialAction) {
        if (data.spatialAction.type === "goToRoom" && data.spatialAction.roomId) {
          onNavigateToRoom(data.spatialAction.roomId);
        } else if (data.spatialAction.type === "startTour") {
          onStartTour(data.spatialAction.route);
        }
      }

      const replyText = data.reply || "I've updated the 3D view for you.";

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyText,
        workflowSteps: data.workflowSteps,
        workflowState: data.workflowState,
        roomAction:
          data.spatialAction?.type === "goToRoom"
            ? {
                roomId: data.spatialAction.roomId,
                roomName: data.spatialAction.roomName,
              }
            : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak response aloud if voice output is enabled
      if (replyText && isVoiceOutputEnabled) {
        speak(replyText);
      }
    } catch (err) {
      console.error("Spatial AI error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Sorry, I had trouble processing that spatial request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (isVoiceOutputEnabled) {
        speak(errorMessage.content);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `Conversation reset. Currently viewing **${
          currentRoom?.name || "the property"
        }**. Speak or type where you'd like to explore next!`,
      },
    ]);
  };

  const handleSpeakRoomNarration = () => {
    if (currentRoom) {
      speak(`You are currently in ${currentRoom.name}. ${currentRoom.description}`);
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border border-[#e5ddd0] bg-white shadow-xs overflow-hidden ${className}`}
    >
      {/* ── Active Room Context Card ── */}
      <div className="border-b border-[#e5ddd0] bg-[#faf7f2] p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#b8924a] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
              Active Spatial Context
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentRoom && (
              <button
                type="button"
                onClick={handleSpeakRoomNarration}
                className="inline-flex items-center gap-1 rounded-full border border-[#e5ddd0] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#b8924a] shadow-2xs hover:border-[#b8924a]"
                title="Listen to room narration"
              >
                <Volume2 className="h-3 w-3" />
                <span>Hear Room Info</span>
              </button>
            )}

            {currentRoom && (
              <span className="rounded-full border border-[#e5ddd0] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#b8924a]">
                {currentRoom.type}
              </span>
            )}
          </div>
        </div>

        {currentRoom ? (
          <div className="space-y-1">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
              {currentRoom.name}
            </h3>
            <p className="text-xs text-[#7a7268] leading-relaxed line-clamp-3">
              {currentRoom.description}
            </p>

            {currentRoom.connectedRooms.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-medium text-[#9a8f7e]">
                  Adjacent:
                </span>
                {currentRoom.connectedRooms.map((adjId) => {
                  const adjRoom = graph.rooms[adjId];
                  if (!adjRoom) return null;
                  return (
                    <button
                      key={adjId}
                      type="button"
                      onClick={() => onNavigateToRoom(adjId)}
                      className="inline-flex items-center gap-0.5 rounded-md border border-[#e5ddd0] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#faf7f2] transition-colors"
                    >
                      <span>{adjRoom.name}</span>
                      <ArrowRight className="h-2.5 w-2.5 text-[#b8924a]" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#7a7268]">
            Viewing complete exterior & grounds. Select a room hotspot or ask the AI to fly the camera into any space.
          </p>
        )}
      </div>

      {/* ── Live Voice Agent Banner ── */}
      <div className="border-b border-[#e5ddd0]/80 bg-[#fbf6ec]/60 px-3 py-2">
        <VoiceAgentIndicator
          isListening={isListening}
          isSpeaking={isSpeaking}
          isVoiceOutputEnabled={isVoiceOutputEnabled}
          status={voiceStatus}
          isSupported={isVoiceSupported}
          onToggleListening={toggleListening}
          onToggleVoiceOutput={toggleVoiceOutput}
          onStopSpeaking={stopSpeaking}
          interimTranscript={interimTranscript}
          variant="banner"
        />
      </div>

      {/* ── Quick Prompt Chips ── */}
      <div className="border-b border-[#e5ddd0] bg-white p-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-2.5 py-1 text-[11px] font-medium text-[#1e1b17] transition-all hover:border-[#b8924a] hover:bg-white disabled:opacity-50"
            >
              <Sparkles className="h-2.5 w-2.5 text-[#b8924a]" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Messages Container ── */}
      <div className="flex-1 max-h-[340px] overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs ${
                  isUser
                    ? "bg-[#b8924a] text-white"
                    : "border border-[#b8924a]/40 bg-[#1e1b17] text-[#dfc99a]"
                }`}
              >
                {isUser ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>

              <div
                className={`flex flex-col space-y-1 max-w-[85%] ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#b8924a] text-white"
                      : "border border-[#e5ddd0] bg-[#faf7f2] text-[#1e1b17]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Room action pill if AI steered camera */}
                  {msg.roomAction && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#b8924a]/40 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#b8924a]">
                      <Compass className="h-3 w-3" />
                      <span>Arrived at {msg.roomAction.roomName}</span>
                    </div>
                  )}
                </div>

                {/* Workflow execution steps if any */}
                {msg.workflowSteps && msg.workflowSteps.length > 0 && (
                  <div className="w-full pt-1">
                    <WorkflowProgress
                      steps={msg.workflowSteps}
                      workflowState={msg.workflowState}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-[#b8924a]/40 bg-[#1e1b17] text-[#dfc99a]">
              <Bot className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] px-3.5 py-2 text-xs text-[#7a7268]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#b8924a]" />
              <span>Analyzing spatial intelligence…</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Box & Voice Controls ── */}
      <div className="border-t border-[#e5ddd0] bg-[#faf7f2] p-3 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? "Listening… speak: 'Take me to balcony', 'Show pool'…"
                : "Speak or type: 'Take me to kitchen', 'Start tour'…"
            }
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 text-xs text-[#1e1b17] placeholder:text-[#9a8f7e] focus:border-[#b8924a] focus:outline-hidden focus:ring-1 focus:ring-[#b8924a]"
          />

          {/* Compact Voice Mic Button */}
          <VoiceAgentIndicator
            isListening={isListening}
            isSpeaking={isSpeaking}
            isVoiceOutputEnabled={isVoiceOutputEnabled}
            status={voiceStatus}
            isSupported={isVoiceSupported}
            onToggleListening={toggleListening}
            onToggleVoiceOutput={toggleVoiceOutput}
            onStopSpeaking={stopSpeaking}
            variant="compact"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1e1b17] text-[#faf7f2] transition-colors hover:bg-[#35312b] disabled:opacity-40"
            title="Send Message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between px-1 text-[10px] text-[#7a7268]">
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3 text-[#b8924a]" />
            <span>Speak or type to navigate in 3D</span>
          </span>

          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex items-center gap-1 text-[#7a7268] hover:text-[#1e1b17]"
            title="Clear Chat"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
