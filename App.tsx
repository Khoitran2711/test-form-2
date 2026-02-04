
import React, { useState, useEffect } from 'react';
import { PublicFeedback } from './components/PublicFeedback';
import { FeedbackLookup } from './components/FeedbackLookup';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Feedback, FeedbackStatus, User } from './types';
import { HOSPITAL_NAME, Icons } from './constants';
import { sheetService } from './services/sheetService';

type PublicView = 'SUBMIT' | 'LOOKUP';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ role: 'PUBLIC' });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [publicView, setPublicView] = useState<PublicView>('SUBMIT');
  const [isLoading, setIsLoading] = useState(false);

  // Tải dữ liệu từ Google Sheets khi khởi chạy
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await sheetService.getAllFeedbacks();
      setFeedbacks(data);
      setIsLoading(false);
    };
    fetchData();
    
    // Tự động làm mới dữ liệu mỗi 2 phút
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const handlePublicSubmit = async (newFeedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => {
    setIsLoading(true);
    const feedback: Feedback = {
      ...newFeedback,
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: FeedbackStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    
    const success = await sheetService.submitFeedback(feedback);
    if (success) {
      setFeedbacks(prev => [feedback, ...prev]);
    } else {
      alert('Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại.');
    }
    setIsLoading(false);
  };

  const handleUpdateFeedback = async (updated: Feedback) => {
    setIsLoading(true);
    const success = await sheetService.updateFeedback(updated);
    if (success) {
      setFeedbacks(prev => prev.map(f => f.id === updated.id ? updated : f));
    } else {
      alert('Không thể cập nhật phản hồi. Vui lòng kiểm tra kết nối mạng.');
    }
    setIsLoading(false);
  };

  const handleAdminLogin = (username: string) => {
    setUser({ role: 'ADMIN', username });
    setIsAdminMode(true);
  };

  const handleLogout = () => {
    setUser({ role: 'PUBLIC' });
    setIsAdminMode(false);
    setPublicView('SUBMIT');
  };

  const renderContent = () => {
    if (isAdminMode) {
      if (user.role !== 'ADMIN') return <AdminLogin onLogin={handleAdminLogin} />;
      return <AdminDashboard feedbacks={feedbacks} onUpdateFeedback={handleUpdateFeedback} onLogout={handleLogout} />;
    }
    return (
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-2 md:py-8 relative z-10">
        {/* Header */}
        <div className="w-full flex flex-row items-center gap-3 md:gap-6 mb-4 md:mb-8 bg-white/40 backdrop-blur-none p-3 md:p-8 rounded-[25px] md:rounded-[40px] shadow-xl border border-white/50">
          <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-xl md:rounded-3xl flex items-center justify-center shadow-md p-1 shrink-0 overflow-hidden">
            <img 
              src="https://bom.so/7EmoNC" 
              alt="Logo Bệnh viện" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl md:text-4xl font-black text-blue-700/95 tracking-tighter leading-tight md:leading-none uppercase drop-shadow-sm">
              {HOSPITAL_NAME}
            </h1>
            <p className="font-bold text-blue-700/95 tracking-[0.15em] text-[10px] md:text-sm uppercase leading-relaxed">
              Hệ thống tiếp nhận phản ánh trực tuyến
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Icons.Clock /> Đang đồng bộ dữ liệu...
          </div>
        )}

        {/* View Toggle */}
        <div className="flex p-1 bg-white/30 backdrop-blur-lg rounded-xl md:rounded-3xl border border-white/50 mb-4 md:mb-10 shadow-lg w-full md:w-auto">
          <button 
            onClick={() => setPublicView('SUBMIT')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              publicView === 'SUBMIT' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/40'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icons.ClipboardList /> Gửi phản ánh
            </div>
          </button>
          <button 
            onClick={() => setPublicView('LOOKUP')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              publicView === 'LOOKUP' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/40'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icons.Search /> Tra cứu
            </div>
          </button>
        </div>

        {publicView === 'SUBMIT' ? (
          <PublicFeedback onSubmit={handlePublicSubmit} />
        ) : (
          <FeedbackLookup feedbacks={feedbacks} />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <img 
          src="images/bg.png" 
          alt="Background" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://scontent.fsgn24-1.fna.fbcdn.net/v/t39.30808-6/514066302_707621135218583_2409261783078819376_n.jpg?stp=cp6_dst-jpg_s960x960_tt6&_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=OsOx_p23lwIQ7kNvwEwKKTf&_nc_oc=AdkOHGyKE-6GY3F7atwt0nmDpbTDUu5UNKN1vcLAbwE4dOO25O9sPQ7-4LN7ggT9hLg&_nc_zt=23&_nc_ht=scontent.fsgn24-1.fna&_nc_gid=7womj9dnlTw27UmSQlvAZw&oh=00_AftZw7lQv33hTzMqQnbaRrZUnPuX7J5vSo0YYFDikJ0XRw&oe=69886252';
          }}
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
      </div>

          <nav className="bg-blue-700/90 backdrop-blur-none text-white px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shadow-lg z-50 sticky top-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue rounded-lg p-1">
            <Icons.Hospital />
          </div>
          <span className="font-bold text-[10px] md:text-sm tracking-wide uppercase">Cổng thông tin góp ý </span>
        </div>
        {!isAdminMode ? (
          <button 
            onClick={() => setIsAdminMode(true)} 
            className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all border border-white/20"
          >
            <Icons.User /> Quản trị
          </button>
        ) : (
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all shadow-lg"
          >
            Thoát
          </button>
        )}
      </nav>

      {renderContent()}

      {!isAdminMode && (
        <footer className="mt-8 md:mt-20 bg-slate-900/95 backdrop-blur-sm text-white/80 py-8 md:py-16 px-6 border-t-8 border-blue-600 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
            <div className="flex items-center gap-4 md:gap-6 text-center md:text-left">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-2xl p-2 md:p-3 shadow-2xl mx-auto md:mx-0">
                <Icons.Hospital />
              </div>
              <div>
                <h3 className="font-black text-base md:text-xl text-white tracking-tight">{HOSPITAL_NAME}</h3>
                <p className="text-[9px] md:text-sm opacity-70">Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm</p>
                <p className="text-[10px] md:text-sm font-bold text-blue-400 mt-1">Hotline: (0259) 3822 660</p>
              </div>
            </div>
            <div className="text-center md:text-right bg-white/5 p-4 md:p-6 rounded-[20px] md:rounded-[30px] border border-white/10 w-full md:w-auto">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-blue-400">Hotline Bộ Y Tế</p>
              <p className="text-xl md:text-4xl font-black text-white tracking-tighter">1900 9095</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-6 md:mt-12 pt-6 md:pt-8 border-t border-white/5 text-center text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">
            © 2024 Ninh Thuan General Hospital.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
