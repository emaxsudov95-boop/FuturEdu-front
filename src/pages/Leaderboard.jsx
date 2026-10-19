import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { Trophy, Coins, Flame, Medal, Award, Crown, Star, Sparkles } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await userAPI.getLeaderboard();
        if (res.data?.data) {
          setLeaders(res.data.data);
        }
      } catch (err) {
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const topThree = leaders.slice(0, 3);
  const remainingLeaders = leaders.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold">
          <img src="/logo.png" alt="FuturEdu" className="w-4 h-4 object-contain" />
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>FuturEdu Haftalik Oʻquvchilar Reytingi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          FuturEdu Chempionati 🏆
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Koʻproq testlar yeching, savollarga javob bering va Olmos Ligada 1-oʻringa koʻtariling!
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-600 font-semibold">Reyting yuklanmoqda...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 items-end max-w-3xl mx-auto">
              
              {/* 2nd Place */}
              <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 shadow-md relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center mx-auto shadow">
                  2
                </div>
                <div className="text-4xl">{topThree[1].avatar}</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{topThree[1].name}</h3>
                  <span className="text-[11px] text-slate-600">{topThree[1].grade}</span>
                </div>
                <div className="flex items-center justify-center gap-1 font-black text-amber-600 text-sm">
                  <Coins className="w-4 h-4 fill-amber-500" />
                  <span>{topThree[1].coins} Coin</span>
                </div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Kumush Liga 🥈
                </span>
              </div>

              {/* 1st Place - Champion */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-yellow-100/80 rounded-3xl p-8 border-2 border-amber-300 text-center space-y-4 shadow-xl -translate-y-2 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 p-1.5 rounded-full shadow-lg">
                  <Crown className="w-6 h-6 fill-amber-300" />
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-400 text-amber-950 font-black text-base flex items-center justify-center mx-auto shadow mt-1">
                  1
                </div>
                <div className="text-5xl">{topThree[0].avatar}</div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{topThree[0].name}</h3>
                  <span className="text-xs text-amber-900 font-semibold">{topThree[0].grade}</span>
                </div>
                <div className="flex items-center justify-center gap-1 font-black text-amber-700 text-base">
                  <Coins className="w-5 h-5 fill-amber-500" />
                  <span>{topThree[0].coins} Coin</span>
                </div>
                <span className="inline-block text-xs font-black px-3 py-1 rounded-full bg-amber-300 text-amber-950 shadow-sm">
                  Olmos Chempion 💎👑
                </span>
              </div>

              {/* 3rd Place */}
              <div className="order-3 bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3 shadow-md relative">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center mx-auto shadow">
                  3
                </div>
                <div className="text-4xl">{topThree[2].avatar}</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{topThree[2].name}</h3>
                  <span className="text-[11px] text-slate-600">{topThree[2].grade}</span>
                </div>
                <div className="flex items-center justify-center gap-1 font-black text-amber-600 text-sm">
                  <Coins className="w-4 h-4 fill-amber-500" />
                  <span>{topThree[2].coins} Coin</span>
                </div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                  Oltin Liga 🥇
                </span>
              </div>

            </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">
                Oʻquvchilar jadvali
              </h3>
              <span className="text-xs text-slate-600 font-semibold">
                Jami: {leaders.length} nafar oʻquvchi
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {leaders.map((st) => {
                const isCurrentUser = user && (user.name === st.name || user.id === st.id);

                return (
                  <div
                    key={st.rank}
                    className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                      isCurrentUser ? 'bg-brand-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        st.rank === 1 ? 'bg-amber-400 text-amber-950' :
                        st.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        st.rank === 3 ? 'bg-amber-100 text-amber-900' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {st.rank}
                      </span>

                      <div className="text-2xl shrink-0">{st.avatar}</div>

                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{st.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-brand-600 text-white px-2 py-0.2 rounded-full font-bold">
                              Siz
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {st.grade} • Lv.{st.level} • {st.league}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-amber-600">
                          <Coins className="w-4 h-4 fill-amber-500" />
                          <span>{st.coins}</span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-semibold">
                          {st.xp} XP
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Leaderboard;
