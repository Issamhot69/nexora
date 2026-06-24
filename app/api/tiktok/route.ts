import { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
  const { niche, goal, count } = await req.json()
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', max_tokens: 2000,
      messages: [
        { role: 'system', content: 'You are a viral TikTok content creator. Return ONLY valid JSON.' },
        { role: 'user', content: `Generate ${count} viral TikTok scripts for niche: ${niche}, goal: ${goal}.
Return ONLY: {"scripts":[{"title":"","hook":"","content":"","cta":"","hashtags":["#tag1"],"duration":"30s","type":"Educational/Entertainment/Story","virality_score":9}]}` }
      ]
    })
  })
  const data = await response.json()
  try { return new Response(data.choices?.[0]?.message?.content?.replace(/```json|```/g,'').trim(), { headers: { 'Content-Type': 'application/json' } }) }
  catch { return new Response('{}') }
}
