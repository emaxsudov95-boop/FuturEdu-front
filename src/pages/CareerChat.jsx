import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Pin, 
  Compass, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  Smile,
  Hash,
  ArrowRight,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CareerChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // O'quvchining kasbi
  const diagnosedCareer = localStorage.getItem('user_diagnosed_career') || user?.selectedCareer || null;

  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Kasb nomidan slug chiqarish
  const getSlug = (title) => {
    if (!title) return 'ai-engineer';
    const lower = title.toLowerCase();
    if (lower.includes('intellekt') || lower.includes('ai')) return 'ai-engineer';
    if (lower.includes('dastur') || lower.includes('web') || lower.includes('software')) return 'software-engineer';
    if (lower.includes('shifokor') || lower.includes('doctor') || lower.includes('jarroh')) return 'doctor-surgeon';
    if (lower.includes('kiber') || lower.includes('cyber') || lower.includes('xavfsizlik')) return 'cyber-security';
    if (lower.includes('arxitekt') || lower.includes('dizayn') || lower.includes('architect')) return 'architect-designer';
    return 'ai-engineer';
  };

  const careerSlug = getSlug(diagnosedCareer);

  // Chat xabarlarini yuklash
  const fetchMessages = async (silent = false) => {
    if (!diagnosedCareer) return;
    if (!silent) setLoading(true);
    try {
      const res = await chatAPI.getCareerChat(careerSlug);
      if (res.data?.data) {
        setChatData(res.data.data);
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Har 4 soniyada yangi xabarlarni yangilab turish (jonli chat simulyatsiyasi)
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [diagnosedCareer, careerSlug]);

  // Har yangi xabar kelganda pastga aylantirish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Xabar yuborish
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const optimisticMsg = {
      id: tempId,
      senderName: user?.name || "Men (Oʻquvchi)",
      senderAvatar: user?.avatar || "🦁",
      senderRole: `${user?.grade || '9-sinf'} • Boʻlajak mutaxassis`,
      text: messageText,
      time: timeStr,
      isPinned: false
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await chatAPI.sendMessage(careerSlug, {
        text: messageText,
        senderName: user?.name || "Men",
        senderAvatar: user?.avatar || "🦁",
        senderRole: `${user?.grade || '9-sinf'} oʻquvchisi`
      });

      if (res.data?.data) {
        setMessages(prev => prev.map(m => m.id === tempId ? res.data.data : m));
      }
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Emojini xabarga qo'shish
  const addEmoji = (emoji) => {
    setInputText(prev => prev + " " + emoji);
  };

  // ==========================================
  // AGAR O'QUVCHI HALI KASB TANLAMAGAN BO'LSA
  // (Faqat bitta kasb chati ochiladi, oldin kasb aniqlanishi shart!)
  // ==========================================
  if (!diagnosedCareer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-5xl mx-auto shadow-lg">
          💬
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Kasbiy Hamjamiyat Chati Qulflangan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Oldin Kasb Diagnostikasidan Oʻting!
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Platformamiz qoidasiga koʻra, har bir oʻquvchi uchun <strong>faqat oʻzi tanlagan kasbiga oid bitta maxsus chat xonasi</strong> ochiladi. Shu tariqa bir xil qiziqishdagi tengdoshlar va ustozlar bilan sifatli muloqot qilasiz.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Kasb Diagnostika Testini Boshlash (+50 Coin)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // O'QUVCHI UCHUN FAQAT BITTA O'ZINING KASB CHATI OCHILADI
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      
      {/* Kasb Chati Headeri */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shrink-0">
            {chatData?.icon || '🤖'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Sizning Kasb Chatingiz
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Jonli muloqot</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {chatData?.careerTitle || diagnosedCareer} Hamjamiyati
            </h1>
            <p className="text-xs text-slate-300 hidden sm:block">
              {chatData?.description}
            </p>
          </div>
        </div>

        {/* Info badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>14 nafar mutaxassis online</span>
          </div>

          <Link
            to="/quizzes"
            className="px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/40 text-brand-300 text-xs font-extrabold transition-colors flex items-center gap-1"
          >
            <span>Mashqlar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Asosiy Chat Oynasi */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Pinned announcement if any */}
        {messages.some(m => m.isPinned) && (
          <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900 font-semibold gap-2">
            <div className="flex items-center gap-2 truncate">
              <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-extrabold text-amber-700">Qadalgan xabar:</span>
              <span className="truncate">{messages.find(m => m.isPinned)?.text}</span>
            </div>
            <span className="text-[10px] text-amber-700 shrink-0 font-bold">Admin Eʻloni</span>
          </div>
        )}

        {/* Xabarlar Ro'yxati */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Xabarlar yuklanmoqda...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-6">
              <div className="space-y-2">
                <span className="text-4xl">👋</span>
                <h3 className="font-bold text-sm text-slate-800">Ushbu kasb xonasida hozircha xabarlar yo'q</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Birinchi bo'lib salom bering yoki tengdoshlaringizga o'zingizni qiziqtirgan savol bilan murojaat qiling!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderName === (user?.name || "Men");
              const isAdmin = msg.senderRole?.toLowerCase().includes('admin') || msg.senderAvatar === '🛡️';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base shrink-0 shadow-sm ${
                    isAdmin ? 'bg-amber-100 border border-amber-300' : 'bg-white border border-slate-200'
                  }`}>
                    {msg.senderAvatar || '👤'}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                    <div className={`flex items-center gap-2 text-[11px] font-bold ${
                      isMe ? 'justify-end text-slate-500' : 'text-slate-600'
                    }`}>
                      <span className={isAdmin ? 'text-amber-700 font-black flex items-center gap-1' : 'text-slate-800'}>
                        {isAdmin && <ShieldCheck className="w-3 h-3 text-amber-600" />}
                        {msg.senderName}
                      </span>
                      {msg.senderRole && !isMe && (
                        <span className="text-[10px] text-slate-600 font-medium hidden sm:inline">
                          ({msg.senderRole})
                        </span>
                      )}
                      <span className="text-[9px] text-slate-600 font-normal">{msg.time}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                        : isAdmin
                        ? 'bg-amber-50/90 text-amber-950 border border-amber-200 rounded-tl-none font-semibold'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Emoji bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-sm no-scrollbar">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
            <Smile className="w-3.5 h-3.5" />
            <span>Tezkor:</span>
          </span>
          {["👍", "🚀", "💡", "🔥", "🤝", "💻", "🧠", "✨"].map((em, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addEmoji(em)}
              className="p-1 rounded-lg hover:bg-slate-100 text-xs transition-colors shrink-0"
            >
              {em}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            required
            placeholder={`${chatData?.careerTitle || 'Kasb'} guruhingizga xabar yozing...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white shadow-md shadow-brand-500/25 transition-all shrink-0"
            title="Yuborish (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};

export default CareerChat;
