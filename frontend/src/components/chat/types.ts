export interface ChatAttachment {
  id: string;
  kind: "image" | "audio";
  label: string;
}

export interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
