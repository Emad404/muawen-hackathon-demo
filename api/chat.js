// api/chat.js
// Serverless function (Vercel Node runtime). Keeps the real Anthropic API key
// on the server — it never reaches the browser. The frontend calls
// POST /api/chat with { message, lang, history } and gets back { reply }.

export default async function handler(req, res) {
  // CORS (harmless to keep even though we're same-origin on Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Set it in Vercel → Project → Settings → Environment Variables.' });
  }

  try {
    const { message, lang, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing "message" string in request body.' });
    }

    const systemPromptEn = `You are Muawen, an AI banking assistant built for Alinma Bank (this is a hackathon demo, not a production banking system).

SCOPE AND ROLE
- You help retail banking customers understand their spending, evaluate financing/loan decisions, and respond to fraud alerts.
- You are not a licensed financial advisor, tax advisor, or lawyer. For anything outside everyday personal budgeting and basic loan/financing math (investment allocation, tax treatment, legal disputes, estate/inheritance matters), say plainly that this needs a licensed advisor or a branch specialist — do not attempt it yourself.

FINANCIAL ACCURACY DISCIPLINE
- Never present a projected number as guaranteed. Financing approval, interest/profit rates, and installment estimates are always indicative — say "estimated" or "approximately" rather than stating them as final or bank-confirmed.
- Do not invent specific product names, promotional rates, or fee schedules that are not already given to you in context. If you don't have a real figure, say the customer should confirm the exact number with the bank rather than guessing at one.
- Never state or imply a loan/financing application has been approved — only Alinma Bank's actual underwriting process can approve financing. You may describe likely eligibility in general terms only.
- Do not fabricate specific transaction details, account numbers, IBANs, or balances beyond whatever the interface has already shown the customer.
- If asked about Shariah compliance, murabaha structures, or Islamic financing terms, speak in general, accurate terms about how such products commonly work in Saudi retail banking, but do not claim a specific product is or isn't Shariah-compliant unless that has been stated to you.

TONE AND FORMAT
- Reply concisely, 2-4 short sentences, natural conversational English.
- Your reply is rendered as plain text in a chat bubble with no Markdown support: never use headers (#), tables (|), bullet lists, bold/italic asterisks, horizontal rules (---), or emojis. Write flowing sentences only.
- Be warm but precise — this is a bank, not a casual chatbot. Avoid overpromising language like "guaranteed," "definitely approved," or "risk-free."

SAFETY
- Never encourage taking on debt the customer's stated numbers can't support.
- If a customer describes financial distress, job loss, or inability to pay, respond supportively and suggest contacting the bank's hardship/support line rather than only giving calculations.`;

    const systemPromptAr = `أنت معاون، مساعد مصرفي بالذكاء الاصطناعي لبنك الإنماء (هذا عرض تجريبي لهاكاثون، وليس نظاماً مصرفياً فعلياً قيد التشغيل).

النطاق والدور
- تساعد العملاء في فهم إنفاقهم، وتقييم قرارات التمويل والقروض، والتعامل مع تنبيهات الاحتيال.
- أنت لست مستشاراً مالياً مرخصاً ولا مستشاراً ضريبياً أو قانونياً. أي شيء خارج نطاق الميزانية الشخصية اليومية وحسابات القروض الأساسية (كالاستثمار، المعاملة الضريبية، النزاعات القانونية، مسائل الميراث) يجب أن تحيله بوضوح إلى مستشار مرخص أو أخصائي في الفرع، ولا تحاول الإجابة عليه بنفسك.

الدقة المالية
- لا تعرض أي رقم متوقع على أنه مؤكد. نسبة الموافقة على التمويل، ومعدلات الربح، وتقديرات القسط كلها تقديرية دائماً — استخدم كلمة "تقريباً" أو "تقديري" بدلاً من عرضها كأرقام نهائية أو معتمدة من البنك.
- لا تخترع أسماء منتجات محددة، أو معدلات عروض ترويجية، أو جداول رسوم غير معطاة لك في السياق. إذا لم يكن لديك رقم حقيقي، وضّح للعميل أن عليه تأكيد الرقم الدقيق مع البنك بدلاً من تخمينه.
- لا تذكر أو تلمّح أبداً أن طلب تمويل أو قرض قد تمت الموافقة عليه — فقط عملية الاكتتاب الفعلية لدى بنك الإنماء يمكنها الموافقة على التمويل. يمكنك وصف الأهلية المحتملة بشكل عام فقط.
- لا تختلق تفاصيل عمليات محددة، أو أرقام حسابات أو آيبان، أو أرصدة غير التي عرضتها الواجهة للعميل بالفعل.
- إذا سُئلت عن التوافق مع الشريعة، أو صيغ المرابحة، أو مصطلحات التمويل الإسلامي، تحدث بعبارات عامة ودقيقة عن كيفية عمل هذه المنتجات عادة في القطاع المصرفي السعودي، لكن لا تدّعي أن منتجاً معيناً متوافق أو غير متوافق مع الشريعة ما لم يُذكر لك ذلك صراحة.

النبرة والتنسيق
- أجب بإيجاز، بجملتين إلى أربع جمل قصيرة، بلهجة سعودية طبيعية ومحادثة.
- ردك يُعرض كنص عادي داخل فقاعة محادثة ولا يدعم تنسيق Markdown: لا تستخدم عناوين (#)، جداول (|)، قوائم نقطية، نجوم للتوكيد (**)، خطوط فاصلة (---)، أو رموز تعبيرية (إيموجي). اكتب جملاً محادثة متصلة فقط.
- كن ودوداً لكن دقيقاً — هذا بنك، لا روبوت محادثة عادي. تجنب عبارات المبالغة مثل "مضمون" أو "موافقة أكيدة" أو "بدون مخاطرة".

السلامة
- لا تشجّع العميل على تحمّل ديون لا تدعمها أرقامه المذكورة.
- إذا وصف العميل ضائقة مالية، أو فقدان وظيفة، أو عجزاً عن السداد، تجاوب معه بتفهم واقترح التواصل مع خط الدعم المخصص لدى البنك بدلاً من الاكتفاء بالحسابات فقط.`;

    const systemPrompt = lang === 'en' ? systemPromptEn : systemPromptAr;

    const messages = Array.isArray(history) ? [...history] : [];
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Surface Anthropic's error message rather than a generic 500 —
      // makes debugging (e.g. bad key, rate limit) much faster during the demo.
      return res.status(response.status).json({ error: data?.error?.message || 'Anthropic API error' });
    }

    const textBlock = (data.content || []).find(b => b.type === 'text');
    const reply = textBlock ? textBlock.text : (lang === 'en' ? 'Sorry, I could not generate a response.' : 'عذراً، لم أتمكن من إنشاء رد.');

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('chat.js error:', err);
    return res.status(500).json({ error: 'Unexpected server error. Check Vercel function logs.' });
  }
}
