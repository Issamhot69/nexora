import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, goal, audience } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [{
        role: 'system',
        content: 'Tu es un expert en email marketing. Génère des séquences emails professionnelles et persuasives. Réponds en français.'
      }, {
        role: 'user',
        content: `Startup: ${startup}
Objectif: ${goal}
Audience cible: ${audience}

Génère une séquence de 5 emails:
Email 1 - Bienvenue (J+0)
Email 2 - Valeur (J+2)
Email 3 - Témoignage (J+4)
Email 4 - Offre (J+6)
Email 5 - Urgence (J+8)

Pour chaque email donne: Sujet, Preview text, Corps complet`
      }]
    })
  })

  const data = await response.json()
  const result = data.choices?.[0]?.message?.content || ''
  return new Response(JSON.stringify({ result }), { headers: { 'Content-Type': 'application/json' } })
}
