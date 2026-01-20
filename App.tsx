
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Auth from './components/Auth';
import SplashScreen from './components/SplashScreen';
import { generateEducationalMaterials } from './services/geminiService';
import { EducationalContent, SearchParams, User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [history, setHistory] = useState<EducationalContent[]>([]);
  const [view, setView] = useState<'create' | 'history'>('create');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          loadHistory(user.id);
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
      setInitializing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const loadHistory = (userId: string) => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(`history_${userId}`) || '[]');
      setHistory(Array.isArray(savedHistory) ? savedHistory : []);
    } catch (e) {
      setHistory([]);
    }
  };

  const saveHistoryToStorage = (userId: string, newHistory: EducationalContent[]) => {
    // LocalStorage hajmini tejash uchun rasmlarni (imageUrl) tarixda saqlamaymiz
    // Chunki base64 rasmlar 5MB kvotani juda tez to'ldiradi
    const historyToSave = newHistory.map(item => ({
      ...item,
      presentation: item.presentation.map(slide => ({ ...slide, imageUrl: undefined }))
    })).slice(0, 10); // Oxirgi 10 ta dars

    try {
      localStorage.setItem(`history_${userId}`, JSON.stringify(historyToSave));
      setHistory(historyToSave);
    } catch (e) {
      console.warn("Storage to'ldi, tarix qisqartirilmoqda...");
      if (historyToSave.length > 1) {
        saveHistoryToStorage(userId, historyToSave.slice(0, -1));
      } else {
        localStorage.removeItem(`history_${userId}`);
      }
    }
  };

  const clearHistory = () => {
    if (currentUser && window.confirm("Barcha tarixni o'chirmoqchimisiz?")) {
      localStorage.removeItem(`history_${currentUser.id}`);
      setHistory([]);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    loadHistory(user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setContent(null);
    setHistory([]);
    setView('create');
  };

  const handleGenerate = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateEducationalMaterials(params);
      setContent(result);
      
      if (currentUser) {
        const newHistory = [result, ...history];
        saveHistoryToStorage(currentUser.id, newHistory);
      }

      setTimeout(() => {
        const resultSection = document.getElementById('result-section');
        resultSection?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'QUOTA_EXCEEDED') {
        setError("AI xizmatining so'rovlar limiti tugadi. Iltimos, 1 daqiqa kutib qayta urinib ko'ring yoki boshqa mavzu tanlang.");
      } else {
        setError("Material yaratishda xatolik yuz berdi. Internet aloqasini tekshiring va qaytadan urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectFromHistory = (item: EducationalContent) => {
    setContent(item);
    setView('create');
    setTimeout(() => {
      const resultSection = document.getElementById('result-section');
      resultSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (initializing) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen fade-in">
        <Header />
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <div className="container mx-auto px-4 mb-8">
        <div className="glass-card p-4 rounded-3xl flex flex-wrap justify-between items-center gap-4 border border-white/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-30 rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 rounded-full">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 font-extrabold text-xl shadow-inner">
                  {currentUser.fullName[0]}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-none mb-1">{currentUser.fullName}</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Premium O'qituvchi</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
            <button 
              onClick={() => setView('create')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${view === 'create' ? 'bg-blue-300 shadow-sm text-gray-900 scale-100' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <i className="fas fa-plus-circle mr-2"></i> Yaratish
            </button>
            <button 
              onClick={() => setView('history')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${view === 'history' ? 'bg-blue-300 shadow-sm text-gray-900 scale-100' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <i className="fas fa-folder-open mr-2"></i> Tarix ({history.length})
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
            title="Chiqish"
          >
            <i className="fas fa-power-off"></i>
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4">
        {view === 'create' ? (
          <div className="fade-in">
            <section className="mb-12">
              <InputForm onSubmit={handleGenerate} isLoading={loading} />
            </section>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-10">
                  <div className="w-32 h-32 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 w-32 h-32 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-brain text-4xl text-blue-600 animate-pulse"></i>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Materiallar tayyorlanmoqda</h3>
                <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
                  Sun'iy intellekt siz uchun eng sara dars rejalari va interaktiv topshiriqlarni yaratmoqda...
                </p>
              </div>
            )}

            {error && (
              <div className="max-w-xl mx-auto mb-12 bg-red-50 border border-red-100 p-6 rounded-3xl shadow-lg flex items-center space-x-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {!loading && content && (
              <div id="result-section" className="scroll-mt-8">
                <ResultDisplay content={content} />
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                <span className="w-2 h-8 bg-blue-600 rounded-full mr-4"></span>
                Materiallar Tarixi
              </h2>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center"
                >
                  <i className="fas fa-trash-alt mr-2"></i> Tozalash
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="glass-card p-20 rounded-[40px] text-center">
                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <i className="fas fa-ghost text-4xl text-gray-300"></i>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Hali hech narsa yo'q</h3>
                 <p className="text-gray-400 mb-8">Hozircha birorta ham material yaratmagansiz.</p>
                 <button 
                  onClick={() => setView('create')} 
                  className="px-8 py-3 bg-blue-300 text-gray-900 rounded-2xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                 >
                   Yaratishni boshlash
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => selectFromHistory(item)}
                    className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <i className="fas fa-arrow-right text-blue-600 transform -rotate-45"></i>
                    </div>
                    <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-gray-900 transition-colors duration-500">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <p className="text-[10px] text-blue-500 font-extrabold uppercase tracking-[0.2em] mb-2">{item.subject}</p>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 leading-tight">{item.topic}</h3>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">{item.presentation.length} Slayd</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <img src="https://buxedu.uz/static/images/logo.png" alt="Logo" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
        </div>
        <p className="text-gray-500 text-sm font-medium">© 2026 O'qituvchi AI Ta'lim Yordamchisi</p>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
          Sirdaryo viloyati maktabgacha va maktab ta'limi boshqarmasi bilan hamkorlikda <a href="https://t.me/rrgfcoder" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold hover:underline">RRGSOFT</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
