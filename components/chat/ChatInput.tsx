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
    <div className="p-4 border-t border-[#1e2e20]">
      <div className={cn(
        "flex items-end gap-3 bg-[#111a13] border rounded-2xl px-4 py-3 transition",
        disabled ? "border-[#1e2e20] opacity-60" : "border-[#1e2e20] focus-within:border-green-700"
      )}>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled || loading}
          placeholder="Peça uma apresentação, trabalho, prova de estudo, análise de edital..."
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 resize-none outline-none leading-relaxed"
          style={{ maxHeight: 140 }}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || loading || disabled}
          className="w-9 h-9 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition flex-shrink-0"
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
      <p className="text-center text-gray-700 text-xs mt-2">
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  );
}
