
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // Xatolik yoki muvaffaqiyat xabari chiqqanda 5 soniyadan keyin yo'qolishi uchun
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (isLogin) {
      // Login qilish logikasi
      const user = users.find((u: User) => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (!user) {
        setError("Bunday emailga ega foydalanuvchi topilmadi!");
        return;
      }

      if (user.password !== formData.password) {
        setError("Maxfiy parol noto'g'ri kiritildi!");
        return;
      }

      onLogin(user);
    } else {
      // Ro'yxatdan o'tish logikasi
      if (!formData.fullName || !formData.email || !formData.password) {
        setError("Iltimos, barcha maydonlarni to'ldiring!");
        return;
      }

      if (formData.password.length < 6) {
        setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
        return;
      }

      const emailExists = users.some((u: User) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (emailExists) {
        setError("Bu email manzili allaqachon ro'yxatdan o'tgan!");
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi tizimga kirishingiz mumkin.");
      setIsLogin(true);
      // Parolni tozalash, lekin emailni qoldirish login uchun qulaylik yaratadi
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 fade-in">
      <div className="relative w-full max-w-lg">
        {/* Shadow decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse [animation-delay:-1s]"></div>

        <div className="glass-card p-10 md:p-14 rounded-[40px] shadow-2xl relative z-10 border border-white">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
              {isLogin ? "Xush kelibsiz!" : "Ro'yxatdan o'ting"}
            </h2>
            <p className="text-gray-400 font-medium">O'qituvchi AI platformasiga kirish</p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-bounce">
              <i className="fas fa-exclamation-circle flex-shrink-0"></i>
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center space-x-3 text-green-600">
              <i className="fas fa-check-circle flex-shrink-0"></i>
              <span className="text-sm font-bold">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Ism va Familiya</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <input
                    type="text"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                    placeholder="Eshmat Toshmatov"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Email Manzili</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  type="email"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                  placeholder="name@school.uz"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Maxfiy Parol</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input
                  type="password"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-blue-400 to-indigo-400 text-gray-900 font-black text-lg rounded-2xl shadow-xl hover:shadow-blue-500/40 transition-all transform hover:scale-[1.02] active:scale-95 mt-4"
            >
              {isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="text-blue-500 font-extrabold hover:text-blue-700 transition-colors text-sm uppercase tracking-widest"
            >
              {isLogin ? "Yangi hisob yaratish →" : "← Tizimga kirish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
