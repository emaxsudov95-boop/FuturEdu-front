import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { battleAPI } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Swords,
  Trophy,
  Coins,
  Flame,
  Zap,
  Clock,
  Shield,
  Award,
  Crown,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Compass,
  Users,
  History,
  Target
} from 'lucide-react';

const BattleArena = () => {
  const { user, refreshUser, updateUserStats } = useAuth();

  // Active view: 'lobby', 'matchmaking', 'vs_screen', 'battle', 'result', 'history', 'leaderboard'
  const [activeTab, setActiveTab] = useState('lobby');

  // Battle profile stats
  const [profileData, setProfileData] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [availableSpheres, setAvailableSpheres] = useState([]);
  const [showSphereSelector, setShowSphereSelector] = useState(false);
  const [loading, setLoading] = useState(true);

  // Matchmaking & Battle session
  const [matchmakingText, setMatchmakingText] = useState('Mos raqib qidirilmoqda...');
  const [battleSession, setBattleSession] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);

  // Round interactive state
  const [roundTimeLeft, setRoundTimeLeft] = useState(15);
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [roundEnded, setRoundEnded] = useState(false);
  const [opponentStatus, setOpponentStatus] = useState('thinking'); // 'thinking', 'answered'
  const [opponentAnswer, setOpponentAnswer] = useState(null); // { isCorrect, spentSeconds }
  const [roundsHistoryData, setRoundsHistoryData] = useState([]);
  const [myTotalScore, setMyTotalScore] = useState(0);
  const [oppTotalScore, setOppTotalScore] = useState(0);

  // Final battle result
  const [battleResult, setBattleResult] = useState(null);

  // Match history list & leaderboard
  const [historyList, setHistoryList] = useState([]);
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const timerRef = useRef(null);
  const roundAdvanceTimeoutRef = useRef(null);

  // Dastlabki yuklash
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await battleAPI.getProfile();
      if (res.data?.success) {
        setProfileData(res.data);
        setAvailableSpheres(res.data.availableSpheres || []);
        if (res.data.user?.careerObj) {
          setSelectedCareer(res.data.user.careerObj);
        } else if (res.data.availableSpheres?.length > 0) {
          setSelectedCareer(res.data.availableSpheres[0]);
        }
      }
    } catch (err) {
      console.error('Battle profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await battleAPI.getHistory();
      if (res.data?.success) {
        setHistoryList(res.data.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await battleAPI.getLeaderboard();
      if (res.data?.success) {
        setLeaderboardList(res.data.leaderboard || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Matchmaking boshlash
  const handleStartMatchmaking = async () => {
    setActiveTab('matchmaking');
    setMatchmakingText('Sizning sohangiz bo‘yicha mos reytingli raqib qidirilmoqda...');

    try {
      const res = await battleAPI.findMatch(selectedCareer?.slug || 'software-engineer');
      if (res.data?.success) {
        setBattleSession(res.data);
        setOpponent(res.data.opponent);
        setQuestions(res.data.questions || []);

        // 2 soniya qidirish animatsiyasidan so'ng VS ekranini ko'rsatish
        setTimeout(() => {
          setActiveTab('vs_screen');
          // 2.5 soniya VS ekranidan keyin jangni boshlash
          setTimeout(() => {
            startBattle(res.data);
          }, 2500);
        }, 1800);
      }
    } catch (err) {
      alert('Raqib topishda xatolik yuz berdi');
      setActiveTab('lobby');
    }
  };

  // Jangni boshlash
  const startBattle = (sessionData) => {
    setCurrentRound(0);
    setMyTotalScore(0);
    setOppTotalScore(0);
    setRoundsHistoryData([]);
    setActiveTab('battle');
    initRound(0, sessionData.questions[0]);
  };

  // Raundni initsializatsiya qilish
  const initRound = (roundIdx, q) => {
    setUserSelectedOption(null);
    setRoundEnded(false);
    setOpponentStatus('thinking');
    setOpponentAnswer(null);
    const limit = q?.timeLimitSeconds || 15;
    setRoundTimeLeft(limit);

    // Opponent random javob berish vaqti (3 dan 9 sekundgacha)
    const oppAnswerDelay = Math.floor(Math.random() * 6000) + 3000;
    const oppWillBeCorrect = Math.random() < 0.75; // 75% ehtimol bilan to'g'ri

    setTimeout(() => {
      setOpponentStatus('answered');
      setOpponentAnswer({
        isCorrect: oppWillBeCorrect,
        spentSeconds: Math.round(oppAnswerDelay / 1000)
      });
    }, oppAnswerDelay);
  };

  // Round Taymeri
  useEffect(() => {
    if (activeTab === 'battle' && !roundEnded && roundTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setRoundTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleOptionSelect(null, true); // Vaqt tugadi
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, roundEnded, roundTimeLeft]);

  // Foydalanuvchi variant tanlaganda
  const handleOptionSelect = (optionIdx, isTimeout = false) => {
    if (roundEnded) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setUserSelectedOption(optionIdx);
    setRoundEnded(true);

    const currentQ = questions[currentRound];
    const totalLimit = currentQ.timeLimitSeconds || 15;
    const userSpentSeconds = totalLimit - roundTimeLeft;
    const isUserCorrect = optionIdx === currentQ.correctIndex;

    // Ball hisoblash
    let roundUserScore = 0;
    if (isUserCorrect) {
      const speedBonus = Math.max(0, (totalLimit - userSpentSeconds) * 3);
      roundUserScore = 100 + speedBonus;
      setMyTotalScore(prev => prev + roundUserScore);
    }

    const oppIsCorrect = opponentAnswer ? opponentAnswer.isCorrect : (Math.random() < 0.75);
    const oppSpentSeconds = opponentAnswer ? opponentAnswer.spentSeconds : 6;
    let roundOppScore = 0;
    if (oppIsCorrect) {
      const oppSpeedBonus = Math.max(0, (totalLimit - oppSpentSeconds) * 3);
      roundOppScore = 100 + oppSpeedBonus;
      setOppTotalScore(prev => prev + roundOppScore);
    }

    // Raund natijasini saqlash
    const roundData = {
      roundIndex: currentRound,
      userSelected: optionIdx,
      userSpentSeconds,
      opponentCorrect: oppIsCorrect,
      opponentSpentSeconds: oppSpentSeconds
    };

    const nextHistory = [...roundsHistoryData, roundData];
    setRoundsHistoryData(nextHistory);

    // 2.5 soniyadan so'ng keyingi raundga yoki yakunga o'tish
    roundAdvanceTimeoutRef.current = setTimeout(() => {
      if (currentRound < questions.length - 1) {
        const nextIdx = currentRound + 1;
        setCurrentRound(nextIdx);
        initRound(nextIdx, questions[nextIdx]);
      } else {
        finishBattle(nextHistory);
      }
    }, 2500);
  };

  // Jangni yakunlash va serverga topshirish
  const finishBattle = async (finalRoundsData) => {
    try {
      const res = await battleAPI.submitBattle({
        battleId: battleSession.battleId,
        roundsData: finalRoundsData
      });

      if (res.data?.success) {
        setBattleResult(res.data);
        setActiveTab('result');

        if (res.data.result === 'victory') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.55 }
          });
        }

        // Tangalarni yangilash
        if (res.data.updatedCoins !== undefined) {
          updateUserStats(res.data.updatedCoins);
        }
        refreshUser();
      }
    } catch (err) {
      console.error('finishBattle error:', err);
      alert('Jang natijalarini saqlashda xatolik');
      setActiveTab('lobby');
    }
  };

  const currentQ = questions[currentRound];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      
      {/* =========================================================================
          HERO & ARENA BANNER
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-950/60 via-slate-950 to-slate-950 border-b border-purple-900/30 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black">
                <img src="/logo.png" alt="FuturEdu" className="w-4 h-4 object-contain" />
                <Swords className="w-3.5 h-3.5" />
                <span>FUTUREDU • 1V1 ONLAYN BILIM JANGI ARENASI</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>Battle Arenasi</span>
                <span className="text-xs sm:text-sm bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-black px-2.5 py-1 rounded-xl shadow-lg shadow-purple-500/25">
                  DUEL REJIMI
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-medium">
                O‘z sohangiz va kasbiy fanlaringiz bo‘yicha tengdoshlaringiz bilan intellektual bellashuv. Tezlik, aniqlik va bilim g‘olibni aniqlaydi!
              </p>
            </div>

            {/* Battle Stats Pill */}
            {profileData?.stats && (
              <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-2xl">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Battle Reytingi</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-lg font-black text-white">{profileData.stats.battleRating}</span>
                  </div>
                  <span className="text-[11px] text-purple-400 font-bold block">{profileData.stats.league}</span>
                </div>

                <div className="w-px h-10 bg-slate-800" />

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">G‘alaba / Seriya</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-black text-emerald-400">{profileData.stats.wins} W</span>
                    <span className="text-xs text-slate-500">/ {profileData.stats.totalBattles}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>Streak: {profileData.stats.winStreak} ta</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs (only shown when not inside an active round) */}
          {activeTab !== 'battle' && activeTab !== 'vs_screen' && activeTab !== 'matchmaking' && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setActiveTab('lobby')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'lobby'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>Jang Maydoni</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('history');
                  fetchHistory();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Janglar Tarixi</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  fetchLeaderboard();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Battle Reytingi</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          TAB 1: LOBBY (SOHA TANLASH & MATCHMAKING)
      ========================================================================= */}
      {activeTab === 'lobby' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* Active Career Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-1">
                  1. Sizning Kasbiy Jang Sohangiz
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>{selectedCareer?.icon || '💻'}</span>
                  <span>{selectedCareer?.title}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ushbu duelda faqat shu kasbga tegishli fanlar bo‘yicha savollar beriladi.
                </p>
              </div>

              <button
                onClick={() => setShowSphereSelector(!showSphereSelector)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Sohani almashtirish</span>
              </button>
            </div>

            {/* Required subjects pill */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400">Kerakli fanlar:</span>
              {selectedCareer?.requiredSubjects?.map((subj, i) => (
                <span key={i} className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  {subj}
                </span>
              ))}
            </div>

            {/* Sphere Selector Drawer */}
            {showSphereSelector && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-white block">Mavjud sohalardan birini tanlang:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSpheres.map(s => (
                    <button
                      key={s.slug}
                      onClick={() => {
                        setSelectedCareer(s);
                        setShowSphereSelector(false);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
                        selectedCareer?.slug === s.slug
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Battle rules callout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block">Raundlar</span>
                <span className="font-black text-white text-sm">5 ta tezkor savol</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block">Savol vaqti</span>
                <span className="font-black text-white text-sm">15 soniya / raund</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block">G‘olib mukofoti</span>
                <span className="font-black text-amber-400 text-sm">+50 Coin, +80 XP</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block">Reyting kuchi</span>
                <span className="font-black text-emerald-400 text-sm">+25 - +35 Elo</span>
              </div>
            </div>

            {/* BIG ACTION BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleStartMatchmaking}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] group"
              >
                <Swords className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                <span>Raqib Qidirish & Jangni Boshlash</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Badges showcase */}
          {profileData?.stats?.badges && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Battle Nishonlaringiz:</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Jangovar Daho</span>
                    <span className="text-[10px] text-slate-500">1-g‘alaba uchun</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Yengilmas Bahodir</span>
                    <span className="text-[10px] text-slate-500">3 ta ketma-ket g‘alaba</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Tezkor Qoplon</span>
                    <span className="text-[10px] text-slate-500">5 soniyadan tez javob</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Olmos Gladiator</span>
                    <span className="text-[10px] text-slate-500">1500+ Reyting</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          MATCHMAKING SCREEN (RADAR ANIMATSIYASI)
      ========================================================================= */}
      {activeTab === 'matchmaking' && (
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-8 animate-in fade-in">
          
          {/* Radar circle */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" />
            <div className="absolute inset-4 rounded-full border border-purple-500/50 animate-pulse" />
            <div className="absolute inset-10 rounded-full border-2 border-dashed border-amber-400 animate-spin duration-1000" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-3xl shadow-2xl shadow-purple-500/50">
              ⚔️
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">Raqib Qidirilmoqda...</h3>
            <p className="text-xs text-purple-300 font-semibold">{matchmakingText}</p>
            <div className="text-[11px] text-slate-500">
              Soha: <strong className="text-slate-300">{selectedCareer?.title}</strong>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('lobby')}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold transition-colors"
          >
            Bekor qilish
          </button>
        </div>
      )}

      {/* =========================================================================
          VS SCREEN (BOSH QARAMA-QARSHILIK EKRANI)
      ========================================================================= */}
      {activeTab === 'vs_screen' && opponent && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in zoom-in-95 duration-300">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>RAQIB TOPILDI! JANG BOSHLANMOQDA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            
            {/* Player Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-brand-500 shadow-2xl shadow-brand-500/20 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-3xl mx-auto shadow-lg">
                {user?.avatar || '🧑‍🎓'}
              </div>
              <div>
                <h4 className="text-base font-black text-white">{user?.name || "O'quvchi Dilshod"}</h4>
                <span className="text-xs text-brand-400 font-bold block">{profileData?.stats?.league || 'Kumush Liga'}</span>
                <span className="text-[11px] text-slate-400">{profileData?.stats?.battleRating || 1200} Reyting</span>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-rose-500/40 animate-pulse">
                VS
              </div>
              <span className="text-xs text-slate-400 font-bold mt-2">5 Raundlik Bellashuv</span>
            </div>

            {/* Opponent Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-rose-500 shadow-2xl shadow-rose-500/20 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-600 flex items-center justify-center text-3xl mx-auto shadow-lg">
                {opponent.avatar || '👤'}
              </div>
              <div>
                <h4 className="text-base font-black text-white">{opponent.name}</h4>
                <span className="text-xs text-rose-400 font-bold block">{opponent.grade} • {opponent.winRate} G‘alaba</span>
                <span className="text-[11px] text-slate-400">{opponent.rating} Reyting</span>
              </div>
            </div>

          </div>

          <div className="text-xs text-slate-400 font-bold animate-pulse">
            Tayyorlaning, 1-raund 3 soniyada boshlanadi...
          </div>
        </div>
      )}

      {/* =========================================================================
          ACTIVE 1V1 BATTLE ROUND SCREEN
      ========================================================================= */}
      {activeTab === 'battle' && currentQ && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Top Duel Gauge & Scoreboard */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              
              {/* Left: You */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-xl sm:text-2xl shadow-md">
                  {user?.avatar || '🧑‍🎓'}
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-white block">Siz</span>
                  <span className="text-base sm:text-xl font-black text-brand-400">{myTotalScore} ball</span>
                </div>
              </div>

              {/* Center: Round & Timer */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
                  Raund {currentRound + 1} / {questions.length}
                </span>
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-black mx-auto ${
                  roundTimeLeft <= 4
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-ping'
                    : 'border-amber-400 bg-amber-400/10 text-amber-300'
                }`}>
                  {roundTimeLeft}
                </div>
              </div>

              {/* Right: Opponent */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-xs sm:text-sm font-black text-white block">{opponent?.name || 'Raqib'}</span>
                  <span className="text-base sm:text-xl font-black text-rose-400">{oppTotalScore} ball</span>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-xl sm:text-2xl shadow-md">
                  {opponent?.avatar || '👤'}
                </div>
              </div>

            </div>

            {/* Opponent Status Indicator */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">
                Soha: <strong className="text-purple-300">{selectedCareer?.title}</strong>
              </span>
              <span className="text-slate-400 flex items-center gap-1.5">
                {opponentStatus === 'thinking' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Raqib o‘ylamoqda...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-bold">Raqib javob berdi!</span>
                  </>
                )}
              </span>
            </div>

          </div>

          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fan: {currentQ.subject}
              </span>
              <span className="text-xs text-amber-400 font-bold">
                Tezlik bonusi: +{Math.max(0, roundTimeLeft * 3)} ball
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isUserChoice = userSelectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:bg-slate-800';

                if (roundEnded) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-400';
                  } else if (isUserChoice && !isCorrect) {
                    btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 line-through';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={roundEnded}
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full p-4 rounded-2xl text-left font-semibold text-xs sm:text-sm transition-all border flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isUserChoice ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span>{opt}</span>
                    </div>

                    {roundEnded && isCorrect && (
                      <span className="text-xs font-black text-emerald-400">To‘g‘ri javob ✓</span>
                    )}
                    {roundEnded && isUserChoice && !isCorrect && (
                      <span className="text-xs font-black text-rose-400">Xato ✕</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Round Feedback when ended */}
            {roundEnded && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  {userSelectedOption === currentQ.correctIndex ? (
                    <span className="font-black text-emerald-400">Siz to‘g‘ri topdingiz! 🎉</span>
                  ) : (
                    <span className="font-bold text-rose-400">Siz adashdingiz...</span>
                  )}
                  <span>•</span>
                  <span>
                    Raqib: {opponentAnswer?.isCorrect ? (
                      <strong className="text-emerald-400">To‘g‘ri (+100)</strong>
                    ) : (
                      <strong className="text-rose-400">Xato (0)</strong>
                    )}
                  </span>
                </div>
                <span className="text-slate-400">Keyingi raund yuklanmoqda...</span>
              </div>
            )}

          </div>

        </div>
      )}

      {/* =========================================================================
          RESULT SCREEN (VICTORY / DEFEAT / DRAW)
      ========================================================================= */}
      {activeTab === 'result' && battleResult && (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in zoom-in-95">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
            
            {/* Background aura */}
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
              battleResult.result === 'victory' ? 'bg-emerald-500/25' : 'bg-rose-500/20'
            }`} />

            <div className="relative z-10 space-y-3">
              {battleResult.result === 'victory' ? (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-amber-500/30 animate-bounce">
                    🏆
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">GʻALABA!</h2>
                  <p className="text-xs sm:text-sm text-emerald-400 font-bold">
                    Ajoyib bilim va tezkorlik! Siz raqibingizdan ustun keldingiz!
                  </p>
                </>
              ) : battleResult.result === 'defeat' ? (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-rose-500/30">
                    🛡️
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">MAGʻLUBIYAT</h2>
                  <p className="text-xs sm:text-sm text-rose-400 font-bold">
                    Bu safar raqib tezroq bo‘ldi. Xatolar ustida ishlab, qayta jang qiling!
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-4xl mx-auto shadow-2xl">
                    🤝
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">DURANG!</h2>
                  <p className="text-xs sm:text-sm text-purple-300 font-bold">
                    Ikkala tomon ham teng kuchli natija ko‘rsatdi!
                  </p>
                </>
              )}
            </div>

            {/* Scoreboard comparison */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 items-center">
              <div>
                <span className="text-xs text-slate-400 font-bold block">Sizning balingiz</span>
                <span className="text-2xl font-black text-brand-400">{battleResult.myScore}</span>
                <span className="text-[11px] text-slate-500 block">({battleResult.myCorrectCount} / 5 ta to‘g‘ri)</span>
              </div>
              <div className="text-xl font-black text-slate-600">VS</div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Raqib bali</span>
                <span className="text-2xl font-black text-rose-400">{battleResult.opponentScore}</span>
                <span className="text-[11px] text-slate-500 block">({battleResult.opponentCorrectCount} / 5 ta to‘g‘ri)</span>
              </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Reyting o‘zgarishi</span>
                <span className={`text-base font-black ${battleResult.ratingDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {battleResult.ratingDelta >= 0 ? `+${battleResult.ratingDelta}` : battleResult.ratingDelta} Elo
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Yutilgan Coin</span>
                <span className="text-base font-black text-amber-400">+{battleResult.coinsEarned} coin</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Yangi Reyting</span>
                <span className="text-base font-black text-white">{battleResult.newRating}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold block">Win Streak</span>
                <span className="text-base font-black text-orange-400">{battleResult.winStreak} ta seriya</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handleStartMatchmaking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yana Jang Qilish ⚔️</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  fetchHistory();
                }}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                <span>Tarixni Ko‘rish</span>
              </button>
            </div>

          </div>

          {/* Question Breakdown and Explanations */}
          {battleResult.roundsReview && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Savollar Yechimi va Tushuntirishlari:</span>
              </h3>
              <div className="space-y-3">
                {battleResult.roundsReview.map((r, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-400">Raund #{r.index + 1}</span>
                      <div className="flex items-center gap-3">
                        <span className={r.isUserCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          Siz: {r.isUserCorrect ? 'To‘g‘ri ✓' : 'Xato ✕'}
                        </span>
                        <span className={r.isOpponentCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                          Raqib: {r.isOpponentCorrect ? 'To‘g‘ri ✓' : 'Xato ✕'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">{r.question}</p>
                    <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                      💡 <strong>Izoh:</strong> {r.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: MATCH HISTORY
      ========================================================================= */}
      {activeTab === 'history' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Battle Janglari Tarixi</h2>
              <p className="text-xs text-slate-400">O‘tkazilgan barcha 1v1 duellar, hisoblar va reyting o‘zgarishlari</p>
            </div>
            <button
              onClick={() => setActiveTab('lobby')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              + Yangi Jang
            </button>
          </div>

          {historyLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Tarix yuklanmoqda...</div>
          ) : historyList.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2">
              <span className="text-4xl">⚔️</span>
              <h3 className="text-sm font-bold text-white">Hozircha janglar tarixi mavjud emas</h3>
              <p className="text-xs text-slate-400">Arenaga kiring va birinchi duelingizni boshlang!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map(item => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                      {item.opponentAvatar || '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">vs {item.opponentName}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.date).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                      <span className="text-xs text-purple-300 font-semibold">{item.careerTitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs font-black text-white">{item.myScore} : {item.opponentScore}</span>
                      <span className="text-[10px] text-slate-500 block">
                        ({item.myCorrectCount} / {item.totalQuestions})
                      </span>
                    </div>

                    <div>
                      {item.result === 'victory' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                          G‘alaba (+{item.ratingDelta || 25})
                        </span>
                      ) : item.result === 'defeat' ? (
                        <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                          Mag‘lubiyat ({item.ratingDelta || -15})
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                          Durang (+5)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: BATTLE LEADERBOARD
      ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Battle Arenasi Peshqadamlari</h2>
            <p className="text-xs text-slate-400">Eng yuqori Elo reytingiga ega yosh daho jangchilar jadvali</p>
          </div>

          <div className="space-y-2">
            {leaderboardList.map(item => (
              <div
                key={item.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  item.isMe
                    ? 'bg-purple-950/40 border-purple-500/40 ring-1 ring-purple-400/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                    item.rank === 1 ? 'bg-amber-400 text-slate-950' :
                    item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    item.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {item.rank}
                  </div>
                  <div className="text-2xl">{item.avatar}</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isMe && (
                        <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-black">
                          SIZ
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">{item.career}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-400 block">{item.rating} Elo</span>
                  <span className="text-[10px] text-purple-300 font-bold">{item.league}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BattleArena;
