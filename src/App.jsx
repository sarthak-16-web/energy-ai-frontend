import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("https://energy-ai-sarthak.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "agent", text: data.answer || "No response" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Server error" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">⚡ Energy AI</div>

        <div className="nav-center">
          <span>Dashboard</span>
          <span>Customers</span>
          <span>Docs</span>
        </div>

        <div className="nav-right">
          <button className="btn-secondary">Login</button>
          <button className="btn-primary">Logout</button>
        </div>
      </header>

      {/* MAIN */}
      <div className="layout">

        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <h3>History</h3>
          <div className="list">
            <span>Solar energy</span>
            <span>Wind power</span>
            <span>Hydro energy</span>
          </div>
        </aside>

        {/* CHAT */}
        <main className="chat-area">
          <div className="chat-container">

            {messages.length === 0 && (
              <div className="empty-state">
                <h2>Ask anything about energy ⚡</h2>
                <p>Start a conversation with your AI assistant</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.role}`}>
                <div className="chat-bubble">
                  {msg.text.replace(/\*\*/g, "")}
                </div>
              </div>
            ))}

            {loading && <div className="typing">AI is thinking...</div>}
            <div ref={chatEndRef}></div>

          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="sidebar">
          <h3>Team</h3>
          <div className="list">
            <span>Khushi</span>
            <span>Zaid</span>
            <span>Rishabh</span>
            <span>Sakshi</span>
            <span>Sarthak</span>
          </div>
        </aside>

      </div>

      {/* FOOTER INPUT */}
      <footer className="footer">
        <div className="input-box">
          <input
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </footer>

    </div>
  );
}

export default App;
