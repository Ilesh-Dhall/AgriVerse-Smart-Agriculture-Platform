"use client";

import { type ChatAttachment } from "@/components/chat/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Paperclip, SendHorizontal, X, StopCircle } from "lucide-react";
import { type KeyboardEvent } from "react";

interface ChatComposerProps {
  inputText: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onAttachImage: () => void;
  onRemoveAttachment: (id: string) => void;
  onToggleAudioRecord: () => void;
  onClearAudio: () => void;
  onToggleSpeechInput: () => void;
  listening: boolean;
  speechSupported: boolean;
  attachments: ChatAttachment[];
  isRecordingAudio: boolean;
  hasAudioDraft: boolean;
  disabled: boolean;
}

export function ChatComposer({
  inputText,
  onInputChange,
  onSend,
  onAttachImage,
  onRemoveAttachment,
  onToggleAudioRecord,
  onClearAudio,
  onToggleSpeechInput,
  listening,
  speechSupported,
  attachments,
  isRecordingAudio,
  hasAudioDraft,
  disabled,
}: ChatComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="glass-panel relative rounded-[24px] border border-border/50 bg-card/70 p-3 shadow-xl shadow-emerald-900/5 transition-all focus-within:ring-2 focus-within:ring-primary/20">

      {/* Attachments Area */}
      {(attachments.length > 0 || hasAudioDraft) && (
        <div className="mb-3 flex flex-wrap gap-2 px-2 pt-1 chat-reveal" style={{ animationDelay: "50ms" }}>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur-md transition-colors hover:bg-primary/10"
            >
              <Paperclip className="h-3 w-3 opacity-70" />
              <span className="truncate max-w-[150px]">{attachment.label}</span>
              <button
                type="button"
                onClick={() => onRemoveAttachment(attachment.id)}
                className="ml-1 rounded-full p-0.5 text-primary/60 hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {hasAudioDraft && (
            <div className="group inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 shadow-sm backdrop-blur-md transition-colors hover:bg-amber-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Audio note</span>
              <button
                type="button"
                onClick={onClearAudio}
                className="ml-1 rounded-full p-0.5 text-amber-700/60 hover:bg-amber-500/20 hover:text-amber-700 dark:text-amber-400/60 dark:hover:text-amber-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex shrink-0 gap-1 pb-1 pl-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onAttachImage}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            title="Attach image"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleAudioRecord}
            className={`h-9 w-9 rounded-xl transition-colors ${isRecordingAudio
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            title={isRecordingAudio ? "Stop recording" : "Record audio"}
          >
            {isRecordingAudio ? <StopCircle className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
          </Button>

          {speechSupported && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleSpeechInput}
              className={`h-9 w-9 rounded-xl transition-colors ${listening
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              title="Dictate message"
            >
              <MicOff className={`h-4 w-4 ${listening ? 'hidden' : 'block'}`} />
              <div className={`relative ${listening ? 'block' : 'hidden'}`}>
                <span className="absolute -inset-1 animate-ping rounded-full bg-primary/40"></span>
                <Mic className="relative h-4 w-4" />
              </div>
            </Button>
          )}
        </div>

        <Textarea
          value={inputText}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            listening
              ? "Listening... speak now"
              : "Message AgriVerse Assistant..."
          }
          className="modern-scrollbar min-h-[44px] max-h-48 resize-none border-0 bg-transparent px-3 py-3 text-[15px] leading-relaxed placeholder:text-muted-foreground/60 shadow-none focus-visible:ring-0"
        />

        <div className="pb-1 pr-1 shrink-0">
          <Button
            type="button"
            size="icon"
            onClick={onSend}
            disabled={disabled}
            className={`h-10 w-10 rounded-[14px] transition-all duration-300 ${disabled || (!inputText.trim() && attachments.length === 0 && !hasAudioDraft)
              ? "bg-muted text-muted-foreground opacity-50 shadow-none"
              : "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
              }`}
          >
            <SendHorizontal className={`h-5 w-5 ${(!inputText.trim() && attachments.length === 0 && !hasAudioDraft && !disabled) ? 'translate-x-0' : 'translate-x-[-1px]'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
