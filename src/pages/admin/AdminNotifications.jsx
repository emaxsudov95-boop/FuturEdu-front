import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Bell, Send, CheckCircle2, Calendar, Megaphone, Trophy, Sparkles } from 'lucide-react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('news');
  const [icon, setIcon] = useState('📢');
  const [targetGrade, setTargetGrade] = useState('Barchasi');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await adminAPI.getNotifications();
      if (res.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await adminAPI.sendNotification({
        title,
        message: content,
        type,
        icon,
        targetGrade
      });

      if (res.data?.success) {
        setMessage(res.data.message);
        setTitle('');
        setContent('');
        fetchNotifications();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" />
            <span>Bildirishnomalar & Eʻlonlar Yuborish</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Oʻquvchilarga yangiliklar, tanlovlar va muhim xabarlarni tarqatish
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Grid: Send Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Yangi Eʻlon Yozish</span>
          </h3>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Eʻlon turi:</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (e.target.value === 'contest') setIcon('🏆');
                  else if (e.target.value === 'quiz') setIcon('📝');
                  else setIcon('📢');
                }}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="news">Yangilik (📢)</option>
                <option value="contest">Tanlov / Musobaqa (🏆)</option>
                <option value="quiz">Yangi Test Eʻloni (📝)</option>
                <option value="alert">Muhim Ogohlantirish (⚠️)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Kimlar uchun:</label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="Barchasi">Barcha oʻquvchilar</option>
                <option value="5-7 sinflar">5-7 sinflar</option>
                <option value="8-9 sinflar">8-9 sinflar</option>
                <option value="10-11 sinflar">10-11 sinflar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Sarlavha:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Yakshanba kuni matematika olimpiadasi!"
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Xabar matni:</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Batafsil ma'lumot..."
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Barchaga Tarqatish</span>
            </button>
          </form>
        </div>

        {/* History (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4">
          <h3 className="font-extrabold text-white text-base">Yuborilgan Eʻlonlar</h3>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {notifications.map((ntf) => (
                <div key={ntf.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ntf.icon || '📢'}</span>
                      <h4 className="font-bold text-xs sm:text-sm text-white">{ntf.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {new Date(ntf.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-7">{ntf.message}</p>
                  <div className="pl-7 text-[10px] text-brand-400 font-bold">
                    Moʻljallangan: {ntf.targetGrade}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminNotifications;
