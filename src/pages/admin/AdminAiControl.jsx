import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Bot, Sparkles, CheckCircle2, Zap, Sliders, Volume2, Shield } from 'lucide-react';

const AdminAiControl = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [temperature, setTemperature] = useState(0.7);
  const [personalityTone, setPersonalityTone] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    fetchAiStats();
  }, []);

  const fetchAiStats = async () => {
    try {
      const res = await adminAPI.getAiStats();
      if (res.data?.data) {
        setSettings(res.data.data);
        setTemperature(res.data.data.temperature || 0.7);
        setPersonalityTone(res.data.data.personalityTone || '');
        setVoiceEnabled(res.data.data.voiceEnabled ?? true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.updateAiSettings({
        temperature,
        personalityTone,
        voiceEnabled
      });
      setMessage(res.data?.message || 'Sozlamalar saqlandi');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-500" />
            <span>AI Ustoz Nazorati & Sozlamalari</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Sunʼiy intellekt modeli sifati, prompt xarakteri va parametrlarni boshqarish
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-xl flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AI Engine Faol (v2.4)</span>
        </span>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Jami berilgan javoblar</span>
          <div className="text-2xl font-black text-white">{settings?.totalQueriesAnswered?.toLocaleString() || 1482} ta</div>
          <span className="text-[10px] text-emerald-400 font-semibold">24/7 uzluksiz javoblar</span>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Oʻrtacha javob tezligi</span>
          <div className="text-2xl font-black text-indigo-400">{settings?.averageResponseTimeSec || 0.8} s</div>
          <span className="text-[10px] text-slate-500 font-semibold">Tezkor generatsiya</span>
        </div>

        <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Oʻquvchilar Qoniqishi</span>
          <div className="text-2xl font-black text-amber-400">{settings?.satisfactionRating || 98.4}%</div>
          <span className="text-[10px] text-amber-400/80 font-semibold">Ijobiy fikrlar nisbati</span>
        </div>
      </div>

      {/* Settings Form */}
      <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-brand-400" />
          <h3 className="font-extrabold text-white text-base">Model Parametrlari</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-5 max-w-xl">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Ijodkorlik darajasi (Temperature):</span>
              <span className="text-brand-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-brand-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Past qiymat (0.2) = Aniq formulalar; Yuqori qiymat (0.8) = Qiziqarli ertaknamo analogiyalar.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              AI Ustoz Ohangi va Xarakteri (System Prompt Tone):
            </label>
            <textarea
              rows={3}
              value={personalityTone}
              onChange={(e) => setPersonalityTone(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <div className="flex-1">
              <span className="text-xs font-bold text-white block">Ovozli oʻqish (Speech Synthesis)</span>
              <span className="text-[10px] text-slate-400">Oʻquvchi chatda ovozli eshitish tugmasidan foydalanishi</span>
            </div>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="w-4 h-4 accent-brand-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20"
          >
            Sozlamalarni Saqlash
          </button>
        </form>
      </div>

    </div>
  );
};

export default AdminAiControl;
