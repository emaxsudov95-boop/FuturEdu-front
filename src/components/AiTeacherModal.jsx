import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, Lightbulb, Smile } from 'lucide-react';
import { aiAPI } from '../services/api';

const AiTeacherModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Salom, mening sevimli oʻquvchim! 👋 Men sening Yoqimli AI Ustozingman. Tushunmagan mavzuing bormi yoki yangi narsani oʻrganmoqchimisan? Menga istalgan savolingni ber!',
      time: 'Hozir'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Pifagor teoremasini sodda tushuntir 📐",
    "Dasturlashni nimadan boshlay? 💻",
    "Kunlik motivatsiya ber! 🚀",
    "Nyuton olmasi nega tushgan? 🍎"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(text);
      if (res.data?.reply) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Uzr, kichik texnik toʻsiq boʻldi. Lekin men seni doim qoʻllab-quvvatlayman! Yana bir bor urinib koʻr-chi! 🌟',
          time: 'Hozir'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white rounded-full shadow-xl shadow-brand-500/35 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-float"
        >
          <div className="relative">
            <span className="text-xl sm:text-2xl animate-bounce-slow">🤖</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold leading-tight">Yoqimli AI Ustoz</span>
            <span className="block text-[10px] text-brand-200">Savoling bormi?</span>
          </div>
        </button>
      )}

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:bottom-6 sm:right-6 z-50 w-[96vw] sm:w-[420px] max-h-[80vh] h-[75vh] sm:h-[85vh] sm:max-h-[620px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                🤖
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <img src="/logo.png" alt="FuturEdu" className="w-5 h-5 object-contain" />
                  <span>FuturEdu AI Ustoz</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </h3>
                <span className="text-xs text-brand-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Suhbatga tayyorman!
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-brand-500/20'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-brand-200' : 'text-slate-600'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full border border-brand-200 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ustozga savolingizni yozing..."
              className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl text-xs sm:text-sm focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default AiTeacherModal;
