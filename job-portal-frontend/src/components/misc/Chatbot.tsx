import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hello! I am Assistant 🤖" },
  ]);

  const sendMessage = () => {
    setMsgs([...msgs, { from: "user", text }]);
    setText("");

    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: "Thanks for the message!" }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 h-80 bg-white dark:bg-gray-900 shadow-lg p-4 rounded-md flex flex-col">
          <div className="flex-1 overflow-auto">
            {msgs.map((m, i) => (
              <p key={i} className={`${m.from === "user" ? "text-right" : ""}`}>
                {m.text}
              </p>
            ))}
          </div>

          <div className="flex gap-1 mt-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border p-2"
            />
            <button onClick={sendMessage} className="p-2 bg-indigo-500 text-white">
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="p-3 bg-indigo-600 text-white rounded-full shadow-lg"
      >
        💬
      </button>
    </div>
  );
}
