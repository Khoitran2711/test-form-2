
import React, { useState } from 'react';
import { Feedback, FeedbackStatus } from '../types';
import { Icons } from '../constants';

interface FeedbackLookupProps {
  feedbacks: Feedback[];
}

export const FeedbackLookup: React.FC<FeedbackLookupProps> = ({ feedbacks }) => {
  const [phone, setPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const results = feedbacks
    .filter(f => f.phoneNumber.replace(/\s/g, '') === phone.replace(/\s/g, ''))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) setHasSearched(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl border border-white/60 text-center">
        <h3 className="text-2xl font-black text-blue-900 mb-4 uppercase tracking-tight">Tra cứu kết quả phản hồi</h3>
        <p className="text-slate-500 text-sm font-medium mb-8">Vui lòng nhập số điện thoại bạn đã dùng để gửi phản ánh</p>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <input 
            type="tel"
            required
            className="flex-1 px-8 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-black text-lg placeholder:text-slate-300"
            placeholder="Nhập số điện thoại của bạn..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-3xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            <Icons.Search /> Tra cứu ngay
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="space-y-6">
          {results.length > 0 ? (
            results.map(f => (
              <div key={f.id} className="bg-white/80 backdrop-blur-xl rounded-[35px] shadow-xl border border-white overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 md:p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                          {f.department}
                        </span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                          f.status === FeedbackStatus.RESOLVED 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {f.status === FeedbackStatus.RESOLVED ? 'Đã có phản hồi' : 'Đang xử lý'}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã phản ánh: #{f.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Thời gian gửi</p>
                      <p className="text-xs font-bold text-slate-600">{f.date} - {f.time}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <div className="w-1 h-3 bg-blue-600 rounded-full"></div> Nội dung bạn đã gửi
                      </h4>
                      <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100 italic text-slate-700 font-medium">
                        "{f.content}"
                      </div>
                    </div>

                    {f.adminReply ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-700">
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <div className="w-1 h-3 bg-emerald-500 rounded-full"></div> Phản hồi từ bệnh viện
                        </h4>
                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-emerald-900 font-bold leading-relaxed shadow-inner">
                          {f.adminReply}
                        </div>
                        <div className="mt-4 flex justify-end">
                           <span className="text-[9px] font-bold text-emerald-600/50 uppercase italic">Cập nhật lúc: {f.repliedAt}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-amber-600 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                        <Icons.Clock />
                        <span className="text-xs font-bold">Bệnh viện đang tiếp nhận và sẽ sớm phản hồi tới bạn qua số điện thoại này.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/40 backdrop-blur-md p-20 rounded-[40px] border border-white/60 text-center space-y-4">
              <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Icons.ClipboardList />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Không tìm thấy phản ánh nào gắn với số điện thoại này</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
