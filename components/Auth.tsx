
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (isLogin) {
      const user = users.find((u: User) => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        alert("Email yoki parol noto'g'ri!");
      }
    } else {
      if (!formData.fullName || !formData.email || !formData.password) {
        alert("Barcha maydonlarni to'ldiring!");
        return;
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      };
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 fade-in">
      <div className="relative w-full max-w-lg">
        {/* Shadow decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse [animation-delay:-1s]"></div>

        <div className="glass-card p-10 md:p-14 rounded-[40px] shadow-2xl relative z-10 border border-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
              {isLogin ? "Hush kelibsiz" : "Ro'yxatdan o'ting"}
            </h2>
            <p className="text-gray-400 font-medium">O'qituvchi AI platformasiga kirish</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Ism va Familiya</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <input
                    type="text"
                    required
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
                  required
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
                  required
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
              onClick={() => setIsLogin(!isLogin)}
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
