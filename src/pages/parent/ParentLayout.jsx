import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Users, 
  BarChart2, 
  CheckSquare, 
  Bot, 
  FileText, 
  Crown, 
  Bell, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  UserPlus
} from 'lucide-react';

const ParentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bola qo'shish modal holati
  const [addChildModalOpen, setAddChildModalOpen] = useState(false);
  const [studentQuery, setStudentQuery] = useState('');
  const [addingChild, setAddingChild] = useState(false);
  const [addChildError, setAddChildError] = useState('');
  const [addChildSuccess, setAddChildSuccess] = useState('');

  const [parentUser, setParentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('parent_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Auth Guard: ota-ona tizimga kirganligini tekshirish
    const token = localStorage.getItem('parent_token');
    const user = localStorage.getItem('parent_user');
    if (!token && !user) {
      navigate('/parent/login');
      return;
    }
    fetchInitialData();

    // Obuna o'zgarganda real-vaqtda yangilash
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

    // Modalni istalgan sahifadan ochish tinglovchisi
    const handleOpenModal = () => {
      setAddChildModalOpen(true);
      setAddChildError('');
      setAddChildSuccess('');
    };

    window.addEventListener('parentSubscriptionChanged', handleSubChange);
    window.addEventListener('openAddChildModal', handleOpenModal);

    return () => {
      window.removeEventListener('parentSubscriptionChanged', handleSubChange);
      window.removeEventListener('openAddChildModal', handleOpenModal);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('parent_user');
    localStorage.removeItem('parent_token');
    localStorage.removeItem('parent_selected_child');
    localStorage.removeItem('parent_subscription');
    navigate('/parent/login');
  };

  const fetchInitialData = async () => {
    try {
      const [cRes, nRes] = await Promise.all([
        parentAPI.getChildren(),
        parentAPI.getParentNotifications()
      ]);

      if (cRes.data?.data) {
        setChildren(cRes.data.data);
        if (cRes.data.data.length > 0) {
          const savedId = localStorage.getItem('parent_selected_child');
          const matched = cRes.data.data.find(c => c.id === savedId);
          const activeId = matched ? matched.id : cRes.data.data[0].id;
          setSelectedChildId(activeId);

          // Obunani olish
          try {
            const dRes = await parentAPI.getChildDashboard(activeId);
            if (dRes.data?.subscription) {
              setSubscription(dRes.data.subscription);
              localStorage.setItem('parent_subscription', JSON.stringify(dRes.data.subscription));
            }
          } catch {}
        } else {
          setSelectedChildId(null);
        }
      }

      if (nRes.data?.data) {
        setNotifications(nRes.data.data);
      }
    } catch (e) {
      console.error("fetchInitialData error:", e);
    }
  };

  const handleSelectChild = (id) => {
    setSelectedChildId(id);
    localStorage.setItem('parent_selected_child', id);
    // Sahifani yangilash signali
    window.dispatchEvent(new CustomEvent('parentChildChanged', { detail: { childId: id } }));
  };

  // Bola Qo'shish Formasini topshirish
  const handleAddChildSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!studentQuery.trim()) {
      setAddChildError("Iltimos, farzandingizning platformadagi email manzili yoki to'liq ismini kiriting");
      return;
    }

    setAddingChild(true);
    setAddChildError('');
    setAddChildSuccess('');

    try {
      const res = await parentAPI.addChild({ studentQuery: studentQuery.trim() });
      if (res.data?.success) {
        const newChild = res.data.child;

        // Ro'yxatni yangilash
        setChildren(prev => {
          const exists = prev.some(c => c.id === newChild.id);
          return exists ? prev : [...prev, newChild];
        });

        setSelectedChildId(newChild.id);
        localStorage.setItem('parent_selected_child', newChild.id);

        // Ota-ona user ma'lumotlarini ham yangilash
        if (parentUser) {
          const updatedUser = {
            ...parentUser,
            linkedChildren: [...(parentUser.linkedChildren || []), newChild.id]
          };
          setParentUser(updatedUser);
          localStorage.setItem('parent_user', JSON.stringify(updatedUser));
        }

        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 }
        });

        setAddChildSuccess(res.data.message || "Farzand muvaffaqiyatli bog'landi! 🎉");

        // Barcha ichki sahifalarga xabar yuborish
        window.dispatchEvent(new CustomEvent('parentChildChanged', { detail: { childId: newChild.id } }));

        setTimeout(() => {
          setAddChildModalOpen(false);
          setStudentQuery('');
          setAddChildSuccess('');
        }, 1600);
      }
    } catch (err) {
      console.error("Add child error:", err);
      setAddChildError(
        err.response?.data?.message || 
        "Farzandni qo'shishda xatolik yuz berdi. Iltimos, email yoki ism to'g'ri kiritilganligini tekshiring."
      );
    } finally {
      setAddingChild(false);
    }
  };

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0] || null;

  const menuItems = [
    { name: 'Dashboard', path: '/parent', icon: BarChart2 },
    { name: 'Vazifalar Nazorati', path: '/parent/tasks', icon: CheckSquare },
    { name: 'AI Ota-ona Maslahatchisi', path: '/parent/ai-advice', icon: Bot, highlight: true },
    { name: 'Hisobotlar (Yuklab olish)', path: '/parent/reports', icon: FileText },
    { name: 'Premium Obuna', path: '/parent/premium', icon: Crown },
  ];

  const isActive = (path) => {
    if (path === '/parent') return location.pathname === '/parent';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 shrink-0">
        
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-3 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo.png" 
              alt="FuturEdu" 
              className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
            />
            <div>
              <h1 className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
                <span>FuturEdu</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">OTA-ONA</span>
              </h1>
              <span className="text-[11px] text-slate-400 font-semibold block">Farzand Monitoringi</span>
            </div>
          </Link>
        </div>

        {/* Multi-Child Switcher Box */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Farzandlar ({children.length})
            </span>
            <button
              onClick={() => {
                setAddChildModalOpen(true);
                setAddChildError('');
                setAddChildSuccess('');
              }}
              className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              title="Yangi farzand qo'shish"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Qo‘shish</span>
            </button>
          </div>

          {children.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-slate-800 text-center space-y-2.5">
              <span className="text-3xl block">👶</span>
              <p className="text-[11px] text-slate-400 leading-snug">Hozircha farzand ulanmagan</p>
              <button
                onClick={() => {
                  setAddChildModalOpen(true);
                  setAddChildError('');
                  setAddChildSuccess('');
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Bola qo‘shish</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
              {children.map((child) => {
                const isSelected = child.id === selectedChildId;
                return (
                  <button
                    key={child.id}
                    onClick={() => handleSelectChild(child.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base shrink-0">{child.avatar}</span>
                      <span className="truncate max-w-[110px]">{child.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'text-slate-400'
                    }`}>
                      {child.grade}
                    </span>
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  setAddChildModalOpen(true);
                  setAddChildError('');
                  setAddChildSuccess('');
                }}
                className="w-full mt-1.5 py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700/80 text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3 h-3" />
                <span>+ Yana bola qo‘shish</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          {/* Parent User Info Card in Sidebar */}
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-sm font-black text-white shrink-0">
                {parentUser?.avatar || '👨‍💼'}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {parentUser?.name || 'Ota-ona Akkaunti'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {parentUser?.phone || 'Himoyalangan Portal'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Obuna holati (Tekin yoki Premium) */}
          <Link
            to="/parent/premium"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              subscription?.isPremium
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Crown className={`w-3.5 h-3.5 ${subscription?.isPremium ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{subscription?.isPremium ? 'Premium Obuna Faol' : 'Tekin Tarif'}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
              subscription?.isPremium ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {subscription?.isPremium ? 'PRO' : 'Aktivlash'}
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Oʻquvchi platformasi</span>
            </span>
          </Link>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="md:hidden flex items-center gap-2">
              <img src="/logo.png" alt="FuturEdu" className="w-7 h-7 object-contain" />
              <span className="font-black text-sm text-white">FuturEdu</span>
            </div>

            {/* Selected Child Pill or Add Child Button in Header */}
            {selectedChild ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-xl">{selectedChild.avatar}</span>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">{selectedChild.name}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{selectedChild.grade} • {selectedChild.league}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAddChildModalOpen(true);
                    setAddChildError('');
                    setAddChildSuccess('');
                  }}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-colors"
                  title="Yana bola qo'shish"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Bola qo‘shish</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAddChildModalOpen(true);
                  setAddChildError('');
                  setAddChildSuccess('');
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Bola qo‘shish</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Bola qo'shish tezkor tugmasi (Header o'ng tarafi - Desktopda) */}
            <button
              onClick={() => {
                setAddChildModalOpen(true);
                setAddChildError('');
                setAddChildSuccess('');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs font-black transition-all shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bola qo‘shish</span>
            </button>

            {/* Notification bell dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white relative transition-colors"
                title="Bildirishnomalar"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.isRead) && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">Ota-ona bildirishnomalari</span>
                    <span className="text-[10px] text-slate-500">{notifications.length} ta</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span className="text-[11px] truncate">{n.title}</span>
                          <span className="text-[9px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Premium Status Pill */}
            <Link
              to="/parent/premium"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                subscription?.isPremium
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${subscription?.isPremium ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">
                {subscription?.isPremium ? 'Premium' : 'Tekin'}
              </span>
            </Link>

            {/* Parent Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-emerald-400">
                {parentUser?.avatar || '👨‍💼'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-extrabold text-white block leading-tight truncate max-w-[140px]">
                  {parentUser?.name || 'Ota-ona Akkaunti'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block truncate max-w-[140px]">
                  {parentUser?.phone || 'Himoyalangan Portal'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Chiqish"
                className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3">
            {/* Mobile Child Switcher */}
            <div className="space-y-1 pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Farzandlar:</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAddChildModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-emerald-400 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Bola qo‘shish</span>
                </button>
              </div>

              {children.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  Hozircha farzand ulanmagan
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {children.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        handleSelectChild(c.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        c.id === selectedChildId ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      <span>{c.avatar}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                      active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Tizimdan chiqish</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 pb-20 md:pb-8 overflow-y-auto">
          <Outlet context={{ selectedChildId, selectedChild, children }} />
        </main>

      </div>

      {/* BOLA QO'SHISH (FARZANDNI BOG'LASH) MODALI */}
      {addChildModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Bola Qo‘shish</h3>
                  <p className="text-xs text-slate-400">Farzandni profilingizga bog‘lash</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAddChildModalOpen(false);
                  setAddChildError('');
                  setAddChildSuccess('');
                }}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            {addChildError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{addChildError}</p>
              </div>
            )}

            {addChildSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p>{addChildSuccess}</p>
              </div>
            )}

            <form onSubmit={handleAddChildSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Farzandingizning Emaili yoki To‘liq Ismi:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentQuery}
                    onChange={(e) => {
                      setStudentQuery(e.target.value);
                      if (addChildError) setAddChildError('');
                    }}
                    placeholder="masalan: azizbek@maktab.uz yoki Azizbek Rahimov"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Demo misollar - bir bosishda sinash uchun */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  Mavjud o‘quvchilar (Sinab ko‘rish uchun):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Azizbek (AI soha)', val: 'azizbek@maktab.uz' },
                    { label: 'Dilshod (Dasturchi)', val: 'dilshod@edulearn.uz' },
                    { label: 'Madina (Shifokor)', val: 'madina@maktab.uz' },
                    { label: 'Jasur (IT)', val: 'jasur@maktab.uz' }
                  ].map((chip) => (
                    <button
                      type="button"
                      key={chip.val}
                      onClick={() => {
                        setStudentQuery(chip.val);
                        if (addChildError) setAddChildError('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-[10px] font-bold transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={addingChild}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {addingChild ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>O‘quvchi qidirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Qidirish va Bola Qo‘shish</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-500 leading-relaxed">
                Tizim platformadagi haqiqiy ro‘yxatdan o‘tgan o‘quvchilarni topadi va ularning real statistikasini monitoringga ulaydi.
              </p>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          OTA-ONALAR PANELI MOBIL PASTKI NAVIGATSIYASI (BOTTOM BAR)
      ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-1 py-1.5 flex items-center justify-around shadow-2xl">
        <Link
          to="/parent"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
            location.pathname === '/parent' ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Monitoring</span>
        </Link>

        <Link
          to="/parent/ai-advice"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
            location.pathname === '/parent/ai-advice' ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">AI Maslahat</span>
        </Link>

        <Link
          to="/parent/tasks"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
            location.pathname === '/parent/tasks' ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Topshiriq</span>
        </Link>

        <Link
          to="/parent/reports"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
            location.pathname === '/parent/reports' ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Hisobot</span>
        </Link>

        <Link
          to="/parent/premium"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
            location.pathname === '/parent/premium' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Premium</span>
        </Link>
      </nav>

    </div>
  );
};

export default ParentLayout;
