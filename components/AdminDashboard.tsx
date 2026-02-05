import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Feedback, FeedbackStatus } from '../types';
import { Icons } from '../constants';
import { suggestReply } from '../services/geminiService';

interface AdminDashboardProps {
  feedbacks: Feedback[];
  onUpdateFeedback: (feedback: Feedback) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  feedbacks,
  onUpdateFeedback
}) => {
  const navigate = useNavigate();

  // 🔐 Check token khi vào trang
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [filter, setFilter] = useState<FeedbackStatus | 'ALL'>('ALL');

  const filteredFeedbacks = feedbacks
    .filter(f => filter === 'ALL' || f.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSuggest = async () => {
    if (!selectedFeedback) return;
    setIsSuggesting(true);
    const suggestion = await suggestReply(selectedFeedback.content, selectedFeedback.department);
    setReplyText(suggestion);
    setIsSuggesting(false);
  };

  const handleSendReply = () => {
    if (!selectedFeedback || !replyText.trim()) return;
    const updated: Feedback = {
      ...selectedFeedback,
      adminReply: replyText,
      status: FeedbackStatus.RESOLVED,
      repliedAt: new Date().toLocaleString('vi-VN')
    };
    onUpdateFeedback(updated);
    setSelectedFeedback(updated);
    setReplyText('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-slate-800 z-30">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full max-w-7xl mx-auto bg-white/40 backdrop-blur-3xl shadow-2xl border-x border-white/50">
        {/* Sidebar Danh sách */}
        <aside className={`w-full md:w-[320px] lg:w-[380px] bg-white/60 border-r border-white/50 flex flex-col shrink-0 ${selectedFeedback ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-white/50 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Icons.ClipboardList /> Phản ánh mới
              </h2>
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{feedbacks.length}</span>
            </div>
            <select 
              className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">Tất cả phản ánh</option>
              <option value={FeedbackStatus.PENDING}>🔴 Chờ xử lý</option>
              <option value={FeedbackStatus.RESOLVED}>🟢 Đã phản hồi</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-20 opacity-30 text-xs italic font-bold uppercase tracking-widest">Không có dữ liệu</div>
            ) : (
              filteredFeedbacks.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeedback(f)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    selectedFeedback?.id === f.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white/80 border-white hover:border-blue-200 text-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                      selectedFeedback?.id === f.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                    }`}>{f.department}</span>
                    <span className={`text-[9px] font-mono ${selectedFeedback?.id === f.id ? 'text-white/60' : 'text-slate-300'}`}>#{f.id}</span>
                  </div>
                  <h4 className="font-extrabold text-xs mb-1 truncate">{f.fullName}</h4>
                  <p className={`text-[10px] line-clamp-2 leading-relaxed opacity-80 ${selectedFeedback?.id === f.id ? 'text-white/80' : 'text-slate-400'}`}>{f.content}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Nội dung chi tiết */}
        <main className={`flex-1 overflow-y-auto bg-transparent ${!selectedFeedback ? 'hidden md:block' : 'block'}`}>
          {selectedFeedback ? (
            <div className="p-6 md:p-10 max-w-4xl mx-auto">
              <button onClick={() => setSelectedFeedback(null)} className="md:hidden mb-6 text-blue-600 text-[10px] font-black flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                ← QUAY LẠI DANH SÁCH
              </button>
              <div className="space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      selectedFeedback.status === FeedbackStatus.RESOLVED 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {selectedFeedback.status === FeedbackStatus.RESOLVED ? 'Đã giải quyết' : 'Chờ xác minh'}
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedFeedback.fullName}</h2>
                    <p className="text-slate-500 font-bold text-xs">📞 {selectedFeedback.phoneNumber || 'Không cung cấp'}</p>
                  </div>
                  <div className="bg-white/60 px-4 py-2 rounded-xl border border-white/80">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Thời gian gửi</p>
                    <p className="text-[11px] font-bold text-slate-600">{selectedFeedback.date} - {selectedFeedback.time}</p>
                  </div>
                </header>

                <div className="p-6 md:p-8 bg-white/80 rounded-3xl border border-white shadow-sm">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-3 bg-blue-600 rounded-full"></div> Nội dung phản ánh
                  </h4>
                  <p className="text-slate-700 font-medium leading-relaxed text-base italic">"{selectedFeedback.content}"</p>
                  
                  {selectedFeedback.images.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      {selectedFeedback.images.map((img, i) => (
                        <img key={i} src={img} className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-2xl border-4 border-white shadow-xl" alt="evidence" />
                      ))}
                    </div>
                  )}
                </div>

                {selectedFeedback.adminReply ? (
                  <div className="p-6 md:p-8 bg-emerald-50/80 rounded-3xl border border-emerald-100 shadow-sm">
                    <h4 className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-4">Phản hồi từ Bệnh viện</h4>
                    <p className="text-emerald-900 font-semibold text-base leading-relaxed">{selectedFeedback.adminReply}</p>
                    <div className="mt-6 pt-6 border-t border-emerald-200/50 flex justify-between items-center">
                       <span className="text-[9px] font-bold text-emerald-600/60 uppercase">Đã phản hồi lúc: {selectedFeedback.repliedAt}</span>
                       <Icons.CheckCircle />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/80 p-6 md:p-8 rounded-3xl border border-white shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soạn thảo phản hồi</h4>
                      
                    </div>
                    <textarea 
                      className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-2xl md:rounded-[32px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none min-h-[160px] transition-all text-slate-700 font-medium text-base leading-relaxed"
                      placeholder="Nhập nội dung phản hồi chính thức tới bệnh nhân..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <button 
                      onClick={handleSendReply}
                      className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl md:rounded-[32px] shadow-2xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
                    >
                      Gửi phản hồi chính thức
                      <Icons.Send />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center space-y-4">
              <div className="w-20 h-20 bg-white/80 rounded-[32px] flex items-center justify-center shadow-sm border border-white">
                <Icons.ClipboardList />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Chọn một phản ánh</p>
                <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Để bắt đầu xử lý</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
