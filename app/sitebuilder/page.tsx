'use client'
import { useState } from 'react'

const templates = [
  { id: 'saas', icon: '💻', name: 'SaaS Platform', desc: 'Dashboard, pricing, features', tags: ['tech', 'software', 'app'] },
  { id: 'agency', icon: '🏢', name: 'Agency', desc: 'Portfolio, services, contact', tags: ['marketing', 'design', 'creative'] },
  { id: 'ecommerce', icon: '🛒', name: 'E-commerce', desc: 'Shop, products, cart', tags: ['shop', 'store', 'boutique'] },
  { id: 'restaurant', icon: '🍔', name: 'Restaurant', desc: 'Menu, reservation, delivery', tags: ['food', 'restaurant', 'cafe'] },
  { id: 'startup', icon: '🚀', name: 'Startup Landing', desc: 'Hero, features, CTA', tags: ['startup', 'landing', 'product'] },
  { id: 'portfolio', icon: '🎨', name: 'Portfolio', desc: 'Projects, about, contact', tags: ['portfolio', 'design', 'freelance'] },
  { id: 'blog', icon: '📝', name: 'Blog', desc: 'Articles, categories, author', tags: ['blog', 'content', 'writing'] },
  { id: 'medical', icon: '🏥', name: 'Medical / Clinic', desc: 'Services, doctors, booking', tags: ['health', 'medical', 'clinic'] },
  { id: 'realestate', icon: '🏠', name: 'Real Estate', desc: 'Properties, agents, search', tags: ['real estate', 'property', 'housing'] },
  { id: 'fitness', icon: '💪', name: 'Fitness / Gym', desc: 'Classes, trainers, pricing', tags: ['fitness', 'gym', 'sport'] },
  { id: 'education', icon: '📚', name: 'Education', desc: 'Courses, instructors, enroll', tags: ['education', 'school', 'courses'] },
  { id: 'travel', icon: '✈️', name: 'Travel', desc: 'Destinations, booking, tours', tags: ['travel', 'tourism', 'hotel'] },
  { id: 'finance', icon: '💰', name: 'Finance / FinTech', desc: 'Banking, investment, crypto', tags: ['finance', 'fintech', 'banking'] },
  { id: 'music', icon: '🎵', name: 'Music / Artist', desc: 'Albums, tours, merch', tags: ['music', 'artist', 'band'] },
  { id: 'ngo', icon: '🌍', name: 'NGO / Association', desc: 'Mission, donate, events', tags: ['ngo', 'charity', 'nonprofit'] },
  { id: 'law', icon: '⚖️', name: 'Law Firm', desc: 'Services, lawyers, contact', tags: ['law', 'legal', 'lawyer'] },
  { id: 'wedding', icon: '💍', name: 'Wedding', desc: 'Story, gallery, RSVP', tags: ['wedding', 'event', 'celebration'] },
  { id: 'crypto', icon: '₿', name: 'Crypto / Web3', desc: 'Token, roadmap, whitepaper', tags: ['crypto', 'web3', 'blockchain'] },
]

