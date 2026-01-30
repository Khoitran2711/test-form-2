
import React, { useState } from 'react';
import { Icons, HOSPITAL_NAME, DEPARTMENTS } from '../constants';
import { Feedback } from '../types';

interface PublicFeedbackProps {
  onSubmit: (feedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => void;
}

export const PublicFeedback: React.FC<PublicFeedbackProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    content: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Added explicit typing for 'file' as 'File' to resolve type inference issues where 'file' was treated as 'unknown'.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, reader.result as string].slice(0, 2));
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, images });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-12 rounded-[40px] shadow-2xl text-center border-t-8 border-emerald-500 animate-in fade-in zoom-in border border-white/50">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Gửi phản ánh thành công!</h2>
        <p className="text-slate-600 mb-8 font-medium">Chúng tôi đã tiếp nhận ý kiến của quý khách và sẽ sớm phản hồi.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-blue-200/50 uppercase text-xs tracking-[0.2em]"
        >
          Tiếp tục gửi góp ý
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden border border-white/60 flex flex-col md:flex-row">
      {/* Sidebar hướng dẫn */}
      <div className="md:w-[30%] bg-blue-700/90 p-10 text-white flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-black mb-6 tracking-tight uppercase border-b border-white/20 pb-4">Hướng dẫn</h3>
          <p className="text-blue-50 text-sm leading-relaxed mb-10 opacity-90 font-medium">
            Mọi thông tin quý khách cung cấp sẽ giúp Bệnh viện không ngừng cải thiện chất lượng phục vụ. Chúng tôi cam kết bảo mật tuyệt đối danh tính người gửi.
          </p>
          <ul className="space-y-8">
            <li className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/10 backdrop-blur-md"><Icons.CheckCircle /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Bảo mật tuyệt đối</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/10 backdrop-blur-md"><Icons.Clock /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Phản hồi nhanh chóng</span>
            </li>
          </ul>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">Vì sức khỏe nhân dân Ninh Thuận</p>
        </div>
      </div>

      {/* Form phản ánh */}
      <form onSubmit={handleSubmit} className="md:w-[70%] p-8 md:p-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Họ tên người phản ánh</label>
            <input 
              required 
              className="w-full px-6 py-5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold placeholder:text-slate-300" 
              placeholder="Nhập họ và tên..." 
              value={formData.fullName} 
              onChange={e => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Số điện thoại liên hệ</label>
            <input 
              type="tel" 
              required
              className="w-full px-6 py-5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold placeholder:text-slate-300" 
              placeholder="09xx xxx xxx" 
              value={formData.phoneNumber} 
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Khoa / Phòng cần góp ý</label>
          <div className="relative">
            <select 
              required 
              className="w-full px-6 py-5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer" 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})}
            >
              <option value="">-- Vui lòng chọn khoa phòng --</option>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nội dung phản ánh chi tiết</label>
          <textarea 
            required 
            className="w-full px-6 py-6 bg-white/50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold min-h-[180px] resize-none leading-relaxed placeholder:text-slate-300" 
            placeholder="Vui lòng mô tả chi tiết sự việc, thời gian và địa điểm phát sinh..." 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Đính kèm bằng chứng (Hình ảnh)</label>
          <div className="flex flex-wrap gap-6">
            {images.map((img, i) => (
              <div key={i} className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <img src={img} className="w-full h-full object-cover" alt="feedback" />
                <button 
                  type="button" 
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))} 
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 2 && (
              <label className="w-28 h-28 bg-white/40 border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/80 hover:border-blue-400 transition-all text-slate-400 group">
                <Icons.ClipboardList />
                <span className="text-[9px] font-black mt-2 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Tải ảnh</span>
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-3xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs group active:scale-[0.98]"
          >
            Gửi thông tin phản ánh
            <div className="group-hover:translate-x-1 transition-transform">
              <Icons.Send />
            </div>
          </button>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-8">
            Dữ liệu được bảo vệ bởi chứng chỉ an toàn y tế quốc gia
          </p>
        </div>
      </form>
    </div>
  );
};
