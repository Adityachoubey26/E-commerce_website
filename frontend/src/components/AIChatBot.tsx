'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Mic, MicOff, RefreshCw, AlertCircle, Headphones } from 'lucide-react';
import API from '../utils/api';
import { ChatMessage } from '../../../shared/types';

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I am ShopEra's Neural Assistant. I can recommend premium products, compare specifications, and answer store policies. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice UI States
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('Listening to your voice...');
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Recommend a flagship smartphone',
    'Compare top smart watches',
    'Explain ShopEra Loyalty Tokens',
    'Any active discount coupon codes?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data } = await API.post('/ai/chat', {
        message: textToSend,
        history: chatHistory
      });

      if (data.success) {
        const modelMsg: ChatMessage = {
          id: Math.random().toString(),
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMsg]);
      } else {
        throw new Error('AI Error');
      }
    } catch (error) {
      console.error('Failed to chat with AI:', error);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        content: "I'm having trouble connecting right now. Please check your network or try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate Voice input recognition
  const startVoiceInput = () => {
    setIsListening(true);
    setVoiceText('Listening for your query...');
    
    // Simulate speech recognition results after 3 seconds
    voiceTimeoutRef.current = setTimeout(() => {
      const mockQueries = [
        'Recommend a flagship smartphone',
        'Compare top smart watches',
        'Tell me about ShopEra Wallet cashback benefits'
      ];
      const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
      setVoiceText(`Recognized: "${randomQuery}"`);
      
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage(randomQuery);
      }, 1000);
    }, 3000);
  };

  const stopVoiceInput = () => {
    if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
    setIsListening(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      
      {/* 3D Animated Robot Head Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-slate-950 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-500/30 relative cursor-pointer group overflow-hidden"
        whileHover={{ scale: 1.05, borderColor: '#6366f1' }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-violet-950/20 to-transparent" />
        
        {/* Animated robot eyes and head elements */}
        <div className="relative w-6 h-6 flex flex-col items-center justify-center space-y-0.5">
          {/* Antenna */}
          <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
          <div className="w-0.5 h-0.5 bg-indigo-400" />
          
          {/* Face */}
          <div className="w-5 h-3.5 rounded bg-slate-800 border border-slate-700 relative flex items-center justify-around px-0.5 shadow-inner group-hover:border-indigo-400 transition-colors">
            {/* Eyes */}
            <div className="w-1 h-1 rounded-full bg-cyan-400 z-10" />
            <div className="w-1 h-1 rounded-full bg-cyan-400 z-10" />
          </div>
          
          {/* Neck */}
          <div className="w-1.5 h-0.5 bg-slate-700 rounded-sm" />
        </div>
      </motion.button>

      {/* Futuristic Perplexity-inspired Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] h-[520px] rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-slate-100"
          >
            {/* Glowing top line */}
            <div className="h-[2px] bg-gradient-to-r from-primary via-secondary to-pink-500 w-full" />

            {/* Panel Header */}
            <div className="p-5 bg-slate-900/50 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                {/* 3D Robot miniature */}
                <div className="w-10 h-10 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center relative">
                  <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full absolute -top-0.5 -right-0.5 animate-pulse" />
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs tracking-wider uppercase">ShopEra AI Assistant</h3>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    Neural Engine Active
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div
                      className={`p-4 rounded-2xl text-[11px] leading-relaxed border ${
                        msg.role === 'user'
                          ? 'bg-primary text-white border-primary rounded-tr-none shadow-md'
                          : 'bg-white/5 border-white/5 rounded-tl-none text-slate-200'
                      }`}
                    >
                      {msg.content.split('\n').map((line, idx) => (
                        <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 block px-1 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-5 py-3 border-t border-white/5 bg-slate-900/25">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                  Popular Queries
                </span>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s)}
                      className="text-left text-[10px] bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 hover:bg-white/10 transition-all cursor-pointer font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated Voice UI Overlay */}
            {isListening && (
              <div className="p-5 border-t border-white/5 bg-indigo-950/20 text-center space-y-4">
                <div className="flex items-center justify-center gap-1.5 h-8">
                  {/* CSS audio waveform bars */}
                  {[0.5, 0.9, 0.6, 0.8, 0.4, 0.9, 0.5, 0.7, 0.3].map((val, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ scaleY: [1, val * 3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.05 }}
                      className="w-1 bg-indigo-500 rounded-full origin-center h-2.5"
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-350 font-bold font-mono">{voiceText}</p>
                <button
                  type="button"
                  onClick={stopVoiceInput}
                  className="px-4 py-1.5 bg-rose-500/25 text-rose-400 rounded-full font-bold text-[9px] hover:bg-rose-500/35 transition-colors cursor-pointer border border-rose-500/10"
                >
                  Cancel Voice Recognition
                </button>
              </div>
            )}

            {/* Input Form & Microphone */}
            {!isListening && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="p-4 border-t border-white/5 bg-slate-900/40 flex gap-2.5 items-center"
              >
                {/* Voice button */}
                <button
                  type="button"
                  onClick={startVoiceInput}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-slate-400 hover:text-indigo-400 cursor-pointer"
                  title="Speak to Assistant"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask neural model a product query..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-primary hover:bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
