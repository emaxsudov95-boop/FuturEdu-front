import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import { 
  Clock, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  AlertCircle, 
  Coins, 
  Flame, 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Bot, 
  FileText,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  UserPlus
} from 'lucide-react';

const ParentDashboard = () => {
  const { selectedChildId } = useOutletContext();
  const [data, setData] = useState(null);
  const [subscription, setSubscription] = useState(() => {
    try {
      const saved = localStorage.getItem('parent_subscription');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildData(selectedChildId);

    const handleChildChange = (e) => {
      fetchChildData(e.detail.childId);
    };

    const handleSubChange = (e) => {
      if (e.detail?.subscription) {
        setSubscription(e.detail.subscription);
      } else {
        try {
          const saved = localStorage.getItem('parent_subscription');
          if (saved) setSubscription(JSON.parse(saved));
        } catch {}
      }
    };

    window.addEventListener('parentChildChanged', handleChildChange);
    window.addEventListener('parentSubscriptionChanged', handleSubChange);
    return () => {
      window.removeEventListener('parentChildChanged', handleChildChange);
      window.removeEventListener('parentSubscriptionChanged', handleSubChange);
    };
  }, [selectedChildId]);

  const fetchChildData = async (childId) => {
    setLoading(true);
    try {
      const res = await parentAPI.getChildDashboard(childId);
      if (res.data?.data) {
        setData(res.data.data);
      }
      if (res.data?.subscription) {
        setSubscription(res.data.subscription);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400 font-semibold">Farzand maʼlumotlari tahlil qilinmoqda...</p>
      </div>
    );
  }

  // Agar ota-onada hali birorta ham bola ulanmagan bo'lsa
  if (!data) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-5xl mx-auto shadow-2xl">
          👨‍👩‍👧
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Hozircha farzand qo‘shilmagan</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Farzandingizning darslari, test ballari, o‘zlashtirish dinamikasi va yutuqlarini kuzatish uchun platformadagi hisobini bog‘lang.
          </p>
        </div>

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openAddChildModal'));
          }}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Bola qo‘shish</span>
        </button>

        {/* Yordamchi quticha */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2 text-slate-400">
          <span className="font-bold text-white block">💡 Qanday ishlaydi?</span>
          <p>
            Farzandingiz platformada ro‘yxatdan o‘tgan email manzilini (masalan: <code>azizbek@maktab.uz</code> yoki <code>dilshod@edulearn.uz</code>) kiriting. Tizim uni avtomatik topib, sizning ota-onalik monitoring profilingizga bog‘laydi.
          </p>
        </div>
      </div>
    );
  }

  // O'quv vaqtini soat va daqiqaga aylantirish
  const formatStudyTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} daqiqa`;
    return `${hrs} soat ${mins > 0 ? mins + ' daq' : ''}`;
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Banner with Child Info */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 p-6 sm:p-8 rounded-3xl border border-emerald-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-emerald-700/60 flex items-center justify-center text-4xl shadow-inner">
            {data?.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{data?.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {data?.grade}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{data?.school}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-brand-300 font-semibold">
              <span>Orzuidagi kasb: <strong>{data?.selectedCareer}</strong></span>
            </div>
          </div>
        </div>

        {/* Rank & League Box */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center px-3 border-r border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Umumiy Oʻrin</span>
            <span className="text-xl font-black text-amber-400">#{data?.rank}</span>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Liga</span>
            <span className="text-xs font-extrabold text-white">{data?.league}</span>
          </div>
        </div>
      </div>

      {/* Tekin tarif holati haqida ogohlantirish / Premiumga o'tish callout */}
      {!subscription?.isPremium && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-200">
            <span className="text-xl">🌱</span>
            <div>
              <span className="font-extrabold text-white block">Siz Tekin (baza) tarifidasiz</span>
              <span className="text-slate-400">AI individual maslahatlari va rasmiy PDF hisobotlarni ochish uchun Premium tarifiga o'ting.</span>
            </div>
          </div>
          <Link
            to="/parent/premium"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shrink-0 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>Aktivlashtirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Daily Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Bugungi oʻquv vaqti</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {formatStudyTime(data?.studyTimeMinutesToday || 0)}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">Reja: 1.5 soat (Bajarildi ✨)</span>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Yechilgan testlar</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {data?.testsCompletedToday} ta test
          </div>
          <span className="text-[10px] text-indigo-400 font-semibold block">Informatika & Matematika</span>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Oʻrtacha aniqlik</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {data?.accuracyRate}%
          </div>
          <span className="text-[10px] text-amber-400/80 font-semibold block">Toʻgʻri javoblar koʻrsatkichi</span>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Faol topshiriqlar</span>
            <CheckSquare className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {data?.activeTasksCount} ta vazifa
          </div>
          <span className="text-[10px] text-rose-400 font-semibold block">Muddati yaqinlashmoqda</span>
        </div>

      </div>

      {/* Fanlar bo'yicha bilim darajasi & Haftalik o'sish grafikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Fanlar bo'yicha tahlil (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Fanlar boʻyicha oʻzlashtirish</h3>
              <p className="text-xs text-slate-400">Farzandingizning har bir fandagi bilim koʻrsatkichi</p>
            </div>
            <span className="text-xs font-bold text-emerald-400">Haqiqiy natijalar</span>
          </div>

          <div className="space-y-4">
            {data?.subjectMastery?.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">{sub.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.2 rounded font-extrabold ${
                      sub.status === "A'lo" ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      sub.status === "Yaxshi" ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-slate-300 font-black">{sub.percent}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${sub.color} rounded-full transition-all duration-500`}
                    style={{ width: `${sub.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Haftalik o'sish dinamikasi (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Haftalik oʻquv dinamikasi</h3>
            <p className="text-xs text-slate-400">Kunlar kesimida dars vaqtlari (daqiqada)</p>
          </div>

          {/* Bar Chart */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2">
              {data?.weeklyProgress?.map((item, idx) => {
                const max = 130;
                const heightPercent = Math.round((item.minutes / max) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.minutes}m
                    </span>
                    <div className="w-full bg-slate-900 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Haftalik jami oʻrganish:</span>
            <strong className="text-emerald-400 font-extrabold">10.5 soat</strong>
          </div>
        </div>

      </div>

      {/* Kuchli va Zaif Tomonlar Tahlili (Muhim talab!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kuchli tomonlar */}
        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-white text-base">Kuchli tomonlari va yutuqlar</h3>
          </div>

          <ul className="space-y-2.5">
            {data?.strengths?.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed p-3 bg-slate-900/70 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Zaif tomonlar */}
        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-extrabold text-white text-base">Eʻtibor qaratilishi kerak boʻlgan mavzular</h3>
          </div>

          <ul className="space-y-2.5">
            {data?.weaknesses?.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed p-3 bg-slate-900/70 rounded-2xl border border-amber-950/60">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/parent/ai-advice"
            className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
          >
            <Bot className="w-4 h-4" />
            <span>Uyda qanday yordam berish boʻyicha AI tavsiyalarini olish →</span>
          </Link>
        </div>

      </div>

      {/* Yutuq nishonlari & So'nggi faoliyat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nishonlar */}
        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">Qoʻlga kiritilgan nishonlar</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data?.badges?.map((b, i) => (
              <div key={i} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-3xl block">{b.icon}</span>
                <span className="text-xs font-bold text-white block truncate">{b.name}</span>
                <span className="text-[10px] text-slate-500">{b.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* So'nggi faoliyat */}
        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">Soʻnggi oʻquv harakatlari</h3>
            <span className="text-[11px] text-slate-500 font-semibold">Jonli sinxron</span>
          </div>

          <div className="space-y-2.5">
            {data?.recentActivities?.map((act, i) => (
              <div key={i} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{act.title}</span>
                  <span className="text-[10px] text-slate-500">{act.time}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                  act.type === 'success' ? 'text-emerald-400 bg-emerald-950' :
                  act.type === 'warning' ? 'text-amber-400 bg-amber-950' :
                  'text-indigo-400 bg-indigo-950'
                }`}>
                  {act.score}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ParentDashboard;
