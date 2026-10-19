import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, Bot } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email yoki parol xato!');
    } finally {
      setLoading(false);
    }
  };

  // 1-klikda demo hisob bilan kirish
  const handleQuickDemo = async () => {
    setEmail('dilshod@edulearn.uz');
    setPassword('123456');
    setLoading(true);
    try {
      await login('dilshod@edulearn.uz', '123456');
      navigate('/');
    } catch (err) {
      setError('Demo hisobga kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group">
            <img 
              src="/logo.png" 
              alt="FuturEdu" 
              className="w-16 h-16 object-contain mx-auto drop-shadow-md group-hover:scale-105 transition-transform" 
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            FuturEdu Platformasiga Kirish
          </h1>
          <p className="text-xs text-slate-600">Oʻz natijalaringiz va coinlaringizni boshqaring</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email manzil:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="misol@maktab.uz"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Maxfiy parol:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolingizni kiriting"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Kirilmoqda...' : 'Kirish'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Tezkor Demo hisob tugmasi */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>⚡ 1-klikda Demo Oʻquvchi hisobi bilan kirish</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Hisobingiz yoʻqmi? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Roʻyxatdan oʻtish (+100 Coin bonus!)
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
