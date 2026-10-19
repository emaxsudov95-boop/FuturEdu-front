import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  BookOpen, 
  Coins, 
  CreditCard, 
  CheckSquare, 
  TrendingUp, 
  Bot, 
  ArrowUpRight, 
  Plus, 
  Bell, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard();
      if (res.data?.stats) {
        setData(res.data.stats);
      }
    } catch (err) {
      console.error('Admin dash error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400 font-semibold">Dashboard koʻrsatkichlari yuklanmoqda...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Jami Oʻquvchilar",
      value: data?.totalStudents || 0,
      sub: `${data?.activeStudents || 0} nafari faol`,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      link: "/admin/students"
    },
    {
      title: "Mavjud Testlar",
      value: data?.totalQuizzesCount || 0,
      sub: "Barcha fanlar boʻyicha",
      icon: BookOpen,
      color: "from-purple-600 to-brand-600",
      link: "/admin/quizzes"
    },
    {
      title: "Amaliy Topshiriqlar",
      value: data?.totalAssignmentsCount || 0,
      sub: "Faol topshiriqlar",
      icon: CheckSquare,
      color: "from-emerald-600 to-teal-600",
      link: "/admin/assignments"
    },
    {
      title: "Aylanishdagi Coinlar",
      value: `${(data?.totalCoinsInCirculation || 0).toLocaleString()} 🪙`,
      sub: "Oʻquvchilar hisobida",
      icon: Coins,
      color: "from-amber-500 to-yellow-600",
      link: "/admin/rewards"
    },
    {
      title: "Jami Tushumlar",
      value: `${(data?.totalRevenue || 0).toLocaleString()} soʻm`,
      sub: "Toʻlovlar muvaffaqiyatli",
      icon: CreditCard,
      color: "from-rose-600 to-orange-600",
      link: "/admin/payments"
    },
    {
      title: "AI Ustoz Sifati",
      value: `${data?.aiSatisfaction || 98.4}%`,
      sub: "Oʻquvchilar qoniqishi",
      icon: Bot,
      color: "from-indigo-600 to-cyan-600",
      link: "/admin/ai-control"
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Boshqaruv Paneli</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Dashboard
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Platformaning barcha faoliyati, oʻquvchilar natijalari va statistikasi
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/quizzes"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi test</span>
          </Link>
          <Link
            to="/admin/notifications"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Eʻlon yuborish</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-6 rounded-3xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 group flex items-start justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {card.title}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-brand-400 transition-colors">
                  {card.value}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {card.sub}
                </span>
              </div>

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Graphs & Analytics 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Activity Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Haftalik oʻquvchilar faolligi</h3>
              <p className="text-xs text-slate-400">Kunlik topshirilgan testlar dinamikasi</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-900 text-indigo-400 border border-slate-800">
              Oxirgi 7 kun
            </span>
          </div>

          {/* Custom Modern CSS / SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {data?.weeklyActivity?.map((item, idx) => {
                const max = 120;
                const heightPercent = Math.round((item.testlar / max) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.testlar}
                    </span>
                    <div className="w-full bg-slate-900 rounded-t-xl h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-brand-600 via-indigo-500 to-cyan-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 mt-1">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subjects Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Fanlar taqsimoti</h3>
            <p className="text-xs text-slate-400">Oʻquvchilar eng koʻp yechgan fanlar</p>
          </div>

          <div className="space-y-4">
            {data?.subjectsBreakdown?.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{sub.subject}</span>
                  <span className="text-slate-400">{sub.percent}% ({sub.count})</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                    style={{ width: `${sub.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/quizzes"
            className="w-full py-2.5 text-center text-xs font-bold text-brand-400 hover:text-white bg-slate-900 rounded-xl transition-colors block"
          >
            Fanlar va testlarni toʻliq boshqarish →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
