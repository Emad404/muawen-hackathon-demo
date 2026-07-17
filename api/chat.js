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

    const systemPrompt = lang === 'en'
      ? "You are Muawen, a smart banking assistant for a Saudi bank (Alinma Bank hackathon demo). Reply concisely (2-4 sentences) in natural English, focused on practical financial guidance. Never invent real account numbers or make binding financial commitments."
      : "أنت معاون، مساعد مصرفي ذكي لبنك سعودي (عرض تجريبي لهاكاثون بنك الإنماء). أجب باللهجة السعودية الطبيعية، بإيجاز (2-4 جمل)، وركز على النصيحة المالية العملية. لا تخترع أرقام حسابات حقيقية ولا تقدم التزامات مالية ملزمة.";

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
