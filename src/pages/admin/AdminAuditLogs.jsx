import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { History, Shield, Clock } from 'lucide-react';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await adminAPI.getAuditLogs();
      if (res.data?.data) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-brand-500" />
            <span>Xavfsizlik & Oʻzgarishlar Tarixi (Audit Log)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin paneldagi barcha muhim harakatlar va tizim xavfsizlik jurnali
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-xl flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Barcha amallar shifrlangan</span>
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Jurnal yuklanmoqda...</div>
      ) : (
        <div className="bg-slate-950 rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4 pl-6">Admin</th>
                  <th className="p-4">Amal</th>
                  <th className="p-4">Obʻekt / Maqsad</th>
                  <th className="p-4">Tafsilotlar</th>
                  <th className="p-4">IP Manzil</th>
                  <th className="p-4 pr-6 text-right">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                      <span>{log.adminName}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-brand-300 font-bold border border-slate-800 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-200 font-semibold">{log.target}</td>
                    <td className="p-4 text-slate-400 text-xs">{log.details}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">{log.ip}</td>
                    <td className="p-4 pr-6 text-right text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
