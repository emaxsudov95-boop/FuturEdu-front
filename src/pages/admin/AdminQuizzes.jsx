import React, { useState, useEffect } from 'react';
import { quizAPI, adminAPI } from '../../services/api';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Clock, 
  Coins, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  Bot
} from 'lucide-react';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState('');

  // Yangi test formasi
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Matematika');
  const [difficulty, setDifficulty] = useState("O'rtacha");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10);
  const [coinsReward, setCoinsReward] = useState(35);
  const [xpReward, setXpReward] = useState(50);
  const [icon, setIcon] = useState('📐');

  // Dinamik savollar
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    }
  ]);

  const subjects = ['Matematika', 'Informatika', 'Fizika', 'Ingliz tili', 'Biologiya', 'Kimyo', 'Mantiqiy savollar'];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await quizAPI.getAll('Barchasi');
      if (res.data?.data) {
        setQuizzes(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Yangi savol qo'shish
  const handleAddQuestionItem = () => {
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]);
  };

  // Savolni o'chirish
  const handleRemoveQuestionItem = (idx) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // Savol maydonini o'zgartirish
  const handleQuestionChange = (idx, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  // Variantni o'zgartirish
  const handleOptionChange = (qIdx, optIdx, val) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].options[optIdx] = val;
      return updated;
    });
  };

  // Yangi testni saqlash
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!title.trim() || questions.some(q => !q.question.trim())) {
      alert('Iltimos, test nomi va barcha savollarni toʻldiring!');
      return;
    }

    try {
      const res = await adminAPI.createQuiz({
        title,
        subject,
        difficulty,
        timeLimitMinutes,
        coinsReward,
        xpReward,
        icon,
        questions
      });

      if (res.data?.success) {
        setMessage(res.data.message);
        setShowCreateModal(false);
        // Reset form
        setTitle('');
        setQuestions([
          {
            question: '',
            options: ['', '', '', ''],
            correctIndex: 0,
            explanation: ''
          }
        ]);
        fetchQuizzes();
        setTimeout(() => setMessage(''), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Testni o'chirish
  const handleDeleteQuiz = async (id, quizTitle) => {
    if (!window.confirm(`Haqiqatan ham "${quizTitle}" testini oʻchirmoqchimisiz?`)) return;

    try {
      const res = await adminAPI.deleteQuiz(id);
      setMessage(res.data?.message || 'Test oʻchirildi');
      setQuizzes(prev => prev.filter(q => q.id !== id && q._id !== id));
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-500" />
            <span>Testlar Boshqaruvi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fanlar boʻyicha testlarni yaratish, savollarni tahrirlash va oʻchirish
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Test Yaratish</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Quizzes Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Testlar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id || quiz._id}
              className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    {quiz.icon || '📚'}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    {quiz.difficulty || "O'rtacha"}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-brand-400 block mb-0.5">
                    {quiz.subject}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {quiz.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-900">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{quiz.timeLimitMinutes || 10} daq</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Coins className="w-3.5 h-3.5 fill-amber-400" />
                    <span>+{quiz.coinsReward} Coin</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {quiz.questions?.length || 0} savol
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => handleDeleteQuiz(quiz.id || quiz._id, quiz.title)}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors text-xs flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Oʻchirish</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Yangi Test Yaratish Modali */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-500" />
                <span>Yangi Test Yaratish</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Fan:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Qiyinlik darajasi:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Oson">Oson</option>
                    <option value="O'rtacha">O'rtacha</option>
                    <option value="Qiyin">Qiyin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Test sarlavhasi:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Fizika: Nyuton qonunlari va Kuch"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Vaqt (daq):</label>
                  <input
                    type="number"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Mukofot Coin:</label>
                  <input
                    type="number"
                    value={coinsReward}
                    onChange={(e) => setCoinsReward(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Mukofot XP:</label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-violet-400 font-bold"
                  />
                </div>
              </div>

              {/* Dinamik savollar */}
              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Savollar ({questions.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddQuestionItem}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-brand-400 text-xs font-bold rounded-lg border border-slate-800"
                  >
                    + Savol qoʻshish
                  </button>
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                  {questions.map((qItem, qIdx) => (
                    <div key={qIdx} className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">
                          {qIdx + 1}-savol:
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestionItem(qIdx)}
                            className="text-xs text-rose-400 hover:text-rose-300"
                          >
                            Oʻchirish
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        value={qItem.question}
                        onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                        placeholder="Savol matnini kiriting..."
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />

                      {/* 4 Variant */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={qItem.correctIndex === optIdx}
                              onChange={() => handleQuestionChange(qIdx, 'correctIndex', optIdx)}
                              className="accent-brand-500"
                              title="To'g'ri variant sifatida belgilash"
                            />
                            <input
                              type="text"
                              required
                              value={qItem.options[optIdx] || ''}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`Variant ${letter}`}
                              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>

                      {/* AI Ustoz izohi */}
                      <div>
                        <input
                          type="text"
                          value={qItem.explanation}
                          onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                          placeholder="AI Ustoz tushuntirishi (to'g'ri javob izohi)..."
                          className="w-full p-2 bg-slate-950 border border-indigo-950 rounded-xl text-xs text-indigo-300 placeholder-indigo-500/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/25"
                >
                  Testni Saqlash & Chop etish 🚀
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminQuizzes;
