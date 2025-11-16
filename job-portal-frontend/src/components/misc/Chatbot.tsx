import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  MessageSquareText, X } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function FancyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I help you today?" },
    { sender: "user", text: "Tell me about your services." },
    { sender: "bot", text: "We provide web development, SEO, and UI/UX design." },
    { sender: "user", text: "What are your pricing plans?" },
    { sender: "bot", text: "Our pricing varies depending on project scope. Basic packages start at $500." },
    { sender: "user", text: "Do you offer support?" },
    { sender: "bot", text: "Yes! We provide 24/7 support via chat and email." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      
      let reply = "Sorry, I didn't understand that.";
      const userText = input.toLowerCase();

      if (userText.includes("services")) reply = "We provide web development, SEO, and UI/UX design.";
      else if (userText.includes("pricing")) reply = "Our pricing depends on project scope. Basic packages start at $500.";
      else if (userText.includes("support")) reply = "Yes! We provide 24/7 support via chat and email.";
      else if (userText.includes("contact")) reply = "You can contact us via email or our contact form on the website.";
      else if (userText.includes("hours")) reply = "Our working hours are 9 AM to 6 PM, Monday to Friday.";

      const botMsg: Message = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="bg-indigo-600 p-4 rounded-full shadow-lg text-white flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquareText className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mt-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-indigo-600 p-4 flex items-center gap-3 rounded-t-2xl">
              <MessageSquareText className="w-8 h-8 text-white" />
              <h2 className="text-white font-bold text-lg">Chatbot Assistant</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[75%] break-words text-white ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "bg-gradient-to-r from-gray-300 to-gray-400 text-black"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl px-4 py-2 bg-gray-300 text-black max-w-[40%] animate-pulse">
                      Typing...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex p-3 border-t border-gray-200 gap-2">
              <input
                type="text"
                className="flex-1 rounded-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-700 transition-colors"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
