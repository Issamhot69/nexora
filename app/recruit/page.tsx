'use client'
import { useState } from 'react'

const roles = [
  { id: 'cto', icon: '👨‍💻', name: 'CTO / Tech Lead', desc: 'Développeur senior, architecture' },
  { id: 'designer', icon: '🎨', name: 'UI/UX Designer', desc: 'Design produit, Figma' },
  { id: 'marketing', icon: '📣', name: 'Growth Marketer', desc: 'SEO, Ads, contenus' },
  { id: 'sales', icon: '💼', name: 'Sales Manager', desc: 'B2B, closing, pipeline' },
  { id: 'cofounder', icon: '🤝', name: 'Co-Fondateur', desc: 'Vision, equity, leadership' },
  { id: 'data', icon: '📊', name: 'Data Scientist', desc: 'ML, IA, analytics' },
  { id: 'product', icon: '🚀', name: 'Product Manager', desc: 'Roadmap, specs, OKRs' },
  { id: 'finance', icon: '💰', name: 'CFO / Finance', desc: 'Comptabilité, levée de fonds' },
]

export default function Recruit() {
  const [startup, setStartup] = useState('')
  const [role, setRole] = useState('cto')
  const [requirements, setRequirements] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup.trim()) return
    setLoading(true)
    setResult('')
    let full = ''

    try {
      const res = await fetch('/api/recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, role: roles.find(r => r.id === role)?.name, requirements })
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
            setResult(prev => prev + token)
          } catch {}
        }
      }
    } catch { setResult('Erreur') }
    setLoading(false)
  }

  const copy = () => navigator.clipboard.writeText(result)

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">👥 Recrutement IA</h1>
          <p className="text-gray-500 mt-1">Trouve et attire les meilleurs talents pour ta startup</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Rôle recherché</h2>
          <div className="grid grid-cols-4 gap-3">
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center ${role === r.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl">{r.icon}</span>
                <span className="text-xs font-semibold">{r.name}</span>
                <span className="text-xs opacity-60">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <input value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Décris ta startup..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <textarea value={requirements} onChange={e => setRequirements(e.target.value)}
            placeholder="Exigences spécifiques — Ex: 5 ans d'expérience React, anglais courant, remote OK..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
            {loading ? '⏳ Génération...' : '⚡ Générer l\'offre d\'emploi'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-indigo-400">✓ Offre générée</span>
              <button onClick={copy} className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded-xl">
                📋 Copier
              </button>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
