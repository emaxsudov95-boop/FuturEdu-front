import React, { useState, useEffect } from 'react';
import { chatAPI } from '../../services/api';
import { 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Bot, 
  Send, 
  Users, 
  Pin, 
  Clock, 
  ShieldCheck, 
  Filter,
  RefreshCw
} from 'lucide-react';

const AdminModeration = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState('ai-engineer');
  const [loading, setLoading] = useState(true);
  const [adminBroadcastText, setAdminBroadcastText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await chatAPI.getAllRoomsAdmin();
      if (res.data?.data) {
        setRooms(res.data.data);
      }
    } catch (err) {
      console.error("Admin rooms fetch error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const selectedRoom = rooms.find(r => r.slug === selectedRoomSlug) || rooms[0];

  // Xabarni moderatsiya orqali o'chirish
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Haqiqatan ham ushbu xabarni qoidabuzarlik sababli chatdan o'chirmoqchimisiz?")) return;

    try {
      const res = await chatAPI.deleteMessage(messageId);
      setStatusMessage(res.data?.message || "Xabar o'chirildi");
      
      // Mahalliy holatni yangilash
      setRooms(prev => prev.map(room => {
        if (room.slug === selectedRoomSlug) {
          return {
            ...room,
            messages: room.messages.filter(m => m.id !== messageId),
            totalMessages: Math.max(0, room.totalMessages - 1)
          };
        }
        return room;
      }));

      setTimeout(() => setStatusMessage(''), 3500);
    } catch (err) {
      console.error(err);
      alert("Xabarni o'chirishda xatolik yuz berdi");
    }
  };

  // Administrator tomonidan xonaga rasmiy xabar / ogohlantirish yuborish
  const handleAdminBroadcast = async (e) => {
    e.preventDefault();
    if (!adminBroadcastText.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await chatAPI.sendMessage(selectedRoomSlug, {
        text: adminBroadcastText.trim(),
        senderName: "Bosh Administrator",
        senderAvatar: "🛡️",
        senderRole: "Admin / Moderator"
      });

      if (res.data?.data) {
        setRooms(prev => prev.map(room => {
          if (room.slug === selectedRoomSlug) {
            return {
              ...room,
              messages: [...room.messages, res.data.data],
              totalMessages: room.totalMessages + 1
            };
          }
          return room;
        }));
        setAdminBroadcastText('');
        setStatusMessage(`"${selectedRoom?.careerTitle}" xonasiga rasmiy xabar yuborildi!`);
        setTimeout(() => setStatusMessage(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span>Kasb Chatlari Moderatsiyasi & Nazorati</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin barcha oʻquvchilar kasbiy guruhlarini bitta joydan toʻliq kuzatadi va boshqaradi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchRooms()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yangilash</span>
          </button>
          <span className="text-xs font-black px-3 py-1.5 bg-slate-800 text-emerald-400 rounded-xl border border-slate-700">
            {rooms.length} ta Kasb Xonasi
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Kasb Chat Xonalari Tanlagichi (Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {rooms.map((room) => {
          const isSelected = room.slug === selectedRoomSlug;
          return (
            <button
              key={room.slug}
              onClick={() => setSelectedRoomSlug(room.slug)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{room.icon}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {room.totalMessages} ta
                </span>
              </div>
              <h4 className="font-black text-xs text-white truncate">{room.careerTitle}</h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {room.lastMessage ? `${room.lastMessage.senderName}: ${room.lastMessage.text}` : 'Xabarlar yoʻq'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tanlangan Xona Tafsilotlari & Moderatsiya Maydoni */}
      {selectedRoom && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          
          {/* Room Header */}
          <div className="p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedRoom.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">{selectedRoom.careerTitle}</h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Jonli Moderatsiya
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedRoom.description}</p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400">
              Jami xabarlar: <strong className="text-white">{selectedRoom.messages?.length || 0}</strong>
            </span>
          </div>

          {/* Xabarlar ro'yxati */}
          <div className="p-5 max-h-[450px] overflow-y-auto space-y-3 bg-slate-950/60">
            {selectedRoom.messages && selectedRoom.messages.length > 0 ? (
              selectedRoom.messages.map((msg) => {
                const isAdmin = msg.senderRole?.toLowerCase().includes('admin') || msg.senderAvatar === '🛡️';

                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      isAdmin
                        ? 'bg-amber-950/20 border-amber-800/60'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-base shrink-0 border border-slate-700">
                        {msg.senderAvatar || '👤'}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-xs text-white flex items-center gap-1">
                            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {msg.senderRole}
                          </span>
                          <span className="text-[9px] text-slate-600 font-mono">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
                      title="Qoidabuzar xabarni oʻchirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-bold">
                Bu kasb xonasida hozircha xabarlar mavjud emas
              </div>
            )}
          </div>

          {/* Admin rasmiy xabar yuborish paneli */}
          <form onSubmit={handleAdminBroadcast} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
              🛡️
            </div>
            <input
              type="text"
              required
              placeholder={`"${selectedRoom.careerTitle}" xonasiga Admin sifatida rasmiy eʼlon yoki ogohlantirish yozing...`}
              value={adminBroadcastText}
              onChange={(e) => setAdminBroadcastText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!adminBroadcastText.trim() || isSending}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Yuborish</span>
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default AdminModeration;
