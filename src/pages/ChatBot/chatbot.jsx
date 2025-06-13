/* eslint-disable no-unused-vars */
// src/components/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 How can I help you find what you're looking for today?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { text: trimmed, sender: "user" }]);
    setInputText("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CHAT_API_URL}api/chat`,
        { message: trimmed }
      );

      const reply = res.data.message;
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <aside className="w-1/2 bg-[#001F54] flex flex-col justify-center px-16">
        <h1 className="text-5xl font-bold text-white mb-4">
          Chatbot for customer service
        </h1>
        <p className="text-lg text-gray-300">
          I&apos;m always here if you need more help. Happy shopping!
        </p>
      </aside>

      {/* Right Panel */}
      <main className="w-1/2 flex flex-col p-8 bg-white">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-lg px-4 py-2 rounded-2xl ${
                m.sender === "user"
                  ? "bg-[#001F54] text-white self-end rounded-br-none"
                  : "bg-gray-200 text-gray-800 self-start rounded-tl-none"
              }`}
            >
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-600 underline hover:text-blue-800 font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <div>
          <div className="bg-gray-200 rounded-full flex items-center h-14 px-6">
            <input
              type="text"
              className="flex-grow bg-transparent placeholder-gray-500 focus:outline-none"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <span className="text-gray-500 mr-4 lowercase">send</span>
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full focus:outline-none cursor-pointer"
            >
              <PaperAirplaneIcon className="h-5 w-5 text-white " />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
