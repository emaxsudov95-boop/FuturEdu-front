import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '8-sinf',
    avatar: '🧑‍🎓'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const avatars = ['🧑‍🎓', '🚀', '🦁', '🌟', '👩‍🎓', '⚡', '🦉', '👨‍🚀'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      confetti({ particleCount: 80, spread: 60 });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Roʻyxatdan oʻtishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
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
            FuturEdu da Roʻyxatdan Oʻtish
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
            <Coins className="w-4 h-4 fill-amber-500" />
            <span>Sizga darhol 100 Coin sovgʻa beriladi! 🎁</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ism va familiya:</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masalan: Azizbek Rahimov"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email manzil:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="azizbek@maktab.uz"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Parol oʻylab toping:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Kamida 6 ta belgi"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sinf yoki bosqich:</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="5-sinf">5-sinf</option>
              <option value="6-sinf">6-sinf</option>
              <option value="7-sinf">7-sinf</option>
              <option value="8-sinf">8-sinf</option>
              <option value="9-sinf">9-sinf</option>
              <option value="10-sinf">10-sinf</option>
              <option value="11-sinf">11-sinf</option>
              <option value="Talaba">Litsey / Kollej / Talaba</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Sevimli avatar belgisini tanlang:</label>
            <div className="flex flex-wrap gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: av })}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all ${
                    formData.avatar === av ? 'bg-brand-600 shadow-md ring-2 ring-brand-400 scale-105' : 'bg-slate-50 border hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Yaratilmoqda...' : 'Aʻzo boʻlish va 100 Coin olish! 🎁'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Allaqachon hisobingiz bormi? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Kirish
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
