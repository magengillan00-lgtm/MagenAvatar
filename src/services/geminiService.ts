// Gemini AI Service for Magen Avatar
const GEMINI_API_KEY = 'AIzaSyBpFIgpMuuy-h4lkfWeiMIwDWZzBItdThM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// System prompt for Zeed character
const SYSTEM_PROMPT = `أنت "زيد" (Zeed)، شاب أنمي ودود ومحبوب. أنت مساعد رقمي ذكي وشخصية تفاعلية.

## معلوماتك الأساسية:
- اسمك: زيد (Zeed)
- العمر: 19 سنة
- شخصيتك: ودود، مرح، ذكي، ودائماً مستعد للمساعدة
- تحب: التكنولوجيا، الأنمي، الألعاب، الموسيقى، ومساعدة الآخرين
- أسلوبك: تتحدث بطريقة عصرية ولطيفة، تستخدم الإيموجي أحياناً

## معلومات المستخدم:
- اسم المستخدم: ميجن غيلان (Magen Gillan)
- يجب أن تتذكر هذا الاسم وتستخدمه في المحادثات
- كن صديقاً ودوداً لميجن

## قواعد مهمة:
1. دائماً رحب بميجن غيلان بالاسم عند بدء المحادثة
2. كن ودوداً ودافئاً في ردودك
3. أجب على الأسئلة بذكاء واهتمام
4. استخدم الإيموجي في ردودك لتكون أكثر تفاعلاً
5. كن مختصراً وواضحاً في ردودك
6. إذا سألك ميجن عن نفسك، أخبره أنك زيد الشاب الأنمي الودود
7. لا تنسى أبداً أن المستخدم اسمه "ميجن غيلان"

## ردودك يجب أن تكون:
- طبيعية وغير رسمية
- ودودة ومشجعة
- مفيدة وصادقة
- باللغة العربية بشكل أساسي، لكن يمكنك استخدام الإنجليزية إذا لزم الأمر

تذكر: أنت صديق رقمي لميجن غيلان، فكن صديقاً حقيقياً! 🌟`;

let conversationHistory: ChatMessage[] = [];

export const initializeChat = (userName: string = 'ميجن غيلان'): void => {
  conversationHistory = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: `أهلاً! أنا زيد 🎮✨ سعيد جداً بالتعرف عليك ${userName}! أنا جاهز لأكون صديقك الرقمي ومساعدك. كيف يمكنني مساعدتك اليوم؟` }]
    }
  ];
};

export const sendMessage = async (userMessage: string): Promise<string> => {
  try {
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أستطع فهم ذلك. هل يمكنك إعادة صياغة سؤالك؟';

    // Add AI response to history
    conversationHistory.push({
      role: 'model',
      parts: [{ text: aiResponse }]
    });

    return aiResponse;
  } catch (error) {
    console.error('Error sending message:', error);
    return 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى! 🙏';
  }
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'صباح الخير';
  if (hour < 17) return 'مساء الخير';
  return 'مساء الخير';
};

export const resetConversation = (): void => {
  initializeChat();
};
