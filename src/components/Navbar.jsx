import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { publicAPI } from '../services/api';
import { 
  Compass, 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  Gift, 
  Bot, 
  LogOut, 
  Menu, 
  X, 
  Coins, 
  Flame, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  ArrowRight,
  Minimize2,
  Maximize2,
  Grid,
  ExternalLink,
  MessageSquare,
  Target,
  Swords
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const menuRef = useRef(null);

  // Navbarni bosganda ochilishi holati (Standart holatda yopiq - joy tejash uchun)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Navbarni to'liq kichraytirib qo'yish (Floating Mini Pill rejim)
  const [isMinimized, setIsMinimized] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  const navLinks = [
    { 
      name: 'Bosh sahifa', 
      path: '/', 
      icon: Sparkles, 
      color: 'from-blue-500 to-indigo-600', 
      desc: 'Asosiy darslar, tavsiyalar va yangiliklar' 
    },
    { 
      name: 'Kasb tanlash', 
      path: '/careers', 
      icon: Compass, 
      color: 'from-violet-500 to-purple-600', 
      desc: 'Kelajak kasblari va zarur fanlar yo‘l xaritasi' 
    },
    { 
      name: 'Testlar & Mashqlar', 
      path: '/quizzes', 
      icon: BookOpen, 
      color: 'from-emerald-500 to-teal-600', 
      desc: 'Fanlar bo‘yicha interaktiv testlar va topshiriqlar' 
    },
    { 
      name: 'MOK Test (100 Ball)', 
      path: '/mock', 
      icon: Target, 
      color: 'from-amber-500 to-orange-600', 
      desc: 'Fan bo‘yicha maxsus imtihon simulyatori, 80+ ballga to‘liq coin keshbek',
      highlight: true 
    },
    { 
      name: 'Battle (Bilim Jangi)', 
      path: '/battle', 
      icon: Swords, 
      color: 'from-rose-500 to-indigo-600', 
      desc: '1v1 jonli bilim jangi! Elo reyting, soha savollari va g‘olibga coinlar',
      highlight: true 
    },
    { 
      name: 'Savol-Javob', 
      path: '/qa', 
      icon: HelpCircle, 
      color: 'from-amber-500 to-orange-600', 
      desc: 'O‘quvchilar forumi va tengdoshlar yordami' 
    },
    { 
      name: 'Reyting', 
      path: '/leaderboard', 
      icon: Trophy, 
      color: 'from-yellow-500 to-amber-600', 
      desc: 'Haftalik va umumiy peshqadamlar jadvali' 
    },
    { 
      name: 'Sovgʻalar Doʻkoni', 
      path: '/rewards', 
      icon: Gift, 
      color: 'from-rose-500 to-pink-600', 
      desc: 'To‘plangan coinlarni qimmatbaho sovg‘alarga almashtirish' 
    },
    { 
      name: 'Kasb Chati', 
      path: '/chat', 
      icon: MessageSquare, 
      color: 'from-teal-500 to-emerald-600', 
      desc: 'Tanlagan kasbingiz bo‘yicha yagona tengdoshlar va ustozlar guruhi' 
    },
    { 
      name: 'AI Ustoz', 
      path: '/ai-tutor', 
      icon: Bot, 
      color: 'from-indigo-500 to-purple-600', 
      desc: '24/7 aqlli yordamchi (Sunʼiy intellekt repetitor)',
      highlight: true 
    },
  ];

  // Marshrut o'zgarganda menyuni avtomatik yopish
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Tashqariga bosganda menyuni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Admin e'lonlarini tekshirish
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await publicAPI.getNotifications();
        if (res.data?.data && res.data.data.length > 0) {
          setAnnouncement(res.data.data[0]);
        }
      } catch (e) {}
    };
    fetchNotifs();
  }, []);

  const currentNav = navLinks.find(item => item.path === location.pathname) || { 
    name: 'Asosiy Menyu', 
    icon: Grid 
  };
  const CurrentIcon = currentNav.icon || Grid;

  // Agar foydalanuvchi "To'liq kichraytirish" rejimini tanlasa (ekranni 100% bo'shatish uchun)
  if (isMinimized) {
    return (
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2 animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 text-white backdrop-blur-md shadow-2xl border border-slate-700/80 hover:bg-slate-800 transition-all font-bold text-xs"
        >
          <img src="/logo.png" alt="FuturEdu" className="w-5 h-5 object-contain" />
          <span className="hidden sm:inline font-black tracking-tight">FuturEdu</span>
          <span className="px-2 py-0.5 rounded-lg bg-brand-500/20 text-brand-300 text-[11px] font-extrabold flex items-center gap-1">
            <Menu className="w-3 h-3" />
            <span>Menyu</span>
          </span>
          {user && (
            <span className="flex items-center gap-1 text-amber-400 font-extrabold text-[11px] pl-1">
              <Coins className="w-3 h-3 fill-amber-400" />
              <span>{user.coins}</span>
            </span>
          )}
        </button>

        <button
          onClick={() => setIsMinimized(false)}
          title="Navbarni qaytarish"
          className="p-2 rounded-2xl bg-white/90 text-slate-700 hover:text-brand-600 hover:bg-white shadow-xl border border-slate-200 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Minimized rejimdagi ochiladigan Menyu Drawer */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="fixed inset-x-3 sm:inset-x-auto sm:right-4 top-16 sm:w-[480px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-5 z-50 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <span className="font-extrabold text-sm text-slate-800">Platforma Bo‘limlari</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      active
                        ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-extrabold truncate">{item.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <Link to="/parent" onClick={() => setIsMenuOpen(false)} className="text-emerald-700 hover:underline">
                👨‍👩‍👧 Ota-onalar
              </Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-amber-700 hover:underline">
                🛡️ Admin Panel
              </Link>
              <button onClick={() => setIsMinimized(false)} className="text-brand-600 hover:underline">
                To‘liq bar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Admin e'loni yuqori bannari (agar mavjud bo'lsa) */}
      {announcement && showBanner && (
        <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center gap-2 truncate">
            <span className="text-sm">{announcement.icon || '📢'}</span>
            <span className="font-extrabold text-amber-300">Eʻlon:</span>
            <span className="truncate">{announcement.title} — {announcement.message}</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/80 hover:text-white pl-3 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ULTRA-IXCHAM ZAMONAVIY NAVBAR HEADER (Joyni tejaydi, bosganda ochiladi) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14">
            
            {/* Chap taraf: FuturEdu Logotipi */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <img 
                src="/logo.png" 
                alt="FuturEdu" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
              />
              <div>
                <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  FuturEdu
                </span>
              </div>
            </Link>

            {/* Markaz: BOSGANDA OCHILADIGAN ASOSIY MENYU TUGMASI (Juda qulay va joy egallamaydi) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border shadow-sm ${
                  isMenuOpen
                    ? 'bg-brand-600 text-white border-brand-600 ring-2 ring-brand-400/40'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
                title="Barcha bo‘limlarni ko‘rish uchun bosing"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <CurrentIcon className="w-3.5 h-3.5 text-brand-600" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">
                  {currentNav.name}
                </span>
                <span className="text-[10px] bg-white/40 px-1.5 py-0.5 rounded-full font-black hidden sm:inline">
                  Bo‘limlar
                </span>
                {isMenuOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                )}
              </button>

              {/* BOSILGANDA OCHILADIGAN MEGA-MENU (ANIMATED DROPDOWN DRAWER) */}
              {isMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[92vw] sm:w-[640px] md:w-[760px] max-w-4xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl p-5 sm:p-6 z-50 space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
                  
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black">
                        <Grid className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Platforma Bo‘limlari</h3>
                        <p className="text-[11px] text-slate-600 font-semibold">Kerakli bo‘limga bir bosishda o‘ting</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 text-xs font-extrabold flex items-center gap-1"
                    >
                      <span>Yopish</span>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 7 ta O'quvchi Bo'limlari - Chiroyli Kartalar Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {navLinks.map((item) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`group p-3 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                            active
                              ? 'bg-brand-50/80 border-brand-300 ring-1 ring-brand-400/50 shadow-sm'
                              : 'bg-slate-50/70 hover:bg-brand-50/40 border-slate-200/80 hover:border-brand-200 hover:-translate-y-0.5'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                                {item.name}
                              </h4>
                              {item.highlight && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-white rounded font-extrabold">
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5 font-medium leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pastki Bo'lim: Boshqaruv & Monitoring (Ota-onalar va Admin) */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 p-3 rounded-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/parent"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-xs font-black transition-all border border-emerald-800 shadow-sm"
                      >
                        <span>👨‍👩‍👧</span>
                        <span>Ota-onalar Monitoring Paneli</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 text-xs font-black transition-all border border-slate-800 shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Panel</span>
                      </Link>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-semibold flex items-center justify-end gap-1.5">
                      <img src="/logo.png" alt="FuturEdu" className="w-3.5 h-3.5 object-contain" />
                      <span>FuturEdu • Taʼlim platformasi 2026</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* O'ng taraf: Coinlar, Profil, Minimal tugmalar */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* BATTLE (1V1 BILIM JANGI) TUGMASI */}
              <Link
                to="/battle"
                title="Battle (1v1 Jonli Bilim Jangi, Elo Reyting & Coinlar)"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-pink-500/20 transition-all hover:scale-105"
              >
                <Swords className="w-3.5 h-3.5" />
                <span className="font-black text-xs">Battle</span>
                <span className="text-[9px] bg-white/20 text-white px-1 rounded font-black hidden sm:inline">
                  VS
                </span>
              </Link>

              {/* MOK TEST TUGMASI */}
              <Link
                to="/mock"
                title="MOK Test (100 ballik imtihon simulyatori, 80+ ballga keshbek)"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 shadow-sm transition-all hover:scale-105"
              >
                <Target className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-black text-xs">MOK Test</span>
                <span className="text-[9px] bg-amber-500 text-white px-1 rounded font-black hidden sm:inline">
                  100B
                </span>
              </Link>

              {/* OTA-ONALAR PANELI TO'G'RIDAN-TO'G'RI TUGMASI */}
              <Link
                to="/parent"
                title="Ota-onalar Monitoring Paneliga oʻtish"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-extrabold text-xs border border-emerald-800 shadow-sm transition-all hover:scale-105"
              >
                <span className="text-sm">👨‍👩‍👧</span>
                <span className="font-black">Ota-onalar</span>
              </Link>

              {/* ADMIN PANEL TUGMASI */}
              <Link
                to="/admin"
                title="Admin Boshqaruv Paneliga oʻtish"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs border border-slate-700 shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  {/* Coin Badge (tezkor do'konga o'tish) */}
                  <Link 
                    to="/rewards" 
                    title="Coinlaringiz balansi"
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-700 font-black text-xs hover:bg-amber-100 transition-colors"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{user.coins || 0}</span>
                  </Link>

                  {/* Level Pill */}
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-violet-50 border border-violet-200/80 rounded-full text-violet-700 text-xs font-black">
                    <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>Lv.{user.level || 1}</span>
                  </div>

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <span className="text-base">{user.avatar || '🎓'}</span>
                    <span className="hidden md:inline max-w-[80px] truncate">{user.name}</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    title="Chiqish"
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-xl shadow-sm transition-all"
                  >
                    Roʻyxatdan oʻtish
                  </Link>
                </div>
              )}

              {/* Ekrandan butunlay yashirish/kichraytirish tugmasi (Test paytida xalaqit bermasligi uchun) */}
              <button
                onClick={() => setIsMinimized(true)}
                title="Navbarni kichraytirish (Ekran maydonini 100% ochish)"
                className="hidden sm:flex p-1.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
