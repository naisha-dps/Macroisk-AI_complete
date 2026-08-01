"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Link2Off } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, type ChatMessageData } from "@/components/assistant/chat-message";
import { ChatInput } from "@/components/assistant/chat-input";
import { TypingBubble } from "@/components/assistant/typing-bubble";
import { useChat } from "@/lib/hooks/use-chat";
import { useAnalysisContext } from "@/lib/providers/analysis-context";

const WELCOME: ChatMessageData = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm trained on the macro-financial research corpus and vector store. If you've run **Full Analysis** on a company, I also have access to that run's forecasts and statements — ask away.",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([WELCOME]);
  const chat = useChat();
  const { lastAnalysis } = useAnalysisContext();
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chat.isPending]);

  function handleSend(query: string) {
    const userMessage: ChatMessageData = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);

    chat.mutate(
      { query, context: lastAnalysis },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: data.answer }]);
        },
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "error",
              content: error instanceof Error ? error.message : "Something went wrong reaching the assistant.",
            },
          ]);
        },
      },
    );
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <PageHeader
        eyebrow="RAG · POST /chat"
        title="Assistant"
        description="Stateless per request — every message is answered fresh from the vector store plus whatever context is attached below."
        actions={
          lastAnalysis ? (
            <Badge variant="accent">
              <Link2 className="h-3 w-3" /> Grounded in {lastAnalysis.company.toUpperCase()}
            </Badge>
          ) : (
            <Badge variant="neutral">
              <Link2Off className="h-3 w-3" /> No pipeline context attached
            </Badge>
          )
        }
      />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div ref={viewportRef} className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 p-6">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {chat.isPending && <TypingBubble />}
          </div>
        </div>
        <ChatInput onSend={handleSend} disabled={chat.isPending} />
      </Card>
    </div>
  );
}
