
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
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl text-center border-t-8 border-emerald-500 animate-in fade-in zoom-in border border-white/50">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-2">Gửi góp ý thành công!</h2>
        <p className="text-slate-600 mb-8 text-sm md:text-base font-medium">Chúng tôi đã tiếp nhận ý kiến của quý khách và sẽ sớm phản hồi.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 md:py-5 px-8 md:px-10 rounded-2xl transition-all shadow-xl shadow-blue-200/50 uppercase text-[10px] md:text-xs tracking-[0.2em]"
        >
          Tiếp tục gửi góp ý
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/60 backdrop-blur-xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white/60 flex flex-col md:flex-row-reverse">
      {/* Form phản ánh - Nằm trên cùng trên Mobile nhờ vị trí JSX */}
      <form onSubmit={handleSubmit} className="md:w-[70%] p-6 md:p-14 space-y-6 md:space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Họ và tên </label>
            <input 
              required 
              className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold placeholder:text-slate-300 text-sm md:text-base" 
              placeholder="Nhập họ và tên..." 
              value={formData.fullName} 
              onChange={e => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Số điện thoại liên hệ</label>
            <input 
              type="tel" 
              required
              className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold placeholder:text-slate-300 text-sm md:text-base" 
              placeholder="09xx xxx xxx" 
              value={formData.phoneNumber} 
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Khoa / Phòng cần góp ý</label>
          <div className="relative">
            <select 
              required 
              className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer text-sm md:text-base" 
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

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nội dung góp ý chi tiết</label>
          <textarea 
            required 
            className="w-full px-5 md:px-6 py-5 md:py-6 bg-white/50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold min-h-[140px] md:min-h-[180px] resize-none leading-relaxed placeholder:text-slate-300 text-sm md:text-base" 
            placeholder="Vui lòng mô tả chi tiết sự việc..." 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Đính kèm bằng chứng (Hình ảnh)</label>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <img src={img} className="w-full h-full object-cover" alt="feedback" />
                <button 
                  type="button" 
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))} 
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 2 && (
              <label className="w-20 h-20 md:w-28 md:h-28 bg-white/40 border-4 border-dashed border-slate-200 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/80 hover:border-blue-400 transition-all text-slate-400 group">
                <Icons.ClipboardList />
                <span className="text-[8px] md:text-[9px] font-black mt-1 md:mt-2 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Tải ảnh</span>
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <div className="pt-4 md:pt-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-3xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs group active:scale-[0.98]"
          >
            Gửi thông tin phản ánh
            <div className="group-hover:translate-x-1 transition-transform">
              <Icons.Send />
            </div>
          </button>
          <p className="text-center text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-6 md:mt-8 leading-relaxed">
            Dữ liệu được bảo vệ bởi chứng chỉ an toàn y tế quốc gia
          </p>
        </div>
      </form>

      {/* Sidebar hướng dẫn - Xuất hiện ở dưới cùng trên Mobile */}
      <div className="md:w-[30%] bg-blue-700/95 p-8 md:p-10 text-white flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="text-lg md:text-2xl font-black tracking-tight uppercase border-b border-white/20 pb-4">Hướng dẫn</h3>
          <p className="text-blue-50 text-xs md:text-sm leading-relaxed opacity-90 font-medium">
            Chúng tôi cam kết bảo mật tuyệt đối danh tính người gửi. Ý kiến của bạn là động lực để chúng tôi hoàn thiện.
          </p>
          <ul className="space-y-5 md:space-y-8">
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/10 backdrop-blur-md shrink-0"><Icons.CheckCircle /></div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Bảo mật tuyệt đối</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/10 backdrop-blur-md shrink-0"><Icons.Clock /></div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Phản hồi nhanh</span>
            </li>
          </ul>
        </div>
        <div className="mt-8 md:mt-12 pt-6 border-t border-white/10 hidden md:block">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">Vì sức khỏe nhân dân Ninh Thuận</p>
        </div>
      </div>
    </div>
  );
};
