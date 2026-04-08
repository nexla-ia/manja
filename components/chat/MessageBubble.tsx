import { ChatMessage } from "@/types/agent";
import { FilePreview } from "./FilePreview";
import { Sparkles } from "lucide-react";

function formatText(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: "var(--mint)", fontWeight: 600 }}>{part}</strong>
      : part
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} anim-fade-up`}>
      <div className={`${isUser ? "max-w-[70%]" : "w-full max-w-[88%]"}`}>

        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 2px 8px var(--glow-mint)" }}>
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold grad-text">Manja</span>
          </div>
        )}

        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={isUser ? {
            background: "linear-gradient(135deg, var(--mint-dim), var(--blue))",
            color: "#fff",
            borderRadius: "18px 18px 4px 18px",
            boxShadow: "0 4px 16px var(--glow-mint)",
          } : {
            background: "var(--card)",
            border: "1px solid var(--border-hi)",
            color: "var(--text)",
            borderRadius: "4px 18px 18px 18px",
          }}
        >
          <span className="prose-chat">{formatText(message.content)}</span>
        </div>

        {!isUser && message.fileResult && (
          <FilePreview result={message.fileResult} arquivoUrl={message.arquivoUrl} />
        )}
      </div>
    </div>
  );
}
