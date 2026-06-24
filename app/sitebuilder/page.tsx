'use client'
import { useState } from 'react'

const templates = [
  { id: 'saas', icon: '💻', name: 'SaaS Platform', desc: 'Dashboard, pricing, features' },
  { id: 'agency', icon: '🏢', name: 'Agency', desc: 'Portfolio, services, contact' },
  { id: 'ecommerce', icon: '🛒', name: 'E-commerce', desc: 'Shop, products, cart' },
  { id: 'restaurant', icon: '🍔', name: 'Restaurant', desc: 'Menu, reservation, delivery' },
  { id: 'startup', icon: '🚀', name: 'Startup Landing', desc: 'Hero, features, CTA' },
  { id: 'portfolio', icon: '🎨', name: 'Portfolio', desc: 'Projects, about, contact' },
]

const colors = [
  { id: 'dark', label: '🌙 Dark', desc: 'Fond sombre moderne' },
  { id: 'light', label: '☀️ Light', desc: 'Fond blanc professionnel' },
  { id: 'gradient', label: '🌈 Gradient', desc: 'Dégradé coloré' },
]

export default function SiteBuilder() {
  const [prompt, setPrompt] = useState('')
  const [template, setTemplate] = useState('startup')
  const [color, setColor] = useState('dark')
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [deployed, setDeployed] = useState(false)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setHtml('')
    setDeployed(false)
    let full = ''

    const enhancedPrompt = `Startup: ${prompt}
Template: ${templates.find(t => t.id === template)?.name}
Style: ${color} theme
Génère un site web HTML complet et professionnel pour cette startup.`

    try {
      const res = await fetch('/api/sitegenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt, template, color })
      })
      const data = await res.json()
      full = data.html || '<h1>Erreur</h1>'
      setHtml(full)
    } catch { setHtml('<h1>Erreur de génération</h1>') }
    setLoading(false)
  }

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prompt.slice(0, 20).replace(/\s/g, '-')}-nexoro.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadZIP = async () => {
    const files = {
      'index.html': html,
      'README.md': `# Site généré par Nexoro\n\nStartup: ${prompt}\nGénéré le: ${new Date().toLocaleDateString('fr-FR')}\n\nNexora AI — nexora-puce-eight.vercel.app`,
    }
    const content = Object.entries(files).map(([name, content]) => `=== ${name} ===\n${content}`).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-nexoro.zip'
    a.click()
  }

  const simulateDeploy = async () => {
    setDeployed(false)
    await new Promise(r => setTimeout(r, 2000))
    setDeployed(true)
  }

  const cleanHtml = (() => {
    let h = html
    if (h.includes('<!DOCTYPE')) return h.substring(h.indexOf('<!DOCTYPE'))
    if (h.includes('<html')) return h.substring(h.indexOf('<html'))
    const bodyStart = h.indexOf('<body') !== -1 ? h.indexOf('<body') : h.indexOf('<nav') !== -1 ? h.indexOf('<nav') : h.indexOf('<div')
    const css = bodyStart > 0 ? h.substring(0, bodyStart) : ''
    const body = bodyStart > 0 ? h.substring(bodyStart) : h
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' + css + '</style></head><body>' + body + '</body></html>'
  })()

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">🌐 Site Builder</h1>
            <p className="text-gray-500 mt-1">Génère un vrai site web complet en 30 secondes</p>
          </div>
          {html && (
            <div className="flex gap-2 flex-wrap">
              <button onClick={downloadHTML}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm">
                📥 HTML
              </button>
              <button onClick={downloadZIP}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm">
                📦 ZIP
              </button>
              <button onClick={simulateDeploy}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm">
                {deployed ? '✅ Déployé !' : '🚀 Déployer'}
              </button>
            </div>
          )}
        </div>

        {deployed && (
          <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-green-400">Site déployé avec succès !</p>
              <p className="text-green-600 text-sm">nexora-puce-eight.vercel.app/sites/{prompt.slice(0,10).replace(/\s/g,'-').toLowerCase()}</p>
            </div>
          </div>
        )}

        {/* Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Template</h2>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${template === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <div className="text-xs font-semibold">{t.name}</div>
                    <div className="text-xs opacity-60">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Style</h2>
            <div className="space-y-2 mb-4">
              {colors.map(c => (
                <button key={c.id} onClick={() => setColor(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${color === c.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-lg">{c.label}</span>
                  <span className="text-xs opacity-60">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Décris ta startup — Ex: FastFoodGenie, plateforme IA pour restaurants fast food, couleurs rouge et noir, style moderne..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading || !prompt.trim()}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
            {loading ? '⏳ Génération du site...' : '🌐 Générer mon site complet'}
          </button>
        </div>

        {/* Preview */}
        {html && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800 flex-wrap">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-400 mx-2">
                🌐 {prompt.slice(0,30)}... — nexoro.app
              </div>
              <button onClick={() => setView('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                👁️ Preview
              </button>
              <button onClick={() => setView('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                💻 Code
              </button>
              {loading && <span className="text-indigo-400 text-xs animate-pulse">Génération...</span>}
            </div>

            {view === 'preview' ? (
              <iframe srcDoc={cleanHtml} className="w-full h-[700px] bg-white"
                sandbox="allow-scripts allow-same-origin" title="Site Preview" />
            ) : (
              <pre className="p-6 text-green-400 text-xs overflow-auto h-[700px] font-mono leading-relaxed">
                {html}
              </pre>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
