"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// SpeechRecognition type definitions for cross-browser support
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

/**
 * Strips markdown, URLs, currency symbols, and technical formatting
 * so speech synthesis pronounces responses naturally.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText;

  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
  // Remove inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");
  // Replace markdown links [label](url) with just label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  // Remove markdown images
  cleaned = cleaned.replace(/!\[[^\]]*\]\([^\)]+\)/g, "");
  // Remove markdown headers
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");
  // Remove bold/italic markers
  cleaned = cleaned.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1");
  // Replace Indian Rupee symbol with readable word
  cleaned = cleaned.replace(/₹\s*([0-9,.]+)\s*(Cr|Crore|L|Lakh|k)?/gi, (match, num, unit) => {
    let u = unit ? ` ${unit}` : "";
    if (unit?.toLowerCase() === "cr") u = " Crore";
    if (unit?.toLowerCase() === "l") u = " Lakh";
    return `${num}${u} Rupees`;
  });
  cleaned = cleaned.replace(/₹/g, "Rupees ");
  // Remove bullet points / blockquotes
  cleaned = cleaned.replace(/^[\s>*-]+/gm, "");
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

export interface UseVoiceAgentOptions {
  /** Language for recognition and synthesis, defaults to 'en-US' */
  lang?: string;
  /** Auto-speak when assistant responds */
  autoSpeak?: boolean;
  /** Callback fired with final recognized speech */
  onFinalTranscript?: (text: string) => void;
  /** Auto submit when speech pauses */
  autoSendOnPause?: boolean;
  /** Silence delay before triggering auto-send (ms) */
  silenceDelayMs?: number;
}

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking" | "unsupported";

export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const {
    lang = "en-US",
    autoSpeak = true,
    onFinalTranscript,
    autoSendOnPause = true,
    silenceDelayMs = 1500,
  } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(autoSpeak);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [status, setStatus] = useState<VoiceStatus>("idle");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Check browser support and load preferred voice on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSynth = "speechSynthesis" in window;

    if (SpeechRec) {
      setIsSupported(true);
    } else {
      setStatus("unsupported");
    }

    if (hasSynth) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Look for modern natural English voices
        const voice =
          voices.find(
            (v) =>
              (v.name.includes("Natural") ||
                v.name.includes("Google") ||
                v.name.includes("Samantha") ||
                v.name.includes("Jenny") ||
                v.name.includes("Guy") ||
                v.name.includes("Aria")) &&
              v.lang.startsWith("en")
          ) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];

        if (voice) {
          preferredVoiceRef.current = voice;
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize recognition instance
  const getRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    if (typeof window === "undefined") return null;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onstart = () => {
      setIsListening(true);
      setStatus("listening");
      setVoiceError(null);
    };

    rec.onend = () => {
      setIsListening(false);
      if (status === "listening") {
        setStatus("idle");
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      if (event.error === "aborted") return;
      console.warn("Speech recognition error:", event.error);
      setVoiceError(`Microphone notice: ${event.error}`);
      setIsListening(false);
      setStatus("idle");
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const currentCombined = (final || interim).trim();
      setInterimTranscript(interim);

      if (final) {
        setTranscript((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
      }

      // Handle pause auto-send
      if (autoSendOnPause && currentCombined) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (currentCombined) {
            onFinalTranscript?.(currentCombined);
            stopListening();
          }
        }, silenceDelayMs);
      }
    };

    recognitionRef.current = rec;
    return rec;
  }, [lang, autoSendOnPause, silenceDelayMs, onFinalTranscript, status]);

  /**
   * Start listening to microphone input
   */
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    // If currently speaking, interrupt it
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setTranscript("");
    setInterimTranscript("");
    setVoiceError(null);

    try {
      const rec = getRecognition();
      if (rec) {
        rec.start();
      } else {
        setVoiceError("Speech recognition is not supported in this browser.");
      }
    } catch (e: any) {
      // If already started, ignore or restart
      if (e?.name !== "InvalidStateError") {
        console.error("Failed to start speech recognition:", e);
      }
    }
  }, [getRecognition]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setStatus("idle");
  }, []);

  /**
   * Toggle listening on / off
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  /**
   * Speak text aloud using SpeechSynthesis
   */
  const speak = useCallback(
    (textToSpeak: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!isVoiceOutputEnabled) return;

      const cleaned = cleanTextForSpeech(textToSpeak);
      if (!cleaned) return;

      // Cancel previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = lang;
      utterance.rate = 1.05; // Slightly upbeat, professional broker cadence
      utterance.pitch = 1.0;

      if (preferredVoiceRef.current) {
        utterance.voice = preferredVoiceRef.current;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setStatus("speaking");
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setStatus("idle");
      };

      utterance.onerror = (err) => {
        console.warn("Speech synthesis error:", err);
        setIsSpeaking(false);
        setStatus("idle");
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceOutputEnabled, lang]
  );

  /**
   * Stop any active speech immediately
   */
  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (status === "speaking") {
      setStatus("idle");
    }
  }, [status]);

  /**
   * Toggle voice speech output on / off
   */
  const toggleVoiceOutput = useCallback(() => {
    setIsVoiceOutputEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  return {
    isSupported,
    isListening,
    isSpeaking,
    isVoiceOutputEnabled,
    status,
    transcript,
    interimTranscript,
    voiceError,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    toggleVoiceOutput,
  };
}
