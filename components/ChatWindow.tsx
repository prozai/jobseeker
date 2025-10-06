import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (input: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${theme.background.main} p-4 overflow-hidden`}>
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 -mr-2">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center justify-start space-x-2 p-4">
              <div className={`h-2 w-2 ${theme.loading.background} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
              <div className={`h-2 w-2 ${theme.loading.background} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
              <div className={`h-2 w-2 ${theme.loading.background} rounded-full animate-bounce`}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 border-t border-slate-700 pt-4">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask for jobs, e.g., 'Find remote React jobs in Europe'..."
            className={`w-full ${theme.background.input} rounded-lg p-3 pr-12 border border-slate-600 focus:ring-2 ${theme.accent.focusRing} ${theme.accent.border} transition resize-none`}
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`absolute right-3 bottom-3 text-slate-400 hover:${theme.accent.text} disabled:text-slate-600 disabled:cursor-not-allowed transition-colors`}
            aria-label="Send message"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;