import { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
  const { destination, days, budget, style } = await req.json()
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', max_tokens: 3000,
      messages: [
        { role: 'system', content: 'You are an expert travel planner. Return ONLY valid JSON.' },
        { role: 'user', content: `Plan a ${days}-day trip to ${destination}. Budget: ${budget}. Style: ${style}.
Return ONLY: {"title":"","description":"","budget_total":"","currency":"","days":[{"day":1,"date":"Day 1","theme":"","morning":{"activity":"","location":"","duration":"","cost":"","tips":""},"afternoon":{"activity":"","location":"","duration":"","cost":"","tips":""},"evening":{"activity":"","location":"","duration":"","cost":"","tips":""},"accommodation":"","meals":["breakfast","lunch","dinner"]}],"tips":["tip1"],"packing":["item1"],"emergency":{"police":"","hospital":"","embassy":""}}` }
      ]
    })
  })
  const data = await response.json()
  try { return new Response(data.choices?.[0]?.message?.content?.replace(/```json|```/g,'').trim(), { headers: { 'Content-Type': 'application/json' } }) }
  catch { return new Response('{}') }
}
