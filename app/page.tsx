'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const modules = [
  { id: 'idea', icon: '💡', name: 'Idea Generator', desc: 'Génère des idées de startup' },
  { id: 'brand', icon: '🎨', name: 'Brand Kit', desc: 'Logo, couleurs, nom' },
  { id: 'market', icon: '📊', name: 'Market Analyzer', desc: 'Analyse du marché' },
  { id: 'ui', icon: '🖥️', name: 'UI Builder', desc: 'Génère ton site web' },
  { id: 'business', icon: '💼', name: 'Business Model', desc: 'Modèle économique' },
  { id: 'marketing', icon: '📣', name: 'Marketing Engine', desc: 'Textes, SEO, emails' },
  { id: 'pitch', icon: '🚀', name: 'Pitch Deck', desc: 'Présentation investisseurs' },
  { id: 'logo', icon: '✏️', name: 'Logo Generator', desc: 'Génère ton logo IA' },
]

const ais = [
  { name: 'Groq LLaMA', color: 'bg-blue-500' },
  { name: 'Claude', color: 'bg-orange-500' },
  { name: 'ChatGPT', color: 'bg-green-500' },
  { name: 'Qwen', color: 'bg-purple-500' },
  { name: 'Codex', color: 'bg-yellow-500' },
]

interface Project {
  id: string
  module: string
  prompt: string
  result: string
  date: string
}

export default function Home() {
  const [active, setActive] = useState('idea')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [view, setView] = useState<'generate' | 'projects'>('generate')

  useEffect(() => {
    const saved = localStorage.getItem('nexoro_projects')
    if (saved) setProjects(JSON.parse(saved))
  }, [])

  const saveProject = (prompt: string, result: string, module: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      module, prompt, result,
      date: new Date().toLocaleDateString('fr-FR')
    }
    const updated = [newProject, ...projects]
    setProjects(updated)
    localStorage.setItem('nexoro_projects', JSON.stringify(updated))
  }

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    localStorage.setItem('nexoro_projects', JSON.stringify(updated))
  }

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult('')
    let fullResult = ''

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, module: active })
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
            fullResult += token
            setResult(prev => prev + token)
          } catch {}
        }
      }
      if (fullResult) saveProject(prompt, fullResult, active)
    } catch {
      setResult('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-2">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">⚡ Nexoro</h1>
          <p className="text-gray-500 text-xs mt-1">AI Startup Factory</p>
        </div>
        <button onClick={() => setView('generate')} className={`flex items-center gap-2 p-3 rounded-xl text-left text-sm font-medium ${view === 'generate' ? 'bg-indigo-600' : 'hover:bg-gray-800 text-gray-400'}`}>⚡ Générer</button>
        <button onClick={() => setView('projects')} className={`flex items-center gap-2 p-3 rounded-xl text-left text-sm font-medium ${view === 'projects' ? 'bg-indigo-600' : 'hover:bg-gray-800 text-gray-400'}`}>📁 Mes Projets ({projects.length})</button>
        <div className="text-xs text-gray-600 px-2 mt-2 mb-1">OUTILS</div>
        <Link href="/launch" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🚀 Launch in 5min</Link>
        <Link href="/roadmap" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🗺️ Roadmap</Link>
        <Link href="/legal" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">⚖️ Juridique</Link>
        <Link href="/recruit" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">👥 Recrutement</Link>
        <Link href="/codegen" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">💻 Code Generator</Link>
        <Link href="/cofounder" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🤖 AI Co-Founder</Link>
        <Link href="/multilang" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🌍 Multi-langues</Link>
        <Link href="/store" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🏪 App Store</Link>
        <Link href="/studio" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🎨 Studio</Link>
        <Link href="/preview" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🖥️ UI Builder</Link>
        <Link href="/export" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">📄 Export PDF</Link>
        <Link href="/factures" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🧾 Factures</Link>
        <Link href="/marketplace" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🌍 Marketplace</Link>
        <Link href="/analytics" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">📊 Analytics</Link>
        <Link href="/whitelabel" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">🏷️ White Label</Link>
        <Link href="/pricing" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">💳 Pricing</Link>
        <Link href="/auth" className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-gray-800 text-gray-400">👤 Mon compte</Link>
        <div className="text-xs text-gray-600 px-2 mt-2 mb-1">MODULES IA</div>
        {modules.map(m => (
          <button key={m.id} onClick={() => { setActive(m.id); setView('generate') }}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${active === m.id && view === 'generate' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
            <span className="text-xl">{m.icon}</span>
            <div>
              <div className="text-sm font-medium">{m.name}</div>
              <div className="text-xs opacity-60">{m.desc}</div>
            </div>
          </button>
        ))}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {view === 'projects' ? '📁 Mes Projets' : `${modules.find(m => m.id === active)?.icon} ${modules.find(m => m.id === active)?.name}`}
          </h2>
          <div className="flex gap-2">
            {ais.map(ai => (
              <div key={ai.name} className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-xs">
                <div className={`w-2 h-2 rounded-full ${ai.color}`}></div>
                {ai.name}
              </div>
            ))}
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          {view === 'generate' ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-4">Décris ta startup</h3>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="Ex: A platform to connect freelancers with global startups using AI matching..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-32 focus:outline-none focus:border-indigo-500" />
                <button onClick={generate} disabled={loading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
                  {loading ? '⏳ Génération en cours...' : '⚡ Générer avec Groq LLaMA'}
                </button>
              </div>

              {result && (
                <div className="bg-gray-900 rounded-2xl border border-indigo-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-indigo-400">Groq LLaMA — En direct</span>
                    </div>
                    {!loading && <span className="text-xs text-green-400">✓ Sauvegardé</span>}
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-400">{projects.length}</div>
                  <div className="text-gray-500 text-sm">Projets créés</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-400">1</div>
                  <div className="text-gray-500 text-sm">IA connectée</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-400">8</div>
                  <div className="text-gray-500 text-sm">Modules actifs</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {projects.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <div className="text-5xl mb-4">📁</div>
                  <p>Aucun projet sauvegardé</p>
                </div>
              ) : projects.map(p => (
                <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span>{modules.find(m => m.id === p.module)?.icon}</span>
                      <span className="font-medium">{modules.find(m => m.id === p.module)?.name}</span>
                      <span className="text-xs text-gray-500">{p.date}</span>
                    </div>
                    <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-red-300 text-sm">🗑️</button>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 italic">"{p.prompt}"</p>
                  <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4">{p.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
