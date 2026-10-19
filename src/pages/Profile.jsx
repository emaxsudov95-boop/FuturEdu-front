import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../services/api';
import { 
  User as UserIcon, 
  Coins, 
  Flame, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  Edit3, 
  Gift, 
  Sparkles, 
  Compass,
  Save
} from 'lucide-react';

const Profile = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    avatar: '🧑‍🎓',
    selectedCareer: ''
  });
  const [statusMsg, setStatusMsg] = useState('');

  const avatarOptions = ['🧑‍🎓', '🚀', '🦁', '🌟', '👩‍🎓', '⚡', '🤖', '👨‍🚀', '🏆', '🦉'];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        grade: user.grade || '8-sinf',
        avatar: user.avatar || '🧑‍🎓',
        selectedCareer: user.selectedCareer || "Dasturchi (Full-Stack Web Developer)"
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile(formData);
      if (res.data?.success) {
        setUser(res.data.user);
        setIsEditing(false);
        setStatusMsg('Profilingiz muvaffaqiyatli yangilandi! ✨');
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-900">Profilni koʻrish uchun tizimga kiring</h2>
        <p className="text-xs text-slate-600">Oʻz natijalaringiz, yigʻilgan coinlar va yutuqlaringizni kuzatib boring.</p>
        <a href="/login" className="inline-block px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl text-sm">
          Kirish
        </a>
      </div>
    );
  }

  // Hisoblash: keyingi darajagacha XP
  const currentLevelXp = (user.xp || 50) % 150;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXp / 150) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
        
        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-100 to-indigo-100 flex items-center justify-center text-5xl shadow-inner border border-brand-200 shrink-0">
              {user.avatar || '🧑‍🎓'}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {user.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                  {user.grade}
                </span>
              </div>
              <p className="text-xs text-slate-600">{user.email}</p>
              
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs font-semibold text-indigo-700">
                <Compass className="w-4 h-4" />
                <span>Orzudagi kasb: <strong>{user.selectedCareer || 'Tanlanmagan'}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Yopish' : 'Tahrirlash'}</span>
          </button>

        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleUpdate} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <h3 className="font-extrabold text-sm text-slate-900">Profil maʼlumotlarini tahrirlash:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ism va familiya:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Maktab sinfi:</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Avatar belgisini tanlang:</label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: av })}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all ${
                      formData.avatar === av ? 'bg-brand-600 scale-110 shadow-md ring-2 ring-brand-400' : 'bg-white border hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Saqlash</span>
              </button>
            </div>
          </form>
        )}

        {/* 4 Gamification Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
            <span className="text-xs font-bold text-amber-700 block">Jami Coinlar</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-center gap-1.5 mt-1">
              <Coins className="w-6 h-6 fill-amber-500" />
              <span>{user.coins || 0}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200/80">
            <span className="text-xs font-bold text-violet-700 block">Tajriba (XP)</span>
            <div className="text-2xl sm:text-3xl font-black text-violet-600 flex items-center gap-1.5 mt-1">
              <Sparkles className="w-6 h-6 text-violet-500" />
              <span>{user.xp || 0} XP</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80">
            <span className="text-xs font-bold text-indigo-700 block">Daraja (Level)</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 flex items-center gap-1.5 mt-1">
              <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span>Lv.{user.level || 1}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-xs font-bold text-emerald-700 block">Yechilgan testlar</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 flex items-center gap-1.5 mt-1">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span>{user.completedQuizzes?.length || 1} ta</span>
            </div>
          </div>

        </div>

        {/* Level Progress Bar */}
        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Daraja rivojlanishi (Lv.{user.level || 1} ➔ Lv.{(user.level || 1) + 1})</span>
            <span className="text-brand-600">{currentLevelXp} / 150 XP ({levelProgressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Badges & Inventory 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Nishonlar (Badges) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Yutuq Nishonlari ({user.badges?.length || 0})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((b, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/60 flex items-center justify-center text-2xl shrink-0">
                    {b.icon || '🏅'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-amber-950">{b.name}</h4>
                    <p className="text-[10px] text-amber-800">{b.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600 col-span-2">Testlarni aʻlo yechib nishonlarga ega boʻling!</p>
            )}
          </div>
        </div>

        {/* Sotib olingan buyumlar (Inventory) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-brand-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Mening Sovgʻalarim ({user.inventory?.length || 0})
              </h3>
            </div>
            <a href="/rewards" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Doʻkon →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.inventory && user.inventory.length > 0 ? (
              user.inventory.map((inv, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-brand-50/50 border border-brand-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-2xl shrink-0">
                    {inv.icon || '🎁'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-950">{inv.title}</h4>
                    <span className="text-[10px] text-emerald-700 font-semibold">Faol</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-600">Sizda hali sovgʻalar yoʻq.</p>
                <a href="/rewards" className="mt-2 inline-block text-xs font-bold text-brand-600">
                  Coinlarni sovgʻalarga almashtirish
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bajargan Testlar Tarixi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-slate-900 text-base">
            Yechilgan testlar va natijalar tarixi
          </h3>
        </div>

        {user.completedQuizzes && user.completedQuizzes.length > 0 ? (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {user.completedQuizzes.map((cq, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{cq.quizTitle}</h4>
                  <span className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(cq.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-extrabold px-3 py-1 bg-brand-50 text-brand-700 rounded-full">
                    {cq.score} / {cq.maxScore} toʻgʻri
                  </span>
                  <div className="flex items-center gap-1 text-xs font-black text-amber-600">
                    <Coins className="w-4 h-4 fill-amber-500" />
                    <span>+{cq.coinsEarned}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600">Hali birorta ham test topshirilmadi.</p>
        )}
      </div>

    </div>
  );
};

export default Profile;
