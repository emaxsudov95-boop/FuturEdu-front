import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  Search, 
  Coins, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Filter,
  Sparkles,
  Award
} from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('Barchasi');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modallar
  const [coinModal, setCoinModal] = useState(null); // { student }
  const [coinAmount, setCoinAmount] = useState('50');
  const [coinReason, setCoinReason] = useState('Faol oʻquvchi bonusi');
  
  const [warnModal, setWarnModal] = useState(null);
  const [warnReason, setWarnReason] = useState('Qoidalarga rioya qiling');

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [gradeFilter, statusFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStudents({
        search,
        grade: gradeFilter,
        status: statusFilter
      });
      if (res.data?.data) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Students error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  // Bloklash / Tiklash
  const handleToggleBlock = async (student) => {
    try {
      const res = await adminAPI.toggleBlockStudent(student.id || student._id);
      setMessage(res.data?.message);
      setStudents(prev =>
        prev.map(s => (s.id === student.id ? { ...s, isBlocked: !s.isBlocked } : s))
      );
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Coin qo'shish / ayirish
  const handleAdjustCoins = async (e) => {
    e.preventDefault();
    if (!coinModal) return;
    try {
      const res = await adminAPI.adjustCoins(coinModal.id || coinModal._id, coinAmount, coinReason);
      setMessage(res.data?.message);
      setStudents(prev =>
        prev.map(s => (s.id === coinModal.id ? { ...s, coins: res.data.coins } : s))
      );
      setCoinModal(null);
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Ogohlantirish berish
  const handleWarn = async (e) => {
    e.preventDefault();
    if (!warnModal) return;
    try {
      const res = await adminAPI.warnStudent(warnModal.id || warnModal._id, warnReason);
      setMessage(res.data?.message);
      setStudents(prev =>
        prev.map(s => (s.id === warnModal.id ? { ...s, warningsCount: res.data.warningsCount } : s))
      );
      setWarnModal(null);
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const grades = ['Barchasi', '7-sinf', '8-sinf', '9-sinf', '10-sinf', '11-sinf'];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" />
            <span>Oʻquvchilar Boshqaruvi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Roʻyxatdan oʻtgan barcha oʻquvchilar profili, coinlari va holati
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-xl">
          Jami: {students.length} oʻquvchi
        </span>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki email boʻyicha qidiruv..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
          >
            {grades.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
          >
            <option value="all">Barcha holat</option>
            <option value="active">Faol</option>
            <option value="blocked">Bloklangan</option>
          </select>
        </div>

      </div>

      {/* Students Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="bg-slate-950 rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4 pl-6">Oʻquvchi</th>
                  <th className="p-4">Sinf</th>
                  <th className="p-4">Orzuidagi Kasb</th>
                  <th className="p-4">Coinlar</th>
                  <th className="p-4">Daraja / Testlar</th>
                  <th className="p-4">Holat</th>
                  <th className="p-4 pr-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {students.map((st) => (
                  <tr key={st.id || st._id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-slate-900 rounded-xl border border-slate-800">
                          {st.avatar || '🧑‍🎓'}
                        </span>
                        <div>
                          <span className="font-extrabold text-white block text-xs sm:text-sm">
                            {st.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block">{st.email || 'student@futuredu.uz'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 font-semibold border border-slate-800 text-[11px]">
                        {st.grade}
                      </span>
                    </td>

                    {/* Career */}
                    <td className="p-4 text-slate-300 max-w-[180px] truncate">
                      {st.selectedCareer || 'Dasturchi 💻'}
                    </td>

                    {/* Coins */}
                    <td className="p-4 font-black text-amber-400">
                      <div className="flex items-center gap-1 text-xs">
                        <Coins className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{st.coins || 0}</span>
                      </div>
                    </td>

                    {/* Level / Completed */}
                    <td className="p-4">
                      <div className="text-slate-300 font-bold">Lv.{st.level || 1}</div>
                      <div className="text-[10px] text-slate-400">{st.completedCount || 1} ta test yechgan</div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {st.isBlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800 text-[10px] font-bold">
                          Bloklangan
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          Faol
                        </span>
                      )}
                      {st.warningsCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[9px] font-bold">
                          {st.warningsCount} ogoh
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                      {/* Coins modal button */}
                      <button
                        onClick={() => setCoinModal(st)}
                        title="Coin berish yoki ayirish"
                        className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                      >
                        <Coins className="w-3.5 h-3.5 inline" />
                      </button>

                      {/* Warning button */}
                      <button
                        onClick={() => setWarnModal(st)}
                        title="Ogohlantirish berish"
                        className="p-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 inline" />
                      </button>

                      {/* Block / Unblock */}
                      <button
                        onClick={() => handleToggleBlock(st)}
                        title={st.isBlocked ? "Akkauntni tiklash" : "Akkauntni bloklash"}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          st.isBlocked
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {st.isBlocked ? <Unlock className="w-3.5 h-3.5 inline" /> : <Lock className="w-3.5 h-3.5 inline" />}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coin sozlash modali */}
      {coinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Coin sozlash: {coinModal.name}</span>
            </h3>

            <form onSubmit={handleAdjustCoins} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Miqdor (+ qoʻshish, - ayirish):
                </label>
                <input
                  type="number"
                  required
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder="Masalan: 50 yoki -20"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Sabab / Izoh:</label>
                <input
                  type="text"
                  required
                  value={coinReason}
                  onChange={(e) => setCoinReason(e.target.value)}
                  placeholder="Masalan: Testda yuqori ball uchun"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCoinModal(null)}
                  className="px-3 py-2 text-xs font-bold text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-xl text-xs shadow-md"
                >
                  Saqlash 🪙
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ogohlantirish modali */}
      {warnModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Ogohlantirish yuborish</span>
            </h3>

            <p className="text-xs text-slate-400">
              Oʻquvchi: <strong className="text-white">{warnModal.name}</strong>
            </p>

            <form onSubmit={handleWarn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Ogohlantirish sababi:</label>
                <textarea
                  required
                  rows={3}
                  value={warnReason}
                  onChange={(e) => setWarnReason(e.target.value)}
                  placeholder="Nooʻrin izoh yoki qoidabuzarlik haqida..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWarnModal(null)}
                  className="px-3 py-2 text-xs font-bold text-slate-400"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Yuborish ⚠️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStudents;
