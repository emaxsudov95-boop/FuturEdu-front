import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerAPI } from '../services/api';
import { 
  Compass, 
  Sparkles, 
  CheckCircle, 
  BookOpen, 
  Award, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  ChevronRight,
  HelpCircle,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CareerGuide = () => {
  const { user, updateUserStats } = useAuth();
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Mini quiz holati
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [recommendedCareerSlug, setRecommendedCareerSlug] = useState(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await careerAPI.getAll();
        if (res.data?.data) {
          setCareers(res.data.data);
          // Agar foydalanuvchida allaqachon tanlangan kasb bo'lsa, o'shani ochiq qo'yamiz
          const initial = res.data.data.find(c => c.title === user?.selectedCareer) || res.data.data[0];
          setSelectedCareer(initial);
        }
      } catch (err) {
        console.error('Careers error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [user]);

  // Kasbni profilga biriktirish
  const handleSelectAsGoal = async (career) => {
    try {
      const res = await careerAPI.selectCareer(career.title);
      setSuccessMessage(res.data?.message || `"${career.title}" kasbi profilingizga biriktirildi!`);
      
      // Confetti effekti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });

      localStorage.setItem('user_diagnosed_career', career.title);

      if (user) {
        updateUserStats(
          (user.coins || 0) + 25,
          (user.xp || 0) + 30,
          user.level,
          career.title
        );
      }

      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      setSuccessMessage(`Kasb belgilandi: ${career.title}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Mini-test savollari
  const careerTestQuestions = [
    {
      q: "Boʻsh vaqtingizda nima bilan shugʻullanish sizga koʻproq zavq bagʻishlaydi?",
      options: [
        { text: "Kompyuterda yangi dastur va oʻyinlar tuzish", slug: "software-engineer" },
        { text: "Robotlar, aqlli texnologiyalar va sunʼiy intellekt haqida bilish", slug: "ai-engineer" },
        { text: "Insonlarga yordam berish va tabiat/tibbiyot sirlarini oʻrganish", slug: "doctor-surgeon" },
        { text: "Chiroyli binolar, dizayn va qiziqarli shakllar chizish", slug: "architect-designer" }
      ]
    },
    {
      q: "Maktabda qaysi fanlar darsida vaqt tezroq oʻtadi?",
      options: [
        { text: "Informatika va Ingliz tili", slug: "software-engineer" },
        { text: "Matematika va Mantiq", slug: "ai-engineer" },
        { text: "Biologiya va Kimyo", slug: "doctor-surgeon" },
        { text: "Chizmachilik va Fizika", slug: "architect-designer" }
      ]
    }
  ];

  const handleQuizAnswer = (slug) => {
    const updated = [...quizAnswers, slug];
    setQuizAnswers(updated);

    if (quizStep + 1 < careerTestQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      // Natijani aniqlash: eng ko'p tanlangan kasb
      const mostFrequent = updated[updated.length - 1] || 'software-engineer';
      setRecommendedCareerSlug(mostFrequent);
      const match = careers.find(c => c.slug === mostFrequent);
      if (match) setSelectedCareer(match);
      setQuizOpen(false);
      setQuizStep(0);
      setQuizAnswers([]);
      confetti({ particleCount: 60, spread: 50 });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold">Kasblar katalogi yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Kelajak Kasblari Yoʻriqnomasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Orzuingdagi kasbni tanla — kerakli fanlarni bilib ol!
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Har bir kasb muvaffaqiyati maktabdagi qaysi fanlarga bogʻliqligini, oʻrganish xaritasini va tavsiya etilgan testlarni shu yerda topasiz.
        </p>

        {/* Mini test trigger button */}
        <div className="pt-2">
          <button
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Qaysi kasb menga mos? Mini-test topshirish ✨</span>
          </button>
        </div>
      </div>

      {/* Success alert message */}
      {successMessage && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <span className="text-xs bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">+25 Coin</span>
        </div>
      )}

      {/* Interactive Career Cards Carousel / Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {careers.map((career) => {
          const isSelected = selectedCareer?.slug === career.slug;
          const isUserCareer = user?.selectedCareer === career.title;

          return (
            <button
              key={career.slug}
              onClick={() => setSelectedCareer(career)}
              className={`p-4 rounded-3xl text-left transition-all duration-200 border flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-brand-50 to-indigo-50/70 border-brand-500 shadow-lg shadow-brand-500/15 -translate-y-1'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {isUserCareer && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  Orzuim
                </div>
              )}
              <div className="text-3xl mb-2">{career.icon}</div>
              <div>
                <h3 className={`font-extrabold text-xs sm:text-sm line-clamp-2 ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                  {career.title}
                </h3>
                <span className="text-[10px] text-slate-600 block mt-1">
                  {career.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Career Detailed View */}
      {selectedCareer && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8 animate-in fade-in duration-300">
          
          {/* Top Banner of Selected Career */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-100 to-indigo-100 flex items-center justify-center text-5xl shadow-inner shrink-0">
                {selectedCareer.icon}
              </div>
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 uppercase tracking-wide">
                  {selectedCareer.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {selectedCareer.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  {selectedCareer.description}
                </p>
              </div>
            </div>

            {/* Set as goal button */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <button
                onClick={() => handleSelectAsGoal(selectedCareer)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all ${
                  user?.selectedCareer === selectedCareer.title
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 hover:scale-105'
                }`}
              >
                {user?.selectedCareer === selectedCareer.title ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Mening orzuidagi kasbim!</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-5 h-5" />
                    <span>Shu kasbni maqsadim deb tanlash</span>
                    <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black">
                      +25 Coin
                    </span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-600">
                Tanlasangiz profilingizga biriktiriladi va bonus beriladi!
              </span>
            </div>
          </div>

          {/* Quick Metrics (Salary, Demand) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">Oʻrtacha oylik daromad</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-900">{selectedCareer.averageSalary}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-amber-800 font-semibold block">Bozorda talab darajasi</span>
                <span className="text-base sm:text-lg font-extrabold text-amber-900">{selectedCareer.demandLevel}</span>
              </div>
            </div>
          </div>

          {/* TAVSIYA ETILADIGAN FANLAR (Asosiy talab!) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-extrabold text-slate-900">
                {selectedCareer.title} uchun maktabda puxta oʻqilishi kerak boʻlgan fanlar:
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {selectedCareer.requiredSubjects.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-2xl text-brand-900 font-bold text-sm shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kerakli ko'nikmalar (Key Skills) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700">Kerakli koʻnikmalar va texnologiyalar:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCareer.keySkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold">
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bosqichma-bosqich yo'l xaritasi (Roadmap) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Muvaffaqiyatga eltuvchi yoʻl xaritasi (Roadmap):
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCareer.roadmap.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 transition-colors space-y-2 relative"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                      {step.step}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-9">
                    {step.desc}
                  </p>
                  {step.recommendedBooks && step.recommendedBooks.length > 0 && (
                    <div className="pl-9 pt-1 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">Tavsiya kitoblar:</span> {step.recommendedBooks.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Quizzes button */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50/60 p-4 rounded-2xl border border-brand-100">
            <div>
              <h4 className="font-bold text-sm text-brand-950">
                Ushbu kasbga mos testlarni topshirishga tayyormisiz?
              </h4>
              <p className="text-xs text-brand-700">
                {selectedCareer.requiredSubjects.join(', ')} fanlari boʻyicha testlarni topshirib Coin yigʻing!
              </p>
            </div>
            <Link
              to="/quizzes"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Kasb mashqlarini yechish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

      {/* Mini-Quiz Modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <h3 className="font-extrabold text-slate-900 text-base">Kasb tanlash mini-testi</h3>
              </div>
              <button
                onClick={() => setQuizOpen(false)}
                className="text-slate-600 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-600">
                Savol {quizStep + 1} / {careerTestQuestions.length}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                {careerTestQuestions[quizStep].q}
              </h4>

              <div className="space-y-2.5 pt-2">
                {careerTestQuestions[quizStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(opt.slug)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between group"
                  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CareerGuide;
