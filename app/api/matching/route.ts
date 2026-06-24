import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { profile, lookingFor } = await req.json()

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
          content: `Tu es un expert en matching de co-fondateurs de startups. Tu analyses les profils et génères des profils de co-fondateurs idéaux avec des descriptions détaillées. Réponds en français.`
        },
        {
          role: 'user',
          content: `Mon profil: ${profile}
Ce que je cherche: ${lookingFor}

Génère:
1. Le profil idéal de mon co-fondateur (compétences, personnalité, expérience)
2. Pourquoi cette combinaison est gagnante
3. Comment se répartir les rôles et l'equity
4. Les 5 questions clés à poser lors du premier meeting
5. Les red flags à éviter dans un co-fondateur
6. Où trouver ce profil (plateformes, événements, communautés)`
        }
      ],
      max_tokens: 2000,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
