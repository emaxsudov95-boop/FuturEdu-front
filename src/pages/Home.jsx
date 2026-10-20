import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  Trophy, 
  Gift, 
  Bot, 
  ArrowRight, 
  Coins, 
  Flame, 
  Star, 
  CheckCircle2, 
  PlayCircle,
  Zap,
  HelpCircle,
  Swords
} from 'lucide-react';
import { quizAPI, careerAPI, userAPI } from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 5,
    totalCareers: 6,
    topStudents: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, cRes, lRes] = await Promise.all([
          quizAPI.getAll(),
          careerAPI.getAll(),
          userAPI.getLeaderboard()
        ]);
        setStats({
          totalQuizzes: qRes.data?.count || 5,
          totalCareers: cRes.data?.count || 6,
          topStudents: (lRes.data?.data || []).slice(0, 3)
        });
      } catch (e) {
        console.log('Home data fetch fallback');
      }
    };
    fetchData();
  }, []);

  const subjects = [
    { name: 'Matematika', icon: '📐', count: '10+ test', color: 'from-blue-500 to-indigo-600', link: '/quizzes?subject=Matematika' },
    { name: 'Informatika', icon: '💻', count: '12+ test', color: 'from-violet-500 to-purple-600', link: '/quizzes?subject=Informatika' },
    { name: 'Fizika', icon: '⚡', count: '8+ test', color: 'from-amber-500 to-orange-600', link: '/quizzes?subject=Fizika' },
    { name: 'Ingliz tili', icon: '🌍', count: '15+ test', color: 'from-emerald-500 to-teal-600', link: '/quizzes?subject=Ingliz%20tili' },
    { name: 'Biologiya', icon: '🌿', count: '7+ test', color: 'from-green-500 to-emerald-600', link: '/quizzes?subject=Biologiya' },
    { name: 'Mantiqiy savollar', icon: '🧩', count: '9+ test', color: 'from-rose-500 to-pink-600', link: '/quizzes?subject=Mantiq' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        {/* Background gradient blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-amber-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold shadow-sm">
                <img src="/logo.png" alt="FuturEdu" className="w-5 h-5 object-contain" />
                <span>FuturEdu — Oʻquvchilar uchun interaktiv taʼlim olami 🚀</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Oʻrgan, <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-500 bg-clip-text text-transparent">Coin yut</span> va kelajak kasbingni tanla!
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                FuturEdu platformasida fanlar boʻyicha qiziqarli testlarni yeching, har bir toʻgʻri javob uchun oltin tangalar yigʻing, yoqimli AI ustozdan tushunmagan mavzularingizni soʻrang va sovrinlarga ega boʻling!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/quizzes"
                  className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Testlarni boshlash</span>
                </Link>

                <Link
                  to="/careers"
                  className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200/90 shadow-sm hover:shadow transition-all"
                >
                  <Compass className="w-5 h-5 text-brand-600" />
                  <span>Kasbimni tanlash</span>
                </Link>

                <Link
                  to="/ai-tutor"
                  className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-base border border-indigo-200 transition-all"
                >
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <span>AI Ustoz bilan chat</span>
                </Link>
              </div>

              {/* Mini highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/70 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-brand-700">100%</div>
                  <div className="text-xs text-slate-600 font-medium">Bepul & qulay</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-amber-500 flex items-center justify-center lg:justify-start gap-1">
                    <Coins className="w-5 h-5 fill-amber-500" /> +Coin
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Har bir test uchun</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-emerald-600 flex items-center justify-center lg:justify-start gap-1">
                    <Zap className="w-5 h-5 fill-emerald-600" /> 24/7
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Yoqimli AI ustoz</div>
                </div>
              </div>

            </div>

            {/* Right Interactive Gamification Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                
                {/* Floating Coin Notification */}
                <div className="absolute -top-5 -right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1.5 animate-bounce-slow">
                  <Coins className="w-4 h-4 fill-amber-900" />
                  <span>+40 Coin yutib olindi!</span>
                </div>

                {/* Card Header: Student Profile Sneak-peek */}
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-100 to-indigo-100 flex items-center justify-center text-3xl shadow-inner">
                    {user?.avatar || '🧑‍🎓'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {user ? user.name : "FuturEdu Oʻquvchisi"}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {user?.selectedCareer || "Kelajak Dasturchisi 💻"}
                    </p>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/60">
                    <span className="text-[11px] font-semibold text-amber-700 block">Mavjud tangalar</span>
                    <span className="text-2xl font-black text-amber-600 flex items-center gap-1">
                      <Coins className="w-5 h-5 fill-amber-500" />
                      {user?.coins || 160}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200/60">
                    <span className="text-[11px] font-semibold text-violet-700 block">Daraja (Level)</span>
                    <span className="text-2xl font-black text-violet-600 flex items-center gap-1">
                      <Flame className="w-5 h-5 fill-rose-500 text-rose-500" />
                      Lv.{user?.level || 2}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Keyingi darajagacha (Lv.3)</span>
                    <span className="text-brand-600">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full w-3/4"></div>
                  </div>
                </div>

                {/* AI Tutor Message bubble */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-900 text-xs leading-relaxed flex items-start gap-2.5">
                  <span className="text-2xl shrink-0">🤖</span>
                  <div>
                    <span className="font-bold block text-indigo-950 mb-0.5">AI Ustoz eslatmasi:</span>
                    "Salom! Bugun 1 ta matematika testini topshirib, kunlik olovingni (streak) oshirib qoʻyishni unutma!"
                  </div>
                </div>

                {/* Quick Button */}
                <Link
                  to="/quizzes"
                  className="mt-4 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Bugungi testni yechish</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1v1 BATTLE (BILIM JANGI) BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border border-purple-500/30 p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-purple-500/30">
                ⚔️
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-[11px] font-black uppercase">
                  <span>Yangi Gamifikatsiya</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black">1v1 Bilim Jangi (Battle Arena)</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Tanlagan kasbingiz va unga tegishli fanlar bo‘yicha tengdoshlaringiz bilan 15 soniyalik raundlarda bellashing. G‘olibga <strong>+50 Coin</strong>, <strong>+80 XP</strong> va maxsus jangovar nishonlar!
                </p>
              </div>
            </div>

            <Link
              to="/battle"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-sm shadow-xl shadow-pink-500/25 flex items-center gap-2 shrink-0 transition-all hover:scale-105 active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>Jangga Kirish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fanlar bo'yicha tezkor testlar (Subjects Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">Fanlar & Mashgʻulotlar</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Qaysi fandan bilimingni sinamoqchisan?
            </h2>
          </div>
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Barcha testlarni koʻrish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((sub, idx) => (
            <Link
              key={idx}
              to={sub.link}
              className="group p-5 bg-white rounded-3xl border border-slate-200/80 hover:border-brand-300 hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-3xl shadow-sm mb-3">
                {sub.icon}
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                {sub.name}
              </h3>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">
                {sub.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Kasb tanlash bo'limi (Career guidance showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>Kelajak kasblari yoʻriqnomasi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Oʻzing yoqtirgan kasbni tanla, biz esa kerakli fanlarni tavsiya qilamiz!
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dasturchi, Shifokor, Sunʼiy Intellekt Muhandisi yoki Arxitektor boʻlmoqchimisiz? Platformamiz har bir kasb uchun nimalarni oʻqish kerakligini xaritada (roadmap) koʻrsatadi.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/careers"
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl shadow-lg transition-all"
              >
                Kasblar katalogiga oʻtish
              </Link>
              <Link
                to="/careers"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all"
              >
                Moslik testini topshirish
              </Link>
            </div>
          </div>

          {/* Decorative icons in background */}
          <div className="absolute right-4 bottom-4 sm:right-12 sm:bottom-8 opacity-20 text-8xl sm:text-9xl pointer-events-none select-none">
            🚀
          </div>
        </div>
      </section>

      {/* Savol-Javob va Reyting 2 ustunli blok */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Q&A Forum Sneak-peek */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Savol-Javob maydoni</h3>
                    <p className="text-xs text-slate-600">Tushunmagan savollaringizga birgalikda javob topamiz</p>
                  </div>
                </div>
                <Link to="/qa" className="text-xs font-bold text-brand-600 hover:text-brand-700">Barchasi →</Link>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 font-bold">Informatika</span>
                    <span className="text-[11px] text-slate-600">Sardorbek tomonidan</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    Dasturchi boʻlish uchun matematikani qanchalik chuqur bilish shart?
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                    AI Ustoz: "HTML/CSS va JS uchun mantiq kifoya, lekin algoritmlar uchun..."
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold">Fizika</span>
                    <span className="text-[11px] text-slate-600">Zuhraxon tomonidan</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    Fizikada Nyuton olmaning tushishidan qanday qonun yaratgan?
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                    AI Ustoz: "Gravitatsiya kuchi va Yer atrofida aylanish sirlari..."
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/qa"
              className="mt-6 w-full py-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs sm:text-sm rounded-xl text-center transition-colors"
            >
              Savol berish va javob yozish (+10 Coin)
            </Link>
          </div>

          {/* Leaderboard Top o'quvchilar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Haftalik chempionlar</h3>
                    <p className="text-xs text-slate-600">Eng koʻp Coin toʻplagan iqtidorli oʻquvchilar</p>
                  </div>
                </div>
                <Link to="/leaderboard" className="text-xs font-bold text-brand-600 hover:text-brand-700">Reyting →</Link>
              </div>

              <div className="space-y-2.5 pt-2">
                {stats.topStudents.length > 0 ? (
                  stats.topStudents.map((st, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          i === 0 ? 'bg-amber-400 text-amber-950' : i === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700 text-white'
                        }`}>
                          {i + 1}
                        </span>
                        <span className="text-xl">{st.avatar}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{st.name}</div>
                          <div className="text-[10px] text-slate-600">{st.grade} • Lv.{st.level}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-extrabold text-xs sm:text-sm text-amber-600">
                        <Coins className="w-4 h-4 fill-amber-500" />
                        <span>{st.coins}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-600">Chempionlar yuklanmoqda...</div>
                )}
              </div>
            </div>

            <Link
              to="/leaderboard"
              className="mt-6 w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm rounded-xl text-center transition-colors"
            >
              Toʻliq reyting va ligalarni koʻrish 🏆
            </Link>
          </div>

        </div>
      </section>

      {/* Sovg'alar va Gamifikatsiya Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/20">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
              🎁
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                Yigʻilgan Coinlarni sovgʻalarga almashtir!
              </h3>
              <p className="text-xs sm:text-sm font-medium text-amber-900 mt-0.5">
                Oltin daho nishonlari, AI Ustoz VIP huquqi, dasturlash kitoblari va super sertifikatlar sizni kutmoqda.
              </p>
            </div>
          </div>
          <Link
            to="/rewards"
            className="whitespace-nowrap px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm shadow-md transition-all shrink-0"
          >
            Sovgʻalar doʻkoniga oʻtish 🪙
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
