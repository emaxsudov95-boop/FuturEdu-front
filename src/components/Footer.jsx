import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Compass, BookOpen, Bot, Trophy } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="FuturEdu" className="w-10 h-10 object-contain drop-shadow-md" />
              <span className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-sky-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                FuturEdu
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Oʻquvchilar uchun zamonaviy, interaktiv va gamifikatsiyalashgan taʼlim platformasi. Har bir bilim uchun mukofot!
            </p>
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold bg-brand-950/60 p-2.5 rounded-xl border border-brand-800/40">
              <span>🌟 Oʻzbekiston yoshlari uchun maxsus yaratildi</span>
            </div>
          </div>

          {/* Platform Bo'limlari */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Imkoniyatlar</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/battle" className="hover:text-pink-400 font-bold transition-colors">⚔️ Battle (1v1 Bilim Jangi)</Link></li>
              <li><Link to="/mock" className="hover:text-amber-400 font-bold transition-colors">🔥 MOK Test (100 ball & Keshbek)</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">🎯 Kasb tanlash yoʻriqnomasi</Link></li>
              <li><Link to="/quizzes" className="hover:text-white transition-colors">📚 Fanlar boʻyicha testlar</Link></li>
              <li><Link to="/qa" className="hover:text-white transition-colors">💬 Savol-Javob jamoasi</Link></li>
              <li><Link to="/leaderboard" className="hover:text-white transition-colors">🏆 Oʻquvchilar reytingi</Link></li>
            </ul>
          </div>

          {/* Gamifikatsiya & AI */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Gamifikatsiya & AI</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/ai-tutor" className="hover:text-white transition-colors">🤖 Yoqimli AI Ustoz</Link></li>
              <li><Link to="/rewards" className="hover:text-white transition-colors">🪙 Coinlar & Sovgʻalar doʻkoni</Link></li>
              <li><Link to="/chat" className="hover:text-white transition-colors">💬 Kasbiy Guruh Chati</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">🥇 Yutuqlar va Nishonlar</Link></li>
            </ul>
          </div>

          {/* Boshqaruv & Monitoring */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
              <span>👨‍👩‍👧 Oila & Nazorat</span>
            </h4>
            <p className="text-xs text-slate-300">
              Farzandingiz darslarini kuzatish va tahliliy hisobotlarni olish:
            </p>
            <div className="space-y-2 pt-1">
              <Link 
                to="/parent/login" 
                className="w-full py-2 px-3 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs font-black flex items-center justify-between transition-all shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <span>👨‍👩‍👧</span>
                  <span>Ota-ona Kirish & Roʻyxatdan oʻtish</span>
                </div>
                <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-bold">Portal</span>
              </Link>
              <Link 
                to="/admin" 
                className="w-full py-2 px-3 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>🛡️</span>
                <span>Admin Boshqaruv Paneli</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 FuturEdu Taʼlim Platformasi. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1">
            Mehr bilan oʻquvchilar uchun ishlab chiqildi <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
