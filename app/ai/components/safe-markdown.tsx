"use client";

import React, { ReactNode } from "react";

type SafeMarkdownProps = {
  content: string;
  className?: string;
};

// Safely format inline markdown: **bold**, *italic*, and `code`
function renderInline(text: string): ReactNode[] {
  // Regex to match **bold**, *italic*, `code`
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-[#1e1b17]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-[#4a443c]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded bg-[#f2ece0] px-1.5 py-0.5 font-mono text-xs text-[#b8924a]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function SafeMarkdown({ content, className = "" }: SafeMarkdownProps) {
  if (!content) return null;

  // Split content by double newlines into blocks
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    const items = currentList.items;
    if (currentList.type === "ul") {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-1 space-y-0.5 pl-4 list-disc marker:text-[#b8924a] text-xs sm:text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-1 space-y-0.5 pl-4 list-decimal marker:text-[#b8924a] marker:font-semibold text-xs sm:text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={`h3-${i}`} className="mt-1.5 mb-0.5 text-xs font-bold uppercase tracking-wider text-[#b8924a]">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={`h2-${i}`} className="mt-2 mb-1 font-serif text-sm sm:text-base font-semibold text-[#1e1b17]">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    // Heading 1
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h2 key={`h1-${i}`} className="mt-2.5 mb-1 font-serif text-base font-bold text-[#1e1b17]">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    // Unordered list item (- or *)
    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (currentList && currentList.type !== "ul") {
        flushList();
      }
      if (!currentList) {
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Ordered list item (1. or 2.)
    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (currentList && currentList.type !== "ol") {
        flushList();
      }
      if (!currentList) {
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="my-2 border-l-2 border-[#b8924a] bg-[#fdfbf7] py-1.5 pl-3 pr-2 text-sm italic text-[#7a7268]"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Regular paragraph line
    flushList();
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-2 text-[#1e1b17] ${className}`}>{elements}</div>;
}
