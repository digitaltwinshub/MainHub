import React, { useState } from 'react';

function getContextProjects() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const stored = JSON.parse(window.localStorage.getItem('dt_projects') || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.slice(0, 20).map((p) => ({
      title: p.title,
      category: p.category,
      goal: p.goal,
      keyFeatures: p.keyFeatures,
      impactData: p.impactData,
      tools: p.tools,
    }));
  } catch {
    return [];
  }
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const projects = getContextProjects();

    try {
const res = await fetch('http://localhost:5001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: trimmed, projects }),
});

      if (!res.ok) {
        throw new Error('Chat request failed');
      }

      const data = await res.json();
      const answer = data && data.answer
        ? data.answer
        : 'The assistant could not generate a response. Please check the backend /api/chat implementation.';

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'There was a problem contacting the AI assistant backend. Please ensure the /api/chat endpoint is running and reachable.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-black text-white px-4 py-2 shadow-lg text-sm md:text-base"
          style={{ fontFamily: 'Poppins, ui-sans-serif' }}
        >
          Ask Digital Twins AI
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div>
              <div className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                Digital Twins Assistant
              </div>
              <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
                Ask about ideas, tools, or how to structure a twin
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
            {messages.length === 0 && (
              <div className="text-xs text-gray-500">
                Example questions:
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>Suggest a new digital twin project using energy data.</li>
                  <li>How can I extend an existing project into a city-scale twin?</li>
                  <li>What tools are good for GIS-based digital twins?</li>
                </ul>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl bg-black text-white px-3 py-2 whitespace-pre-wrap'
                    : 'mr-auto max-w-[85%] rounded-2xl bg-gray-100 text-gray-900 px-3 py-2 whitespace-pre-wrap'
                }
              >
                {m.content}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-gray-100 text-gray-500 px-3 py-2 text-xs">
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-200 px-2 py-2 flex items-center gap-2">
            <input
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ask something about digital twins..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-black text-white text-sm px-3 py-2 disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
