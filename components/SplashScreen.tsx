
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <img 
          src="https://buxedu.uz/static/images/logo.png" 
          alt="Buxoro Ta'lim Logo" 
          className="w-40 md:w-56 h-auto relative z-10 loading-logo"
        />
      </div>
      <div className="mt-12 flex flex-col items-center">
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-violet-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
        <p className="text-xl font-bold text-gray-800 tracking-widest uppercase animate-pulse">
          Yuklanmoqda...
        </p>
        <p className="text-gray-400 text-sm mt-2">O'qituvchi AI tizimi tayyorlanmoqda</p>
      </div>
    </div>
  );
};

export default SplashScreen;
