'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat({ url }: { url: string }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (input: string) => {
    if (!input.trim()) {
      return;
    }

    const newMessages = [
      ...messages,
      { role: 'user' as const, content: input },
    ];

    setMessages(newMessages);
    
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();

      if (data?.message) {
        setMessages([...newMessages, data.message]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-50 mb-2">AI Chat</h1>
        </div>

        <div style={{ marginBottom: 20 }}>
          {messages.map((m, i) => (
            <div key={i}>
              <b>{m.role}:</b> {m.content}
            </div>
          ))}
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendMessage(input);
          }}
          className="mb-6 bg-gray-900 rounded-lg shadow-md p-6"
        >
          <div className="flex flex-col gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-gray-300"
              placeholder="Write message..."
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
