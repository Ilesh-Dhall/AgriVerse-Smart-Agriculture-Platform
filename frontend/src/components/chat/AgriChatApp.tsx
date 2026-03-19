"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { profileData } from "@/data/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bot, Menu, Plus, Leaf, User, Volume2, Moon, Sun, Send } from "lucide-react";
import { AuthGate } from "@/components/chat/AuthGate";
import { useTheme } from "@/components/theme-provider";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatComposer } from "@/components/chat/ChatComposer";
import {
  getStoredPassword,
  getUnlockedState,
  readActiveSessionId,
  readStoredSessions,
  setStoredPassword,
  setUnlockedState,
  writeActiveSessionId,
  writeStoredSessions,
} from "@/components/chat/storage";
import type { ChatAttachment, ChatSession, Message } from "@/components/chat/types";

const QUICK_TEMPLATES = [
  { text: "Crop health", icon: "🌱" },
  { text: "Weather concerns", icon: "🌤️" },
  { text: "Market prices", icon: "💰" },
  { text: "Irrigation advice", icon: "💧" },
  { text: "Fertilizer guidance", icon: "🧪" },
  { text: "Pest control", icon: "🐛" },
];

const INITIAL_MESSAGE: Message = {
  id: 1,
  type: "ai",
  text: "Hello! I am your AgriVerse Assistant. How can I support your farming operations today?",
  timestamp: new Date(Date.now() - 240000).toISOString(),
};

function createSession(title = "New chat"): ChatSession {
  const now = new Date().toISOString();
  const random = Math.random().toString(36).slice(2, 8);
  return {
    id: `${Date.now()}-${random}`,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [INITIAL_MESSAGE],
  };
}

function toConversationTitle(text: string) {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "New chat";
  return cleaned.slice(0, 42);
}

