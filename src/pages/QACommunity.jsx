import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { questionAPI } from '../services/api';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  Plus, 
  Coins, 
  CheckCircle2, 
  Bot, 
  Heart, 
  User as UserIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QACommunity = () => {
  const { user, updateUserStats } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState('Barchasi');

  // Yangi savol formasi holati
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState('Matematika');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Javob yozish holati
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const subjects = ['Barchasi', 'Matematika', 'Informatika', 'Fizika', 'Ingliz tili', 'Biologiya', 'Umumiy'];

  useEffect(() => {
    fetchQuestions();
  }, [activeSubject]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await questionAPI.getAll(activeSubject);
      if (res.data?.data) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      console.error('Questions fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Yangi savol berish
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await questionAPI.create({
        title: newTitle,
        content: newContent,
        subject: newSubject
      });

      if (res.data?.data) {
        setQuestions(prev => [res.data.data, ...prev]);
        setShowAskModal(false);
        setNewTitle('');
        setNewContent('');
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error('Ask error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Javob yozish
  const handleSendAnswer = async (questionId) => {
    if (!replyText.trim()) return;

    try {
      const res = await questionAPI.addAnswer(questionId, replyText);
      if (res.data?.answer) {
        setQuestions(prev =>
          prev.map(q => {
            if (q.id === questionId || q._id === questionId) {
              return {
                ...q,
                answers: [...(q.answers || []), res.data.answer]
              };
            }
            return q;
          })
        );
        setReplyText('');
        setReplyOpenId(null);
        confetti({ particleCount: 60, spread: 50 });

        // +10 Coin foydalanuvchiga
        if (user) {
          updateUserStats((user.coins || 0) + 10, (user.xp || 0) + 15, user.level);
        }
      }
    } catch (err) {
      console.error('Reply error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Oʻquvchilar Forumi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Savol-Javob jamoasi 💬
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Tushunmagan mavzuingiz boʻyicha savol bering yoki boshqalarga yordam berib Coin yigʻing!
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Savol berish</span>
        </button>
      </div>

      {/* Fanlar filtri */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubject === sub
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Savollar ro'yxati */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-600 font-semibold">Savollar yuklanmoqda...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="text-4xl">🤔</div>
          <h3 className="font-bold text-slate-800 text-base">Hozircha savollar yoʻq</h3>
          <p className="text-xs text-slate-600">Birinchi boʻlib savol bering va AI Ustozdan tushunarli javob oling!</p>
          <button
            onClick={() => setShowAskModal(true)}
            className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl"
          >
            Savol berish
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id || q._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-xl shrink-0">
                    {q.authorAvatar || '🎓'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {q.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                      <span className="font-semibold text-slate-700">{q.authorName}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-bold">
                        {q.subject}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold shrink-0">
                  <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>+{q.coinsBounty || 15} Coin</span>
                </div>
              </div>

              {/* Question Content */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-13">
                {q.content}
              </p>

              {/* Answers Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-xs font-extrabold text-slate-600 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Javoblar ({q.answers?.length || 0}):</span>
                </span>

                <div className="space-y-2.5">
                  {q.answers?.map((ans, aIdx) => (
                    <div
                      key={aIdx}
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        ans.isAiAnswer
                          ? 'bg-gradient-to-r from-brand-50/70 to-indigo-50/70 border border-brand-200'
                          : 'bg-slate-50 border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{ans.authorAvatar || (ans.isAiAnswer ? '🤖' : '🧑‍🎓')}</span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {ans.authorName}
                          </span>
                          {ans.isAiAnswer && (
                            <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              AI Ustoz Izohi
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{ans.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form Trigger & Form */}
                <div className="pt-2">
                  {replyOpenId === (q.id || q._id) ? (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Ushbu savolga tushunarli javobingizni yozing..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-700">
                          ✨ Javob yozganingiz uchun: +10 Coin olasiz!
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReplyOpenId(null)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600"
                          >
                            Bekor qilish
                          </button>
                          <button
                            onClick={() => handleSendAnswer(q.id || q._id)}
                            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"
                          >
                            Javobni joʻnatish
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyOpenId(q.id || q._id);
                        setReplyText('');
                      }}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      <span>Javob yozish (+10 Coin)</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Savol berish modali */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                <span>Yangi savol berish</span>
              </h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-slate-600 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fan:</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold"
                >
                  {subjects.filter(s => s !== 'Barchasi').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Savol sarlavhasi:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masalan: Pifagor teoremasida gipotenuzani qanday topamiz?"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batafsil matn:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Savolingizni tushunarli qilib yozing..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Savolingizga AI Ustoz birinchi boʻlib samimiy javob tayyorlaydi!</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Chop etilmoqda..." : "Savolni joylash 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default QACommunity;
