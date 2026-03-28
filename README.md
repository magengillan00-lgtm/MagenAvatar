# Magen Avatar - تطبيق الأفاتار التفاعلي 🎭

تطبيق أندرويد تفاعلي يضم شخصية "زيد" (Zeed) - شاب أنمي ودود يتحدث معك ويستجيب لرسائلك باستخدام الذكاء الاصطناعي.

![Magen Avatar](./assets/icon.png)

## المميزات ✨

- 🎨 **شخصية أنمي تفاعلية**: شخصية "زيد" الأنمي مع رسوم متحركة طبيعية
- 🤖 **ذكاء اصطناعي متقدم**: محادثات ذكية باستخدام Google Gemini AI
- 💬 **واجهة دردشة سهلة**: تجربة محادثة سلسة وجميلة
- 🌙 **تصميم أنيق**: واجهة داكنة مريحة للعين
- 📱 **متوافق مع جميع الأجهزة**: يعمل على أندرويد 7.0 وما فوق

## متطلبات التشغيل 📋

- Node.js 18+
- Android Studio (لبناء APK)
- Android SDK 34
- Java 17+

## التثبيت والتشغيل 🚀

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-username/MagenAvatar.git
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

### 4. بناء ملف APK

#### الطريقة الأولى: استخدام EAS Build (الأسهل)

```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول إلى Expo
eas login

# بناء APK
eas build --platform android --profile preview
```

#### الطريقة الثانية: بناء محلي

```bash
# إنشاء ملفات Android الأصلية
npx expo prebuild --platform android

# بناء APK
cd android
./gradlew assembleRelease

# ملف APK سيكون في:
# android/app/build/outputs/apk/release/app-release.apk
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

يمكنك تعديل شخصية "زيد" في الملف `src/services/geminiService.ts` عن طريق تحديث `SYSTEM_PROMPT`.

## التقنيات المستخدمة 🛠️

- **React Native** - إطار العمل الأساسي
- **Expo** - منصة التطوير
- **TypeScript** - لغة البرمجة
- **Google Gemini AI** - الذكاء الاصطناعي
- **React Native SVG** - الرسومات
- **Expo Linear Gradient** - التدرجات

## معلومات المستخدم 👤

التطبيق مصمم لـ **ميجن غيلان (Magen Gillan)** ويتعرف عليه تلقائياً.

## الترخيص 📄

MIT License

## المساهمة 🤝

نرحب بالمساهمات! يرجى فتح issue أو pull request.

---

**تم إنشاء هذا التطبيق بـ ❤️ للمستخدم Magen Gillan**
