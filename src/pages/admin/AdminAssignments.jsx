import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { CheckSquare, Plus, Trash2, Calendar, Coins, Flame, CheckCircle2 } from 'lucide-react';

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Matematika');
  const [description, setDescription] = useState('');
  const [coinsReward, setCoinsReward] = useState(30);
  const [xpReward, setXpReward] = useState(45);
  const [deadline, setDeadline] = useState('');

  const subjects = ['Matematika', 'Informatika', 'Ingliz tili', 'Fizika', 'Biologiya', 'Kimyo'];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await adminAPI.getAssignments();
      if (res.data?.data) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await adminAPI.createAssignment({
        title,
        subject,
        description,
        coinsReward,
        xpReward,
        deadline
      });

      if (res.data?.success) {
        setMessage(res.data.message);
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchAssignments();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Topshiriqni o'chirmoqchimisiz?")) return;
    try {
      await adminAPI.deleteAssignment(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
      setMessage("Topshiriq o'chirildi");
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
            <CheckSquare className="w-6 h-6 text-brand-500" />
            <span>Topshiriqlar & Vazifalar Boshqaruvi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fanlar boʻyicha amaliy vazifalar yaratish, muddat belgilash va natijalarni koʻrish
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Vazifa Qoʻshish</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((asn) => (
            <div key={asn.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-900 text-brand-400 border border-slate-800">
                  {asn.subject}
                </span>
                <h3 className="font-extrabold text-white text-sm sm:text-base">{asn.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{asn.description}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Coins className="w-3.5 h-3.5 fill-amber-400" />
                    <span>+{asn.coinsReward} Coin</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(asn.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {asn.submissionsCount || 0} nafar oʻquvchi topshirdi
                </span>
                <button
                  onClick={() => handleDelete(asn.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">Yangi Amaliy Vazifa</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Fan:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Vazifa sarlavhasi:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Nyuton qonunlariga 3 ta masala"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Batafsil tavsif:</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vazifa shartlari..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Mukofot Coin:</label>
                  <input
                    type="number"
                    value={coinsReward}
                    onChange={(e) => setCoinsReward(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Topshirish muddati:</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Bekor qilish</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow">Vazifani Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAssignments;