export function AgriChatApp() {
  const { theme, setTheme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [storedPassword, setStoredPasswordState] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const [imageDrafts, setImageDrafts] = useState<ChatAttachment[]>([]);
  const [audioDraft, setAudioDraft] = useState<ChatAttachment | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands: [
      { command: ["clear"], callback: () => setInputText("") },
      { command: ["send", "send message"], callback: () => { void handleSendMessage(); } },
    ],
  });

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [sessions, activeSessionId],
  );

  useEffect(() => {
    setIsHydrated(true);
    setStoredPasswordState(getStoredPassword());
    setIsUnlocked(getUnlockedState());

    const storedSessions = readStoredSessions();
    if (storedSessions.length > 0) {
      setSessions(storedSessions);
      const preferred = readActiveSessionId();
      const exists = storedSessions.some((s) => s.id === preferred);
      setActiveSessionId(exists ? preferred : storedSessions[0].id);
      return;
    }

    const fallbackSession = createSession("Farm Strategy");
    setSessions([fallbackSession]);
    setActiveSessionId(fallbackSession.id);
  }, []);

  useEffect(() => {
    if (!isHydrated || sessions.length === 0) return;
    writeStoredSessions(sessions);
  }, [sessions, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !activeSessionId) return;
    writeActiveSessionId(activeSessionId);
  }, [activeSessionId, isHydrated]);

  useEffect(() => {
    if (transcript && listening) setInputText(transcript);
  }, [transcript, listening]);

  // ✅ FIX: Scroll only the messages container, not the page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [activeSession?.messages, typingMessage, isTyping]);

  useEffect(() => {
    return () => {
      imageDrafts.forEach((draft) => {
        if (draft.label.startsWith("blob:")) URL.revokeObjectURL(draft.label);
      });
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [imageDrafts]);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : String(minutes);
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const updateSession = (sessionId: string, updater: (s: ChatSession) => ChatSession) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...updater(s), updatedAt: new Date().toISOString() } : s,
      ),
    );
  };

  const appendMessageToActive = (message: Message) => {
    if (!activeSessionId) return;
    updateSession(activeSessionId, (session) => {
      const nextMessages = [...session.messages, message];
      const shouldRename = session.title === "New chat" && message.type === "user";
      return {
        ...session,
        title: shouldRename ? toConversationTitle(message.text) : session.title,
        messages: nextMessages,
      };
    });
  };

  const createNewSession = () => {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    setTypingMessage(null);
    setIsTyping(false);
    setInputText("");
    setImageDrafts([]);
    setAudioDraft(null);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fallback = createSession("Farm Strategy");
        setActiveSessionId(fallback.id);
        return [fallback];
      }
      if (activeSessionId === id) setActiveSessionId(filtered[0].id);
      return filtered;
    });
  };

  const typeMessage = async (fullText: string, messageId: number) => {
    const words = fullText.split(" ");
    let currentText = "";
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];
      setTypingMessage({ id: messageId, type: "ai", text: currentText, timestamp: new Date().toISOString() });
      await new Promise((r) => setTimeout(r, words[i].length > 6 ? 55 : 38));
    }
    setTypingMessage(null);
    appendMessageToActive({ id: messageId, type: "ai", text: fullText, timestamp: new Date().toISOString() });
  };

  const getAIResponse = async (userMessage: string, chatHistory: Message[]): Promise<string> => {
    try {
      const recentMessages = chatHistory.slice(-9);
      const contextualMessage = recentMessages
        .map((msg) => ({ role: msg.type === "user" ? "user" : "assistant", content: msg.text }))
        .concat({ role: "user", content: userMessage });

      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          message: JSON.stringify(
            "this is my profile data: " + JSON.stringify(profileData) +
            "and this is my conversation history: " + JSON.stringify(contextualMessage),
          ),
        }),
      });

      if (!response.ok) console.log(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.response) return "I'm sorry, there was an error processing your request. Please try again.";
      if (Array.isArray(data.response) && data.response[0]?.output) return data.response[0].output;
      if (typeof data.response === "string") return data.response;
      if (data.response.content || data.response.message) return data.response.content || data.response.message;
      return data.response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "I'm sorry, I am having trouble connecting right now. Please try again in a moment.";
    }
  };

  const handleAttachImage = () => imageInputRef.current?.click();

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const next = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      kind: "image" as const,
      label: file.name,
    }));
    setImageDrafts((prev) => [...prev, ...next]);
    event.target.value = "";
  };

  const toggleAudioRecording = async () => {
    if (isRecordingAudio && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioDraft({ id: `${Date.now()}-audio-fallback`, kind: "audio", label: "Audio note attached" });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        setAudioDraft({ id: `${Date.now()}-audio`, kind: "audio", label: recordedChunksRef.current.length > 0 ? "Audio note recorded" : "Audio note attached" });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch {
      setAudioDraft({ id: `${Date.now()}-audio-fallback`, kind: "audio", label: "Audio note (permission denied)" });
      setIsRecordingAudio(false);
    }
  };

  const startVoiceInput = async () => {
    if (!browserSupportsSpeechRecognition) return;
    if (listening) { SpeechRecognition.stopListening(); return; }
    resetTranscript();
    await SpeechRecognition.startListening({
      continuous: true,
      language: localStorage.getItem("speech")?.toLowerCase() || "en-US",
      interimResults: true,
    });
  };

  const handleSendMessage = async () => {
    SpeechRecognition.stopListening();
    if (!activeSession) return;
    const trimmed = inputText.trim();
    const hasImages = imageDrafts.length > 0;
    const hasAudio = !!audioDraft;
    if (!trimmed && !hasImages && !hasAudio) return;

    const parts: string[] = [];
    if (trimmed) parts.push(trimmed);
    if (hasImages) parts.push(`[Attached image: ${imageDrafts.map((i) => i.label).join(", ")}]`);
    if (hasAudio) parts.push("[Attached audio note]");

    const userMessageText = parts.join("\n\n");
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: userMessageText,
      timestamp: new Date().toISOString(),
      attachments: [...imageDrafts, ...(audioDraft ? [audioDraft] : [])],
    };

    appendMessageToActive(userMessage);
    setInputText("");
    setImageDrafts([]);
    setAudioDraft(null);
    setIsTyping(true);

    try {
      const aiResponseText = await getAIResponse(userMessageText, activeSession.messages);
      setIsTyping(false);
      await typeMessage(aiResponseText, Date.now() + 1);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setIsTyping(false);
      appendMessageToActive({
        id: Date.now() + 1,
        type: "ai",
        text: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const playMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("speech")?.toLowerCase() || "en-IN";
    speechSynthesis.speak(utterance);
  };

  const handleSetupPassword = (password: string) => {
    setStoredPassword(password);
    setStoredPasswordState(password);
    setUnlockedState(true);
    setIsUnlocked(true);
  };

  const handleUnlock = (password: string) => {
    const match = password === storedPassword;
    if (match) { setUnlockedState(true); setIsUnlocked(true); }
    return match;
  };

  const handleLock = () => { setUnlockedState(false); setIsUnlocked(false); };

  const activeMessages = activeSession?.messages ?? [];

  if (!isHydrated) return null;
  if (!isUnlocked) {
    return (
      <AuthGate
        hasPassword={Boolean(storedPassword)}
        onSetupPassword={handleSetupPassword}
        onUnlock={handleUnlock}
      />
    );
  }

  return (
    /*
     * ✅ FIX: Use `h-screen` + `overflow-hidden` on the outermost wrapper so the
     * entire viewport is locked. Nothing can grow beyond the screen height.
     * The messages area gets `flex-1 overflow-y-auto` so it scrolls internally.
     * All colors use Tailwind theme tokens (bg-background, bg-card, text-foreground,
     * border-border, text-muted-foreground) so light/dark toggle works correctly.
     */
    <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center">

      {/* Ambient glow — uses primary color so it adapts to theme */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-primary/5 blur-[120px] z-0" />

      <div
        className="relative z-10 flex h-full w-full max-w-[1440px] overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* ── Sidebar ── */}
        <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-border bg-card">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onCreateSession={createNewSession}
            onDeleteSession={deleteSession}
            onLogout={handleLock}
          />
        </aside>

        {/* ── Main ── */}
        <main className="flex flex-1 flex-col min-h-0 min-w-0 bg-background">

          {/* Header — fixed height, never grows */}
          <header className="shrink-0 flex h-[52px] items-center gap-3 border-b border-border px-4 md:px-6 bg-background/80 backdrop-blur-md">

            {/* Mobile sidebar trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r border-border bg-card w-[260px]">
                <SheetHeader className="hidden"><SheetTitle>Conversations</SheetTitle></SheetHeader>
                <ChatSidebar
                  sessions={sessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={setActiveSessionId}
                  onCreateSession={createNewSession}
                  onDeleteSession={deleteSession}
                  onLogout={handleLock}
                />
              </SheetContent>
            </Sheet>

            {/* Brand mark */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Leaf className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground tracking-tight">AgriVerse</span>
              <span className="text-[10px] font-medium text-primary border border-primary/20 bg-primary/10 rounded-full px-2 py-0.5 tracking-widest uppercase">
                Core
              </span>
            </div>

            <div className="flex-1" />

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* New chat */}
            <button
              onClick={createNewSession}
              className="hidden md:flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-all"
            >
              <Plus className="h-3 w-3" />
              New
            </button>
          </header>

          {/* ✅ Messages area — flex-1 + overflow-y-auto = internal scroll only */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(var(--border)) transparent" }}
          >
            <div className="mx-auto max-w-[720px] px-4 md:px-6 py-8 space-y-8">

              {activeMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5">
                    {message.type === "ai" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <Leaf className="h-3.5 w-3.5 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted border border-border">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col max-w-[82%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={
                        message.type === "user"
                          ? "rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-primary-foreground text-sm leading-relaxed"
                          : "rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3 text-foreground text-sm leading-relaxed"
                      }
                    >
                      {message.type === "ai" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary prose-a:text-primary">
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      )}

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.attachments.map((item) => (
                            <span
                              key={item.id}
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${message.type === "user"
                                  ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground/70"
                                  : "bg-muted border-border text-muted-foreground"
                                }`}
                            >
                              {item.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp + TTS */}
                    <div className={`flex items-center gap-2 mt-1.5 px-1 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <span className="text-[11px] text-muted-foreground/60 tabular-nums">{formatTime(message.timestamp)}</span>
                      {message.type === "ai" && (
                        <button
                          onClick={() => playMessage(message.text)}
                          className="text-muted-foreground/40 hover:text-primary transition-colors"
                          title="Play message"
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {(typingMessage || isTyping) && (
                <div className="flex gap-3 flex-row">
                  <div className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Leaf className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex flex-col items-start max-w-[82%]">
                    <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3">
                      {typingMessage ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary">
                          <ReactMarkdown>{typingMessage.text + " ▌"}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 h-5">
                          <span className="text-xs text-muted-foreground mr-1">Thinking</span>
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="h-1 w-1 rounded-full bg-primary/60 animate-bounce"
                              style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} className="h-px" />
            </div>
          </div>

          {/* ✅ Footer — shrink-0 keeps it pinned at the bottom, never pushed off screen */}
          <footer className="shrink-0 border-t border-border bg-background/80 backdrop-blur-md px-4 md:px-6 pt-3 pb-4">
            <div className="mx-auto max-w-[720px] space-y-2.5">

              {/* Quick templates */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TEMPLATES.map((t) => (
                  <button
                    key={t.text}
                    onClick={() => setInputText(`Can you provide insights on ${t.text.toLowerCase()}?`)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    <span>{t.icon}</span>
                    {t.text}
                  </button>
                ))}
              </div>

              {/* Composer */}
              <ChatComposer
                inputText={inputText}
                onInputChange={setInputText}
                onSend={handleSendMessage}
                onAttachImage={handleAttachImage}
                onRemoveAttachment={(id) => setImageDrafts((prev) => prev.filter((i) => i.id !== id))}
                onToggleAudioRecord={toggleAudioRecording}
                onClearAudio={() => setAudioDraft(null)}
                onToggleSpeechInput={startVoiceInput}
                listening={listening}
                speechSupported={browserSupportsSpeechRecognition}
                attachments={imageDrafts}
                isRecordingAudio={isRecordingAudio}
                hasAudioDraft={Boolean(audioDraft)}
                disabled={
                  isTyping ||
                  (!inputText.trim() && imageDrafts.length === 0 && !audioDraft && !isRecordingAudio && !listening)
                }
              />

              <p className="text-center text-[10px] tracking-widest uppercase text-muted-foreground/40 font-medium">
                AgriVerse Core · AI-powered farm intelligence
              </p>
            </div>
          </footer>
        </main>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageInput}
      />
    </div>
  );
}