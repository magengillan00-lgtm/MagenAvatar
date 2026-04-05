# Magen Avatar - تطبيق الأفاتار التفاعلي 🎭

تطبيق أندرويد تفاعلي يضم شخصية "هيوري" (Hiyori) - فتاة أنمي ودودة تتحدث معك وتستجيب لرسائلك باستخدام الذكاء الاصطناعي.

![Magen Avatar](./assets/icon.png)

## 📥 تحميل التطبيق

[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen?style=for-the-badge&logo=android)](https://github.com/magengillan00-lgtm/MagenAvatar/releases/download/v1.0.0/MagenAvatar-v1.0.0.apk)

**حجم الملف:** ~5.5 MB  
**الإصدار:** 1.0.0  
**متوافق مع:** Android 7.0+ (مثل Honor 8X)

## المميزات ✨

- 🎨 **شخصية أنمي تفاعلية**: شخصية "هيوري" الأنمي مع رسوم متحركة طبيعية
- 🤖 **ذكاء اصطناعي متقدم**: محادثات ذكية باستخدام Google Gemini AI
- 💬 **واجهة دردشة سهلة**: تجربة محادثة سلسة وجميلة
- 🌙 **تصميم أنيق**: واجهة داكنة مريحة للعين
- 📱 **متوافق مع جميع الأجهزة**: يعمل على أندرويد 7.0 وما فوق
- 👤 **التعرف على المستخدم**: يتعرف تلقائياً على **ميجن غيلان**

## طريقة التثبيت 📱

1. **حمّل ملف APK** من الرابط أعلاه
2. **فعّل التثبيت من مصادر غير معروفة**:
   - اذهب إلى: الإعدادات → الأمان → مصادر غير معروفة
   - أو عند التثبيت مباشرة: الإعدادات → السماح من هذا المصدر
3. **افتح ملف APK** واتبع خطوات التثبيت
4. **استمتع بالتحدث مع Hiyori!** 🎉

## متطلبات التشغيل 📋

- Node.js 18+ (للمطورين)
- Android Studio (لبناء APK)
- Android SDK 34
- Java 17+

## التثبيت والتشغيل 🚀

### 1. استنساخ المشروع

```bash
git clone https://github.com/magengillan00-lgtm/MagenAvatar.git
cd MagenAvatar
```

### 2. تثبيت المتطلبات

```bash
npm install
```

### 3. تشغيل التطبيق (للتطوير)

```bash
# تشغيل على محاكي أو جهاز متصل
npx expo run:android
```

## هيكل المشروع 📁

```
MagenAvatar/
├── App.tsx                 # المكون الرئيسي للتطبيق
├── app.json               # إعدادات Expo
├── package.json           # المتطلبات
├── assets/                # الصور والأيقونات
│   ├── icon.png          # أيقونة التطبيق
│   ├── splash-icon.png   # شاشة البداية
│   └── ...
├── src/
│   ├── components/
│   │   ├── Avatar.tsx    # مكون الأفاتار
│   │   └── ChatInterface.tsx  # واجهة الدردشة
│   ├── services/
│   │   └── geminiService.ts   # خدمة Gemini AI
│   └── context/
│       └── AppContext.tsx     # إدارة حالة التطبيق
└── android/              # مشروع Android الأصلي
```

## التكوين ⚙️

### تغيير مفتاح Gemini API

قم بتعديل الملف `src/services/geminiService.ts`:

```typescript
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
```

### تخصيص الشخصية

يمكنك تعديل شخصية "هيوري" في الملف `src/services/geminiService.ts` عن طريق تحديث `SYSTEM_PROMPT`.

## التقنيات المستخدمة 🛠️

- **React Native** - إطار العمل الأساسي
- **Expo** - منصة التطوير
- **Capacitor** - تحويل الويب لتطبيق أصلي
- **TypeScript** - لغة البرمجة
- **Google Gemini AI** - الذكاء الاصطناعي
- **React Native SVG** - الرسومات (أفاتار هيوري)
- **Expo Linear Gradient** - التدرجات

## معلومات المستخدم 👤

التطبيق مصمم لـ **ميجن غيلان (Magen Gillan)** ويتعرف عليه تلقائياً.

## الترخيص 📄

MIT License

## المساهمة 🤝

نرحب بالمساهمات! يرجى فتح issue أو pull request.

---

**تم إنشاء هذا التطبيق بـ ❤️ للمستخدم Magen Gillan**
