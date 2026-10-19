import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Compass, 
  Gift, 
  CreditCard, 
  ShieldAlert, 
  Bot, 
  Bell, 
  History, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Search,
  Sparkles,
  ShieldCheck,
  Target
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Oʻquvchilar', path: '/admin/students', icon: Users },
    { name: 'MOK Test Sozlamalari', path: '/admin/mock-settings', icon: Target },
    { name: 'Testlar boshqaruvi', path: '/admin/quizzes', icon: BookOpen },
    { name: 'Topshiriqlar', path: '/admin/assignments', icon: CheckSquare },
    { name: 'Fanlar & Kasblar', path: '/admin/careers', icon: Compass },
    { name: 'Coin & Sovgʻalar', path: '/admin/rewards', icon: Gift },
    { name: 'Toʻlovlar & Tariflar', path: '/admin/payments', icon: CreditCard },
    { name: 'Chat Moderatsiyasi', path: '/admin/moderation', icon: ShieldAlert },
    { name: 'AI Ustoz Nazorati', path: '/admin/ai-control', icon: Bot },
    { name: 'Bildirishnomalar', path: '/admin/notifications', icon: Bell },
    { name: 'Xavfsizlik Jurnali', path: '/admin/audit-logs', icon: History },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 shrink-0">
        
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800/70">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo.png" 
              alt="FuturEdu" 
              className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
            />
            <div>
              <h1 className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                <span>FuturEdu</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded font-black">ADMIN</span>
              </h1>
              <span className="text-[11px] text-slate-400 font-semibold block">Platforma Nazorati</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-600'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Links to Student & Parent Platform */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <Link
            to="/parent"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>👨‍👩‍👧</span>
              <span>Ota-onalar paneli</span>
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">Oʻtish</span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Oʻquvchi platformasi</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Saytga</span>
          </Link>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="md:hidden flex items-center gap-2">
              <img src="/logo.png" alt="FuturEdu" className="w-7 h-7 object-contain" />
              <span className="font-black text-sm text-white">FuturEdu</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Boshqaruv Tizimi</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white relative transition-colors"
              title="Bildirishnomalar"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5"></span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-sm font-black text-white shadow">
                🛡️
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-extrabold text-white block leading-tight">Bosh Administrator</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Tizim Online</span>
              </div>
            </div>
          </div>

        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                    active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-800">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-400"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Oʻquvchi platformasiga oʻtish</span>
              </Link>
            </div>
          </div>
        )}

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
