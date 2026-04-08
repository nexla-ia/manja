import { ChatMessage } from "@/types/agent";
import { FilePreview } from "./FilePreview";
import { Sparkles } from "lucide-react";

function formatText(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="gradient-text font-semibold">{part}</strong>
      : part
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      <div className={`max-w-[78%] ${isUser ? "" : "w-full"}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)" }}>
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-xs font-semibold gradient-text">Manja</span>
          </div>
        )}

        <div className={
          isUser
            ? "text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
            : "rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
        }
        style={isUser ? {
          background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
          boxShadow: "0 4px 15px rgba(110,231,183,0.2)",
        } : {
          background: "#14141E",
          border: "1px solid #1E1E2E",
          color: "#E2E8F0",
        }}>
          {formatText(message.content)}
        </div>

        {!isUser && message.fileResult && (
          <FilePreview result={message.fileResult} arquivoUrl={message.arquivoUrl} />
        )}
      </div>
    </div>
  );
}
