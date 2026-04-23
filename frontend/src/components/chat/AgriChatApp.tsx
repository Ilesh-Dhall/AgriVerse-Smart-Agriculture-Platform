"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import { profileData } from "@/data/data"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Bot,
  Menu,
  Plus,
  Leaf,
  User,
  Volume2,
  Moon,
  Sun,
  Send,
} from "lucide-react"
import { AuthGate } from "@/components/chat/AuthGate"
import { useTheme } from "@/components/theme-provider"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ChatComposer } from "@/components/chat/ChatComposer"
import {
  getStoredPassword,
  getUnlockedState,
  readActiveSessionId,
  readStoredSessions,
  setStoredPassword,
  setUnlockedState,
  writeActiveSessionId,
  writeStoredSessions,
} from "@/components/chat/storage"
import type {
  ChatAttachment,
  ChatImage,
  ChatSession,
  Message,
} from "@/components/chat/types"

const QUICK_TEMPLATES = [
  { text: "Crop health", icon: "🌱" },
  { text: "Weather concerns", icon: "🌤️" },
  { text: "Market prices", icon: "💰" },
  { text: "Irrigation advice", icon: "💧" },
  { text: "Fertilizer guidance", icon: "🧪" },
  { text: "Pest control", icon: "🐛" },
]

const INITIAL_MESSAGE: Message = {
  id: 1,
  type: "ai",
  text: "Hello! I am your AgriVerse Assistant. How can I support your farming operations today?",
  timestamp: new Date(Date.now() - 240000).toISOString(),
}

function createSession(title = "New chat"): ChatSession {
  const now = new Date().toISOString()
  const random = Math.random().toString(36).slice(2, 8)
  return {
    id: `${Date.now()}-${random}`,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [INITIAL_MESSAGE],
  }
}

function toConversationTitle(text: string) {
  const cleaned = text.trim().replace(/\s+/g, " ")
  if (!cleaned) return "New chat"
  return cleaned.slice(0, 42)
}

