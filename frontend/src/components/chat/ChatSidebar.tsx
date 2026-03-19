"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ChatSession } from "@/components/chat/types";
import { LogOut, MessageSquarePlus, Sprout, Trash2 } from "lucide-react";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onLogout: () => void;
  compact?: boolean;
}

function formatSessionTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onLogout,
  compact = false,
}: ChatSidebarProps) {
  return (
    <aside className="glass-panel flex h-full flex-col border-r border-border/40 bg-card/60 backdrop-blur-[24px]">
      <div className="border-b border-border/40 p-5 pl-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-700 text-white shadow-md shadow-primary/20">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-[15px] font-bold tracking-tight text-foreground">
              AgriVerse Setup
            </p>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Intelligence
            </p>
          </div>
        </div>

        <Button
          className="h-11 w-full justify-start gap-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-600 font-semibold text-white shadow-md shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30"
          onClick={onCreateSession}
        >
          <MessageSquarePlus className="h-[18px] w-[18px]" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-4 modern-scrollbar">
        <div className="space-y-2">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Recent Conversations
          </p>
          {sessions.map((session, index) => {
            const active = session.id === activeSessionId;
            return (
              <button
                type="button"
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`chat-reveal group w-full rounded-2xl border p-3.5 text-left transition-all duration-300 ${active
                  ? "border-primary/20 bg-primary/10 shadow-sm dark:bg-primary/20"
                  : "border-transparent hover:border-border/50 hover:bg-muted/50"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 overflow-hidden">
                    <p className={`line-clamp-1 text-[14px] font-medium leading-relaxed transition-colors ${active ? "text-primary dark:text-emerald-300 font-semibold" : "text-foreground group-hover:text-primary"}`}>
                      {session.title}
                    </p>
                    <p className="mt-1.5 text-[11px] font-medium text-muted-foreground/70 flex items-center gap-1.5">
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      {formatSessionTime(session.updatedAt)}
                    </p>
                  </div>
                  {sessions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-border/40 p-4">
        <Button
          variant={compact ? "default" : "ghost"}
          className={`h-11 w-full justify-start gap-2.5 rounded-xl font-medium transition-colors hover:bg-muted/80 ${compact ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
          onClick={onLogout}
        >
          <LogOut className="h-[18px] w-[18px] text-muted-foreground" />
          Lock App
        </Button>
      </div>
    </aside>
  );
}
