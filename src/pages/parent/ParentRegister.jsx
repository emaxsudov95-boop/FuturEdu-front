import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Users,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const ParentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi lozim');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Kiritilgan parollar bir-biriga mos kelmadi');
      return;
    }

    setLoading(true);

    try {
      const res = await parentAPI.register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        childName: formData.childName
      });

      if (res.data?.success) {
        localStorage.setItem('parent_token', res.data.token || 'parent-token-active');
        localStorage.setItem('parent_user', JSON.stringify(res.data.data));
        navigate('/parent');
      } else {
        setError(res.data?.message || 'Roʻyxatdan oʻtishda xatolik yuz berdi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Roʻyxatdan oʻtishda server xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Glow shapes */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Brand header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ota-onalar Hamjamiyati</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link to="/" className="hover:scale-105 transition-transform">
              <img src="/logo.png" alt="FuturEdu" className="w-14 h-14 object-contain drop-shadow-lg" />
            </Link>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                FuturEdu <span className="text-xs bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">OTA-ONA</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Yangi ota-ona akkauntini ochish</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Roʻyxatdan oʻtish</h2>
            <p className="text-xs text-slate-400 mt-0.5">Farzandingiz bilan xavfsiz bog'laning va rivojlanishini kuzating</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Ota-ona F.I.SH */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Ota-onaning to‘liq F.I.SH:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masalan: Nodirbek Rahimov"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Telefon & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Telefon raqam:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email (ixtiyoriy):
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nodir@mail.uz"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bog'lanadigan farzand */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Bog‘lanuvchi farzand ismi / maktabi:
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  placeholder="Masalan: Azizbek Rahimov (9-sinf)"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * Tizim avtomatik tarzda farzand profilini sizning hisobingizga ulaydi
              </p>
            </div>

            {/* Parollar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Parol:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-9 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Parolni tasdiqlang:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Qoidalar roziligi */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                required
                id="terms"
                defaultChecked
                className="mt-1 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                Foydalanish shartlari va maxfiylik siyosatiga roziman. Farzandim ma’lumotlari himoyalanganligini tasdiqlayman.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm mt-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Roʻyxatdan oʻtish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Akkauntingiz allaqachon bormi?{' '}
              <Link 
                to="/parent/login" 
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Tizimga kiring
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ParentRegister;
