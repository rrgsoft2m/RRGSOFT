
import { GoogleGenAI, Type } from "@google/genai";
import { EducationalContent, SearchParams, Slide } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateImageForSlide = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Educational illustration for a classroom presentation slide. Subject: ${prompt}. Style: minimalist, bright, 3d render style, professional, high quality.` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return '';
  } catch (error) {
    console.error("Image generation error:", error);
    return '';
  }
};

export const generateEducationalMaterials = async (params: SearchParams): Promise<EducationalContent> => {
  const ai = getAI();

  const prompt = `Siz 20 yillik tajribaga ega bo'lgan tajribali O'qituvchi AI Ta'lim Yordamchisisiz. Quyidagi ma'lumotlar asosida dars materiallarini tayyorlang:
  Fan: ${params.subject}
  Mavzu: ${params.topic}
  Sinf: ${params.grade}
  Til: ${params.language}
  Dars turi: ${params.lessonType}

  Quyidagilarni o'z ichiga olsin:
  A) Taqdimot rejasi (8-10 slaydda, sarlavha va asosiy matn). Har bir slayd uchun "imagePrompt" maydonida ingliz tilida o'sha slaydga mos vizual rasm uchun qisqa ta'rif bering.
  B) 10-15 ta test savollari.
  C) 10 ta Savol-javob materiallari.
  D) 1 ta krossvord.
  E) 1 ta mantiqiy jumboq.
  F) 1 ta o'quvchilar uchun mini-o'yin g'oyasi.

  Javobni FAQAT JSON formatida qaytaring.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          presentation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["title", "content", "imagePrompt"]
            }
          },
          tests: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING }
              },
              required: ["type", "question", "answer"]
            }
          },
          qa: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          },
          crossword: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                clue: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["clue", "answer"]
            }
          },
          logicPuzzle: {
            type: Type.OBJECT,
            properties: {
              puzzle: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["puzzle", "answer"]
          },
          miniGame: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              rules: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "rules"]
          }
        },
        required: ["presentation", "tests", "qa", "crossword", "logicPuzzle", "miniGame"]
      }
    }
  });

  const content: EducationalContent = JSON.parse(response.text.trim());
  content.id = Math.random().toString(36).substr(2, 9);
  content.timestamp = Date.now();
  content.subject = params.subject;
  content.topic = params.topic;

  return content;
};
