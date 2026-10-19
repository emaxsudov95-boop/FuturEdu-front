import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { parentAPI } from '../../services/api';
import { FileText, Printer, Download, Calendar, CheckCircle2, Award, Clock } from 'lucide-react';

const ParentReports = () => {
  const { selectedChildId, selectedChild } = useOutletContext();
  const [period, setPeriod] = useState('weekly'); // daily, weekly, monthly
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport(selectedChildId, period);
  }, [selectedChildId, period]);

  const fetchReport = async (childId, p) => {
    setLoading(true);
    try {
      const res = await parentAPI.getReportData(childId, p);
      if (res.data) {
        setReport(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!selectedChild) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl mx-auto shadow-xl">
          📊
        </div>
        <h2 className="text-xl font-bold text-white">Farzand tanlanmagan</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          O‘quv natijalari hisobotlarini ko‘rish va yuklab olish uchun avval farzandingizni akkauntingizga bog‘lang.
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
      
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Oʻquv Natijalari Hisoboti</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kunlik, haftalik va oylik batafsil oʻzlashtirish tahlillari
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'daily', label: 'Kunlik' },
              { id: 'weekly', label: 'Haftalik' },
              { id: 'monthly', label: 'Oylik' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === p.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish / PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Hisobot shakllantirilmoqda...</div>
      ) : (
        /* Printable Official Report Card */
        <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 space-y-8 max-w-4xl mx-auto print:m-0 print:p-4 print:shadow-none print:border-none">
          
          {/* Report Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <img src="/logo.png" alt="FuturEdu" className="w-6 h-6 object-contain" />
                <span className="text-xs font-black tracking-widest text-emerald-700 uppercase">
                  FUTUREDU TAʻLIM PLATFORMASI
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Rasmiy Oʻquv Faoliyati Hisoboti
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Davr: <strong>{period === 'daily' ? 'Kunlik tahlil' : period === 'weekly' ? 'Haftalik yakuniy hisobot' : 'Oylik chuqurlashtirilgan hisobot'}</strong> • Sana: {new Date(report?.generatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 block">{report?.child?.name}</span>
              <span className="text-xs text-slate-600 font-semibold">{report?.child?.grade} • {report?.child?.school}</span>
            </div>
          </div>

          {/* 4 Summary Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Jami dars vaqti</span>
              <span className="text-xl font-black text-slate-900 block">{report?.metrics?.totalStudyHours}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Topshirilgan testlar</span>
              <span className="text-xl font-black text-slate-900 block">{report?.metrics?.testsAttempted} ta</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Oʻrtacha oʻzlashtirish</span>
              <span className="text-xl font-black text-emerald-600 block">{report?.metrics?.averageScore}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Topshiriqlar</span>
              <span className="text-xl font-black text-slate-900 block">{report?.metrics?.completedAssignments} ta</span>
            </div>
          </div>

          {/* Subject Mastery Table */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Fanlar boʻyicha oʻzlashtirish koʻrsatkichi:
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">Fan nomi</th>
                    <th className="p-3">Bilim darajasi</th>
                    <th className="p-3 text-right">Baholash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report?.subjectBreakdown?.map((s, i) => (
                    <tr key={i}>
                      <td className="p-3 font-bold text-slate-800">{s.subject}</td>
                      <td className="p-3 font-semibold text-slate-700">{s.percent}%</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                          s.status === "A'lo" ? 'bg-emerald-100 text-emerald-800' :
                          s.status === "Yaxshi" ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wide">
                Kuchli tomonlar va yutuqlar:
              </h4>
              <ul className="text-xs text-emerald-900 space-y-1 list-disc list-inside">
                {report?.strengths?.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wide">
                Keyingi oʻquv davri uchun tavsiyalar:
              </h4>
              <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                {report?.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer of the Report */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <img src="/logo.png" alt="FuturEdu" className="w-4 h-4 object-contain inline" />
              <span>Ushbu hisobot FuturEdu AI taʼlim tizimi tomonidan tasdiqlangan.</span>
            </span>
            <span className="font-mono text-[10px]">VERIFIED-REPORT-2026</span>
          </div>

        </div>
      )}

    </div>
  );
};

export default ParentReports;
