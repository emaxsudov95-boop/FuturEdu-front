import React, { useState, useEffect } from 'react';
import { rewardAPI, adminAPI } from '../../services/api';
import { Gift, Plus, Trash2, Coins, CheckCircle2, Sparkles } from 'lucide-react';

const AdminRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(100);
  const [category, setCategory] = useState('Nishon');
  const [icon, setIcon] = useState('🎁');
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !cost) return;

    try {
      const res = await adminAPI.createReward({
        title,
        cost,
        category,
        icon,
        description,
        popular
      });

      if (res.data?.success) {
        setMessage(res.data.message);
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchRewards();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, rewTitle) => {
    if (!window.confirm(`"${rewTitle}" sovgʻasini oʻchirmoqchimisiz?`)) return;
    try {
      await adminAPI.deleteReward(id);
      setRewards(prev => prev.filter(r => r.id !== id && r._id !== id));
      setMessage("Sovg'a o'chirildi");
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
            <Gift className="w-6 h-6 text-amber-500" />
            <span>Coin & Sovgʻalar Boshqaruvi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Sovgʻalar katalogini yangilash, coin narxlarini belgilash va oʻchirish
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-black transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Sovgʻa Qoʻshish</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Sovgʻalar yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((rew) => (
            <div key={rew.id || rew._id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    {rew.icon || '🎁'}
                  </span>
                  {rew.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Mashhur ⭐
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
                    {rew.category}
                  </span>
                  <h3 className="font-extrabold text-white text-base">{rew.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rew.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-1 font-black text-amber-400 text-sm">
                  <Coins className="w-4 h-4 fill-amber-400" />
                  <span>{rew.cost} Coin</span>
                </div>
                <button
                  onClick={() => handleDelete(rew.id || rew._id, rew.title)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1"
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
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">Yangi Sovgʻa Qoʻshish</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Sovgʻa nomi:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Kitob (PDF)"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Ikonka:</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Narxi (Coin):</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Toifa:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Nishon">Nishon</option>
                    <option value="Kitob">Kitob</option>
                    <option value="Imkoniyat">Imkoniyat</option>
                    <option value="Avatar">Avatar</option>
                    <option value="Sertifikat">Sertifikat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Qisqacha tavsif:</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sovg'a haqida..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pop"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="accent-amber-500"
                />
                <label htmlFor="pop" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Mashhur (bestseller) sifatida belgilash
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Bekor qilish</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs rounded-xl shadow">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminRewards;
