import React, { useState, useEffect } from "react";

const AskAIModal = ({ isOpen, onClose }) => {
  const steps = [
    { q: "What is your travel preference?", options: ["Adventure", "Relax", "Culture"] },
    { q: "What is your destination?", input: true },
    { q: "How many people are going?", input: true },
    { q: "What is your budget?", options: ["Cheap", "Moderate", "Luxury"] },
    { q: "Choose your travel style", options: ["Just Before", "Just Travel", "Next Adventure"] },
    { q: "How many days are you going?", input: true },
    { q: "Preferred transport?", options: ["Bus", "Train", "Flight"] },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m Trevo AI, your trip planner. Let’s plan your trip step by step!" },
  ]);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAnswers({});
      setMessages([
        { sender: "bot", text: "👋 Hi! I’m Trevo AI, your trip planner. Let’s plan your trip step by step!" },
      ]);
    }
  }, [isOpen]);

  const handleAnswer = (value) => {
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: value }]);
    setAnswers((prev) => ({ ...prev, [step]: value }));
    setPrompt("");

    if (step + 1 < steps.length) {
      setStep(step + 1);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: steps[step + 1].q }]);
      }, 500);
    } else {
      setStep(steps.length);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `🎉 Here’s your travel package:
- Preference: ${answers[0] || value}
- Destination: ${answers[1]}
- People: ${answers[2]}
- Budget: ${answers[3]}
- Style: ${answers[4]}
- Days: ${answers[5]}
- Transport: ${answers[6] || value}`,
          },
        ]);
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl w-[95%] max-w-3xl relative animate-fade-in-up flex flex-col h-[90vh]">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3 text-center text-zinc-800 dark:text-zinc-100">
          Trevo AI 🤖
        </h2>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 scrollbar-thin scrollbar-thumb-[#6A5ACD]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                    alt="bot"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
                    msg.sender === "user"
                      ? "bg-purple-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="user"
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Input / Options */}
          <div className="mt-3 flex flex-col gap-2">
            {step < steps.length && steps[step].options && (
              <div className="flex flex-wrap gap-2">
                {steps[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {step < steps.length && steps[step].input && (
              <div className="flex items-center gap-2">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type here..."
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 
                             bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-white 
                             outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => handleAnswer(prompt)}
                  disabled={prompt.trim() === ""}
                  className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default AskAIModal;
