import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Wrench, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

interface FixItAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPostProblem: (initialText: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const FixItAssistantDrawer: React.FC<FixItAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onPostProblem
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Welcome to FixIt Shashemene. Describe what needs fixing \u2014 plumbing, electrical, car, phone, or appliance \u2014 and this will diagnose the issue and match you with nearby verified workers in Arada, Awasho, Bole, and surrounding neighborhoods."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user' as const, text: text.trim() }];
    setMessages(newMsgs);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.chatWithAIAssistant({
        message: text.trim(),
        conversationHistory: newMsgs
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.reply }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I can help connect you with verified tradespeople in Shashemene! Would you like to create a service request now?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickSuggestions = [
    'My kitchen sink pipe is leaking',
    'Main electrical breaker is tripping',
    'Phone screen is cracked and unresponsive',
    'Car engine makes strange knocking noise'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#141414] shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300 text-[#F5F5F7]">
      {/* Header */}
      <div className="bg-[#1C1C1E] border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF5C00] text-black flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">FixIt Assistant</h3>
            <p className="text-[10px] text-[#FF5C00]">Local Service Concierge</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notice */}
      <div className="bg-[#1C1C1E]/50 px-3.5 py-2 border-b border-white/5 text-[11px] text-white/50 flex items-center justify-between">
        <span>Assists with local diagnosis & worker discovery.</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0A0A0A]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-[#FF5C00] text-black flex items-center justify-center text-xs shrink-0 mt-1">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[82%] text-xs p-3.5 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-white text-black font-medium rounded-br-none shadow-md'
                  : 'bg-[#1C1C1E] text-white/90 border border-white/10 rounded-bl-none shadow-md leading-relaxed space-y-2'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* If assistant suggests requesting */}
              {m.role === 'assistant' && idx > 0 && (
                <button
                  onClick={() => {
                    const lastUserMsg = messages
                      .slice()
                      .reverse()
                      .find((msg) => msg.role === 'user');
                    onPostProblem(lastUserMsg ? lastUserMsg.text : 'Need repair in Shashemene');
                    onClose();
                  }}
                  className="mt-2 w-full py-1.5 px-3 bg-[#FF5C00]/15 hover:bg-[#FF5C00]/25 text-[#FF5C00] border border-[#FF5C00]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Start Request with this problem</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-white/40 italic">
            <div className="w-7 h-7 rounded-xl bg-[#FF5C00] text-black flex items-center justify-center text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Looking into that...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-[#141414] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0">Try:</span>
        {quickSuggestions.map((qs, i) => (
          <button
            key={i}
            onClick={() => handleSend(qs)}
            className="shrink-0 bg-[#1C1C1E] hover:bg-white/10 text-white/70 hover:text-white border border-white/5 px-2.5 py-1 rounded-full transition cursor-pointer"
          >
            {qs}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#1C1C1E] border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask FixIt Assistant..."
          className="flex-1 text-xs bg-[#141414] text-white border border-white/10 focus:border-[#FF5C00]/50 rounded-xl px-3.5 py-2.5 outline-hidden transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-2.5 rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 text-black transition shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
