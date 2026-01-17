
import React, { useState } from 'react';
import { SearchParams } from '../types';

interface InputFormProps {
  onSubmit: (params: SearchParams) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    subject: '',
    topic: '',
    grade: '',
    language: 'Uzbek',
    lessonType: 'new topic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.subject || !params.topic || !params.grade) {
      alert("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    onSubmit(params);
  };

  const inputClass = "w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400";
  const labelClass = "block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2";

  return (
    <div className="glass-card p-8 md:p-12 rounded-[40px] max-w-5xl mx-auto mb-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
        <i className="fas fa-pencil-ruler text-9xl"></i>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Dars yaratish</h2>
          <p className="text-gray-400 font-medium">Kerakli ma'lumotlarni kiriting va AI ishga tushadi</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100">
          Smart Mode: ON
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full md:col-span-1">
            <label className={labelClass}>O'quv fani</label>
            <div className="relative">
              <i className="fas fa-book-open absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
              <input
                type="text"
                placeholder="Matematika, Biologiya..."
                className={`${inputClass} pl-14`}
                value={params.subject}
                onChange={(e) => setParams({ ...params, subject: e.target.value })}
              />
            </div>
          </div>
          
          <div className="col-span-full md:col-span-1">
            <label className={labelClass}>Sinf / Guruh</label>
            <div className="relative">
              <i className="fas fa-users absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
              <input
                type="text"
                placeholder="7-sinf, 1-kurs..."
                className={`${inputClass} pl-14`}
                value={params.grade}
                onChange={(e) => setParams({ ...params, grade: e.target.value })}
              />
            </div>
          </div>

          <div className="col-span-full">
            <label className={labelClass}>Dars mavzusi</label>
            <div className="relative">
              <i className="fas fa-lightbulb absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
              <input
                type="text"
                placeholder="Masalan: Fotosintez jarayoni yoki Kvadrat tenglamalar..."
                className={`${inputClass} pl-14`}
                value={params.topic}
                onChange={(e) => setParams({ ...params, topic: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-600/5 p-8 rounded-[32px] border border-blue-100 flex flex-col justify-between">
          <div className="space-y-6 mb-8">
            <div>
              <label className={labelClass}>Til</label>
              <select
                className={inputClass}
                value={params.language}
                onChange={(e) => setParams({ ...params, language: e.target.value })}
              >
                <option value="Uzbek">🇺🇿 O'zbekcha</option>
                <option value="Russian">🇷🇺 Ruscha</option>
                <option value="English">🇺🇸 Inglizcha</option>
              </select>
            </div>
            
            <div>
              <label className={labelClass}>Dars maqsadi</label>
              <select
                className={inputClass}
                value={params.lessonType}
                onChange={(e) => setParams({ ...params, lessonType: e.target.value })}
              >
                <option value="new topic">🆕 Yangi mavzu</option>
                <option value="revision">🔄 Takrorlash</option>
                <option value="exam preparation">📝 Imtihon</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 rounded-2xl text-gray-900 font-black text-lg flex items-center justify-center space-x-3 transition-all transform active:scale-95 shadow-xl ${
              isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-300 to-indigo-300 hover:shadow-blue-500/40'
            }`}
          >
            {isLoading ? (
              <>
                <i className="fas fa-sync-alt fa-spin"></i>
                <span>Ishlamoqda...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sparkles"></i>
                <span>Yaratish</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
