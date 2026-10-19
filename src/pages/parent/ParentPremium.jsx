import React, { useState, useEffect } from 'react';
import { parentAPI } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Crown, Check, Star, ShieldCheck, Zap, HeartHandshake, 
  Sparkles, Award, FileText, ArrowRight, CreditCard, CheckCircle2, 
  HelpCircle, AlertCircle, RefreshCw
} from 'lucide-react';

const ParentPremium = () => {
  const [subscription, setSubscription] = useState(() => {
    try {
      const saved = localStorage.getItem('parent_subscription');
      return saved ? JSON.parse(saved) : {
        isPremium: false,
        planId: 'free',
        planName: 'Tekin (Bepul)',
        expiresAt: null
      };
    } catch {
      return {
        isPremium: false,
        planId: 'free',
        planName: 'Tekin (Bepul)',
        expiresAt: null
      };
    }
  });

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState('click');
  const [cardNumber, setCardNumber] = useState('8600 4512 8901 2345');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Farzand dashboard ma'lumotlaridan obuna holatini olish
    const fetchStatus = async () => {
      try {
        const res = await parentAPI.getChildDashboard('child-1');
        if (res.data?.subscription) {
          setSubscription(res.data.subscription);
          localStorage.setItem('parent_subscription', JSON.stringify(res.data.subscription));
        }
      } catch (err) {
        console.error("Obuna holatini yuklashda xatolik:", err);
      }
    };
    fetchStatus();
  }, []);

  // Obunani aktivlashtirish tugmasi bosilganda
  const handlePlanClick = (plan) => {
    if (plan.id === 'free') {
      // Tekin tarifga to'g'ridan-to'g'ri o'tish (To'lovsiz)
      activatePlan(plan, null);
    } else {
      // Premium tarif uchun to'lov/aktivlashtirish modalini ochish
      setSelectedPlan(plan);
      setPaymentModalOpen(true);
    }
  };

  // Asosiy aktivlashtirish funksiyasi
  const activatePlan = async (plan, provider = null) => {
    setIsProcessing(true);

    try {
      const isPremium = plan.id === 'premium';
      const res = await parentAPI.updateSubscription({
        planId: plan.id,
        planName: plan.name,
        isPremium: isPremium,
        paymentMethod: provider || 'direct'
      });

      if (res.data?.success && res.data?.data) {
        const updatedSub = res.data.data;
        setSubscription(updatedSub);
        localStorage.setItem('parent_subscription', JSON.stringify(updatedSub));

        // Barcha ota-ona komponentlariga yangilanish xabarini yuborish
        window.dispatchEvent(new CustomEvent('parentSubscriptionChanged', {
          detail: { subscription: updatedSub }
        }));

        setIsProcessing(false);
        setPaymentModalOpen(false);

        if (isPremium) {
          // G'alaba animatsiyasi
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 }
          });
          setToastMessage({
            title: "Tabriklaymiz! Premium tarif aktivlashtirildi 🎉",
            desc: "Barcha AI tahlillar, cheksiz monitoring va rasmiy PDF hisobotlar muvaffaqiyatli ochildi."
          });
        } else {
          setToastMessage({
            title: "Tekin (bepul) tarif aktivlashtirildi ✓",
            desc: "Boshlang'ich bepul rejimga muvaffaqiyatli o'tildi."
          });
        }

        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err) {
      console.error("Obunani aktivlashtirishda xatolik:", err);
      setIsProcessing(false);
      alert("Obunani aktivlashtirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  // Modal ichidagi aktivlashtirish formasi
  const handleModalSubmit = (e) => {
    e.preventDefault();
    activatePlan(selectedPlan, paymentProvider);
  };

  // FAQAT 2 XIL OBUNA TARIFI:
  const plans = [
    {
      id: 'free',
      name: 'Tekin',
      badge: 'Boshlang\'ich (Bepul)',
      price: '0',
      period: 'so\'m / doimiy bepul',
      desc: 'Farzandingizning asosiy o\'qish ko\'rsatkichlarini kuzatish uchun bepul rejim.',
      features: [
        '1 nafar farzandni monitoring qilish',
        'Kunlik sarflangan vaqt va ishlangan testlar',
        'Asosiy fanlar bo\'yicha o\'zlashtirish foizlari',
        'Standart bildirishnomalar',
        'Haftalik qisqa natijalar xulosasi'
      ],
      notIncluded: [
        'AI Ota-ona individual maslahatchisi (24/7)',
        'Zaif mavzular chuqur tahlili va uy mashqlari',
        'Rasmiy muhrli PDF hisobotlarni chop etish',
        'Bir nechta farzandni bitta profilda birlashtirish'
      ],
      isCurrent: !subscription.isPremium,
      highlight: false
    },
    {
      id: 'premium',
      name: 'Premium',
      badge: 'Eng Ommabop 🔥',
      price: '39 000',
      period: 'so\'m / oy',
      desc: 'Farzandingiz ta\'limini to\'liq nazorat qilish, AI ustoz va rasmiy PDF hisobotlar.',
      features: [
        'Barcha farzandlarni bitta akkauntdan kuzatish',
        'AI Ota-ona individual maslahatchisi (24/7 jonli tahlil)',
        'Zaif mavzular tahlili va uyda yordam tavsiyalari',
        'Rasmiy muhrli PDF hisobotlarni cheksiz yuklab olish',
        'Muntazam Telegram va SMS ogohlantirishlar',
        'O\'quv fanlari o\'sish dinamikasi grafigi',
        'Topshiriqlar muddati va intizom nazorati',
        '24/7 tezkor qo\'llab-quvvatlash xizmati'
      ],
      notIncluded: [],
      isCurrent: subscription.isPremium,
      highlight: true
    }
  ];

  // 2 USTUNLI ANIQ TAQOSLASH JADVALI
  const comparisonRows = [
    { name: 'Kuzatish mumkin bo\'lgan farzandlar soni', free: '1 nafar', premium: 'Barcha farzandlar (Cheksiz)' },
    { name: 'Kunlik o\'qish vaqti va test ko\'rsatkichlari', free: '✔ Mavjud', premium: '✔ Mavjud' },
    { name: 'Fanlar bo\'yicha o\'zlashtirish foizlari', free: '✔ Asosiy', premium: '✔ Kengaytirilgan' },
    { name: 'AI Ota-ona Maslahatchisi tavsiyalari', free: '—', premium: '✔ Real-vaqtda jonli tahlil' },
    { name: 'Zaif mavzular tahlili va uy mashqlari', free: '—', premium: '✔ Mavjud (Shaxsiy reja)' },
    { name: 'Rasmiy PDF hisobotlarni yuklab olish', free: '—', premium: '✔ Cheksiz chop etish' },
    { name: 'Telegram va SMS bildirishnomalar', free: '—', premium: '✔ Faol ogohlantirishlar' },
    { name: 'Qo\'llab-quvvatlash xizmati', free: 'Standart', premium: 'Ustuvor 24/7 VIP' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-extrabold text-sm">{toastMessage.title}</p>
            <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Crown className="w-4 h-4" />
            <span>Ota-ona Obuna Tizimi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            Farzandingiz Ta'limini <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Yangi Bosqichga</span> Olib Chiqing!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Platformada 2 xil tarif mavjud: <strong>Tekin</strong> (baza rejimi) va <strong>Premium</strong> (AI tahlillar, cheksiz farzandlar monitoringi va rasmiy PDF hisobotlar).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xavfsiz to'lov (Click, Payme, Uzum)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Bir bosishda aktivlashtirish</span>
            </div>
          </div>
        </div>

        {/* Current status pill */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${subscription.isPremium ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
            <div className="text-xs">
              <span className="text-slate-400 block font-semibold">Hozirgi aktiv tarifingiz:</span>
              <span className="font-extrabold text-white text-sm">
                {subscription.isPremium ? '⭐ Premium Tarif (Faol)' : '🌱 Tekin Tarif (Bepul)'}
              </span>
            </div>
          </div>

          {subscription.isPremium && subscription.expiresAt && (
            <div className="text-xs text-emerald-300 bg-emerald-950/70 px-3.5 py-1.5 rounded-xl border border-emerald-800/60 font-semibold">
              Amal qilish muddati: {new Date(subscription.expiresAt).toLocaleDateString()} gacha
            </div>
          )}
        </div>
      </div>

      {/* 2 TA OBUNA KARTASI (GRID COLS 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-2">
        {plans.map((plan) => {
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.isCurrent
                  ? 'bg-slate-900 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10'
                  : plan.highlight
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 shadow-xl hover:-translate-y-1'
                  : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                  plan.isCurrent
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                    : plan.highlight
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {plan.badge}
                </span>

                {plan.isCurrent && (
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Faol</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[34px] leading-relaxed">{plan.desc}</p>

                {/* Price Box */}
                <div className="my-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-bold">{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 text-xs font-semibold">
                  <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Tarif imkoniyatlari:</p>
                  
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <div className="pt-2 space-y-2 text-slate-500">
                      {plan.notIncluded.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 line-through decoration-slate-600">
                          <span className="w-4 h-4 text-center shrink-0 text-slate-600 font-bold">✕</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AKTIVLASHTIRISH TUGMASI */}
              <div className="pt-2">
                <button
                  disabled={plan.isCurrent || isProcessing}
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-4 px-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.isCurrent
                      ? 'bg-slate-800 text-emerald-400 cursor-not-allowed border border-emerald-500/30'
                      : plan.highlight
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  {plan.isCurrent ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hozirgi faol tarifingiz</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Aktivlashtirish</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 2 USTUNLI TAQOSLASH JADVALI */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Tariflarni Taqoslash</h2>
            <p className="text-xs text-slate-400">Tekin va Premium rejalarining asosiy farqlari</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-3 px-4">Imkoniyatlar</th>
                <th className="py-3 px-4 text-slate-300">Tekin (Bepul)</th>
                <th className="py-3 px-4 text-emerald-400">Premium ⭐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-300">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{row.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{row.free}</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-bold">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Bo'limi */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 max-w-4xl mx-auto">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <span>Ko'p Beriladigan Savollar</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-black text-white">Tekin va Premium o'rtasida qanday farq bor?</h4>
            <p className="text-slate-400 leading-relaxed">
              Tekin tarifida 1 nafar farzandning kunlik o'qishini ko'ra olasiz. Premium tarifida esa barcha farzandlaringiz, AI individual maslahatchisi va rasmiy PDF hisobotlar to'liq ochiladi.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-black text-white">Aktivlashtirish tugmasi qanday ishlaydi?</h4>
            <p className="text-slate-400 leading-relaxed">
              Aktivlashtirish tugmasini bosgan zahotingiz tizim akkauntingizni ushbu tarif rejasiga o'tkazadi va barcha imkoniyatlar darhol ishga tushadi.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-black text-white">Qayta Tekin tarifga o'tsa bo'ladimi?</h4>
            <p className="text-slate-400 leading-relaxed">
              Ha, istalgan vaqtda Tekin kartasidagi "Aktivlashtirish" tugmasini bosish orqali bepul rejimga qaytishingiz mumkin.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <h4 className="font-black text-white">To'lovlar xavfsizligi kafolatlanganmi?</h4>
            <p className="text-slate-400 leading-relaxed">
              Barcha to'lovlar Click, Payme va Uzum Bank orqali 256-bitli SSL xavfsiz protokolida amalga oshiriladi.
            </p>
          </div>
        </div>
      </div>

      {/* TO'LOV VA AKTIVLASHTIRISH MODALI */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Tarifni Aktivlashtirish</h3>
                  <p className="text-xs text-slate-400">{selectedPlan?.name} tarifi</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Price Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Tarif narxi:</p>
                <p className="text-xl font-black text-emerald-400">{selectedPlan?.price} so'm</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">
                1 oylik to'liq kirish
              </span>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">To'lov tizimini tanlang:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'click', name: 'Click', logo: '🔵 Click' },
                    { id: 'payme', name: 'Payme', logo: '🟢 Payme' },
                    { id: 'uzum', name: 'Uzum', logo: '🟣 Uzum' }
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPaymentProvider(p.id)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-black border transition-all ${
                        paymentProvider === p.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {p.logo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Inputs */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Karta raqami:</label>
                <input
                  type="text"
                  required
                  placeholder="8600 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Muddati:</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Telefon raqam:</label>
                  <input
                    type="text"
                    required
                    defaultValue="+998 90 123 45 67"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* ASOSIY AKTIVLASHTIRISH TUGMASI */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Tarif aktivlashtirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Aktivlashtirish ({selectedPlan?.price} so'm)</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                256-bit SSL xavfsiz shifrlash orqali himoyalangan
              </p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParentPremium;
