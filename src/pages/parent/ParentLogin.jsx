import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Users,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

const ParentLogin = () => {
  const navigate = useNavigate();
  const [phoneOrEmail, setPhoneOrEmail] = useState('+998 90 123 45 67');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await parentAPI.login({ phoneOrEmail, password });
      if (res.data?.success) {
        localStorage.setItem('parent_token', res.data.token || 'parent-token-active');
        localStorage.setItem('parent_user', JSON.stringify(res.data.data));
        navigate('/parent');
      } else {
        setError(res.data?.message || 'Kirishda xatolik yuz berdi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Telefon raqami yoki parol notoʻgʻri');
    } finally {
      setLoading(false);
    }
  };

  // 1-klikda tezkor test orqali kirish
  const handleQuickDemo = async () => {
    setPhoneOrEmail('+998 90 123 45 67');
    setPassword('password123');
    setLoading(true);
    setError('');
    try {
      const res = await parentAPI.login({ phoneOrEmail: '+998 90 123 45 67', password: 'password123' });
      if (res.data?.success) {
        localStorage.setItem('parent_token', res.data.token || 'parent-token-active');
        localStorage.setItem('parent_user', JSON.stringify(res.data.data));
        navigate('/parent');
      }
    } catch (err) {
      setError('Tezkor demo kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ota-ona Monitoring Xizmati</span>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <Link to="/" className="hover:scale-105 transition-transform">
              <img src="/logo.png" alt="FuturEdu" className="w-14 h-14 object-contain drop-shadow-lg" />
            </Link>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                FuturEdu <span className="text-xs bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">OTA-ONA</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Farzandingiz muvaffaqiyati sari</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Shaxsiy kabinetga kirish</h2>
            <p className="text-xs text-slate-400 mt-0.5">Farzandingiz darslari, testlari va tahlillarini kuzating</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Telefon raqami yoki Email:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="+998 90 123 45 67 yoki email"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Maxfiy parol:
                </label>
                <span className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer">
                  Parolni unutdingizmi?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Kabinetga kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800/90 text-slate-300 border border-slate-800 rounded-xl p-3 text-xs font-bold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">👨‍💼</span>
                <div className="text-left">
                  <div className="text-white text-xs font-bold group-hover:text-emerald-400 transition-colors">
                    Farhod Rahimov (1-klikda tezkor kirish)
                  </div>
                  <div className="text-[10px] text-slate-500">2 ta farzand bog'langan demo hisob</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold">yoki</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-400">
              Hali roʻyxatdan oʻtmadingizmi?{' '}
              <Link 
                to="/parent/register" 
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Ota-ona sifatida roʻyxatdan oʻting
              </Link>
            </p>
            
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <span>Oʻquvchi platformasiga qaytish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Feature badges */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-base mb-0.5">📊</div>
            <span className="text-[10px] font-bold text-slate-400 block">Kunlik statistika</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-base mb-0.5">🤖</div>
            <span className="text-[10px] font-bold text-slate-400 block">AI maslahatlari</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-base mb-0.5">🔒</div>
            <span className="text-[10px] font-bold text-slate-400 block">100% Xavfsiz</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentLogin;
