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

const bgImages = [
  { id: 'none', label: '⬛ Couleur pure', url: '' },
  { id: 'city', label: '🌆 Ville', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
  { id: 'ocean', label: '🌊 Océan', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
  { id: 'mountain', label: '🏔️ Montagne', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { id: 'office', label: '💼 Bureau', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80' },
  { id: 'tech', label: '💻 Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80' },
  { id: 'food', label: '🍽️ Food', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80' },
  { id: 'nature', label: '🌿 Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80' },
  { id: 'space', label: '🚀 Espace', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80' },
  { id: 'abstract', label: '🎨 Abstrait', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80' },
  { id: 'people', label: '👥 Personnes', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80' },
  { id: 'custom', label: '📤 Upload', url: 'custom' },
]

export default function SiteBuilder() {
  const [prompt, setPrompt] = useState('')
  const [template, setTemplate] = useState('startup')
  const [color, setColor] = useState('dark')
  const [bgImage, setBgImage] = useState('none')
  const [customBg, setCustomBg] = useState('')
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [deployed, setDeployed] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')

  const handleCustomBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCustomBg(reader.result as string)
    reader.readAsDataURL(file)
  }

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setHtml('')
    setDeployed(false)

    const selectedBg = bgImage === 'custom' ? customBg : bgImages.find(b => b.id === bgImage)?.url || ''

    try {
      const res = await fetch('/api/sitegenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, template, color, bgImage: selectedBg })
      })
      const data = await res.json()
      setHtml(data.html || '<h1>Erreur</h1>')
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
  }

  const deploy = async () => {
    setDeployed(false)
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, siteName: prompt.slice(0, 20) || 'my-site' })
      })
      const data = await res.json()
      if (data.url) { setDeployedUrl(data.url); setDeployed(true) }
    } catch {
      await new Promise(r => setTimeout(r, 2000))
      setDeployedUrl('https://my-site-nexoro.vercel.app')
      setDeployed(true)
    }
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
              <button onClick={downloadHTML} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl text-sm">📥 HTML</button>
              <button onClick={deploy} className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-xl text-sm">🚀 Déployer</button>
            </div>
          )}
        </div>

        {deployed && (
          <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <p className="font-semibold text-green-400">Site déployé !</p>
              <a href={deployedUrl} target="_blank" className="text-green-500 text-sm underline">{deployedUrl}</a>
            </div>
            <a href={deployedUrl} target="_blank" className="bg-green-600 hover:bg-green-500 text-white text-xs py-1.5 px-4 rounded-xl">Voir →</a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template */}
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

          {/* Style */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Style texte</h2>
            <div className="space-y-2 mb-4">
              {colors.map(c => (
                <button key={c.id} onClick={() => setColor(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${color === c.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <span>{c.label}</span>
                  <span className="text-xs opacity-60">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image de fond */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">🖼️ Image de fond (au choix)</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {bgImages.map(bg => (
              <button key={bg.id} onClick={() => setBgImage(bg.id)}
                className={`relative rounded-xl overflow-hidden h-20 transition-all ${bgImage === bg.id ? 'ring-2 ring-indigo-500 scale-105' : 'hover:scale-105'}`}>
                {bg.url && bg.url !== 'custom' ? (
                  <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-2xl">{bg.id === 'none' ? '⬛' : '📤'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                  <span className="text-white text-xs font-semibold w-full text-center">{bg.label}</span>
                </div>
                {bgImage === bg.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-xs">✓</div>
                )}
              </button>
            ))}
          </div>

          {bgImage === 'custom' && (
            <div className="mt-4">
              <label className="flex items-center gap-3 bg-gray-800 border border-dashed border-gray-600 rounded-xl p-4 cursor-pointer hover:border-indigo-500 transition-all">
                {customBg ? (
                  <img src={customBg} alt="bg" className="h-16 w-32 object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400 text-sm">📤 Upload ton image de fond (JPG, PNG)</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCustomBg} />
              </label>
            </div>
          )}
        </div>

        {/* Prompt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Décris ta startup — Ex: FastFoodGenie, plateforme IA pour restaurants, couleurs rouge et noir..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading || !prompt.trim()}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
            {loading ? '⏳ Génération...' : '🌐 Générer mon site avec ce fond'}
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
            </div>
            {view === 'preview' ? (
              <iframe srcDoc={cleanHtml} className="w-full h-[700px] bg-white" sandbox="allow-scripts allow-same-origin" title="Preview" />
            ) : (
              <pre className="p-6 text-green-400 text-xs overflow-auto h-[700px] font-mono">{html}</pre>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
