export interface ChatAttachment {
  id: string
  kind: "image" | "audio"
  label: string
  src?: string
}

export interface ChatImage {
  id: string
  src: string
  alt: string
}

export interface Message {
  id: number
  type: "user" | "ai"
  text: string
  timestamp: string
  attachments?: ChatAttachment[]
  images?: ChatImage[]
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}
