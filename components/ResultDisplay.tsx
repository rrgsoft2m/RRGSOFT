
import React, { useState, useEffect } from 'react';
import { EducationalContent } from '../types';
import { generateImageForSlide } from '../services/geminiService';

interface ResultDisplayProps {
  content: EducationalContent;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<'presentation' | 'tests' | 'qa' | 'others'>('presentation');
  const [slidesWithImages, setSlidesWithImages] = useState(content.presentation);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Testlar uchun holatlar
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showTestResults, setShowTestResults] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Savol-javob uchun ochiq indekslar
  const [openQAIndices, setOpenQAIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchImages = async () => {
      setGeneratingImages(true);
      setQuotaExceeded(false);
      const updatedSlides = [...content.presentation];
      
      for (let i = 0; i < updatedSlides.length; i++) {
        // Agar rasm hali yo'q bo'lsa generatsiya qilamiz
        if (!updatedSlides[i].imageUrl && updatedSlides[i].imagePrompt) {
          try {
            const url = await generateImageForSlide(updatedSlides[i].imagePrompt!);
            if (url) {
              updatedSlides[i].imageUrl = url;
              setSlidesWithImages([...updatedSlides]);
            }
          } catch (error: any) {
            console.warn(`Slayd ${i + 1} uchun AI rasm limiti urildi.`);
            if (error.message === "QUOTA_EXCEEDED") {
              setQuotaExceeded(true);
              // Kvota tugaganda barcha qolgan rasmlarga Unsplash placeholder qo'yamiz
              for (let j = i; j < updatedSlides.length; j++) {
                if (!updatedSlides[j].imageUrl) {
                  // Mavzuga mos chiroyli rasm (Picsum yoki Unsplash)
                  const keyword = encodeURIComponent(updatedSlides[j].title || content.subject);
                  updatedSlides[j].imageUrl = `https://picsum.photos/seed/${keyword+j}/800/450`;
                }
              }
              setSlidesWithImages([...updatedSlides]);
              setGeneratingImages(false);
              return; 
            }
          }
        }
      }
      setGeneratingImages(false);
    };
    fetchImages();
  }, [content]);

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    if (showTestResults) return;
    setUserAnswers({ ...userAnswers, [questionIndex]: option });
  };

  const calculateResults = () => {
    let score = 0;
    content.tests.forEach((test, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase().trim();
      const correctAnswer = test.answer.toLowerCase().trim();
      
      if (test.type === 'multiple_choice') {
        if (userAnswer === correctAnswer) {
          score++;
        }
      } else if (test.type === 'true_false') {
        if (userAnswer === correctAnswer) {
          score++;
        }
      } else {
        if (userAnswer === correctAnswer) {
          score++;
        }
      }
    });
    setTestScore(score);
    setShowTestResults(true);
  };

  const resetTest = () => {
    setUserAnswers({});
    setShowTestResults(false);
    setTestScore(0);
  };

  const toggleQA = (index: number) => {
    setOpenQAIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const tabs = [
    { id: 'presentation', label: 'Taqdimot', icon: 'fa-desktop' },
    { id: 'tests', label: 'Interaktiv Test', icon: 'fa-check-double' },
    { id: 'qa', label: 'Savol-Javob', icon: 'fa-question-circle' },
    { id: 'others', label: 'Interaktiv', icon: 'fa-puzzle-piece' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all shadow-md ${
              activeTab === tab.id
                ? 'bg-blue-300 text-gray-900 transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[500px]">
        {activeTab === 'presentation' && (
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
               <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-chalkboard-teacher text-blue-500 mr-3"></i>
                Taqdimot Slaydlari
              </h2>
              <div className="flex flex-col items-end">
                {generatingImages && (
                  <span className="text-xs text-blue-500 animate-pulse font-bold flex items-center">
                    <i className="fas fa-magic mr-2"></i> Rasmlar yaratilmoqda ({slidesWithImages.filter(s => s.imageUrl?.startsWith('data:')).length}/{slidesWithImages.length})...
                  </span>
                )}
                {quotaExceeded && (
                  <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100 flex items-center">
                    <i className="fas fa-info-circle mr-2"></i> AI Limiti: Ba'zi rasmlar zaxira tizimidan yuklandi.
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-12">
              {slidesWithImages.map((slide, index) => (
                <div key={index} className={`flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-6 rounded-3xl border border-gray-100 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-blue-400 uppercase mb-2">Slayd {index + 1}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{slide.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{slide.content}</p>
                  </div>
                  <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 shadow-inner relative group">
                    {slide.imageUrl ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {!slide.imageUrl.startsWith('data:') && (
                           <div className="absolute top-2 right-2 bg-black/30 backdrop-blur px-2 py-1 rounded text-[8px] text-white font-bold uppercase tracking-widest">
                             Visual Fallback
                           </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 italic p-4 text-center">
                        <i className="fas fa-image animate-pulse opacity-20 text-4xl mb-2"></i>
                        <span className="text-sm">Rasm tayyorlanmoqda...</span>
                        <div className="w-8 h-1 bg-blue-200 mt-4 overflow-hidden rounded-full">
                          <div className="w-full h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-list-check text-green-500 mr-3"></i>
                Bilimingizni tekshiring
              </h2>
              {showTestResults && (
                <button 
                  onClick={resetTest}
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Qayta urinish
                </button>
              )}
            </div>

            {showTestResults && (
              <div className="mb-12 p-8 bg-blue-400 rounded-3xl text-gray-900 text-center shadow-xl transform">
                <div className="text-5xl font-black mb-2">{testScore} / {content.tests.length}</div>
                <div className="text-xl font-medium opacity-90">Sizning natijangiz</div>
                <div className="mt-4 inline-block px-6 py-2 bg-white/40 rounded-full font-bold">
                  {Math.round((testScore / content.tests.length) * 100)}% muvaffaqiyat
                </div>
              </div>
            )}

            <div className="space-y-8">
              {content.tests.map((test, index) => {
                const isCorrect = showTestResults && userAnswers[index]?.toLowerCase() === test.answer.toLowerCase();
                const isWrong = showTestResults && userAnswers[index] && userAnswers[index]?.toLowerCase() !== test.answer.toLowerCase();

                return (
                  <div key={index} className={`p-6 rounded-3xl border transition-all ${
                    showTestResults 
                      ? isCorrect ? 'bg-green-50 border-green-200' : isWrong ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className="bg-white/80 backdrop-blur shadow-sm text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {test.type.replace('_', ' ')}
                      </span>
                      {showTestResults && (
                        <span>
                          {isCorrect ? (
                            <i className="fas fa-check-circle text-green-500 text-xl"></i>
                          ) : isWrong ? (
                            <i className="fas fa-times-circle text-red-500 text-xl"></i>
                          ) : null}
                        </span>
                      )}
                    </div>
                    <p className="text-xl text-gray-800 font-semibold mb-6">{index + 1}. {test.question}</p>
                    
                    {test.type === 'short_answer' ? (
                      <div className="mt-2">
                        <input
                          type="text"
                          disabled={showTestResults}
                          placeholder="Javobingizni yozing..."
                          className={`w-full p-4 rounded-xl border outline-none transition-all text-gray-900 ${
                            showTestResults 
                              ? isCorrect ? 'border-green-300 bg-white' : 'border-red-300 bg-white'
                              : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
                          }`}
                          value={userAnswers[index] || ''}
                          onChange={(e) => handleAnswerSelect(index, e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {test.options?.map((opt, i) => {
                          const isSelected = userAnswers[index] === opt;
                          const isCorrectOption = showTestResults && opt.toLowerCase() === test.answer.toLowerCase();
                          
                          return (
                            <button
                              key={i}
                              disabled={showTestResults}
                              onClick={() => handleAnswerSelect(index, opt)}
                              className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all text-left ${
                                isSelected 
                                  ? 'bg-blue-300 text-gray-900 border-blue-400 shadow-md transform scale-[1.02]' 
                                  : isCorrectOption 
                                    ? 'bg-green-100 border-green-400 text-green-800 font-bold'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                isSelected ? 'bg-white/40 text-gray-900' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {showTestResults && !isCorrect && (
                      <div className="mt-4 p-4 bg-white/50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm font-bold text-gray-500">To'g'ri javob:</p>
                        <p className="text-green-600 font-bold">{test.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showTestResults && (
              <div className="mt-12 text-center">
                <button
                  onClick={calculateResults}
                  className="px-12 py-5 bg-blue-300 text-gray-900 font-black text-xl rounded-2xl shadow-xl hover:bg-blue-400 hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95 transition-all"
                >
                  Natijani tekshirish
                </button>
                <p className="text-gray-400 mt-4 text-sm italic">Hamma savollarga javob berganingizga ishonch hosil qiling.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-comments text-orange-500 mr-3"></i>
              Savol-Javob Materiallari
            </h2>
            <div className="space-y-4">
              {content.qa.map((item, index) => {
                const isOpen = openQAIndices.has(index);
                return (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:border-orange-200"
                  >
                    <button 
                      onClick={() => toggleQA(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-orange-50/30 transition-colors focus:outline-none"
                    >
                      <h3 className="font-bold text-gray-800 pr-4 flex-1">
                        <span className="text-orange-500 mr-2">{index + 1}.</span>
                        {item.question}
                      </h3>
                      <i className={`fas fa-chevron-down text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-400' : ''}`}></i>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                      <div className="px-6 pb-6">
                        <div className="p-4 bg-orange-50/50 rounded-xl border-l-4 border-orange-400">
                          <p className="text-gray-700 italic leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'others' && (
           <div className="p-8 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-table-cells text-purple-500 mr-3"></i>
                Krossvord
              </h2>
              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr>
                      <th className="pb-4 text-purple-700 font-bold">Ta'rif</th>
                      <th className="pb-4 text-purple-700 font-bold text-right">Javob</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {content.crossword.map((entry, idx) => (
                      <tr key={idx}>
                        <td className="py-4 pr-4 text-gray-700">{entry.clue}</td>
                        <td className="py-4 font-mono font-bold text-purple-600 uppercase tracking-widest text-right">{entry.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-pink-50 p-8 rounded-3xl border border-pink-100 shadow-sm">
                <h3 className="text-xl font-bold text-pink-700 mb-4 flex items-center">
                   <i className="fas fa-brain mr-2"></i> Mantiqiy Jumboq
                </h3>
                <p className="text-gray-800 mb-6 text-lg leading-relaxed">{content.logicPuzzle.puzzle}</p>
                <div className="bg-white p-4 rounded-xl border border-pink-200 text-pink-600 font-bold inline-block">
                  Javob: <span className="text-gray-700 font-normal">{content.logicPuzzle.answer}</span>
                </div>
              </div>
              <div className="bg-cyan-50 p-8 rounded-3xl border border-cyan-100 shadow-sm">
                 <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center">
                   <i className="fas fa-gamepad mr-2"></i> Mini-O'yin
                </h3>
                <h4 className="font-bold text-gray-800 mb-2">{content.miniGame.title}</h4>
                <p className="text-gray-600 mb-6 text-sm">{content.miniGame.description}</p>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Qoidalar:</h5>
                  {content.miniGame.rules.map((rule, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-white/50 p-2 rounded-lg">
                      <span className="w-5 h-5 bg-cyan-500 text-gray-900 rounded-full flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                      <span className="text-xs text-gray-700">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
