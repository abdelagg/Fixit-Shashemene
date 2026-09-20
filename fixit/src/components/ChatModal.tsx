import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, CheckCheck, Clock, MapPin, Sparkles } from 'lucide-react';
import { ServiceRequest, Message, UserRole } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ChatModalProps {
  request: ServiceRequest;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ request, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.getMessages(request.id);
      setMessages(res.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [request.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !user) return;

    const isWorker = user.role === 'worker';
    const receiverId = isWorker ? request.customerId : (request.workerId || 'user_work_1');

    try {
      setLoading(true);
      const res = await api.sendMessage({
        requestId: request.id,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        receiverId,
        message: text.trim()
      });
      setMessages((prev) => [...prev, res.message]);
      setInputText('');
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cannedResponses =
    user?.role === 'worker'
      ? [
          "Salam! I'm on my way to your location.",
          'Could you confirm your exact house/building number?',
          'I have the necessary tools and spare parts ready.',
          'I have arrived outside your house.'
        ]
      : [
          'Hello! We are at the house right now.',
          'The water/power has been turned off safely.',
          'Let me know when you reach the main road.',
          'Thank you for the quick response!'
        ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-[#F5F5F7]">
      <div
        id="chat-modal-container"
        className="bg-[#141414] w-full max-w-lg rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#1C1C1E] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5C00] flex items-center justify-center text-black font-extrabold">
              {user?.role === 'worker'
                ? request.customerName.charAt(0)
                : (request.workerName || 'W').charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {user?.role === 'worker' ? request.customerName : (request.workerName || 'Assigned Worker')}
              </h3>
              <p className="text-[11px] text-[#FF5C00] flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Shashemene, {request.location.neighborhood}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Job Context banner */}
        <div className="bg-[#1C1C1E]/60 px-4 py-2 border-b border-white/5 text-xs text-white/70 flex items-center justify-between">
          <span className="font-medium truncate max-w-[70%] text-white">Job: {request.title}</span>
          <span className="text-[10px] font-extrabold uppercase bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30 px-2 py-0.5 rounded-md">
            {request.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-xs text-white/40">
              No messages yet. Send a message to coordinate your Shashemene service request!
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderId === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-white/40 mb-0.5 px-1">
                    {isMine ? 'You' : m.senderName}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      isMine
                        ? 'bg-white text-black font-medium rounded-br-none shadow-md'
                        : 'bg-[#1C1C1E] text-white/90 border border-white/10 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p className="leading-relaxed">{m.message}</p>
                    <div
                      className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                        isMine ? 'text-black/60' : 'text-white/40'
                      }`}
                    >
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3 text-[#FF5C00]" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Canned Responses */}
        <div className="px-3 py-2 bg-[#141414] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0">Quick:</span>
          {cannedResponses.map((cr, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(cr)}
              className="shrink-0 bg-[#1C1C1E] hover:bg-white/10 text-white/70 hover:text-white border border-white/5 px-2.5 py-1 rounded-full transition cursor-pointer"
            >
              {cr}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#1C1C1E] border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
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
    </div>
  );
};
