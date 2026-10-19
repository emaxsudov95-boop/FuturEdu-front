import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rewardAPI } from '../services/api';
import { Gift, Coins, CheckCircle2, AlertCircle, Sparkles, ShoppingBag, Award, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

const RewardShop = () => {
  const { user, updateUserStats, refreshUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await rewardAPI.getAll();
      if (res.data?.data) {
        setRewards(res.data.data);
      }
    } catch (err) {
      console.error('Reward error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (reward) => {
    setMessage('');
    setError('');

    if (!user) {
      setError('Sovgʻalarni sotib olish uchun iltimos tizimga kiring!');
      return;
    }

    if ((user.coins || 0) < reward.cost) {
      setError(`Sizda yetarli Coin mavjud emas! Ushbu sovgʻa uchun ${reward.cost} Coin kerak, sizda esa ${user.coins || 0} Coin bor.`);
      return;
    }

    try {
      const res = await rewardAPI.purchase(reward.id || reward._id);
      if (res.data?.success) {
        setMessage(res.data.message || `"${reward.title}" muvaffaqiyatli xarid qilindi! 🎉`);
        updateUserStats(res.data.coinsLeft, user.xp, user.level);
        await refreshUser();

        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sovgʻani xarid qilishda xatolik yuz berdi');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header and User Balance Showcase */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl text-amber-950 shadow-xl shadow-amber-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm text-xs font-bold text-amber-950">
            <img src="/logo.png" alt="FuturEdu" className="w-4 h-4 object-contain" />
            <Gift className="w-3.5 h-3.5" />
            <span>FuturEdu Sovgʻalar Doʻkoni</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Yigʻilgan Coinlarni sovgʻalarga almashtir! 🎁
          </h1>
          <p className="text-xs sm:text-sm font-medium text-amber-900 max-w-xl">
            Testlarni topshirib toʻplagan tangalaringiz evaziga qimmatli kitoblar, VIP imkoniyatlar, avatarlar va sertifikatlarga ega boʻling!
          </p>
        </div>

        {/* Big Coin Balance Box */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/60 text-center shrink-0 shadow-lg">
          <span className="text-xs font-bold text-slate-600 block">Sizning balansingiz</span>
          <div className="text-3xl sm:text-4xl font-black text-amber-600 flex items-center justify-center gap-2 mt-0.5">
            <Coins className="w-8 h-8 fill-amber-500 text-amber-500 animate-bounce-slow" />
            <span>{user?.coins || 0}</span>
          </div>
          <span className="text-[11px] font-bold text-amber-800">Oltin Tanga (Coin)</span>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Rewards Catalog */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-600 font-semibold">Sovgʻalar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((rew) => {
            const hasEnough = (user?.coins || 0) >= rew.cost;
            const alreadyOwned = user?.inventory?.some(i => i.rewardId === rew.id || i.title === rew.title);

            return (
              <div
                key={rew.id || rew._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {rew.popular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span>Eng mashhur</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-50 to-yellow-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {rew.icon || '🎁'}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-700 block mb-1">
                      {rew.category}
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                      {rew.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rew.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Narxi:</span>
                    <div className="flex items-center gap-1 font-black text-base text-amber-600">
                      <Coins className="w-5 h-5 fill-amber-500" />
                      <span>{rew.cost} Coin</span>
                    </div>
                  </div>

                  {alreadyOwned ? (
                    <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Xarid qilingan</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(rew)}
                      disabled={!hasEnough}
                      className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                        hasEnough
                          ? 'bg-slate-900 hover:bg-amber-500 hover:text-amber-950 text-white shadow-slate-900/10'
                          : 'bg-slate-100 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{hasEnough ? 'Sotib olish' : 'Yetarli Coin yoʻq'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default RewardShop;
