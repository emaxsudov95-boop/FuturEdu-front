import React, { useState, useEffect } from 'react';
import { mockAPI } from '../../services/api';
import {
  Flame,
  Coins,
  Clock,
  Award,
  Crown,
  CheckCircle2,
  Save,
  AlertCircle,
  TrendingUp,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

const AdminMockSettings = () => {
  const [settings, setSettings] = useState({
    entryCostCoins: 30,
    cashbackThreshold: 80,
    timeLimitMinutes: 20,
    highScoreBonusCoins: 20,
    perfectScoreBonusCoins: 50
  });

  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalCoinsSpent: 0,
    totalCoinsRefunded: 0,
    totalBonusCoins: 0,
    passRate: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await mockAPI.getAdminSettings();
      if (res.data?.success) {
        setSettings(res.data.settings);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('MOK sozlamalarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await mockAPI.updateAdminSettings(settings);
      if (res.data?.success) {
        setSuccessMessage('MOK Test sozlamalari muvaffaqiyatli saqlandi va barcha oʻquvchilarda darhol yangilandi! 🎉');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(res.data?.message || 'Saqlashda xatolik yuz berdi');
      }
    } catch (err) {
      setErrorMessage('Server xatosi: sozlamalarni saqlab bo‘lmadi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Sozlamalar yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">MOK Test Boshqaruvi & Sozlamalari</h1>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
              100 Ballik Tizim
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test narxi, keshbek (qaytarish) chegarasi, vaqt limiti va ragʻbatlantirish bonuslarini real vaqtda sozlang.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saqlanmoqda...' : 'Oʻzgarishlarni Saqlash'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real-time MOK Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jami Urinishlar</span>
          <span className="text-xl font-black text-white">{stats.totalAttempts} ta</span>
          <span className="text-[10px] text-slate-500 block">Topshirilgan testlar</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sarflangan Coinlar</span>
          <span className="text-xl font-black text-amber-400">{stats.totalCoinsSpent}</span>
          <span className="text-[10px] text-slate-500 block">Kirish to‘lovlari</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Qaytarilgan Coinlar</span>
          <span className="text-xl font-black text-emerald-400">{stats.totalCoinsRefunded}</span>
          <span className="text-[10px] text-slate-500 block">Keshbek miqdori</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bonus Coinlar</span>
          <span className="text-xl font-black text-purple-400">{stats.totalBonusCoins}</span>
          <span className="text-[10px] text-slate-500 block">90+ va 100 ballga</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keshbek Ulushi</span>
          <span className="text-xl font-black text-cyan-400">{stats.passRate}%</span>
          <span className="text-[10px] text-slate-500 block">Muvaffaqiyat foizi</span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Coin Narxi va Qaytarish Qoidalari */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
              🪙
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Coin Narxi & Keshbek Chegarasi</h3>
              <p className="text-xs text-slate-400">O‘quvchilar test boshlashda sarflaydigan va qaytarib oladigan mezonlar</p>
            </div>
          </div>

          {/* Test narxi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Test boshlash narxi (Coin):
            </label>
            <div className="relative">
              <Coins className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="0"
                max="500"
                required
                name="entryCostCoins"
                value={settings.entryCostCoins}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              * O‘quvchi MOK testni boshlash tugmasini bosganida hisobidan shu miqdorda coin yechiladi (standart: 30 coin).
            </p>
          </div>

          {/* Qaytarish chegarasi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Coinlarni avtomatik qaytarish chegarasi (100 ballik shkalada):
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="50"
                max="100"
                required
                name="cashbackThreshold"
                value={settings.cashbackThreshold}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-400 focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              * O‘quvchi ushbu ball (masalan: 80 ball) yoki undan yuqori to‘plasa, sarflagan {settings.entryCostCoins} coini avtomatik ravishda to‘liq qaytariladi.
            </p>
          </div>

          {/* Vaqt chegarasi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Test davomiyligi (Daqiqa):
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="5"
                max="120"
                required
                name="timeLimitMinutes"
                value={settings.timeLimitMinutes}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              * Test ekranda ko‘rinadigan teskari sanash taymeri (standart: 20 daqiqa).
            </p>
          </div>

        </div>

        {/* Box 2: Rag'batlantirish & Yuqori natijalar mukofotlari */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black">
              👑
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Yuqori Natija Mukofotlari</h3>
              <p className="text-xs text-slate-400">90+ va 100 ball olgan aʼlochi o‘quvchilar uchun bonuslar</p>
            </div>
          </div>

          {/* 90+ ball bonusi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              90–99 ball uchun qo‘shimcha Bonus Coin:
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="0"
                max="200"
                required
                name="highScoreBonusCoins"
                value={settings.highScoreBonusCoins}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-amber-400 focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              * 90+ ball to‘plaganlarga: sarflagan {settings.entryCostCoins} coin qaytariladi + {settings.highScoreBonusCoins} bonus coin va "MOK Oltin FuturEdu" nishoni beriladi.
            </p>
          </div>

          {/* 100 ball super bonusi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              100 ball (Mukammal natija) uchun Super Bonus Coin:
            </label>
            <div className="relative">
              <Crown className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="0"
                max="500"
                required
                name="perfectScoreBonusCoins"
                value={settings.perfectScoreBonusCoins}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-purple-300 focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              * 100 ballik natija uchun: {settings.entryCostCoins} coin qaytariladi + {settings.perfectScoreBonusCoins} super bonus va "MOK Mukammal Daho" toji beriladi.
            </p>
          </div>

          {/* Xavfsizlik va takrorlanishdan himoya */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Avtomatlashtirilgan Xavfsizlik Kafolatlangan</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tizim har bir test sessiyasini unikal ID bilan ro‘yxatga oladi. Bir xil test uchun takroran coin berilmaydi, foydalanuvchilar natijalari audit jurnaliga yoziladi.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminMockSettings;
