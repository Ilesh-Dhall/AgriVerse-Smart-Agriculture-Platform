"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, User, Bot, Stars, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { profileData } from "@/data/data";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  timestamp: Date;
}

// Type extension for Chrome detection
declare global {
  interface Window {
    chrome?: object;
  }
}

export default function AiPage() {
  // Browser detection moved to state to avoid SSR mismatch
  const [isChromium, setIsChromium] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [microphonePermission, setMicrophonePermission] =
    useState<string>("prompt");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);

      // Better detection for Chromium-based browsers (Chrome, Edge, Brave, etc.)
      const isChromiumBrowser =
        /Chrome|Chromium|CriOS|Edge|Edg/.test(navigator.userAgent) ||
        !!window.chrome;

      setIsChromium(isChromiumBrowser);

      // Check microphone permission status
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "microphone" as PermissionName })
          .then((permissionStatus) => {
            setMicrophonePermission(permissionStatus.state);
            permissionStatus.onchange = () => {
              setMicrophonePermission(permissionStatus.state);
            };
          })
          .catch(console.error);
      }
    }
  }, []);

  const commands = [
    {
      command: "clear",
      callback: () => setInputText(""),
    },
    {
      command: "send",
      callback: () => {
        if (inputText && inputText.trim()) {
          handleSendMessage();
        }
      },
    },
    {
      command: "send message",
      callback: () => {
        if (inputText && inputText.trim()) {
          handleSendMessage();
        }
      },
    },
    {
      command: ["stop listening", "stop recording"],
      callback: () => {
        if (listening) {
          SpeechRecognition.stopListening();
        }
      },
    },
  ];

  // Enhanced speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    commands,
    clearTranscriptOnListen: false,
    transcribing: true,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      text: "Hi there! I'm your AgriVerse AI Assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 240000),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    document.title = "AI Farming Intelligence — AgriVerse";
  }, [messages, typingMessage]);

  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);

  // Add more consistent browser support for speech recognition
  useEffect(() => {
    // Initialize speech recognition for Chromium browsers
    if (isClient && isChromium && browserSupportsSpeechRecognition) {
      // Pre-initialize speech recognition for Chromium
      try {
        if (!SpeechRecognition.getRecognition()) {
          console.log(
            "Initializing speech recognition for Chromium browser..."
          );
        }
      } catch (error) {
        console.warn("Failed to initialize speech recognition:", error);
      }
    }

    // On some browsers, speech recognition might stop automatically
    // This effect tries to keep it going if we want continuous mode
    if (listening && browserSupportsSpeechRecognition) {
      // Set a 3-second check interval to ensure we're still listening
      // This helps with browsers that might stop the recognition automatically
      const keepAliveInterval = setInterval(() => {
        if (!listening) {
          // Try to restart if it stopped unexpectedly
          console.log("Attempting to restart speech recognition...");
          SpeechRecognition.startListening({
            continuous: true,
            language: localStorage.getItem("speech")?.toLowerCase() || "en-US",
          });
        }
      }, 3000);

      return () => clearInterval(keepAliveInterval);
    }
  }, [listening, browserSupportsSpeechRecognition, isClient, isChromium]);

  const typeMessage = async (fullText: string, messageId: number) => {
    const words = fullText.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];

      setTypingMessage({
        id: messageId,
        type: "ai",
        text: currentText,
        timestamp: new Date(),
      });

      // Adjust typing speed - faster for short words, slower for long words
      const delay = words[i].length > 6 ? 150 : 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Clear typing message and add to main messages
    setTypingMessage(null);
    const finalMessage: Message = {
      id: messageId,
      type: "ai",
      text: fullText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, finalMessage]);
  };

  const getAIResponse = async (
    userMessage: string,
    chatHistory: Message[]
  ): Promise<string> => {
    try {
      const contextLimit = 9;
      const recentMessages = chatHistory.slice(-contextLimit);
      const contexualMessage = recentMessages
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        }))
        .concat({
          role: "user",
          content: userMessage,
        });

      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          message: JSON.stringify(
            "this is my profile data: " +
              JSON.stringify(profileData) +
              "and this is my conversation history: " +
              JSON.stringify(contexualMessage)
          ),
        }),
      });
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        return "I'm sorry, There was an error processing your request. Please try again.";
      }

      if (Array.isArray(data.response) && data.response[0]?.output) {
        return data.response[0].output;
      } else if (typeof data.response === "string") {
        return data.response;
      } else if (data.response.content || data.response.message) {
        return data.response.content || data.response.message;
      }

      return data.response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    SpeechRecognition.stopListening();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const aiResponseText = await getAIResponse(currentInput, messages);
      setIsTyping(false);

      const messageId = Date.now() + 1;
      await typeMessage(aiResponseText, messageId);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setIsTyping(false);

      const errorResponse: Message = {
        id: Date.now() + 1,
        type: "ai",
        text: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleQuickTemplate = (template: string) => {
    setInputText(`Tell me about ${template.toLowerCase()} for my farm`);
  };

  // Deterministic time formatting to avoid hydration mismatch
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const playLastMessage = (id: number) => {
    const lastMessage = messages.find((msg) => msg.id === id);
    if (lastMessage && lastMessage.type === "ai") {
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      let lang = localStorage.getItem("speech")?.toLocaleLowerCase();
      if (lang === undefined) {
        lang = "hi-IN";
      }
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  // Update input text when transcript changes
  useEffect(() => {
    if (transcript && listening) {
      console.log("Transcript updated:", transcript);
      setInputText(transcript);
    }
  }, [transcript, listening]);

  // Add tooltip or notification when microphone is not available
  useEffect(() => {
    if (isMicrophoneAvailable === false) {
      alert(
        "Microphone access is needed for voice input. Please allow access in your browser settings."
      );
    }
  }, [isMicrophoneAvailable]);

  // Enhanced permission and support checking
  useEffect(() => {
    const checkBrowserSupport = async () => {
      // Check HTTPS requirement for Chromium browsers
      if (
        isChromium &&
        location.protocol !== "https:" &&
        location.hostname !== "localhost"
      ) {
        console.warn("Chromium browsers require HTTPS for speech recognition");
        alert(
          "Speech recognition requires HTTPS in Chromium browsers. Please use HTTPS or try Safari."
        );
        return;
      }

      // Check microphone availability
      if (isMicrophoneAvailable === false) {
        alert(
          "Microphone access is needed for voice input. Please allow access in your browser settings."
        );
        return;
      }

      // For Chromium browsers, explicitly request microphone permission
      if (isChromium && microphonePermission !== "granted") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          console.log("Microphone permission granted");
          // Stop the stream immediately since we just needed permission
          stream.getTracks().forEach((track) => track.stop());
          setMicrophonePermission("granted");
        } catch (error) {
          console.error("Microphone permission denied:", error);
          alert(
            "Microphone permission is required for voice input. Please allow access and refresh the page."
          );
          setMicrophonePermission("denied");
        }
      }
    };

    if (isClient) {
      checkBrowserSupport();
    }
  }, [isMicrophoneAvailable, isChromium, isClient, microphonePermission]);

  const startListening = async () => {
    // Wait for client-side hydration
    if (!isClient) {
      return;
    }

    // Enhanced browser support checking
    if (!browserSupportsSpeechRecognition) {
      let message = "Your browser does not support speech recognition.";
      if (isChromium) {
        message +=
          " Make sure you're using HTTPS and have granted microphone permissions.";
      } else {
        message += " Please try Chrome (with HTTPS) or Safari.";
      }
      alert(message);
      return;
    }

    // Check if we're on HTTPS for Chromium browsers
    if (
      isChromium &&
      location.protocol !== "https:" &&
      location.hostname !== "localhost"
    ) {
      alert(
        "Chromium browsers require HTTPS for speech recognition. Please use HTTPS or try Safari."
      );
      return;
    }

    // For Chromium browsers, ensure microphone permission is granted
    if (isChromium && microphonePermission !== "granted") {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophonePermission("granted");
      } catch (error) {
        console.error("Microphone permission required:", error);
        alert("Please grant microphone permission and try again.");
        return;
      }
    }

    if (listening) {
      console.log("Stopping speech recognition...");
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();

      try {
        console.log("Starting speech recognition...");

        // Enhanced options for better Chromium compatibility
        const options = {
          continuous: true,
          language: localStorage.getItem("speech")?.toLowerCase() || "en-US",
          interimResults: false,
          maxAlternatives: 1,
        };

        // Add Chromium-specific options
        if (isChromium) {
          options.interimResults = true; // Better for Chromium browsers
          options.maxAlternatives = 1;
          // Use more specific language code for Chromium
          if (!options.language.includes("-")) {
            options.language =
              options.language === "en"
                ? "en-US"
                : options.language === "hi"
                ? "hi-IN"
                : options.language + "-US";
          }

          // Add a small delay for Chromium browsers to ensure proper initialization
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await SpeechRecognition.startListening(options);

        console.log("Speech recognition active - speak now");

        // Focus input field
        setTimeout(() => {
          const inputField = document.querySelector("input");
          if (inputField) {
            inputField.focus();
          }
        }, 100);
      } catch (error) {
        console.error("Error starting speech recognition:", error);

        let errorMessage = "There was an error starting speech recognition.";
        if (isChromium) {
          errorMessage +=
            " Make sure you're using HTTPS and have granted microphone permissions.";
        }
        errorMessage += " Please try again.";

        alert(errorMessage);
      }
    }
  };

  return (
    <div
      className="p-6 flex flex-col gap-6 mx-auto fade-in-5 animate-in duration-300"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg">
        <div className="p-2 rounded-lg bg-green-500/10">
          <Stars size={40} className="text-3xl text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">AgriVerse AI Assistant</span>
          <p className="text-sm">
            Get instant farming insights powered by real-time data and AI
          </p>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex flex-col gap-3 grow overflow-y-scroll pr-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "ai" && (
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-6 text-green-600" />
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl border ${
                message.type === "user"
                  ? "bg-bluish-bg text-bluish-text border-bluish-border"
                  : "bg-greenish-bg text-greenish-text border-greenish-border"
              }`}
            >
              {message.type === "ai" ? (
                <div className="text-md prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc ml-4 mb-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-4 mb-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-md">{message.text}</p>
              )}
              <div className="flex items-end justify-between">
                <p className={`text-xs mt-1 text-muted-foreground`}>
                  {formatTime(message.timestamp)}
                </p>
                {message.type === "ai" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => playLastMessage(message.id)}
                    className="text-muted-foreground hover:text-black dark:hover:text-white"
                    aria-label="Play message"
                  >
                    <Volume2 size={16} />
                  </Button>
                )}
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            )}
          </div>
        ))}

        {typingMessage && (
          <div className="flex gap-3 animate-in slide-in-from-bottom-5 duration-300">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-6 text-green-600" />
            </div>
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl border bg-greenish-bg text-greenish-text border-greenish-border">
              <div className="text-md prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-4 mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-4 mb-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                  }}
                >
                  {typingMessage.text + "|"}
                </ReactMarkdown>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                {formatTime(typingMessage.timestamp)}
              </p>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-in slide-in-from-bottom-5">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-6 text-green-600" />
            </div>
            <div className="border px-4 py-3 rounded-2xl bg-green-50 border-green-200 text-green-800">
              <div className="flex gap-1 justify-center items-end">
                <p className={`text-sm`}>Thinking </p>
                <div className="w-1 h-1 bg-green-800 rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-green-800 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-green-800 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { text: "Crop health", icon: "🌱" },
            { text: "Weather concerns", icon: "🌤️" },
            { text: "Market prices", icon: "💰" },
            { text: "Irrigation advice", icon: "💧" },
            { text: "Fertilizer guidance", icon: "🧪" },
            { text: "Pest control", icon: "🐛" },
          ].map((template) => (
            <Button
              key={template.text}
              variant="outline"
              size="sm"
              onClick={() => handleQuickTemplate(template.text)}
              className="gap-2 hover:scale-105 transition-all duration-200 border-green-200 hover:border-green-300 hover:bg-green-50"
            >
              <span className="text-base">{template.icon}</span>
              {template.text}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              listening
                ? "Speak now..."
                : "Ask about crop health, weather, market prices, irrigation..."
            }
            className="flex-1 focus:border-green-400 focus:ring-green-400/20"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant={listening ? "default" : "outline"}
            size="icon"
            className={
              listening
                ? "bg-red-600 hover:bg-red-700 animate-pulse transition-all duration-200"
                : isClient && browserSupportsSpeechRecognition
                ? "border-green-200 hover:bg-green-50 hover:border-green-300"
                : "border-gray-300 bg-gray-100 cursor-not-allowed"
            }
            aria-label={listening ? "Stop voice input" : "Start voice input"}
            onClick={startListening}
            disabled={!isClient || !browserSupportsSpeechRecognition}
            title={
              !isClient
                ? "Loading..."
                : !browserSupportsSpeechRecognition
                ? "Speech recognition not supported"
                : listening
                ? "Stop listening"
                : "Start voice input"
            }
          >
            {listening ? (
              <MicOff className="h-4 w-4 text-white" />
            ) : (
              <Mic
                className={`h-4 w-4 ${
                  !isClient || !browserSupportsSpeechRecognition
                    ? "text-gray-400"
                    : ""
                }`}
              />
            )}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-green-600 hover:bg-green-700 hover:shadow-xl transition-all duration-200"
          >
            <Send className="h-4 w-4" />
            {listening ? "Send Voice Message:" : "Ask AI"}
          </Button>
        </div>
      </div>
    </div>
  );
}
