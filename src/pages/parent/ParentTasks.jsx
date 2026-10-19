import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { CheckSquare, Clock, Coins, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

const ParentTasks = () => {
  const { selectedChild } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [selectedChild]);

  const fetchTasks = async () => {
    try {
      const res = await adminAPI.getAssignments();
      if (res.data?.data) {
        setTasks(res.data.data);
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
          📋
        </div>
        <h2 className="text-xl font-bold text-white">Farzand tanlanmagan</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Topshiriqlar va vazifalarni kuzatish uchun avval farzandingizni akkauntingizga bog‘lang.
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Vazifalar & Topshiriqlar Nazorati</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedChild?.name} ning bajarilgan va muddati yaqinlashayotgan maktab topshiriqlari
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl">
            Jami: {tasks.length} ta topshiriq
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Topshiriqlar yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tasks.map((task, idx) => {
            const isCompleted = idx === 0; // 1-vazifa bajarilgan, qolgani kutilmoqda

            return (
              <div
                key={task.id}
                className="p-6 bg-slate-950 rounded-3xl border border-slate-800/90 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-900 text-brand-400 border border-slate-800">
                      {task.subject}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                        : 'bg-amber-950/80 text-amber-400 border-amber-800'
                    }`}>
                      {isCompleted ? 'Muvaffaqiyatli topshirildi ✨' : 'Kutilmoqda ⏳'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base">{task.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <Coins className="w-3.5 h-3.5 fill-amber-400" />
                      <span>+{task.coinsReward} Coin</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Muddati: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Ota-ona tavsiyasi:</span>
                  <span className="text-slate-300 font-semibold">
                    {isCompleted ? "Ko'rib chiqildi va a'lo baholandi" : "Bugun kechki payt bajarishni eslatish"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ParentTasks;
