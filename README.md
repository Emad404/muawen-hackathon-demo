<div dir="rtl" align="right">

# معاون · Muawen

مساعد مصرفي ذكي مبني بالذكاء الاصطناعي التوليدي (GenAI) — من خدمة تُستدعى إلى شريك مالي يراقب ويحمي على مدار الساعة.

**مشروع مقدَّم في هاكاثون أمد 2026 — بنك الإنماء × أكاديمية طويق**

---

## نظرة عامة

تتفاعل البنوك التقليدية مع العميل فقط بعد وقوع المشكلة، ما يعني وقتاً طويلاً في الانتظار أو البحث داخل التطبيق. **معاون** يحوّل هذه العلاقة من رد فعل إلى استباقية، عبر مساعد محادثة يعمل بالذكاء الاصطناعي التوليدي، يفهم اللهجة السعودية، ويراقب وضع العميل المالي باستمرار.

## المميزات الرئيسية

- **مراقبة استباقية (Proactive):** تنبيهات إنفاق تصل قبل أن يسأل العميل، مع اقتراحات ميزانية مخصّصة.
- **محاكاة القرارات (Simulation):** معاينة أثر قرار مالي (كقرض جديد) على الميزانية والتدفق النقدي قبل اتخاذه.
- **حماية فورية (Protection):** كشف المعاملات المشبوهة لحظياً، وإرشاد العميل خلال خطوات الاعتراض وتجميد البطاقة.

## التقنيات المستخدمة

| التقنية | الحالة | الوصف |
|---|---|---|
| Claude API (Anthropic) | ✅ مطبّق | محرّك المحادثة الحي الفعلي، وليس ردوداً مبرمَجة مسبقاً |
| واجهة ويب ثنائية اللغة | ✅ مطبّق | عربي/إنجليزي، مع وضع ليلي ونهاري |
| Vercel Serverless Function | ✅ مطبّق | وسيط خادم آمن يحفظ مفتاح الـ API بعيداً عن المتصفح |
| الاسترجاع المعزّز (RAG) | 🔜 قادم | ربط الإجابات بقاعدة معرفة مصرفية موسّعة |
| كشف الشذوذ الفعلي (Anomaly Detection) | 🔜 قادم | نموذج فعلي يتجاوز المحاكاة الحالية |
| التفاعل الصوتي (STT/TTS) | 🔜 قادم | ميزة تفاعلية إضافية |

## هيكل المشروع

```
├── index.html      # واجهة الموقع (لوحة التحكم، الحسابات، التحويلات، البطاقات، المحادثة)
├── api/
│   └── chat.js     # دالة خادوم بلا-سيرفر تستدعي Claude API بأمان
└── package.json
```

## التشغيل والنشر

المشروع ملف ثابت (Static) يعمل مباشرة، مع دالة خادوم واحدة فقط لحفظ مفتاح الـ API:

1. استنسخ المستودع (Clone) وارفعه إلى [Vercel](https://vercel.com).
2. أضف متغيّر البيئة `ANTHROPIC_API_KEY` في إعدادات المشروع على Vercel.
3. أعد النشر (Redeploy) بعد إضافة المتغيّر.

## الفريق

- عبدالعزيز العمري (Abdulaziz Alamri)
- عماد العسكر (Emad Alaskar)

</div>

---
---

# Muawen (معاون)

A GenAI-powered smart banking assistant — turning the bank from a service you call on into a financial partner that watches over and protects your money around the clock.

**Built for Amad Hackathon 2026 — Alinma Bank × Tuwaiq Academy**

---

## Overview

Traditional banks only react after something has already gone wrong, leaving customers waiting or digging through menus. **Muawen** flips that relationship — a GenAI conversational assistant that understands the Saudi dialect and continuously watches the customer's financial standing, stepping in before they have to ask.

## Key Features

- **Proactive Monitoring:** Spending alerts arrive before the customer asks, with tailored budget suggestions.
- **Decision Simulation:** Preview the impact of a financial decision (like a new loan) on the budget and cash flow before committing.
- **Instant Protection:** Detects suspicious transactions in real time and walks the customer through disputing and freezing the card.

## Tech Stack

| Technology | Status | Description |
|---|---|---|
| Claude API (Anthropic) | ✅ Live | Real conversational engine — not scripted responses |
| Bilingual web UI | ✅ Live | Arabic/English, with light and dark mode |
| Vercel Serverless Function | ✅ Live | Secure server-side proxy keeping the API key off the client |
| Retrieval-Augmented Generation (RAG) | 🔜 Planned | Grounding answers in an expanded banking knowledge base |
| Real Anomaly Detection | 🔜 Planned | A trained model beyond the current simulated logic |
| Voice interaction (STT/TTS) | 🔜 Planned | Additional interactive layer |

## Project Structure

```
├── index.html      # Website UI (dashboard, accounts, transfers, cards, chat)
├── api/
│   └── chat.js     # Serverless function that securely calls the Claude API
└── package.json
```

## Running & Deployment

This is a static site with a single serverless function to keep the API key secure:

1. Clone the repo and import it into [Vercel](https://vercel.com).
2. Add the `ANTHROPIC_API_KEY` environment variable in the project settings.
3. Redeploy after the variable is set.

## Team

- Abdulaziz Alamri
- Emad Alaskar
