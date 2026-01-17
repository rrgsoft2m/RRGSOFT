
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative pt-12 pb-20 px-4 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="mb-8 relative inline-block group">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img 
            src="https://buxedu.uz/static/images/logo.png" 
            alt="Logo" 
            className="h-20 md:h-28 w-auto relative z-10 hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-gray-900">
          O'qituvchi <span className="gradient-text">AI</span> <br/>
          Ta'lim Yordamchisi
        </h1>
        
        <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mb-8 mx-auto"></div>
        
        <p className="text-gray-600 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
          Kreativ dars rejalar, interaktiv testlar va sun'iy intellekt tomonidan 
          yaratilgan vizual materiallar olamiga xush kelibsiz.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-900">
            <i className="fas fa-bolt text-yellow-500"></i>
            <span>Tezkor generatsiya</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-900">
            <i className="fas fa-magic text-purple-500"></i>
            <span>AI Rasmlar</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-900">
            <i className="fas fa-brain text-blue-500"></i>
            <span>Mantiqiy o'yinlar</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