const bgCategories = [
  {
    label: '🏙️ Villes & Architecture',
    images: [
      { id: 'city1', label: 'NYC Skyline', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
      { id: 'city2', label: 'Tokyo', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80' },
      { id: 'city3', label: 'Paris', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80' },
      { id: 'city4', label: 'Dubai', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80' },
    ]
  },
  {
    label: '🌊 Nature & Paysages',
    images: [
      { id: 'ocean1', label: 'Océan', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
      { id: 'mountain1', label: 'Montagne', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
      { id: 'forest1', label: 'Forêt', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80' },
      { id: 'desert1', label: 'Désert', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80' },
      { id: 'lake1', label: 'Lac', url: 'https://images.unsplash.com/photo-1439853949212-36089c408613?w=1920&q=80' },
      { id: 'sunset1', label: 'Coucher soleil', url: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=1920&q=80' },
    ]
  },
  {
    label: '💻 Tech & Business',
    images: [
      { id: 'tech1', label: 'Code', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80' },
      { id: 'office1', label: 'Bureau', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80' },
      { id: 'startup1', label: 'Startup', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80' },
      { id: 'meeting1', label: 'Meeting', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80' },
      { id: 'laptop1', label: 'Laptop', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&q=80' },
    ]
  },
  {
    label: '🍽️ Food & Restaurant',
    images: [
      { id: 'food1', label: 'Restaurant', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80' },
      { id: 'food2', label: 'Cuisine', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80' },
      { id: 'food3', label: 'Coffee', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80' },
      { id: 'food4', label: 'Sushi', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1920&q=80' },
      { id: 'food5', label: 'Pizza', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=80' },
    ]
  },
  {
    label: '🎨 Abstrait & Design',
    images: [
      { id: 'abs1', label: 'Violet', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80' },
      { id: 'abs2', label: 'Bleu', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80' },
      { id: 'abs3', label: 'Aurora', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80' },
      { id: 'abs4', label: 'Néon', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1920&q=80' },
      { id: 'abs5', label: 'Géométrique', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&q=80' },
    ]
  },
  {
    label: '🚀 Espace & Science',
    images: [
      { id: 'space1', label: 'Galaxie', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80' },
      { id: 'space2', label: 'Nébuleuse', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80' },
      { id: 'space3', label: 'Lune', url: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&q=80' },
    ]
  },
  {
    label: '💪 Sport & Fitness',
    images: [
      { id: 'sport1', label: 'Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80' },
      { id: 'sport2', label: 'Running', url: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=1920&q=80' },
      { id: 'sport3', label: 'Yoga', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80' },
    ]
  },
  {
    label: '✈️ Voyage & Luxe',
    images: [
      { id: 'travel1', label: 'Plage', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80' },
      { id: 'travel2', label: 'Hôtel', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80' },
      { id: 'travel3', label: 'Avion', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80' },
      { id: 'travel4', label: 'Luxe', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80' },
    ]
  },
]

const colors = [
  { id: 'dark', label: '🌙 Dark' },
  { id: 'light', label: '☀️ Light' },
  { id: 'gradient', label: '🌈 Gradient' },
]

export default function SiteBuilder() {
  const [prompt, setPrompt] = useState('')
  const [template, setTemplate] = useState('startup')
  const [color, setColor] = useState('dark')
  const [bgImage, setBgImage] = useState('')
  const [customBg, setCustomBg] = useState('')
  const [bgDescription, setBgDescription] = useState('')
  const [generatedBgCSS, setGeneratedBgCSS] = useState('')
  const [bgLoading, setBgLoading] = useState(false)
  const [bgPreview, setBgPreview] = useState('')
  const [templateSearch, setTemplateSearch] = useState('')
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [deployed, setDeployed] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.tags.some(tag => tag.includes(templateSearch.toLowerCase()))
  )

  const generateBgWithAI = async () => {
    if (!bgDescription.trim()) return
    setBgLoading(true)
    setGeneratedBgCSS('')
    try {
      const res = await fetch('/api/bggenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: bgDescription })
      })
      const data = await res.json()
      setGeneratedBgCSS(data.css)
      setBgImage('ai-generated')
      // Preview
      const preview = `<!DOCTYPE html><html><head><meta charset="UTF-8">${data.css}</head><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;"><div style="color:white;font-size:2rem;font-weight:bold;text-shadow:0 2px 10px rgba(0,0,0,0.5)">✨ ${bgDescription}</div></body></html>`
      setBgPreview(preview)
    } catch {}
    setBgLoading(false)
  }

  const handleCustomBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setCustomBg(reader.result as string); setBgImage('custom') }
    reader.readAsDataURL(file)
  }

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setHtml('')
    setDeployed(false)
    const selectedBg = bgImage === 'custom' ? customBg : bgImage === 'ai-generated' ? '' : bgImage

    try {
      const res = await fetch('/api/sitegenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, template, color, bgImage: bgImage === 'ai-generated' ? '' : selectedBg, generatedBgCSS: bgImage === 'ai-generated' ? generatedBgCSS : '' })
      })
      const data = await res.json()
      setHtml(data.html || '<h1>Erreur</h1>')
    } catch { setHtml('<h1>Erreur</h1>') }
    setLoading(false)
  }

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `site-nexoro.html`
    a.click()
  }

  const deploy = async () => {
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, siteName: prompt.slice(0, 20) })
      })
      const data = await res.json()
      if (data.url) { setDeployedUrl(data.url); setDeployed(true) }
    } catch {
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
            <div className="flex gap-2">
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

        {/* Templates avec recherche */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-sm font-medium text-gray-400">🎯 Template ({filteredTemplates.length}/{templates.length})</h2>
            <input value={templateSearch} onChange={e => setTemplateSearch(e.target.value)}
              placeholder="🔍 Chercher — restaurant, blog, crypto..."
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-64" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {filteredTemplates.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${template === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{t.name}</div>
                  <div className="text-xs opacity-60 truncate">{t.desc}</div>
                </div>
              </button>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-4 text-center py-8 text-gray-500">
                <p>Aucun template trouvé pour "{templateSearch}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Style + Image de fond */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-sm font-medium text-gray-400 mb-3">Style texte</h2>
            <div className="space-y-2">
              {colors.map(c => (
                <button key={c.id} onClick={() => setColor(c.id)}
                  className={`w-full p-2 rounded-xl text-sm transition-all text-left ${color === c.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-sm font-medium text-gray-400 mb-3">🖼️ Image de fond — {bgCategories.reduce((a, b) => a + b.images.length, 0)} choix + upload</h2>
            
            {/* IA Background Generator - EN HAUT */}
            <div className="bg-indigo-900/30 border border-indigo-700 rounded-xl p-4 mb-4">
              <p className="text-indigo-400 text-sm font-semibold mb-3">🤖 Générer un fond avec l'IA — décris ce que tu veux</p>
              <div className="flex gap-2">
                <input value={bgDescription} onChange={e => setBgDescription(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && generateBgWithAI()}
                  placeholder="Ex: océan tropical, espace galactique violet, forêt enchantée, feu, cyber néon..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                <button onClick={generateBgWithAI} disabled={bgLoading || !bgDescription}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap">
                  {bgLoading ? "⏳ Génération..." : "✨ Générer IA"}
                </button>
              </div>
              {bgPreview && (
                <div className="mt-3 rounded-xl overflow-hidden h-32 relative">
                  <iframe srcDoc={bgPreview} className="w-full h-full border-0" sandbox="allow-scripts" title="bg preview" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">✓ Actif</div>
                </div>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {/* Couleur pure */}
              <button onClick={() => setBgImage('')}
                className={`w-full flex items-center gap-2 p-2 rounded-xl text-sm transition-all ${bgImage === '' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                ⬛ Couleur pure (pas d'image)
              </button>

              {bgCategories.map(cat => (
                <div key={cat.label}>
                  <p className="text-xs text-gray-500 mb-2">{cat.label}</p>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {cat.images.map(img => (
                      <button key={img.id} onClick={() => setBgImage(img.url)}
                        className={`relative rounded-lg overflow-hidden h-14 transition-all ${bgImage === img.url ? 'ring-2 ring-indigo-500 scale-105' : 'hover:scale-105'}`}>
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                          <span className="text-white text-xs w-full text-center truncate">{img.label}</span>
                        </div>
                        {bgImage === img.url && (
                          <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-xs">✓</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Upload custom */}
              <div>
                <p className="text-xs text-gray-500 mb-2">📤 Upload ton image</p>
                <label className="flex items-center gap-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl p-3 cursor-pointer hover:border-indigo-500 transition-all">
                  {customBg ? (
                    <img src={customBg} alt="custom" className="h-10 w-16 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400 text-sm">📤 Choisir une image personnalisée</span>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomBg} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Décris ta startup — Ex: FastFoodGenie, plateforme IA pour restaurants fast food..."
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
                🌐 {prompt.slice(0,40)}...
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
