import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios"; // adjust if needed

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
      <h2 style={styles.header}><strong>SupplySathi</strong> - Your Vendor Assistant 💡</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#b2dfdb" : "#f0ebe3",
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div style={{ ...styles.message, alignSelf: "flex-start" }}>Typing...</div>}
      </div>

      <div style={styles.inputBox}>
        <textarea
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
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
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    fontFamily: "sans-serif",
    height: "600px",
    background: "#f5f9f7", // soft ivory-green
  },
  header: {
    background: "#00695c", // deep teal
    color: "white",
    margin: 0,
    padding: "12px",
    textAlign: "center",
    fontSize: "18px",
  },
  chatBox: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#e0f2f1", // subtle greenish-blue
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    wordWrap: "break-word",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  inputBox: {
    display: "flex",
    padding: "10px",
    background: "#e8f5e9", // soft light green
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    resize: "none",
    borderRadius: "20px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
    outline: "none",
  },
  sendButton: {
    marginLeft: "10px",
    backgroundColor: "#00796b", // slightly lighter teal
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default GroqChatbot;
