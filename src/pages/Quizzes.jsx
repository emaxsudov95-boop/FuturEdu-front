import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI, careerAPI } from '../services/api';
import { 
  BookOpen, 
  Clock, 
  Coins, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Bot,
  Award,
  AlertCircle,
  Compass,
  Check,
  Target,
  Brain,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Quizzes = () => {
  const { user, updateUserStats } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSubject = searchParams.get('subject') || 'Barchasi';

  // Kasb holatlari
  const [diagnosedCareer, setDiagnosedCareer] = useState(() => {
    return localStorage.getItem('user_diagnosed_career') || user?.selectedCareer || null;
  });
  const [careersList, setCareersList] = useState([]);

  // Diagnostika testi bosqichlari
  const [isDiagnosticActive, setIsDiagnosticActive] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [diagnosticScores, setDiagnosticScores] = useState({
    'ai-engineer': 0,
    'software-engineer': 0,
    'doctor-surgeon': 0,
    'cyber-security': 0,
    'architect-designer': 0,
    'finance-business': 0
  });
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Testlar holatlari
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active quiz session states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // 6 ta Chuqur Kasbga Yo'naltiruvchi Diagnostika Savollari
  const diagnosticQuestions = [
    {
      q: "Boʻsh vaqtingizda qaysi mashgʻulot sizga eng koʻp zavq va qiziqish bagʻishlaydi?",
      icon: "🎯",
      options: [
        { text: "Aqlli robotlar, sun'iy intellekt va murakkab hisob-kitoblar bilan shug'ullanish", career: "ai-engineer" },
        { text: "Kompyuterda kod yozish, o‘yinlar va zamonaviy veb-saytlar yaratish", career: "software-engineer" },
        { text: "Insonlarga yordam berish, salomatlik va tabiat biologiyasini o'rganish", career: "doctor-surgeon" },
        { text: "Kiberxavfsizlik, tizimlarni xakerlik hujumlaridan himoya qilish va shifrlash", career: "cyber-security" },
        { text: "Binolar, zamonaviy dizayn, 3D shakllar va chizmalar chizish", career: "architect-designer" }
      ]
    },
    {
      q: "Maktabda qaysi fanlar darsida vaqt qanday tez oʻtib ketganini sezmay qolasiz?",
      icon: "📚",
      options: [
        { text: "Matematika va Mantiqiy masalalar", career: "ai-engineer" },
        { text: "Informatika va Ingliz tili", career: "software-engineer" },
        { text: "Biologiya va Kimyo laboratoriyalari", career: "doctor-surgeon" },
        { text: "Kompyuter tarmoqlari va axborot xavfsizligi", career: "cyber-security" },
        { text: "Fizika, Chizmachilik va Geometriya", career: "architect-designer" }
      ]
    },
    {
      q: "Kutilmagan muammoga duch kelganingizda qanday usulda yechim qidirasiz?",
      icon: "🧩",
      options: [
        { text: "Chuqur mantiqiy tahlil qilib, ma'lumotlar va qonuniyatlarni topish orqali", career: "ai-engineer" },
        { text: "Muammoni mayda bosqichlarga bo'lib, avtomatlashtirilgan dastur yordamida", career: "software-engineer" },
        { text: "Diqqat bilan alomatlarni kuzatib, tirik organizm kabi ehtiyotkorona yondashib", career: "doctor-surgeon" },
        { text: "Tizimning zaif joylarini tekshirib, xavf-xatarlarni oldindan to'sish orqali", career: "cyber-security" },
        { text: "Fazoviy tasavvur qilib, chizma yoki 3D ko'rinishida modellashtirib", career: "architect-designer" }
      ]
    },
    {
      q: "Kelajakda qanday natijaga erishish sizni eng koʻp faxrlantiradi?",
      icon: "🌟",
      options: [
        { text: "Odamdek fikrlovchi va yangi ixtirolar qiluvchi Sun'iy Intellekt yaratish", career: "ai-engineer" },
        { text: "Millionlab insonlar har kuni foydalanadigan super ilova yoki web-servis qurish", career: "software-engineer" },
        { text: "Og'ir kasalliklarni davolab, insonlar hayotini saqlab qolish", career: "doctor-surgeon" },
        { text: "Davlat va yirik banklarning maxfiy tizimlarini raqamli posbonday himoyalash", career: "cyber-security" },
        { text: "Kelajak shaharlarini va osmono'par go'zal binolarni loyihalash", career: "architect-designer" }
      ]
    },
    {
      q: "Sizni qaysi zamonaviy texnologiya eng koʻp hayratlantiradi?",
      icon: "⚡",
      options: [
        { text: "Neyrotarmoqlar, ChatGPT va o'zini o'zi boshqaradigan aqlli mashinalar", career: "ai-engineer" },
        { text: "Tezkor bulutli serverlar, zamonaviy JavaScript va veb-platformalar", career: "software-engineer" },
        { text: "Genetika, DNK tahrirlash va zamonaviy tibbiy nanotexnologiyalar", career: "doctor-surgeon" },
        { text: "Kriptografiya, xavfsiz blokcheyn va kiber himoya qalqonlari", career: "cyber-security" },
        { text: "Eko-arxitektura, aqlli uylar va 3D qurilish printerlari", career: "architect-designer" }
      ]
    },
    {
      q: "Doʻstlaringiz va ustozlaringiz sizdagi qaysi kuchli jihatni koʻproq maqtashadi?",
      icon: "💎",
      options: [
        { text: "Oʻta kuchli mantiq va murakkab formulalarni tez tushunishimni", career: "ai-engineer" },
        { text: "Kompyuter va yangi texnologiyalarni chaqqon o'zlashtirishimni", career: "software-engineer" },
        { text: "Mehribonlik, sabr-toqat va boshqalarga yordam berishga intilishimni", career: "doctor-surgeon" },
        { text: "Hushyorlik, ehtiyotkorlik va nozik xatolarni tezda payqashimni", career: "cyber-security" },
        { text: "Ijodiy tasavvur, chiroyli did va chizmachilik qobiliyatimni", career: "architect-designer" }
      ]
    }
  ];

  // Kasblar haqida to'liq ma'lumot xaritasi
  const careerProfiles = {
    'ai-engineer': {
      title: "Sun'iy Intellekt Muhandisi (AI Engineer)",
      icon: "🤖",
      color: "from-blue-600 to-indigo-600",
      salary: "$2,000 - $6,000+",
      matchPercent: 96,
      requiredSubjects: ["Matematika", "Informatika", "Ingliz tili", "Fizika"],
      tagline: "Sizda chuqur mantiqiy fikrlash, matematika va zamonaviy neyrotarmoqlarga kuchli moyillik aniqlandi!",
      recommendedCategory: "Informatika"
    },
    'software-engineer': {
      title: "Dasturchi (Full-Stack Web Developer)",
      icon: "💻",
      color: "from-violet-600 to-purple-600",
      salary: "$1,500 - $4,500",
      matchPercent: 94,
      requiredSubjects: ["Informatika", "Matematika", "Ingliz tili"],
      tagline: "Sizda algoritmik fikrlash, web texnologiyalari va yangi ilovalar yaratishga yuksak iqtidor mavjud!",
      recommendedCategory: "Informatika"
    },
    'doctor-surgeon': {
      title: "Shifokor va Jarroh (Doctor / Surgeon)",
      icon: "🩺",
      color: "from-emerald-600 to-teal-600",
      salary: "$1,500 - $5,000",
      matchPercent: 95,
      requiredSubjects: ["Biologiya", "Kimyo", "Ona tili", "Fizika"],
      tagline: "Sizda insonparvarlik, tabiat sirlariga qiziqish va biologik jarayonlarni chuqur his qilish qobiliyati ustun!",
      recommendedCategory: "Biologiya"
    },
    'cyber-security': {
      title: "Kiberxavfsizlik Mutaxassisi (Cybersecurity)",
      icon: "🛡️",
      color: "from-amber-600 to-rose-600",
      salary: "$1,800 - $5,500",
      matchPercent: 93,
      requiredSubjects: ["Informatika", "Matematika", "Ingliz tili"],
      tagline: "Sizda o'ta hushyorlik, himoya instinkti va axborot xavfsizligini ta'minlashga yuqori potensial bor!",
      recommendedCategory: "Informatika"
    },
    'architect-designer': {
      title: "Arxitektor va 3D Dizayner (Architect)",
      icon: "🏛️",
      color: "from-rose-600 to-pink-600",
      salary: "$1,000 - $3,500",
      matchPercent: 92,
      requiredSubjects: ["Fizika", "Matematika", "Chizmachilik"],
      tagline: "Sizda boy fazoviy tasavvur, chizmachilik va muhandislik estetikasiga nodir qobiliyat namoyon bo'ldi!",
      recommendedCategory: "Fizika"
    }
  };

  // Kasblar ro'yxatini olish
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await careerAPI.getAll();
        if (res.data?.data) {
          setCareersList(res.data.data);
        }
      } catch (err) {}
    };
    fetchCareers();
  }, []);

  // Kasb aniqlangandan so'ng unga mos testlarni yuklash
  useEffect(() => {
    if (diagnosedCareer) {
      fetchCareerQuizzes();
    }
  }, [diagnosedCareer, selectedSubject]);

  const fetchCareerQuizzes = async () => {
    setLoading(true);
    try {
      // Backenddan barcha testlarni olamiz
      const res = await quizAPI.getAll(selectedSubject);
      if (res.data?.data) {
        setQuizzes(res.data.data);
      }
    } catch (err) {
      console.error('Quiz fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Diagnostika testida variant tanlash
  const handleDiagnosticAnswer = (careerKey) => {
    setDiagnosticScores(prev => ({
      ...prev,
      [careerKey]: (prev[careerKey] || 0) + 1
    }));

    if (diagnosticStep + 1 < diagnosticQuestions.length) {
      setDiagnosticStep(prev => prev + 1);
    } else {
      // Barcha savollar tugadi - AI tahlilini boshlash
      setIsAnalyzing(true);
      setTimeout(() => {
        // Eng ko'p ball to'plagan kasbni hisoblash
        const updatedScores = {
          ...diagnosticScores,
          [careerKey]: (diagnosticScores[careerKey] || 0) + 1
        };

        let bestCareer = 'ai-engineer';
        let maxScore = -1;
        Object.entries(updatedScores).forEach(([key, score]) => {
          if (score > maxScore) {
            maxScore = score;
            bestCareer = key;
          }
        });

        const selectedProfile = careerProfiles[bestCareer] || careerProfiles['ai-engineer'];
        setDiagnosticResult(selectedProfile);
        setIsAnalyzing(false);

        // Confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 1500);
    }
  };

  // Tanlangan kasbni tasdiqlash va profilga saqlash
  const handleConfirmCareer = async (profile) => {
    setDiagnosedCareer(profile.title);
    localStorage.setItem('user_diagnosed_career', profile.title);
    setIsDiagnosticActive(false);
    setDiagnosticResult(null);

    try {
      await careerAPI.selectCareer(profile.title);
      if (user) {
        updateUserStats(
          (user.coins || 0) + 50,
          (user.xp || 0) + 60,
          user.level,
          profile.title
        );
      }
    } catch (e) {}

    // Sahifani mos mashqlarga o'tkazish
    fetchCareerQuizzes();
  };

  // Testni boshlash (faqat kasb tanlangandan so'ng)
  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setSubmissionResult(null);
    setTimeLeft(quiz.timeLimitMinutes * 60);
  };

  // Taymer
  useEffect(() => {
    if (!activeQuiz || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isSubmitted, timeLeft]);

  // Variantni belgilash
  const handleSelectOption = (qIdx, optIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Testni topshirish
  const handleSubmitQuiz = async () => {
    if (!activeQuiz || isSubmitted) return;

    try {
      const res = await quizAPI.submit(activeQuiz.id || activeQuiz._id, userAnswers);
      const resultData = res.data;
      setSubmissionResult(resultData);
      setIsSubmitted(true);

      if (resultData.percentage >= 60) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (user && resultData.earnedCoins) {
        updateUserStats(
          (user.coins || 0) + resultData.earnedCoins,
          (user.xp || 0) + resultData.earnedXp,
          user.level
        );
      }
    } catch (err) {
      console.error('Quiz submit error:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Tanlangan kasb ma'lumotlari
  const currentCareerInfo = Object.values(careerProfiles).find(p => 
    p.title.toLowerCase().includes((diagnosedCareer || '').toLowerCase())
  ) || careerProfiles['ai-engineer'];

  // ==========================================
  // KO'RINISH 1: TEST TOP HIRISH JARAYONI (Faol test)
  // ==========================================
  if (activeQuiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Quiz Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                {activeQuiz.subject} • {activeQuiz.difficulty}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {!isSubmitted && (
                <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-mono font-bold text-sm border ${
                  timeLeft < 60 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}

              <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold">
                <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>+{activeQuiz.coinsReward} Coin</span>
              </div>
            </div>
          </div>

          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Savol {currentQuestionIndex + 1} / {activeQuiz.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>
              </div>

              <div className="space-y-3">
                {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all text-xs sm:text-sm font-semibold ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-2 ring-brand-400/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {optionLetters[optIdx]}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 disabled:opacity-40"
                >
                  Orqaga
                </button>

                {currentQuestionIndex + 1 < activeQuiz.questions.length ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
                  >
                    Keyingi savol
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5"
                  >
                    <span>Testni yakunlash</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Test Natijasi */
            <div className="space-y-6 text-center animate-in zoom-in-95">
              <div className="inline-flex p-4 rounded-3xl bg-amber-50 border border-amber-200">
                <Award className="w-12 h-12 text-amber-500" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {submissionResult?.percentage >= 60 ? 'Ajoyib natija! 🎉' : 'Yaxshi urinish! 💪'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  {submissionResult?.motivationalMessage}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-xl font-black text-slate-900">{submissionResult?.percentage}%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Aniqlik</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="text-xl font-black text-amber-600">+{submissionResult?.earnedCoins}</div>
                  <div className="text-[10px] text-amber-700 font-bold uppercase">Coinlar</div>
                </div>
                <div className="p-3 bg-violet-50 rounded-2xl border border-violet-200">
                  <div className="text-xl font-black text-violet-600">+{submissionResult?.earnedXp}</div>
                  <div className="text-[10px] text-violet-700 font-bold uppercase">XP Tajriba</div>
                </div>
              </div>

              {/* Savollarning batafsil tahlili */}
              <div className="space-y-4 text-left pt-6 border-t border-slate-100">
                <h4 className="font-extrabold text-sm text-slate-900">Xatolar va AI Ustoz Tahlili:</h4>
                <div className="space-y-3">
                  {submissionResult?.reviewDetails?.map((rev, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border ${
                        rev.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      } space-y-2`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
                          {rev.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <span>{i + 1}-savol: {rev.question}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rev.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rev.isCorrect ? 'Toʻgʻri' : 'Xato'}
                        </span>
                      </div>
                      <div className="p-3 bg-white/90 rounded-xl text-xs text-slate-700 border border-slate-200/60 leading-relaxed">
                        <span className="font-bold text-indigo-700 flex items-center gap-1 mb-0.5">
                          <Bot className="w-3.5 h-3.5" /> AI Ustoz tushuntirishi:
                        </span>
                        {rev.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qayta ishlash</span>
                </button>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-2xl text-xs sm:text-sm transition-all"
                >
                  Boshqa mashqlarga qaytish
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    );
  }

  // ==========================================
  // KO'RINISH 2: KASB TANLASH DIAGNOSTIKA TESTI BOSQICHI
  // ==========================================
  if (isDiagnosticActive) {
    const currentQ = diagnosticQuestions[diagnosticStep];

    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        
        {isAnalyzing ? (
          /* AI Tahlil qilish ekrani */
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-brand-50 border-4 border-brand-500 border-t-transparent animate-spin mx-auto flex items-center justify-center">
              <Brain className="w-8 h-8 text-brand-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Sunʼiy Intellekt Javoblaringizni Tahlil Qilmoqda... 🤖
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                Qobiliyatlaringiz, qiziqishlaringiz va kuchli tomonlaringiz asosida sizga eng mos kelajak kasbi saralanmoqda.
              </p>
            </div>
          </div>
        ) : diagnosticResult ? (
          /* AI Natijasi: Kasb Tavsiyasi */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-brand-500 shadow-2xl space-y-6 animate-in zoom-in-95">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Diagnostika Natijasi • {diagnosticResult.matchPercent}% Moslik</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sizga Eng Mos Kelajak Kasbi Aniqlanishi 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                {diagnosticResult.tagline}
              </p>
            </div>

            {/* Tavsiya etilgan kasb kartasi */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-5 border border-indigo-800 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shrink-0 backdrop-blur-md">
                  {diagnosticResult.icon}
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                    Tavsiya Etilgan Asosiy Yoʻnalish
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {diagnosticResult.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Oylik oʻrtacha daromad: <span className="text-amber-300 font-bold">{diagnosticResult.salary}</span>
                  </p>
                </div>
              </div>

              {/* Kerakli fanlar */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <span className="text-xs font-bold text-slate-300 block">
                  Ushbu kasb uchun o‘rganishingiz zarur bo‘lgan asosiy fanlar:
                </span>
                <div className="flex flex-wrap gap-2">
                  {diagnosticResult.requiredSubjects.map((sub, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-white/15 text-white text-xs font-extrabold flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{sub}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleConfirmCareer(diagnosticResult)}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Ushbu Kasb Mashqlarini Boshlash 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setDiagnosticStep(0);
                  setDiagnosticResult(null);
                  setDiagnosticScores({
                    'ai-engineer': 0,
                    'software-engineer': 0,
                    'doctor-surgeon': 0,
                    'cyber-security': 0,
                    'architect-designer': 0,
                    'finance-business': 0
                  });
                }}
                className="py-3 px-5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm"
              >
                Qaytadan topshirish
              </button>
            </div>

          </div>
        ) : (
          /* Savollar jarayoni */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
            
            {/* Step progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-600" />
                  <span>Kasb Diagnostika Savoli {diagnosticStep + 1} / {diagnosticQuestions.length}</span>
                </span>
                <span className="text-brand-600">
                  {Math.round(((diagnosticStep + 1) / diagnosticQuestions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((diagnosticStep + 1) / diagnosticQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Savol matni */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl mb-2 block">{currentQ.icon}</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentQ.q}
              </h3>
            </div>

            {/* Variantlar */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleDiagnosticAnswer(opt.career)}
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-brand-50/70 hover:border-brand-400 text-slate-800 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-all hover:scale-[1.01] group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-xs font-black shrink-0 transition-colors">
                      {i + 1}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsDiagnosticActive(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ✕ Bekor qilish va orqaga qaytish
              </button>
            </div>

          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // KO'RINISH 3: AGAR KASB TANLANMAGAN BO'LSA
  // (Foydalanuvchi to'g'ridan-to'g'ri test boshlay olmaydi, oldin diagnostikadan o'tishi shart!)
  // ==========================================
  if (!diagnosedCareer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        
        {/* Banner: Testlarni boshlashdan oldin kasb aniqlanadi */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-700/60 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl mx-auto border border-white/20 shadow-lg">
            🧭
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avval Kasb Tanlash Diagnostikasidan Oʻting</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Oʻzingizga Mos Kasbni Aniqlang va Maxsus Mashqlarni Ochiring!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Platformamizda tasodifiy testlar berilmaydi. Har bir oʻquvchi oʻz qobiliyati va kelajak maqsadiga mos kasbni tanlashi kerak. 6 ta qisqa va qiziqarli savolga javob bering — sunʼiy intellekt sizga eng mos kasbni va uning mashqlarini chiqarib beradi!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setDiagnosticStep(0);
                setDiagnosticScores({
                  'ai-engineer': 0,
                  'software-engineer': 0,
                  'doctor-surgeon': 0,
                  'cyber-security': 0,
                  'architect-designer': 0,
                  'finance-business': 0
                });
                setIsDiagnosticActive(true);
              }}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>Kasb Diagnostika Testini Boshlash (+50 Coin)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>6 ta qiziqarli diagnostika savoli</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AI tomonidan mos kasb tahlili</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kasbga yoʻnaltirilgan mashqlar toʻplami</span>
            </div>
          </div>
        </div>

        {/* Qulflangan testlar ko'rinishi (Locked Preview) */}
        <div className="space-y-4 opacity-75 grayscale-[30%]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Testlar ro‘yxati (Kasb aniqlangandan keyin ochiladi)</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">🔒 Qulflangan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Matematika va Mantiq Asoslari", sub: "Matematika", icon: "📐" },
              { title: "Informatika va Algoritmlar", sub: "Informatika", icon: "💻" },
              { title: "Fizika va Mexanika Qonunlari", sub: "Fizika", icon: "⚡" }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    🔒 Kutilmoqda
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.sub} fani bo'yicha amaliy mashqlar</p>
                <button
                  onClick={() => setIsDiagnosticActive(true)}
                  className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Oldin kasbni aniqlang 🔒
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // KO'RINISH 4: KASB ANIQLANGAN -> SHU KASBGA MOS MASHQLAR VA TESTLAR
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Tanlangan Kasb Boshqaruvi Bannari */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl shrink-0 backdrop-blur-md border border-white/20">
              {currentCareerInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Faol Maqsad Kasbingiz
                </span>
                <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Moslik: {currentCareerInfo.matchPercent}%</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {currentCareerInfo.title}
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Ushbu sahifada sizning tanlangan kasbingiz uchun zarur boʻlgan maxsus mashqlar, interaktiv testlar va bilim darajangiz aks etadi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/chat"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/40 transition-all shadow-sm"
              title="Kasbingiz bo'yicha maxsus guruh chatiga o'tish"
            >
              <span>💬</span>
              <span>Kasb Chati</span>
            </Link>

            <button
              onClick={() => {
                setDiagnosticStep(0);
                setIsDiagnosticActive(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shrink-0"
              title="Diagnostika testini qayta topshirish"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Kasbni qayta aniqlash</span>
            </button>
          </div>

        </div>

        {/* Required subjects pill bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold mr-1">Kasb uchun kerakli fanlar:</span>
          {currentCareerInfo.requiredSubjects.map((sub, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-semibold">
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Fanlar bo'yicha filter - FAQAT KASBGA KERAKLI FANLAR KO'RSATILADI */}
      {(() => {
        const careerSubjects = currentCareerInfo.requiredSubjects || [];

        // FAQAT ushbu kasb o'rganishi kerak bo'lgan fanlar va mashqlarni filtrlash
        const careerMatchedQuizzes = quizzes.filter((quiz) => {
          const isRequiredSubject = careerSubjects.some(
            (sub) => sub.trim().toLowerCase() === (quiz.subject || '').trim().toLowerCase()
          );
          const isDirectCareerMatch = (quiz.careerTitle && quiz.careerTitle.toLowerCase().includes(currentCareerInfo.title.toLowerCase())) ||
                                      (quiz.careerSlug && quiz.careerSlug.toLowerCase() === currentCareerInfo.slug);

          // Kasbga mutlaqo aloqasi bo'lmagan boshqa fanlarni ko'rsatmaymiz!
          if (!isRequiredSubject && !isDirectCareerMatch) {
            return false;
          }

          // Agar o'quvchi ma'lum bir fanni tanlagan bo'lsa
          if (selectedSubject && selectedSubject !== 'Barchasi') {
            return (quiz.subject || '').trim().toLowerCase() === selectedSubject.trim().toLowerCase();
          }

          return true;
        });

        // Filtr tugmalari: faqat kasb uchun kerakli fanlar ro'yxati
        const subjectTabs = ['Barchasi', ...careerSubjects];

        return (
          <>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-600" />
                  <span>{currentCareerInfo.title} Uchun Saralangan Mashqlar</span>
                </h2>
                <p className="text-xs text-slate-600">
                  Kerakli fanlar: <span className="font-bold text-brand-700">{careerSubjects.join(', ')}</span>. 
                  Boshqa begona fanlar chiqarilmaydi. ({careerMatchedQuizzes.length} ta mashq mavjud)
                </p>
              </div>

              {/* Fanlar Filtr Tugmalari: FAQAT KASB FANLARI */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {subjectTabs.map((sub) => {
                  const isSelected = (selectedSubject === sub) || (sub === 'Barchasi' && (!selectedSubject || selectedSubject === 'Barchasi'));
                  return (
                    <button
                      key={sub}
                      onClick={() => setSearchParams(sub === 'Barchasi' ? {} : { subject: sub })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-sm ring-1 ring-brand-400'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {sub === 'Barchasi' ? 'Barcha kasb fanlari' : sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quizzes List - FAQAT KASB MASHQLARI */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-600 font-semibold">Kasbingizga mos mashqlar saralanmoqda...</p>
              </div>
            ) : careerMatchedQuizzes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-1" />
                <p className="text-sm font-bold text-slate-800">
                  {selectedSubject && selectedSubject !== 'Barchasi' 
                    ? `"${selectedSubject}" fani bo'yicha bu kasb uchun mashqlar tez orada qo'shiladi` 
                    : `"${currentCareerInfo.title}" kasbi fanlari bo'yicha mashqlar tez orada to'ldiriladi`}
                </p>
                <p className="text-xs text-slate-500">
                  Kerakli fanlar: {careerSubjects.join(', ')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerMatchedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id || quiz._id}
                    className="bg-white rounded-3xl p-6 border border-brand-200/90 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      
                      {/* Card Top */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {quiz.icon || '📚'}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ⭐ {quiz.subject} (Kasb fani)
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {quiz.difficulty || "O'rtacha"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-extrabold text-brand-600 block mb-1 uppercase tracking-wider">
                          {quiz.subject}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                          {quiz.title}
                        </h3>
                      </div>

                      {/* Rewards */}
                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{quiz.timeLimitMinutes || 10} daqiqa</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-amber-600">
                          <Coins className="w-3.5 h-3.5 fill-amber-500" />
                          <span>+{quiz.coinsReward} Coin</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-violet-600">
                          <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>+{quiz.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Mashqni boshlash tugmasi */}
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="mt-6 w-full py-3 bg-slate-900 group-hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>Mashqni boshlash</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      })()}

    </div>
  );
};

export default Quizzes;