interface AIResponsePayload {
  text: string
  images: ChatImage[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function coerceString(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean")
    return String(value)
  return ""
}

function extractImages(
  value: unknown,
  fallbackAlt = "Response image"
): ChatImage[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => {
      if (typeof item === "string") {
        return item
          ? { id: `${index}-${item}`, src: item, alt: fallbackAlt }
          : null
      }

      if (!isRecord(item)) return null

      const src = coerceString(
        item.src ?? item.url ?? item.imageUrl ?? item.image_url ?? item.path
      )
      if (!src) return null

      const alt =
        coerceString(item.alt ?? item.caption ?? item.label ?? item.name) ||
        fallbackAlt
      return { id: coerceString(item.id) || `${index}-${src}`, src, alt }
    })
    .filter((item): item is ChatImage => Boolean(item))
}

function parseAIResponse(payload: unknown): AIResponsePayload {
  if (typeof payload === "string") {
    return { text: payload, images: [] }
  }

  if (Array.isArray(payload)) {
    const nested = payload.map((item) => parseAIResponse(item))
    return {
      text: nested
        .map((item) => item.text)
        .filter(Boolean)
        .join("\n\n"),
      images: nested.flatMap((item) => item.images),
    }
  }

  if (isRecord(payload)) {
    const textFields = [
      "text",
      "content",
      "message",
      "output",
      "reply",
      "answer",
      "response",
    ]
    let text = ""

    for (const field of textFields) {
      const candidate = payload[field]
      if (typeof candidate === "string" && candidate.trim()) {
        text = candidate
        break
      }
    }

    if (!text && Array.isArray(payload.content)) {
      text = payload.content
        .map((item) => {
          if (typeof item === "string") return item
          if (isRecord(item)) {
            return coerceString(
              item.text ?? item.content ?? item.output ?? item.message
            )
          }
          return ""
        })
        .filter(Boolean)
        .join("\n\n")
    }

    const images = [
      payload.images,
      payload.imageUrls,
      payload.image_urls,
      payload.image,
      payload.media,
    ].flatMap((candidate) => extractImages(candidate))

    if (!text) {
      text = coerceString(
        payload.text ?? payload.content ?? payload.message ?? payload.output
      )
    }

    if (!text) {
      text = JSON.stringify(payload)
    }

    return { text, images }
  }

  return { text: String(payload ?? ""), images: [] }
}

export function AgriChatApp() {
  const webhookBaseUrl =
    import.meta.env.VITE_N8N_WEBHOOK_URL ?? "/webhook/my-endpoint"

  const { theme, setTheme } = useTheme()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [storedPassword, setStoredPasswordState] = useState("")
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState("")
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingMessage, setTypingMessage] = useState<Message | null>(null)
  const [imageDrafts, setImageDrafts] = useState<ChatAttachment[]>([])
  const [imageDraftFiles, setImageDraftFiles] = useState<
    Array<{ id: string; file: File }>
  >([])
  const [audioDraft, setAudioDraft] = useState<ChatAttachment | null>(null)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)

  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands: [
      { command: ["clear"], callback: () => setInputText("") },
      {
        command: ["send", "send message"],
        callback: () => {
          void handleSendMessage()
        },
      },
    ],
  })

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [sessions, activeSessionId]
  )

  useEffect(() => {
    setIsHydrated(true)
    setStoredPasswordState(getStoredPassword())
    setIsUnlocked(getUnlockedState())

    const storedSessions = readStoredSessions()
    if (storedSessions.length > 0) {
      setSessions(storedSessions)
      const preferred = readActiveSessionId()
      const exists = storedSessions.some((s) => s.id === preferred)
      setActiveSessionId(exists ? preferred : storedSessions[0].id)
      return
    }

    const fallbackSession = createSession("Farm Strategy")
    setSessions([fallbackSession])
    setActiveSessionId(fallbackSession.id)
  }, [])

  useEffect(() => {
    if (!isHydrated || sessions.length === 0) return
    writeStoredSessions(sessions)
  }, [sessions, isHydrated])

  useEffect(() => {
    if (!isHydrated || !activeSessionId) return
    writeActiveSessionId(activeSessionId)
  }, [activeSessionId, isHydrated])

  useEffect(() => {
    if (transcript && listening) setInputText(transcript)
  }, [transcript, listening])

  // ✅ FIX: Scroll only the messages container, not the page
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [activeSession?.messages, typingMessage, isTyping])

  useEffect(() => {
    return () => {
      imageDrafts.forEach((draft) => {
        if (draft.src?.startsWith("blob:")) URL.revokeObjectURL(draft.src)
      })
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [imageDrafts])

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12 || 12
    const minutesStr = minutes < 10 ? `0${minutes}` : String(minutes)
    return `${hours}:${minutesStr} ${ampm}`
  }

  const updateSession = (
    sessionId: string,
    updater: (s: ChatSession) => ChatSession
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...updater(s), updatedAt: new Date().toISOString() }
          : s
      )
    )
  }

  const appendMessageToActive = (message: Message) => {
    if (!activeSessionId) return
    updateSession(activeSessionId, (session) => {
      const nextMessages = [...session.messages, message]
      const shouldRename =
        session.title === "New chat" && message.type === "user"
      return {
        ...session,
        title: shouldRename ? toConversationTitle(message.text) : session.title,
        messages: nextMessages,
      }
    })
  }

  const createNewSession = () => {
    const session = createSession()
    setSessions((prev) => [session, ...prev])
    setActiveSessionId(session.id)
    setTypingMessage(null)
    setIsTyping(false)
    setInputText("")
    setImageDrafts([])
    setAudioDraft(null)
  }

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id)
      if (filtered.length === 0) {
        const fallback = createSession("Farm Strategy")
        setActiveSessionId(fallback.id)
        return [fallback]
      }
      if (activeSessionId === id) setActiveSessionId(filtered[0].id)
      return filtered
    })
  }

  const typeMessage = async (
    fullText: string,
    messageId: number,
    images: ChatImage[] = []
  ) => {
    if (fullText) {
      const words = fullText.split(" ")
      let currentText = ""
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? " " : "") + words[i]
        setTypingMessage({
          id: messageId,
          type: "ai",
          text: currentText,
          timestamp: new Date().toISOString(),
        })
        await new Promise((r) => setTimeout(r, words[i].length > 6 ? 55 : 38))
      }
    }
    setTypingMessage(null)
    appendMessageToActive({
      id: messageId,
      type: "ai",
      text: fullText,
      timestamp: new Date().toISOString(),
      images: images.length > 0 ? images : undefined,
    })
  }

  const getAIResponse = async (
    userMessage: string,
    chatHistory: Message[],
    imageFiles: File[]
  ): Promise<AIResponsePayload> => {
    try {
      const recentMessages = chatHistory.slice(-9)
      const contextualMessage = recentMessages
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        }))
        .concat({ role: "user", content: userMessage })

      const endpoint = `${webhookBaseUrl}?query_format=text`

      const response =
        imageFiles.length > 0
          ? await (() => {
              const formData = new FormData()
              formData.append("message", userMessage)
              formData.append("file", imageFiles[0])
              for (let i = 1; i < imageFiles.length; i++) {
                formData.append(`file_${i + 1}`, imageFiles[i])
              }

              return fetch(endpoint, {
                method: "POST",
                body: formData,
              })
            })()
          : await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: JSON.stringify(
                  // "this is my profile data: " + JSON.stringify(profileData) +
                  // JSON.stringify(contextualMessage),
                  userMessage
                ),
              }),
            })

      if (!response.ok) console.log(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (!data) {
        return {
          text: "I'm sorry, there was an error processing your request. Please try again.",
          images: [],
        }
      }

      if (Array.isArray(data) && data[0]?.output) {
        return parseAIResponse(data[0])
      }

      return parseAIResponse(data)
    } catch (error) {
      console.error("Error getting AI response:", error)
      return {
        text: "I'm sorry, I am having trouble connecting right now. Please try again in a moment.",
        images: [],
      }
    }
  }

  const handleAttachImage = () => imageInputRef.current?.click()

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const now = Date.now()
    const selected = Array.from(files).map((file, index) => {
      const id = `${now}-${index}-${file.name}`
      return {
        id,
        file,
        attachment: {
          id,
          kind: "image" as const,
          label: file.name,
          src: URL.createObjectURL(file),
        },
      }
    })

    setImageDraftFiles((prev) => [
      ...prev,
      ...selected.map(({ id, file }) => ({ id, file })),
    ])
    setImageDrafts((prev) => [
      ...prev,
      ...selected.map(({ attachment }) => attachment),
    ])
    event.target.value = ""
  }

  const toggleAudioRecording = async () => {
    if (isRecordingAudio && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecordingAudio(false)
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioDraft({
        id: `${Date.now()}-audio-fallback`,
        kind: "audio",
        label: "Audio note attached",
      })
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        setAudioDraft({
          id: `${Date.now()}-audio`,
          kind: "audio",
          label:
            recordedChunksRef.current.length > 0
              ? "Audio note recorded"
              : "Audio note attached",
        })
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      mediaRecorder.start()
      setIsRecordingAudio(true)
    } catch {
      setAudioDraft({
        id: `${Date.now()}-audio-fallback`,
        kind: "audio",
        label: "Audio note (permission denied)",
      })
      setIsRecordingAudio(false)
    }
  }

  const startVoiceInput = async () => {
    if (!browserSupportsSpeechRecognition) return
    if (listening) {
      SpeechRecognition.stopListening()
      return
    }
    resetTranscript()
    await SpeechRecognition.startListening({
      continuous: true,
      language: localStorage.getItem("speech")?.toLowerCase() || "en-US",
      interimResults: true,
    })
  }

  const handleSendMessage = async () => {
    SpeechRecognition.stopListening()
    if (!activeSession) return
    const trimmed = inputText.trim()
    const hasImages = imageDrafts.length > 0
    const hasAudio = !!audioDraft
    if (!trimmed && !hasImages && !hasAudio) return

    const parts: string[] = []
    if (trimmed) parts.push(trimmed)
    if (hasImages)
      parts.push(
        `[Attached image: ${imageDrafts.map((i) => i.label).join(", ")}]`
      )
    if (hasAudio) parts.push("[Attached audio note]")

    const userMessageText = parts.join("\n\n")
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: userMessageText,
      timestamp: new Date().toISOString(),
      attachments: [...imageDrafts, ...(audioDraft ? [audioDraft] : [])],
    }

    appendMessageToActive(userMessage)
    setInputText("")
    setImageDrafts([])
    const outgoingImageFiles = imageDraftFiles.map((item) => item.file)
    setImageDraftFiles([])
    setAudioDraft(null)
    setIsTyping(true)

    try {
      const aiResponse = await getAIResponse(
        userMessageText,
        activeSession.messages,
        outgoingImageFiles
      )
      setIsTyping(false)
      await typeMessage(aiResponse.text, Date.now() + 1, aiResponse.images)
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      setIsTyping(false)
      appendMessageToActive({
        id: Date.now() + 1,
        type: "ai",
        text: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      })
    }
  }

  const playMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = localStorage.getItem("speech")?.toLowerCase() || "en-IN"
    speechSynthesis.speak(utterance)
  }

  const handleSetupPassword = (password: string) => {
    setStoredPassword(password)
    setStoredPasswordState(password)
    setUnlockedState(true)
    setIsUnlocked(true)
  }

  const handleUnlock = (password: string) => {
    const match = password === storedPassword
    if (match) {
      setUnlockedState(true)
      setIsUnlocked(true)
    }
    return match
  }

  const handleLock = () => {
    setUnlockedState(false)
    setIsUnlocked(false)
  }

  const activeMessages = activeSession?.messages ?? []

  if (!isHydrated) return null
  if (!isUnlocked) {
    return (
      <AuthGate
        hasPassword={Boolean(storedPassword)}
        onSetupPassword={handleSetupPassword}
        onUnlock={handleUnlock}
      />
    )
  }

  return (
    /*
     * ✅ FIX: Use `h-screen` + `overflow-hidden` on the outermost wrapper so the
     * entire viewport is locked. Nothing can grow beyond the screen height.
     * The messages area gets `flex-1 overflow-y-auto` so it scrolls internally.
     * All colors use Tailwind theme tokens (bg-background, bg-card, text-foreground,
     * border-border, text-muted-foreground) so light/dark toggle works correctly.
     */
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-background">
      {/* Ambient glow — uses primary color so it adapts to theme */}
      <div className="pointer-events-none fixed top-0 left-1/2 z-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div
        className="relative z-10 flex h-full w-full max-w-[1440px] overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* ── Sidebar ── */}
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-card md:flex">
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
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          {/* Header — fixed height, never grows */}
          <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
            {/* Mobile sidebar trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden">
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[260px] border-r border-border bg-card p-0"
              >
                <SheetHeader className="hidden">
                  <SheetTitle>Conversations</SheetTitle>
                </SheetHeader>
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
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                <Leaf className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                AgriVerse
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-widest text-primary uppercase">
                Core
              </span>
            </div>

            <div className="flex-1" />

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* New chat */}
            <button
              onClick={createNewSession}
              className="hidden h-7 items-center gap-1.5 rounded-md border border-border px-3 text-[12px] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:flex"
            >
              <Plus className="h-3 w-3" />
              New
            </button>
          </header>

          {/* ✅ Messages area — flex-1 + overflow-y-auto = internal scroll only */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--border)) transparent",
            }}
          >
            <div className="mx-auto max-w-[720px] space-y-8 px-4 py-8 md:px-6">
              {activeMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Avatar */}
                  <div className="mt-0.5 shrink-0">
                    {message.type === "ai" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                        <Leaf className="h-3.5 w-3.5 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`flex max-w-[82%] min-w-0 flex-col ${message.type === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={
                        message.type === "user"
                          ? "overflow-hidden rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-relaxed break-words text-primary-foreground"
                          : "overflow-x-auto rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 text-sm leading-relaxed break-words text-foreground"
                      }
                    >
                      {message.type === "ai" ? (
                        <div className="space-y-3">
                          {message.text && (
                            <div className="prose prose-sm dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary prose-a:text-primary prose-img:my-3 prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-md w-full max-w-none min-w-0">
                              <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                          )}

                          {message.images && message.images.length > 0 && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {message.images.map((image) => (
                                <figure
                                  key={image.id}
                                  className="overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-sm"
                                >
                                  <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="h-auto w-full object-cover"
                                    loading="lazy"
                                  />
                                  {image.alt && (
                                    <figcaption className="border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
                                      {image.alt}
                                    </figcaption>
                                  )}
                                </figure>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      )}

                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.attachments.map((item) => (
                              <span
                                key={item.id}
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${
                                  message.type === "user"
                                    ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/70"
                                    : "border-border bg-muted text-muted-foreground"
                                }`}
                              >
                                {item.label}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Timestamp + TTS */}
                    <div
                      className={`mt-1.5 flex items-center gap-2 px-1 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.type === "ai" && (
                        <button
                          onClick={() => playMessage(message.text)}
                          className="text-muted-foreground/40 transition-colors hover:text-primary"
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
                <div className="flex flex-row gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                    <Leaf className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex max-w-[82%] min-w-0 flex-col items-start">
                    <div className="overflow-x-auto rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 break-words">
                      {typingMessage ? (
                        <div className="prose prose-sm dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary w-full max-w-none min-w-0">
                          <ReactMarkdown>
                            {typingMessage.text + " ▌"}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex h-5 items-center gap-1.5">
                          <span className="mr-1 text-xs text-muted-foreground">
                            Thinking
                          </span>
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="h-1 w-1 animate-bounce rounded-full bg-primary/60"
                              style={{
                                animationDelay: `${delay}ms`,
                                animationDuration: "1s",
                              }}
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
          <footer className="shrink-0 border-t border-border bg-background/80 px-4 pt-3 pb-4 backdrop-blur-md md:px-6">
            <div className="mx-auto max-w-[720px] space-y-2.5">
              {/* Quick templates */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TEMPLATES.map((t) => (
                  <button
                    key={t.text}
                    onClick={() =>
                      setInputText(
                        `Can you provide insights on ${t.text.toLowerCase()}?`
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
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
                onRemoveAttachment={(id) => {
                  const target = imageDrafts.find((item) => item.id === id)
                  if (target?.src?.startsWith("blob:")) {
                    URL.revokeObjectURL(target.src)
                  }
                  setImageDrafts((prev) => prev.filter((i) => i.id !== id))
                  setImageDraftFiles((prev) => prev.filter((i) => i.id !== id))
                }}
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
                  (!inputText.trim() &&
                    imageDrafts.length === 0 &&
                    !audioDraft &&
                    !isRecordingAudio &&
                    !listening)
                }
              />

              <p className="text-center text-[10px] font-medium tracking-widest text-muted-foreground/40 uppercase">
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
  )
}
