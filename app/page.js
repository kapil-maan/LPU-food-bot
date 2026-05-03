"use client";


import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "🍕 Which pizza place is cheapest?",
  "🥗 Best veg options under ₹60?",
  "🍜 Compare Chinese stalls",
  "⭐ What's the best rated place?",
  "🌅 What's open for breakfast?",
  "💰 Budget meal under ₹50?",
];

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your LPU Food Guide. Ask me anything about food places on campus — prices, comparisons, recommendations, timings, and more! 🍽️",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role !== "system"),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🍽️</span>
            <div>
              <h1 className="logo-title">LPU Food Guide</h1>
              <p className="logo-subtitle">Campus Food AI Assistant</p>
            </div>
          </div>
          <div className="status-badge">
            <span className="status-dot" />
            8 Food Places
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="chat-main">
        <div className="messages-container">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message-row ${msg.role === "user" ? "user-row" : "bot-row"}`}
            >
              {msg.role === "assistant" && (
                <div className="avatar bot-avatar">🤖</div>
              )}
              <div
                className={`bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}
              >
                {msg.content.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="avatar user-avatar">👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message-row bot-row">
              <div className="avatar bot-avatar">🤖</div>
              <div className="bubble bot-bubble typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested questions (show only at start) */}
        {messages.length <= 1 && (
          <div className="suggestions">
            <p className="suggestions-label">Try asking:</p>
            <div className="suggestions-grid">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Input bar */}
      <div className="input-bar">
        <div className="input-inner">
          <textarea
            className="input-field"
            placeholder="Ask about food places, prices, or comparisons..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className={`send-btn ${loading || !input.trim() ? "send-btn-disabled" : ""}`}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "➤"}
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
