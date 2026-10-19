import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import { Bot, Sparkles, HeartHandshake, Lightbulb, Compass, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ParentAiAdvice = () => {
  const { selectedChildId, selectedChild } = useOutletContext();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvice(selectedChildId);
  }, [selectedChildId]);

  const fetchAdvice = async (childId) => {
    setLoading(true);
    try {
      const res = await parentAPI.getParentAiAdvice(childId);
      if (res.data?.data) {
        setAdvice(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChild) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl mx-auto shadow-xl">
          🤖
        </div>
        <h2 className="text-xl font-bold text-white">Farzand tanlanmagan</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          AI individual ota-ona tavsiyalarini olish uchun avval farzandingizni akkauntingizga bog‘lang.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openAddChildModal'))}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20"
        >
          + Bola qo‘shish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 p-6 sm:p-8 rounded-3xl border border-emerald-800/60 shadow-xl flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-4xl shadow-inner">
            🤖
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Ota-ona Maslahatchisi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {selectedChild?.name} uchun Shaxsiy Tavsiyalar
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Farzandingizning soʻnggi test natijalari va oʻzlashtirishiga asoslangan individual pedagogik maslahatlar
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">AI tavsiyalari tahlil qilinmoqda...</div>
      ) : (
        <div className="space-y-6">
          
          {/* Umumiy Baho */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Umumiy oʻquv holati tahlili</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {advice?.overallAssessment}
            </p>
          </div>

          {/* Amaliy Tavsiyalar Ro'yxati */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {advice?.recommendations?.map((rec, i) => (
              <div key={i} className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {rec.category}
                  </span>
                  <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-brand-300 font-semibold flex items-center gap-1 border-t border-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Amalda qoʻllash tavsiya etiladi</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ota-ona uchun oltin maslahat */}
          <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/30 rounded-3xl border border-amber-800/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Lightbulb className="w-5 h-5" />
              <span>Psixolog & Pedagog Tavsiyasi:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed pl-7">
              "{advice?.motivationalTip}"
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default ParentAiAdvice;
