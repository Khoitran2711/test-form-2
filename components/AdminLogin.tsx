
import React, { useState } from 'react';
import { Icons, HOSPITAL_NAME } from '../constants';

interface AdminLoginProps {
  onLogin: (username: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
  // 🔐 lưu token admin (dùng cho mọi thiết bị)
  localStorage.setItem('adminToken', 'bvnt-2026-secret');

  onLogin(username);
}
else {
      setError('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-30">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-3xl rounded-[50px] shadow-2xl overflow-hidden border border-white/60">
        <div className="bg-slate-900/90 p-12 text-center text-white relative">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-6 bg-white rounded-3xl p-3 shadow-xl">
              <Icons.Hospital />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight leading-tight">{HOSPITAL_NAME}</h2>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-3">Hệ thống Quản trị</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-500/20 text-center animate-shake">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold transition-all text-slate-800" 
              placeholder="admin" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full px-6 py-4 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold transition-all text-slate-800" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all uppercase tracking-[0.2em] text-xs mt-4"
          >
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};
