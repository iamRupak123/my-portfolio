import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"  



function RupakAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Rupak AI. Ask me anything about Rupak's skills, projects, education, or experience.",
    },
  ])

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  const suggestions = [
    "Tell me about Rupak",
    "What are his skills?",
    "Show me his projects",
    "Tell me about his AI projects",
  ]

  const sendMessage = async (question = input) => {
    const text = question.trim()

    if (!text || isLoading) return

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ])

    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          className="rupak-ai-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Rupak AI"
        >
          <span className="ai-button-glow"></span>
          <span className="ai-button-icon">✦</span>
          <span className="ai-button-text">Rupak AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="rupak-ai-window">
          <div className="rupak-ai-header">
            <div className="ai-header-info">
              <div className="ai-avatar">
                ✦
              </div>

              <div>
                <h3>Rupak AI</h3>
                <span>
                  <i></i>
                  Online
                </span>
              </div>
            </div>

            <button
              className="ai-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="rupak-ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${
                  message.role === "user"
                    ? "ai-user-message"
                    : "ai-bot-message"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="message-avatar">✦</div>
                )}
<div className="message-bubble">
  <ReactMarkdown>
    {message.text}
  </ReactMarkdown>
</div>
              </div>
            ))}

            {isLoading && (
              <div className="ai-message ai-bot-message">
                <div className="message-avatar">✦</div>

                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="ai-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            className="rupak-ai-input"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
            >
              ↑
            </button>
          </form>

          <div className="ai-footer">
            Powered by AI • About Rupak
          </div>
        </div>
      )}
    </>
  )
}

export default RupakAI