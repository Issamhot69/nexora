import { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
  const { business, products, style, language } = await req.json()
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', max_tokens: 3000,
      messages: [
        { role: 'system', content: `You are a professional catalogue designer. Write in ${language}. Return ONLY valid JSON.` },
        { role: 'user', content: `Create a product catalogue for: Business: ${business}, Products: ${products}, Style: ${style}
Return ONLY: {"business_name":"","tagline":"","description":"","categories":[{"name":"","emoji":"","products":[{"name":"","description":"","price":"","features":["feature1"],"badge":"New/Popular/Sale","emoji":""}]}]}` }
      ]
    })
  })
  const data = await response.json()
  try { return new Response(data.choices?.[0]?.message?.content?.replace(/```json|```/g,'').trim(), { headers: { 'Content-Type': 'application/json' } }) }
  catch { return new Response('{}') }
}
