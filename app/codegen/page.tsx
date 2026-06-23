'use client'
import { useState } from 'react'

const stacks = [
  { id: 'nextjs', icon: '▲', name: 'Next.js', desc: 'TypeScript + Tailwind' },
  { id: 'react', icon: '⚛️', name: 'React', desc: 'Vite + TypeScript' },
  { id: 'node', icon: '🟢', name: 'Node.js', desc: 'Express + PostgreSQL' },
  { id: 'python', icon: '🐍', name: 'Python', desc: 'FastAPI + SQLAlchemy' },
  { id: 'mobile', icon: '📱', name: 'React Native', desc: 'Expo + TypeScript' },
]

const components = [
  { id: 'landing', icon: '🌐', name: 'Landing Page', desc: 'Hero, features, pricing, CTA' },
  { id: 'dashboard', icon: '📊', name: 'Dashboard', desc: 'Stats, tables, graphiques' },
  { id: 'auth', icon: '🔐', name: 'Auth System', desc: 'Login, register, JWT' },
  { id: 'api', icon: '⚡', name: 'API REST', desc: 'CRUD + documentation' },
  { id: 'database', icon: '🗄️', name: 'Database', desc: 'Schéma + migrations' },
  { id: 'payment', icon: '💳', name: 'Stripe Payment', desc: 'Abonnements + webhooks' },
]

export default function CodeGen() {
  const [prompt, setPrompt] = useState('')
  const [stack, setStack] = useState('nextjs')
  const [component, setComponent] = useState('landing')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setCode('')
    let full = ''

    try {
      const res = await fetch('/api/codegen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, stack, component })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.replace('data: ', '')
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content || ''
            full += token
            setCode(prev => prev + token)
          } catch {}
        }
      }
    } catch { setCode('Erreur de génération') }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const ext: Record<string, string> = { nextjs: 'tsx', react: 'tsx', node: 'ts', python: 'py', mobile: 'tsx' }
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component}-nexoro.${ext[stack] || 'ts'}`
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💻 Code Generator</h1>
            <p className="text-gray-500 mt-1">Génère le code source complet de ta startup</p>
          </div>
          {code && (
            <div className="flex gap-2">
              <button onClick={copy}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm">
                {copied ? '✅ Copié !' : '📋 Copier'}
              </button>
              <button onClick={download}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm">
                📥 Télécharger
              </button>
            </div>
          )}
        </div>

        {/* Stack */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Stack technique</h2>
          <div className="grid grid-cols-5 gap-3">
            {stacks.map(s => (
              <button key={s.id} onClick={() => setStack(s.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${stack === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-semibold">{s.name}</span>
                <span className="text-xs opacity-60">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Component */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Composant à générer</h2>
          <div className="grid grid-cols-3 gap-3">
            {components.map(c => (
              <button key={c.id} onClick={() => setComponent(c.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${component === c.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-xl">{c.icon}</span>
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs opacity-60">{c.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Décris ta startup — Ex: A SaaS platform for restaurant management with AI-powered analytics..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? '⏳ Génération du code...' : '⚡ Générer le code'}
          </button>
        </div>

        {/* Code output */}
        {code && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-xs ml-2">{component}-nexoro.{stack === 'python' ? 'py' : 'tsx'}</span>
              </div>
              {loading && <span className="text-indigo-400 text-xs animate-pulse">Génération en cours...</span>}
            </div>
            <pre className="p-6 text-green-400 text-xs overflow-auto max-h-[600px] font-mono leading-relaxed">
              {code}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}
