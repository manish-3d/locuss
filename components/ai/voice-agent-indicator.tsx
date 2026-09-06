"use client";

import React from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react";
import type { VoiceStatus } from "@/hooks/use-voice-agent";

interface VoiceAgentIndicatorProps {
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceOutputEnabled: boolean;
  status: VoiceStatus;
  isSupported: boolean;
  onToggleListening: () => void;
  onToggleVoiceOutput: () => void;
  onStopSpeaking: () => void;
  interimTranscript?: string;
  className?: string;
  variant?: "compact" | "banner";
}

export function VoiceAgentIndicator({
  isListening,
  isSpeaking,
  isVoiceOutputEnabled,
  status,
  isSupported,
  onToggleListening,
  onToggleVoiceOutput,
  onStopSpeaking,
  interimTranscript = "",
  className = "",
  variant = "compact",
}: VoiceAgentIndicatorProps) {
  if (!isSupported) {
    return null;
  }

  if (variant === "banner") {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 transition-all ${
          isListening
            ? "border-[#b8924a] bg-[#fbf6ec] shadow-xs"
            : isSpeaking
            ? "border-[#3d332a] bg-[#faf7f2] shadow-xs"
            : "border-[#e5ddd0] bg-white"
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          {/* Animated Mic Button */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              isListening
                ? "bg-[#b8924a] text-white shadow-md shadow-[#b8924a]/20 animate-pulse"
                : "border border-[#e5ddd0] bg-[#faf7f2] text-[#1e1b17] hover:border-[#b8924a] hover:bg-white"
            }`}
            title={isListening ? "Stop listening" : "Start talking to Live AI Broker"}
          >
            {isListening ? (
              <Mic className="h-5 w-5 animate-bounce" />
            ) : (
              <Mic className="h-5 w-5 text-[#b8924a]" />
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8924a] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#b8924a]" />
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1e1b17]">
                {isListening
                  ? "Listening to your voice…"
                  : isSpeaking
                  ? "AI Broker Speaking…"
                  : "Live Voice AI Broker"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f2ece0] px-2 py-0.5 text-[10px] font-mono text-[#7a7268]">
                <Sparkles className="h-2.5 w-2.5 text-[#b8924a]" />
                Live Audio
              </span>
            </div>
            <p className="text-[11px] text-[#7a7268]">
              {isListening && interimTranscript
                ? `“${interimTranscript}”`
                : isListening
                ? "Speak your question or spatial command…"
                : isSpeaking
                ? "Click speaker to mute audio response"
                : "Click microphone to speak hands-free"}
            </p>
          </div>
        </div>

        {/* Audio Output Mute / Speaker Controls */}
        <div className="flex items-center gap-1.5">
          {isSpeaking && (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="inline-flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-2.5 py-1 text-xs font-medium text-[#1e1b17] shadow-2xs hover:bg-[#faf7f2]"
            >
              Stop Speech
            </button>
          )}

          <button
            type="button"
            onClick={onToggleVoiceOutput}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${
              isVoiceOutputEnabled
                ? "border-[#b8924a]/50 bg-[#faf7f2] text-[#b8924a]"
                : "border-[#e5ddd0] bg-white text-[#7a7268] hover:bg-[#faf7f2]"
            }`}
            title={
              isVoiceOutputEnabled
                ? "Voice output enabled (click to mute AI voice)"
                : "Voice output muted (click to enable AI voice)"
            }
          >
            {isVoiceOutputEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Compact layout (for input composers)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Live Voice Mic Button */}
      <button
        type="button"
        onClick={onToggleListening}
        className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          isListening
            ? "bg-[#b8924a] text-white shadow-sm animate-pulse"
            : "text-[#7a7268] hover:bg-[#f2ece0] hover:text-[#1e1b17]"
        }`}
        title={isListening ? "Stop listening" : "Speak to AI Broker (Voice Input)"}
        aria-label="Voice input"
      >
        <Mic className={`h-4 w-4 ${isListening ? "animate-bounce" : ""}`} />
        {isListening && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8924a] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8924a]" />
          </span>
        )}
      </button>

      {/* Voice Output Speaker Toggle */}
      <button
        type="button"
        onClick={onToggleVoiceOutput}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          isVoiceOutputEnabled
            ? "text-[#b8924a] hover:bg-[#f2ece0]"
            : "text-[#a39a8c] hover:bg-[#f2ece0]"
        }`}
        title={
          isVoiceOutputEnabled
            ? "AI voice responses enabled (click to mute)"
            : "AI voice responses muted (click to enable)"
        }
        aria-label="Toggle voice output"
      >
        {isVoiceOutputEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </button>

      {/* When AI is speaking, allow one-click stop */}
      {isSpeaking && (
        <button
          type="button"
          onClick={onStopSpeaking}
          className="flex h-7 items-center gap-1 rounded-md border border-[#e5ddd0] bg-white px-2 text-[10px] font-semibold text-[#1e1b17] shadow-2xs hover:bg-[#faf7f2]"
          title="Stop reading response"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#b8924a] animate-ping" />
          <span>Mute</span>
        </button>
      )}
    </div>
  );
}
