import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { skills, budget, country, experience, interests, time } = await req.json()

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
          content: `Tu es un expert en création de startups qui analyse le profil d'un entrepreneur et génère LA startup parfaite pour lui. Tu bases tes recommandations sur ses compétences réelles, son budget, son pays, son expérience et ses intérêts. Tu génères une startup ultra-personnalisée avec un plan d'action concret. Réponds en français.`
        },
        {
          role: 'user',
          content: `Profil entrepreneur:
- Compétences: ${skills}
- Budget disponible: ${budget}
- Pays: ${country}
- Années d'expérience: ${experience}
- Centres d'intérêt: ${interests}
- Temps disponible par semaine: ${time}

Génère:
1. LA startup parfaite pour ce profil (nom, concept, pourquoi c'est parfait pour lui)
2. Pourquoi ses compétences sont un avantage compétitif unique
3. Plan de lancement en 90 jours adapté à son budget
4. Les 3 premiers clients à cibler
5. Revenu estimé après 6 mois
6. Score de compatibilité entrepreneur/startup (sur 100)`
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
