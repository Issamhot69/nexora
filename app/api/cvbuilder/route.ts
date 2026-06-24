import { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
  const { name, title, experience, skills, education, language } = await req.json()
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', max_tokens: 2000,
      messages: [
        { role: 'system', content: `You are a professional CV writer. Write in ${language}. Return ONLY valid JSON.` },
        { role: 'user', content: `Create a professional CV for: Name: ${name}, Title: ${title}, Experience: ${experience}, Skills: ${skills}, Education: ${education}
Return ONLY: {"name":"","title":"","summary":"","experience":[{"company":"","role":"","period":"","achievements":["achievement1"]}],"skills":{"technical":["skill1"],"soft":["skill1"]},"education":[{"school":"","degree":"","year":""}],"languages":["English"],"certifications":["cert1"]}` }
      ]
    })
  })
  const data = await response.json()
  try { return new Response(data.choices?.[0]?.message?.content?.replace(/```json|```/g,'').trim(), { headers: { 'Content-Type': 'application/json' } }) }
  catch { return new Response('{}') }
}
