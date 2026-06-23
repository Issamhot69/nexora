import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { startup, type, country } = await req.json()

  const docs: Record<string, string> = {
    cgu: 'Conditions Générales d\'Utilisation (CGU) complètes et professionnelles',
    privacy: 'Politique de Confidentialité RGPD complète',
    terms: 'Mentions Légales complètes',
    contract: 'Contrat de Prestation de Services professionnel',
    nda: 'Accord de Non-Divulgation (NDA) professionnel',
    status: 'Statuts de société (SARL/SAS) complets',
  }

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
          content: `Tu es un expert juridique spécialisé en droit des entreprises et du numérique. Tu génères des documents juridiques professionnels pour les startups. Pays: ${country}. Document: ${docs[type]}. Sois précis, professionnel et complet.`
        },
        { role: 'user', content: `Startup: ${startup}\nGénère: ${docs[type]}` }
      ],
      max_tokens: 3000,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
