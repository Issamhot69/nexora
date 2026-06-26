import { NextRequest, NextResponse } from 'next/server'

const systemPrompt = `Tu es Alex, le consultant IA de Nexoro — la plateforme de création de sites web par IA.
Tu aides les utilisateurs à créer leur site web professionnel étape par étape.

Nexoro permet de :
1. /create — Créer un site web complet en 10 minutes
2. /imagegen — Générer des images IA pour le site  
3. /logo — Créer un logo IA professionnel
4. /sitebuilder — Builder avancé avec 18 templates
5. /domains — Acheter un domaine personnalisé
6. /seo — Optimiser le site pour Google

Réponds toujours en français, sois amical, concis et pratique.
Guide toujours vers l'action — donne des étapes numérotées claires.
Si quelqu'un décrit son business, propose-lui immédiatement de créer son site sur /create.
Maximum 150 mots par réponse.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  })

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content || 'Désolé, réessaie !'
  return NextResponse.json({ reply })
}
