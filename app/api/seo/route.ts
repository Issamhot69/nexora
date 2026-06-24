import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, website, keywords } = await req.json()

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
        content: 'Tu es un expert SEO. Génère une stratégie SEO complète et actionnable. Réponds en français.'
      }, {
        role: 'user',
        content: `Startup: ${startup}
Site web: ${website || 'Non défini'}
Mots-clés cibles: ${keywords}

Génère une stratégie SEO complète:
1. Audit SEO (points forts et faibles estimés)
2. 20 mots-clés prioritaires avec volume estimé
3. Structure de site recommandée
4. 10 idées d'articles de blog à fort potentiel
5. Stratégie de backlinks
6. Meta titles et descriptions pour les 5 pages principales
7. Plan d'action SEO sur 3 mois`
      }]
    })
  })

  const data = await response.json()
  const result = data.choices?.[0]?.message?.content || ''
  return new Response(JSON.stringify({ result }), { headers: { 'Content-Type': 'application/json' } })
}
