import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockAPI } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Coins,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  Award,
  Crown,
  ChevronRight,
  Filter,
  Flame,
  ShieldCheck,
  BookOpen,
  History,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const MockTest = () => {
  const { user, refreshUser, updateUserStats } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'lobby' (fan tanlash), 'exam' (test jarayoni), 'result' (yakuniy natija), 'history' (tarix)
  const [activeTab, setActiveTab] = useState('lobby');

  // Server sozlamalari va fanlar
  const [settings, setSettings] = useState({
    entryCostCoins: 30,
    cashbackThreshold: 80,
    timeLimitMinutes: 20,
    highScoreBonusCoins: 20,
    perfectScoreBonusCoins: 50,
    questionCount: 10
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Faol Imtihon holati
  const [activeSession, setActiveSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [examSubmitting, setExamSubmitting] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);

  // Natija holati
  const [examResult, setExamResult] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all', 'wrong', 'correct'

  // Tarix holati
  const [historyStats, setHistoryStats] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Xatolik xabari
  const [errorMessage, setErrorMessage] = useState('');

  const timerRef = useRef(null);

  // Dastlabki yuklash
  useEffect(() => {
    fetchMockInfo();
  }, []);

  const fetchMockInfo = async () => {
    setLoading(true);
    try {
      const res = await mockAPI.getInfo();
      if (res.data?.success) {
        setSettings(res.data.settings);
        setSubjects(res.data.subjects || []);
        if (res.data.subjects?.length > 0 && !selectedSubject) {
          setSelectedSubject(res.data.subjects[0]);
        }
      }
    } catch (err) {
      console.error('MOK info error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tarixni yuklash
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await mockAPI.getMyHistory();
      if (res.data?.success) {
        setHistoryStats(res.data.stats);
        setHistoryList(res.data.history || []);
      }
    } catch (err) {
      console.error('History error:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Test boshlash (Coin kirgan paytning o'zidayoq darhol yechiladi)
  const handleStartExam = async () => {
    if (!selectedSubject) return;
    setErrorMessage('');

    // Coin tekshirish
    const userCoins = user?.coins || 0;
    if (userCoins < settings.entryCostCoins) {
      setErrorMessage(`MOK test boshlash uchun hisobingizda kamida ${settings.entryCostCoins} coin boʻlishi kerak. Sizda hozir: ${userCoins} coin.`);
      return;
    }

    // TANGANING KIRGAN PAYTNING O'ZIDAYOQ DARHOL AYRILISHI
    const instantRemaining = Math.max(0, userCoins - settings.entryCostCoins);
    updateUserStats(instantRemaining);

    try {
      setLoading(true);
      const res = await mockAPI.startTest({
        subjectId: selectedSubject.id,
        userId: user?._id || user?.id
      });

      if (res.data?.success) {
        setActiveSession(res.data);
        setQuestions(res.data.questions || []);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTimeLeftSeconds(res.data.timeLimitMinutes * 60);
        setActiveTab('exam');

        // Foydalanuvchi tangalarini server javobi bo'yicha mustahkamlash
        if (res.data.remainingCoins !== undefined) {
          updateUserStats(res.data.remainingCoins);
        }
        refreshUser();
      } else {
        refreshUser(); // Xatolik bo'lsa qayta tiklash
        setErrorMessage(res.data?.message || 'Testni boshlashda xatolik yuz berdi');
      }
    } catch (err) {
      refreshUser(); // Xatolik bo'lsa qayta tiklash
      setErrorMessage(err.response?.data?.message || 'Server bilan bog‘lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  // Taymer boshqaruvi
  useEffect(() => {
    if (activeTab === 'exam' && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam(true); // Vaqt tugaganda avtomatik topshirish
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, timeLeftSeconds]);

  // Javob tanlash
  const handleSelectAnswer = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  // Testni topshirish
  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (examSubmitting || !activeSession) return;
    setShowConfirmSubmitModal(false);
    setExamSubmitting(true);

    if (timerRef.current) clearInterval(timerRef.current);

    const totalTime = activeSession.timeLimitMinutes * 60;
    const spentTimeSeconds = Math.max(10, totalTime - timeLeftSeconds);

    try {
      const res = await mockAPI.submitTest({
        sessionId: activeSession.sessionId,
        answers: userAnswers,
        timeSpentSeconds: spentTimeSeconds,
        userId: user?._id || user?.id
      });

      if (res.data?.success) {
        setExamResult(res.data);
        setActiveTab('result');

        // Agar keshbek yoki yuqori natija bo'lsa bayram konfettisini otish
        if (res.data.score >= settings.cashbackThreshold) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }

        // Foydalanuvchi balansini yangilash
        if (res.data.updatedUserCoins !== undefined) {
          updateUserStats(res.data.updatedUserCoins);
        }
        refreshUser();
      } else {
        alert(res.data?.message || 'Natijani hisoblashda xatolik');
      }
    } catch (err) {
      console.error(err);
      alert('Testni topshirishda server xatosi yuz berdi');
    } finally {
      setExamSubmitting(false);
    }
  };

  // Format sekundlar: mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-20">
      
      {/* =========================================================================
          TOP HERO & STATS BANNER
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        {/* Glow lights */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black">
                <img src="/logo.png" alt="FuturEdu" className="w-4 h-4 object-contain" />
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>FUTUREDU MOK TEST • 100 BALLIK TIZIM • AVTOMATIK KESHBEK</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                <span>MOK Test Simulyatori</span>
                <span className="text-sm bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                  100 Ball
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-medium">
                Fan bo‘yicha maxsus test topshiring. <strong className="text-white font-bold">{settings.cashbackThreshold}+ ball</strong> to‘plasangiz, sarflagan <strong className="text-amber-300 font-bold">{settings.entryCostCoins} coiningiz</strong> to‘liq qaytariladi!
              </p>
            </div>

            {/* User Coin Pill */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Coins className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Balansingiz</span>
                <span className="text-lg font-black text-amber-400">{user?.coins || 0} coin</span>
              </div>
            </div>
          </div>

          {/* Quick Rules Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xs">
                🪙
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Test narxi</span>
                <span className="text-xs font-black text-white">{settings.entryCostCoins} Coin</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">
                🎯
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Keshbek chegarasi</span>
                <span className="text-xs font-black text-emerald-400">{settings.cashbackThreshold}+ Ball (100%)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-xs">
                👑
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Bonus & Badge</span>
                <span className="text-xs font-black text-purple-300">90+ da +{settings.highScoreBonusCoins} coin</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs">
                ⏱️
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Vaqt chegarasi</span>
                <span className="text-xs font-black text-white">{settings.timeLimitMinutes} daqiqa</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation (Lobby vs History) - only visible when not inside active exam */}
          {activeTab !== 'exam' && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setActiveTab('lobby')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'lobby'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Fan Tanlash & Boshlash</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('history');
                  fetchHistory();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Testlarim Tarixi & Tahlil</span>
              </button>

              {examResult && (
                <button
                  onClick={() => setActiveTab('result')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'result'
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>So‘nggi Natija ({examResult.score} ball)</span>
                </button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          TAB 1: LOBBY (FAN TANLASH & BOSHLASH)
      ========================================================================= */}
      {activeTab === 'lobby' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">1. Qaysi fan bo‘yicha MOK test topshirasiz?</h2>
              <p className="text-xs text-slate-400">Bitta fanni tanlang — faqat shu fanning oson, o‘rtacha va qiyin savollari beriladi</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Jami: {subjects.length} ta fan mavjud
            </span>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subj) => {
              const isSelected = selectedSubject?.id === subj.id;
              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj)}
                  className={`relative p-5 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-slate-900 border-brand-500 ring-2 ring-brand-500/40 shadow-xl shadow-brand-500/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs shadow-md">
                      ✓
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {subj.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-400 block mb-0.5">
                        {subj.badge}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                        {subj.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {subj.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>10 ta savol</span>
                    <span className="text-amber-400 font-bold">100 ball</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar (Selected subject & Start test button) */}
          {selectedSubject && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
                  {selectedSubject.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full">
                      Tanlandi
                    </span>
                    <span className="text-xs text-slate-400">{settings.timeLimitMinutes} daqiqa</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedSubject.name} MOK Imtihoni</h3>
                  <p className="text-xs text-slate-400">
                    Kirish to‘lovi: <strong className="text-amber-400">{settings.entryCostCoins} coin</strong> • {settings.cashbackThreshold}+ ball to‘plasangiz avtomatik qaytariladi!
                  </p>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>Testni Boshlash ({settings.entryCostCoins} coin)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: ACTIVE EXAM (IMTIHON JARAYONI)
      ========================================================================= */}
      {activeTab === 'exam' && currentQ && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Top Exam Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md">
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeSession?.subject?.icon}</span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {activeSession?.subject?.name} MOK Testi
                </h3>
                <span className="text-xs text-slate-400 font-semibold">
                  Savol: {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-black text-sm border ${
              timeLeftSeconds < 180 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' 
                : 'bg-slate-950 border-slate-800 text-amber-400'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Finish Button */}
            <button
              onClick={() => setShowConfirmSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all"
            >
              Topshirish
            </button>
          </div>

          {/* Question Numbers Quick Navigation */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400">Savollar xaritasi:</span>
              <span className="text-[11px] text-emerald-400 font-bold">{answeredCount} ta belgilandi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = currentQuestionIndex === idx;
                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white ring-2 ring-brand-400 shadow-md scale-105'
                        : isAnswered
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Difficulty Badge & Question Number */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Savol #{currentQuestionIndex + 1}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                currentQ.difficulty === 'Oson'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : currentQ.difficulty === "O'rtacha"
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {currentQ.difficulty} daraja
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full p-4 rounded-2xl text-left font-semibold text-xs sm:text-sm transition-all border flex items-center justify-between group ${
                      isSelected
                        ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg ring-1 ring-brand-400'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}>
                        {optionLetter}
                      </div>
                      <span>{option}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 disabled:opacity-40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Oldingi</span>
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
                >
                  <span>Keyingi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmSubmitModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <span>Testni Yakunlash</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Confirm Submit Modal */}
          {showConfirmSubmitModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                  🎯
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-white">Testni topshirmoqchimisiz?</h3>
                  <p className="text-xs text-slate-400">
                    Siz {questions.length} ta savoldan <strong className="text-white">{answeredCount} tasiga</strong> javob berdingiz.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Qaytarish chegarasi:</span>
                    <span className="font-bold text-emerald-400">{settings.cashbackThreshold}+ ball</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qolgan vaqt:</span>
                    <span className="font-bold text-amber-400">{formatTime(timeLeftSeconds)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirmSubmitModal(false)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Davom ettirish
                  </button>
                  <button
                    onClick={() => handleSubmitExam(false)}
                    disabled={examSubmitting}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                  >
                    {examSubmitting ? 'Hisoblanmoqda...' : 'Ha, topshirish'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: EXAM RESULT & MISTAKES REVIEW (NATIJA VA TAHLIL)
      ========================================================================= */}
      {activeTab === 'result' && examResult && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* Main Result Card */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
            
            {/* Background Glow */}
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
              examResult.score >= settings.cashbackThreshold ? 'bg-emerald-500/20' : 'bg-rose-500/15'
            }`} />

            {/* Score Ring */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center relative shadow-inner bg-slate-950">
                <span className="text-4xl font-black text-white">{examResult.score}</span>
                <span className="text-[11px] text-slate-400 font-extrabold uppercase">100 Ballik</span>
              </div>

              {/* Status Banner */}
              <div className="mt-4 max-w-md">
                {examResult.score >= 100 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-sm">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>MUTLAQ GʻALABA! 100 BALLIK NATIJA!</span>
                  </div>
                ) : examResult.score >= 90 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-sm">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>OLTIN NATIJA! KESHBEK + BONUS COINLAR!</span>
                  </div>
                ) : examResult.isRefunded ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>TABRIKLAYMIZ! SARFLAGAN COINLARINGIZ QAYTARILDI!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Keshbek berilmadi (chegara: {settings.cashbackThreshold} ball)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Coin & Reward Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">To‘g‘ri javoblar</span>
                <span className="text-base font-black text-emerald-400">
                  {examResult.correctCount} / {examResult.totalQuestions}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Qaytarilgan Coin</span>
                <span className="text-base font-black text-amber-400">
                  +{examResult.refundedCoins || 0} coin
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Qo‘shimcha Bonus</span>
                <span className="text-base font-black text-purple-400">
                  +{examResult.bonusCoins || 0} coin
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Yangi Balansingiz</span>
                <span className="text-base font-black text-white">
                  {examResult.updatedUserCoins} coin
                </span>
              </div>
            </div>

            {/* Badge Awarded Callout */}
            {examResult.badgeAwarded && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{examResult.badgeAwarded.icon}</span>
                  <div>
                    <span className="text-xs font-black text-amber-300 block">
                      Yangi Nishon Qadalandi: {examResult.badgeAwarded.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{examResult.badgeAwarded.description}</span>
                  </div>
                </div>
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('lobby')}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yangi MOK Test Boshlash</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('history');
                  fetchHistory();
                }}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                <span>Barcha Testlarim Tarixi</span>
              </button>
            </div>

          </div>

          {/* Detailed Question Review & Mistakes Analysis */}
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Savollar Tahlili va Xatolar ustida ishlash</span>
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </h3>
                <p className="text-xs text-slate-400">Har bir savolning to‘g‘ri javobi va ilmiy tushuntirishi bilan tanishing</p>
              </div>

              {/* Review Filters */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Barchasi ({examResult.review?.length})
                </button>
                <button
                  onClick={() => setReviewFilter('wrong')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === 'wrong' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Xatolar ({examResult.review?.filter(r => !r.isCorrect).length})
                </button>
                <button
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  To‘g‘rilar ({examResult.review?.filter(r => r.isCorrect).length})
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-4">
              {examResult.review
                ?.filter(r => {
                  if (reviewFilter === 'wrong') return !r.isCorrect;
                  if (reviewFilter === 'correct') return r.isCorrect;
                  return true;
                })
                .map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                        item.isCorrect
                          ? 'bg-slate-900/80 border-emerald-500/30'
                          : 'bg-slate-900/80 border-rose-500/30'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            item.isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                          }`}>
                            {item.isCorrect ? '✓' : '✕'}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            Savol #{item.index + 1} ({item.difficulty})
                          </span>
                        </div>
                        <span className={`text-[11px] font-black ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.isCorrect ? "+10 Ball (To'g'ri)" : "0 Ball (Xato)"}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base font-bold text-white">
                        {item.question}
                      </p>

                      {/* Options breakdown */}
                      <div className="space-y-2">
                        {item.options.map((opt, optI) => {
                          const isUserChoice = item.userSelected === optI;
                          const isCorrectChoice = item.correctIndex === optI;

                          let bgStyle = 'bg-slate-950/60 border-slate-800 text-slate-400';
                          if (isCorrectChoice) {
                            bgStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-bold';
                          } else if (isUserChoice && !item.isCorrect) {
                            bgStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-200 line-through';
                          }

                          return (
                            <div
                              key={optI}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${bgStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold">{String.fromCharCode(65 + optI)})</span>
                                <span>{opt}</span>
                              </div>
                              <div>
                                {isCorrectChoice && (
                                  <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                                    To‘g‘ri javob
                                  </span>
                                )}
                                {isUserChoice && !isCorrectChoice && (
                                  <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                                    Sizning javobingiz
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Scientific Explanation */}
                      {item.explanation && (
                        <div className="p-3.5 rounded-2xl bg-brand-950/40 border border-brand-500/20 text-xs space-y-1">
                          <span className="font-bold text-brand-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Izoh & Yechim uslubi:</span>
                          </span>
                          <p className="text-slate-300 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: TEST HISTORY & PROGRESS ANALYTICS (TARIX VA STATISTIKA)
      ========================================================================= */}
      {activeTab === 'history' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Mening MOK Testlar Tarixim</h2>
              <p className="text-xs text-slate-400">Har bir topshirilgan imtihon natijalari, qaytarilgan coinlar va dinamika</p>
            </div>
            <button
              onClick={() => setActiveTab('lobby')}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <span>+ Yangi Test</span>
            </button>
          </div>

          {/* Stats Cards */}
          {historyStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jami Testlar</span>
                <span className="text-2xl font-black text-white">{historyStats.totalAttempts} ta</span>
                <span className="text-[11px] text-slate-500 block">MOK topshirildi</span>
              </div>

              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">O‘rtacha Ball</span>
                <span className="text-2xl font-black text-brand-400">{historyStats.averageScore} / 100</span>
                <span className="text-[11px] text-slate-500 block">Umumiy ko‘rsatkich</span>
              </div>

              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keshbek Ko‘rsatkichi</span>
                <span className="text-2xl font-black text-emerald-400">{historyStats.successRate}%</span>
                <span className="text-[11px] text-slate-500 block">80+ ball bilan qaytgan</span>
              </div>

              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yutilgan Coinlar</span>
                <span className="text-2xl font-black text-amber-400">
                  +{historyStats.totalCoinsRefunded + historyStats.totalBonusCoinsEarned}
                </span>
                <span className="text-[11px] text-slate-500 block">Keshbek va bonuslar</span>
              </div>
            </div>
          )}

          {/* History List Table / Cards */}
          {historyLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Tarix yuklanmoqda...</div>
          ) : historyList.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <span className="text-4xl">📜</span>
              <h3 className="text-base font-bold text-white">Hozircha MOK testlar mavjud emas</h3>
              <p className="text-xs text-slate-400">O‘zingiz qiziqqan fanni tanlab, birinchi sinovni topshiring!</p>
              <button
                onClick={() => setActiveTab('lobby')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
              >
                Test Boshlash
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                        {item.subjectIcon || '📚'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{item.subjectName}</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {new Date(item.submittedAt).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {item.correctCount} / {item.totalQuestions} ta to‘g‘ri • {Math.round(item.timeSpentSeconds / 60)} daqiqa
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Score Pill */}
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-semibold">Natija:</span>
                        <span className={`text-base font-black ${
                          item.score >= 80 ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                          {item.score} ball
                        </span>
                      </div>

                      {/* Refund status badge */}
                      <div>
                        {item.isRefunded ? (
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center gap-1">
                            <span>+{item.refundedCoins + (item.bonusCoins || 0)} coin</span>
                            <span className="text-[10px] bg-emerald-500/20 px-1 rounded">Keshbek</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold">
                            Keshbek yo‘q
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default MockTest;
