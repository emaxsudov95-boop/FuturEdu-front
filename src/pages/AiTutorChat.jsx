import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';
import { Bot, Send, Sparkles, Volume2, RotateCcw, Lightbulb, Compass, Award, CheckCircle2 } from 'lucide-react';

const AiTutorChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Salom ${user?.name ? user.name : 'aziz oʻquvchim'}! 👋\n\nMen — sening Yoqimli AI Ustozingman! 🤖✨\n(OpenAI GPT sunʼiy intellekti bilan quvvatlanganman)\n\nMening vazifam:\n• Maktab darslaridagi har qanday qiyin mavzuni bolalarga xos sodda va qiziqarli tushuntirish;\n• Testlardagi xatolaringni erinmay izohlash;\n• Orzuingdagi kasbni egallashing uchun toʻgʻri yoʻl koʻrsatish;\n• Va albatta senga kuchli motivatsiya berish!\n\nBugun qaysi mavzuni birgalikda oʻrganamiz? Savolingni bemalol yoz! 😊`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'OpenAI GPT-4o-mini'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickTopics = [
    { label: "Pifagor teoremasi 📐", query: "Pifagor teoremasini bolalarga tushunarli qilib oddiy hayotiy misol bilan tushuntirib ber!" },
    { label: "Quyosh nurlari ☀️", query: "Quyosh nega sarg'ish yoki qizil ko'rinadi? Oddiy tushuntirib ber." },
    { label: "Dasturchilikni boshlash 💻", query: "Men 8-sinfda o'qiyman, qanday qilib yaxshi dasturchi bo'lishim mumkin?" },
    { label: "Nyuton qonunlari ⚡", query: "Nyutonning ikkinchi qonuni F = ma formulasini sodda qilib aytib ber." },
    { label: "Bugungi motivatsiya 🚀", query: "Ustoz, bugun dars qilishga erinyapman, menga o'qishga ishtiyoq bag'ishlaydigan motivatsiya bering!" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(text, {
        userCareer: user?.selectedCareer,
        userGrade: user?.grade
      });

      if (res.data?.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: res.data.reply,
            provider: res.data.provider || 'OpenAI GPT',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Kechirasiz, aloqada kichik toʻsiq boʻldi. Lekin men doim siz bilaman, yana bir bor savol bering! 🌟',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Ovozli o'qish
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-brand-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner animate-float">
            🤖
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OpenAI API Faol Ulandi ✨</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Yoqimli AI Ustoz bilan Jonli Chat
            </h1>
            <p className="text-xs text-brand-100 mt-0.5">
              OpenAI intellekti asosida savollarga javob beruvchi va bolalarni ragʻbatlantiruvchi yordamchi
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          title="Chatni tozalash"
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white/80 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-500/15'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                <div className={`mt-2 flex items-center justify-between text-[10px] ${
                  msg.sender === 'user' ? 'text-brand-200' : 'text-slate-500'
                }`}>
                  <span className="flex items-center gap-1">
                    <span>{msg.time}</span>
                    {msg.sender === 'ai' && (
                      <span className="text-[9px] bg-brand-50 text-brand-700 px-1.5 py-0.2 rounded font-semibold">
                        ⚡ {msg.provider || 'AI Engine'}
                      </span>
                    )}
                  </span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      title="Ovozli eshitish"
                      className="p-1 hover:text-brand-600 transition-colors flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Eshitish</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-lg shrink-0">
                🤖
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-4 flex items-center gap-2 shadow-sm">
                <span className="text-xs text-slate-600 font-semibold">AI Ustoz javob oʻylamoqda</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Topic Buttons */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto flex gap-2 no-scrollbar">
          {quickTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSend(topic.query)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI Ustozga savolingizni yozing..."
            className="flex-1 px-5 py-3.5 bg-slate-100 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl text-xs sm:text-sm focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 shrink-0 text-xs sm:text-sm"
          >
            <span>Joʻnatish</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};

export default AiTutorChat;
