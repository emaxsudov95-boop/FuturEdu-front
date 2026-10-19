import React, { useState, useEffect } from 'react';
import { careerAPI, adminAPI } from '../../services/api';
import { Compass, Plus, Trash2, CheckCircle2, DollarSign, TrendingUp, BookOpen } from 'lucide-react';

const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('💼');
  const [category, setCategory] = useState('Texnologiya & IT');
  const [description, setDescription] = useState('');
  const [averageSalary, setAverageSalary] = useState('$1,500 - $4,000');
  const [demandLevel, setDemandLevel] = useState('Juda yuqori');
  const [requiredSubjectsText, setRequiredSubjectsText] = useState('Matematika, Informatika, Ingliz tili');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await careerAPI.getAll();
      if (res.data?.data) {
        setCareers(res.data.data);
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

    const subjectsArray = requiredSubjectsText.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await adminAPI.createCareer({
        title,
        icon,
        category,
        description,
        averageSalary,
        demandLevel,
        requiredSubjects: subjectsArray,
        roadmap: [
          { step: 1, title: 'Asoslar', desc: `${subjectsArray[0] || 'Asosiy'} fani boʻyicha fundamental bilimlarni egallash.` },
          { step: 2, title: 'Amaliy bilimlar', desc: 'Soha boʻyicha amaliy mashgʻulotlar va mini-loyihalar ustida ishlash.' },
          { step: 3, title: 'Mutaxassislikka kirish', desc: 'Oliy taʼlim va professional sertifikatlarga tayyorgarlik.' }
        ]
      });

      if (res.data?.success) {
        setMessage(res.data.message);
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchCareers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, careerTitle) => {
    if (!window.confirm(`"${careerTitle}" kasbini oʻchirmoqchimisiz?`)) return;
    try {
      await adminAPI.deleteCareer(id);
      setCareers(prev => prev.filter(c => c.id !== id && c.slug !== id));
      setMessage("Kasb muvaffaqiyatli o'chirildi");
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
            <Compass className="w-6 h-6 text-brand-500" />
            <span>Fanlar & Kasblar Boshqaruvi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Yangi kasblar, ularga zarur fanlar va yoʻl xaritasini (roadmap) boshqarish
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kasb Qoʻshish</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Kasblar yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {careers.map((career) => (
            <div key={career.slug || career.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    {career.icon || '💼'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                    {career.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base">{career.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{career.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-900 text-xs">
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{career.averageSalary}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">KERAKLI FANLAR:</span>
                    <div className="flex flex-wrap gap-1">
                      {career.requiredSubjects?.map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-brand-300 text-[10px] font-semibold border border-slate-800">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => handleDelete(career.id || career.slug, career.title)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Oʻchirish</span>
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
              <h3 className="font-black text-white text-base">Yangi Kasb Yoʻnalishi</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Kasb nomi:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Biotexnolog"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Ikonka (emoji):</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Soha / Kategoriya:</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Kerakli fanlar (vergul bilan):</label>
                <input
                  type="text"
                  required
                  value={requiredSubjectsText}
                  onChange={(e) => setRequiredSubjectsText(e.target.value)}
                  placeholder="Biologiya, Kimyo, Ingliz tili"
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-brand-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Oʻrtacha maosh:</label>
                  <input
                    type="text"
                    value={averageSalary}
                    onChange={(e) => setAverageSalary(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Talab darajasi:</label>
                  <input
                    type="text"
                    value={demandLevel}
                    onChange={(e) => setDemandLevel(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Kasb tavsifi:</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kasb haqida qisqacha ma'lumot..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Bekor qilish</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow">Kasbni Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCareers;
