import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, model, price, growth } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [{
        role: 'system',
        content: 'You are a financial expert. Return ONLY valid JSON, no markdown, no explanation.'
      }, {
        role: 'user',
        content: `For this startup: "${startup}", business model: ${model}, price: $${price}/month, expected growth: ${growth}%/month

Return ONLY this JSON:
{
  "months": [
    {"month": "M1", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M2", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M3", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M4", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M5", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M6", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M7", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M8", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M9", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M10", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M11", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0},
    {"month": "M12", "revenue": 0, "customers": 0, "expenses": 0, "profit": 0}
  ],
  "year1": 0,
  "year2": 0,
  "year3": 0,
  "breakeven": "M6",
  "cac": 0,
  "ltv": 0,
  "summary": "2 sentence financial summary"
}`
      }]
    })
  })

  const data = await response.json()
  try {
    const raw = data.choices?.[0]?.message?.content || '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response('{}', { headers: { 'Content-Type': 'application/json' } })
  }
}
