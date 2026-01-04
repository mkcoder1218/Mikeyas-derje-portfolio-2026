
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const TypingMessage: React.FC<{ content: string }> = ({ content }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + content[index]);
        setIndex(prev => prev + 1);
      }, 10); // Adjust speed here
      return () => clearTimeout(timeout);
    }
  }, [index, content]);

  return <span>{displayedText}</span>;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello. I'm Mikeyas's AI representative. How can I help you learn more about his professional work?", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const responseText = await getChatResponse(inputValue, history);
    
    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border ${isOpen ? 'bg-white text-zinc-950 border-white' : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-600'}`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-lg`}></i>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-zinc-950 border border-zinc-800 flex flex-col shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <i className="fas fa-robot text-xs"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">AI Assistant</h3>
                  <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] text-sm px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'}`}>
                    {msg.role === 'assistant' ? (
                      <TypingMessage content={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-zinc-900 px-4 py-3 rounded-2xl border border-zinc-800">
                      <div className="flex gap-1">
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-zinc-600 rounded-full"></motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-zinc-600 rounded-full"></motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-zinc-600 rounded-full"></motion.div>
                      </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-zinc-900">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="w-full bg-zinc-900 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none border border-zinc-800"
                />
                <button onClick={handleSendMessage} className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <i className="fas fa-arrow-up text-xs"></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
