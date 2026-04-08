"use client";

import { useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, loading, disabled }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="p-4" style={{ borderTop: "1px solid #1E1E2E" }}>
      <div
        className={cn(
          "flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200",
          disabled ? "opacity-60" : ""
        )}
        style={{
          background: "#14141E",
          border: "1px solid #1E1E2E",
          outline: "none",
        }}
        onFocusCapture={e => {
          if (!disabled) (e.currentTarget as HTMLElement).style.border = "1px solid #6EE7B7";
        }}
        onBlurCapture={e => {
          (e.currentTarget as HTMLElement).style.border = "1px solid #1E1E2E";
        }}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled || loading}
          placeholder="Peça uma apresentação, trabalho, prova de estudo, análise de edital..."
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
          style={{ color: "#F1F5F9", maxHeight: 140, caretColor: "#6EE7B7" }}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || loading || disabled}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 btn-shimmer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: value.trim() && !disabled ? "0 4px 15px rgba(110,231,183,0.3)" : undefined }}
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
      <p className="text-center text-xs mt-2" style={{ color: "#334155" }}>
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  );
}
