import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, role, requirements } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en recrutement de startups tech. Tu génères des profils de candidats idéaux, des offres d'emploi professionnelles et des questions d'entretien pertinentes. Réponds en français.`
        },
        {
          role: 'user',
          content: `Startup: ${startup}\nRôle recherché: ${role}\nExigences: ${requirements}\n\nGénère:\n1. Description du poste parfaite\n2. Profil idéal du candidat\n3. 5 questions d'entretien clés\n4. Salaire recommandé\n5. Où trouver ce profil`
        }
      ],
      max_tokens: 1500,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
