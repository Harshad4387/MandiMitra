import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";

const GroqChatbot = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askGroq = async () => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/chatbot/groq", { text });
      const botReply = res.data?.reply || "No reply received.";
      const botMessage = { sender: "bot", content: botReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", content: "Error contacting Groq API." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askGroq();
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.header}>
        <strong>SupplySathi</strong> - Your Vendor Assistant 💡
      </h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#e3f2fd" : "#ffffff",
              border: msg.sender === "user" ? "1px solid #90caf9" : "1px solid #e0e0e0",
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, alignSelf: "flex-start" }}>
            Typing...
          </div>
        )}
      </div>

      <div style={styles.inputBox}>
        <textarea
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button style={styles.sendButton} onClick={askGroq} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "500px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #dcdcdc",
    borderRadius: "12px",
    overflow: "hidden",
    fontFamily: "Segoe UI, sans-serif",
    height: "600px",
    background: "#f9f9f9",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  header: {
    background: "#1976d2", // professional blue
    color: "#ffffff",
    margin: 0,
    padding: "14px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "600",
  },
  chatBox: {
    flex: 1,
    padding: "12px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#f0f4f8",
  },
  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: "10px",
    wordWrap: "break-word",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
  },
  inputBox: {
    display: "flex",
    padding: "12px",
    background: "#ffffff",
    borderTop: "1px solid #dcdcdc",
  },
  input: {
    flex: 1,
    resize: "none",
    borderRadius: "20px",
    border: "1px solid #ccc",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    background: "#fefefe",
    fontFamily: "inherit",
  },
  sendButton: {
    marginLeft: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default GroqChatbot;
