import { ChatMessage } from "@/types/agent";
import { FilePreview } from "./FilePreview";
import { BookOpen } from "lucide-react";

function formatText(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-green-400 font-semibold">{part}</strong>
      : part
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[78%] ${isUser ? "" : "w-full"}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-green-600/20 border border-green-600/30 flex items-center justify-center">
              <BookOpen size={13} className="text-green-400" />
            </div>
            <span className="text-green-500 text-xs font-semibold">Manja</span>
          </div>
        )}

        <div className={
          isUser
            ? "bg-green-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
            : "bg-[#111a13] border border-[#1e2e20] text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
        }>
          {formatText(message.content)}
        </div>

        {!isUser && message.fileResult && (
          <FilePreview result={message.fileResult} arquivoUrl={message.arquivoUrl} />
        )}
      </div>
    </div>
  );
}
