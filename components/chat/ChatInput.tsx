"use client";

import { useRef, KeyboardEvent, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, loading, disabled }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = () => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = Math.min(ref.current.scrollHeight, 140) + "px";
  };

  const canSend = !!value.trim() && !loading && !disabled;

  return (
    <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
        style={{
          background: "var(--card)",
          border: focused ? "1px solid var(--mint-dim)" : "1px solid var(--border-hi)",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,125,0.07)" : "none",
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled || loading}
          placeholder="Peça uma apresentação, trabalho, análise de edital..."
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
          style={{
            color: "var(--text)",
            caretColor: "var(--mint)",
            maxHeight: 140,
          }}
        />

        <button
          onClick={onSend}
          disabled={!canSend}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          style={canSend ? {
            background: "linear-gradient(135deg, var(--mint-dim), var(--blue))",
            boxShadow: "0 4px 12px var(--glow-mint)",
          } : {
            background: "var(--border-hi)",
          }}
        >
          <ArrowUp size={14} className="text-white" />
        </button>
      </div>
      <p className="text-center text-xs mt-2" style={{ color: "var(--text-3)" }}>
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  );
}
