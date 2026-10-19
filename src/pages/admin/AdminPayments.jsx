import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { CreditCard, CheckCircle2, Clock, XCircle, Search, ShieldCheck } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const plans = [
    { name: "Tekin (Bepul)", price: "0 so'm / doimiy", desc: "Barcha asosiy testlar va 1 nafar o'quvchi monitoringi", activeStudents: 148, badge: "Baza" },
    { name: "Premium", price: "39,000 so'm / oy", desc: "AI Maslahatchi, cheksiz monitoring, PDF hisobotlar va eksklyuziv tahlillar", activeStudents: 96, badge: "Eng ommabop 🔥" }
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await adminAPI.getPayments();
      if (res.data?.data) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await adminAPI.updatePaymentStatus(id, status);
      setMessage(res.data?.message);
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-500" />
            <span>Toʻlovlar & Obunalar Tizimi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Toʻlovlar tarixi, tranzaksiyalar xavfsizligi va tarif rejalarini boshqarish
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Xavfsiz Tranzaksiya Gateway</span>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((pl, i) => (
          <div key={i} className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-3 relative overflow-hidden">
            {pl.badge && (
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-500/40 rounded-full">
                {pl.badge}
              </span>
            )}
            <h3 className="font-extrabold text-white text-base">{pl.name}</h3>
            <div className="text-xl font-black text-emerald-400">{pl.price}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{pl.desc}</p>
            <div className="pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-900">
              Faol obunachilar: <strong className="text-slate-300">{pl.activeStudents} nafar</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl space-y-4 p-6">
        <h3 className="font-extrabold text-white text-base">Toʻlovlar Tarixi</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Tranzaksiya ID</th>
                <th className="p-3">Oʻquvchi</th>
                <th className="p-3">Tarif</th>
                <th className="p-3">Summa</th>
                <th className="p-3">Toʻlov Tizimi</th>
                <th className="p-3">Holat</th>
                <th className="p-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono text-[11px] text-slate-400">{p.transactionId}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{p.studentName}</div>
                    <div className="text-[10px] text-slate-500">{p.studentEmail}</div>
                  </td>
                  <td className="p-3 text-slate-300">{p.planName}</td>
                  <td className="p-3 font-black text-emerald-400">{p.amount.toLocaleString()} soʻm</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-bold">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      p.status === 'Muvaffaqiyatli'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                        : p.status === 'Kutilmoqda'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                        : 'bg-rose-950/80 text-rose-400 border-rose-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {p.status !== 'Muvaffaqiyatli' && (
                      <button
                        onClick={() => handleUpdateStatus(p.id, 'Muvaffaqiyatli')}
                        className="p-1 px-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg font-bold text-[10px]"
                      >
                        Tasdiqlash
                      </button>
                    )}
                    {p.status !== 'Bekor qilindi' && (
                      <button
                        onClick={() => handleUpdateStatus(p.id, 'Bekor qilindi')}
                        className="p-1 px-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg font-bold text-[10px]"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPayments;
