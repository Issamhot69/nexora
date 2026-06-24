import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, template, color } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [{
        role: 'system',
        content: 'You are an expert web developer. Generate ONLY pure HTML code. Never add explanations or markdown. Always start with <!DOCTYPE html>.'
      }, {
        role: 'user',
        content: `Generate a complete beautiful modern HTML website for: "${prompt}"
Template: ${template}, Style: ${color}

STRICT RULES - FOLLOW EXACTLY:
1. Start with EXACTLY <!DOCTYPE html> - nothing before it
2. ALL CSS must be inside <style> tags in <head>
3. Include: navbar, hero section, features (4 items), pricing (3 plans: Free/Pro/Enterprise), testimonials (3), footer
4. Use beautiful modern design with colors matching the startup
5. 100% responsive with media queries
6. Add hover effects and smooth transitions
7. Output ONLY HTML code, nothing else
8. End with </html>`
      }]
    })
  })

  const data = await response.json()
  const html = data.choices?.[0]?.message?.content || '<!DOCTYPE html><html><body><h1>Error</h1></body></html>'
  
  return new Response(JSON.stringify({ html }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
