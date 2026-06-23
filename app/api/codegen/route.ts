import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, stack, component } = await req.json()

  const stacks: Record<string, string> = {
    nextjs: 'Next.js 14, TypeScript, Tailwind CSS, App Router',
    react: 'React 18, TypeScript, Tailwind CSS, Vite',
    node: 'Node.js, Express, TypeScript, PostgreSQL',
    python: 'Python, FastAPI, SQLAlchemy, PostgreSQL',
    mobile: 'React Native, TypeScript, Expo',
  }

  const components: Record<string, string> = {
    landing: 'une landing page complète avec hero, features, pricing, testimonials et CTA',
    dashboard: 'un dashboard admin complet avec sidebar, stats cards, tables et graphiques',
    auth: 'un système d\'authentification complet avec login, register, forgot password et JWT',
    api: 'une API REST complète avec CRUD, authentification JWT et documentation',
    database: 'un schéma de base de données complet avec migrations et modèles',
    payment: 'une intégration Stripe complète avec abonnements, webhooks et portail client',
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
          content: `Tu es un expert développeur full-stack. Tu génères du code professionnel, propre et complet en ${stacks[stack] || stacks.nextjs}. Tu génères ${components[component] || components.landing} pour la startup décrite. Génère UNIQUEMENT du code, avec des commentaires clairs. Pas d'explications en dehors du code.`
        },
        { role: 'user', content: `Startup: ${prompt}\nStack: ${stacks[stack]}\nComposant: ${components[component]}` }
      ],
      max_tokens: 3000,
      temperature: 0.3,
      stream: true
    })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  })
}
