'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, icon: '📝', title: 'Ton business', desc: 'Décris ton activité' },
  { id: 2, icon: '🎨', title: 'Design', desc: 'Template & couleurs' },
  { id: 3, icon: '🖼️', title: 'Visuels', desc: 'Logo & images' },
  { id: 4, icon: '✨', title: 'Génération', desc: 'IA crée ton site' },
  { id: 5, icon: '✏️', title: 'Édition', desc: 'Modifier le contenu' },
  { id: 6, icon: '🚀', title: 'Publication', desc: 'Mettre en ligne' },
  { id: 7, icon: '🌐', title: 'Domaine', desc: 'Ton adresse web' },
  { id: 8, icon: '📊', title: 'Analytics', desc: 'Suivi des visites' },
]

const templates = [
  { id: 'restaurant', icon: '🍔', name: 'Restaurant / Café', desc: 'Menu, réservations, livraison' },
  { id: 'startup', icon: '🚀', name: 'Startup / SaaS', desc: 'Landing page, pricing, features' },
  { id: 'ecommerce', icon: '🛒', name: 'Boutique en ligne', desc: 'Produits, panier, paiement' },
  { id: 'agency', icon: '🏢', name: 'Agence / Studio', desc: 'Portfolio, services, contact' },
  { id: 'medical', icon: '🏥', name: 'Médical / Clinique', desc: 'Services, médecins, rendez-vous' },
  { id: 'realestate', icon: '🏠', name: 'Immobilier', desc: 'Propriétés, agents, recherche' },
  { id: 'fitness', icon: '💪', name: 'Fitness / Sport', desc: 'Cours, tarifs, inscription' },
  { id: 'education', icon: '📚', name: 'Éducation', desc: 'Cours, formateurs, inscription' },
  { id: 'travel', icon: '✈️', name: 'Tourisme / Hôtel', desc: 'Destinations, chambres, booking' },
  { id: 'law', icon: '⚖️', name: 'Cabinet juridique', desc: 'Services, avocats, contact' },
  { id: 'beauty', icon: '💄', name: 'Beauté / Spa', desc: 'Services, équipe, réservation' },
  { id: 'construction', icon: '🏗️', name: 'BTP / Construction', desc: 'Projets, services, devis' },
]

const colorThemes = [
  { id: 'indigo', name: 'Indigo', c1: '#6366f1', c2: '#8b5cf6' },
  { id: 'emerald', name: 'Emerald', c1: '#10b981', c2: '#059669' },
  { id: 'rose', name: 'Rose', c1: '#f43f5e', c2: '#e11d48' },
  { id: 'amber', name: 'Amber', c1: '#f59e0b', c2: '#d97706' },
  { id: 'cyan', name: 'Cyan', c1: '#06b6d4', c2: '#0891b2' },
  { id: 'orange', name: 'Orange', c1: '#f97316', c2: '#ea580c' },
]

const bgImages = [
  { id: 'none', label: '⬛ Couleur', url: '' },
  { id: 'city', label: '🌆 Ville', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
  { id: 'nature', label: '🌿 Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80' },
  { id: 'tech', label: '💻 Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80' },
  { id: 'food', label: '🍽️ Food', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80' },
  { id: 'ocean', label: '🌊 Océan', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
  { id: 'abstract', label: '🎨 Abstrait', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80' },
  { id: 'space', label: '🚀 Espace', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80' },
]

export default function CreateSite() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [businessDesc, setBusinessDesc] = useState('')
  const [businessType, setBusinessType] = useState('restaurant')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [colorTheme, setColorTheme] = useState('indigo')
  const [bgImage, setBgImage] = useState('none')
  const [darkMode, setDarkMode] = useState(true)
  const [logo, setLogo] = useState<string | null>(null)
  const [html, setHtml] = useState('')
  const [generating, setGenerating] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')
  const [bgAiDesc, setBgAiDesc] = useState('')
  const [bgAiLoading, setBgAiLoading] = useState(false)
  const [bgAiCSS, setBgAiCSS] = useState('')

  const selectedTheme = colorThemes.find(t => t.id === colorTheme)!
  const selectedBg = bgImages.find(b => b.id === bgImage)!
  const selectedTemplate = templates.find(t => t.id === businessType)!

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const generateBgAI = async () => {
    if (!bgAiDesc) return
    setBgAiLoading(true)
    try {
      const res = await fetch('/api/bggenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: bgAiDesc })
      })
      const data = await res.json()
      setBgAiCSS(data.css)
      setBgImage('ai')
    } catch {}
    setBgAiLoading(false)
  }

  const generateSite = async () => {
    setGenerating(true)
    setHtml('')
    try {
      const prompt = `${businessName} — ${businessDesc}. Type: ${selectedTemplate.name}. Phone: ${phone}. Address: ${address}.`
      const res = await fetch('/api/sitegenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          template: businessType,
          color: darkMode ? 'dark' : 'light',
          bgImage: selectedBg.url,
          generatedBgCSS: bgAiCSS,
          colorTheme: selectedTheme,
          logo,
        })
      })
      const data = await res.json()
      setHtml(data.html || '')
    } catch {}
    setGenerating(false)
  }

  const deploy = async () => {
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, siteName: businessName })
      })
      const data = await res.json()
      if (data.url) { setDeployedUrl(data.url); setDeployed(true) }
    } catch {
      setDeployedUrl(`https://${businessName.toLowerCase().replace(/\s/g, '-')}.nexoro.app`)
      setDeployed(true)
    }
  }

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${businessName}-site.html`
    a.click()
  }

  const next = () => {
    if (currentStep === 4 && !html) { generateSite(); }
    if (currentStep < 8) setCurrentStep(prev => prev + 1)
  }
  const prev = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1) }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header progress */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {steps.map(step => (
              <button key={step.id} onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${currentStep === step.id ? 'bg-indigo-600 text-white' : currentStep > step.id ? 'bg-green-900/30 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
                {currentStep > step.id ? '✅' : step.icon}
                <span className="hidden md:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Step 1 — Business Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">📝 Parle-moi de ton business</h1>
              <p className="text-gray-500 mt-1">Ces infos seront utilisées pour créer tout le contenu de ton site</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Nom de ton business *</label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                  placeholder="Ex: FastFoodGenie, Café du Marché, Studio Pixel..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-lg font-semibold" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Décris ton activité *</label>
                <textarea value={businessDesc} onChange={e => setBusinessDesc(e.target.value)}
                  placeholder="Ex: Restaurant fast food spécialisé en burgers artisanaux et sushis fusion, livraison 7j/7, ouvert depuis 2020..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-28 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Téléphone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Adresse</label>
                  <input value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="123 Rue de Paris, 75001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Type de site *</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {templates.map(t => (
                  <button key={t.id} onClick={() => setBusinessType(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${businessType === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <div className="text-xs font-semibold">{t.name}</div>
                      <div className="text-xs opacity-60">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Design */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">🎨 Design de ton site</h1>
              <p className="text-gray-500 mt-1">Choisis les couleurs, le style et l'image de fond</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Couleur principale</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colorThemes.map(t => (
                  <button key={t.id} onClick={() => setColorTheme(t.id)}
                    className={`p-4 rounded-xl transition-all text-center ${colorTheme === t.id ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`}
                    style={{ background: `linear-gradient(135deg, ${t.c1}, ${t.c2})` }}>
                    <div className="text-white text-xs font-bold">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-400">Style</h2>
                <div className="flex gap-2">
                  <button onClick={() => setDarkMode(true)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${darkMode ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
                    🌙 Dark
                  </button>
                  <button onClick={() => setDarkMode(false)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${!darkMode ? 'bg-white text-gray-900' : 'text-gray-500'}`}>
                    ☀️ Light
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Image de fond</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
                {bgImages.map(bg => (
                  <button key={bg.id} onClick={() => setBgImage(bg.id)}
                    className={`relative rounded-xl overflow-hidden h-14 transition-all ${bgImage === bg.id ? 'ring-2 ring-indigo-500 scale-105' : 'hover:scale-105'}`}>
                    {bg.url ? (
                      <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs">⬛</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                      <span className="text-white text-xs w-full text-center">{bg.label}</span>
                    </div>
                    {bgImage === bg.id && <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-xs">✓</div>}
                  </button>
                ))}
              </div>

              <div className="bg-indigo-900/30 border border-indigo-700 rounded-xl p-4">
                <p className="text-indigo-400 text-sm font-semibold mb-2">🤖 Générer un fond avec l'IA</p>
                <div className="flex gap-2">
                  <input value={bgAiDesc} onChange={e => setBgAiDesc(e.target.value)}
                    placeholder="Ex: océan tropical, forêt magique, espace galactique..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                  <button onClick={generateBgAI} disabled={bgAiLoading || !bgAiDesc}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap">
                    {bgAiLoading ? '⏳' : '✨ Générer'}
                  </button>
                </div>
                {bgAiCSS && bgImage === 'ai' && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-400 text-xs">Fond IA actif — "{bgAiDesc}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Logo & Images */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">🖼️ Logo & Images</h1>
              <p className="text-gray-500 mt-1">Upload ton logo ou génère-en un avec l'IA</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Logo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition-all">
                  {logo ? (
                    <img src={logo} alt="logo" className="h-20 object-contain" />
                  ) : (
                    <>
                      <div className="text-4xl mb-3">📤</div>
                      <p className="text-gray-400 text-sm">Upload ton logo</p>
                      <p className="text-gray-600 text-xs mt-1">PNG, SVG recommandé</p>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-6">
                  <div className="text-4xl mb-3">✨</div>
                  <p className="text-gray-300 font-semibold text-sm mb-2">Générer avec l'IA</p>
                  <p className="text-gray-500 text-xs text-center mb-4">L'IA génère 4 logos basés sur le nom de ton business</p>
                  <button onClick={() => router.push('/logo')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 px-6 rounded-xl transition-all">
                    Ouvrir Logo Generator →
                  </button>
                </div>
              </div>
              {logo && (
                <button onClick={() => setLogo(null)}
                  className="mt-3 text-red-400 text-sm hover:text-red-300">
                  🗑️ Supprimer le logo
                </button>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Images pour ton site</h2>
              <p className="text-gray-500 text-sm mb-4">Tu peux générer des images personnalisées pour ton site avec notre IA</p>
              <button onClick={() => router.push('/imagegen')}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-6 rounded-xl transition-all">
                🖼️ Ouvrir Image Generator →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Génération */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">✨ Génération du site</h1>
              <p className="text-gray-500 mt-1">L'IA crée ton site complet en 30 secondes</p>
            </div>

            {/* Résumé */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
              <h2 className="text-sm font-medium text-gray-400">Récapitulatif</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Business</p>
                  <p className="font-semibold">{businessName || '—'}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-semibold">{selectedTemplate.icon} {selectedTemplate.name}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Couleur</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-4 rounded-full" style={{ background: selectedTheme.c1 }}></div>
                    <p className="font-semibold">{selectedTheme.name}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Style</p>
                  <p className="font-semibold">{darkMode ? '🌙 Dark' : '☀️ Light'}</p>
                </div>
              </div>
            </div>

            {!html ? (
              <button onClick={generateSite} disabled={generating || !businessName}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-6 rounded-2xl transition-all text-xl">
                {generating ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    L'IA génère ton site...
                  </span>
                ) : '✨ Générer mon site maintenant'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <p className="font-semibold text-green-400">Site généré avec succès !</p>
                    <p className="text-green-600 text-sm">Clique sur Suivant pour voir et modifier ton site</p>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-3 border-b border-gray-800 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400">{businessName}.nexoro.app</span>
                  </div>
                  <iframe srcDoc={html} className="w-full h-96" sandbox="allow-scripts allow-same-origin" title="Preview" />
                </div>
                <button onClick={generateSite} disabled={generating}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-all text-sm">
                  🔄 Regénérer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 5 — Édition */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">✏️ Modifier ton site</h1>
              <p className="text-gray-500 mt-1">Personnalise chaque section de ton site</p>
            </div>
            {html ? (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-400">{businessName}.nexoro.app</span>
                    <button onClick={downloadHTML} className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg">
                      📥 HTML
                    </button>
                  </div>
                  <iframe srcDoc={html} className="w-full h-[600px]" sandbox="allow-scripts allow-same-origin" title="Site Preview" />
                </div>
                <button onClick={() => router.push('/siteeditor')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl">
                  ✏️ Ouvrir l'éditeur avancé →
                </button>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">⚠️ Génère d'abord ton site à l'étape 4</p>
                <button onClick={() => setCurrentStep(4)} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl">
                  ← Retour à la génération
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 6 — Publication */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">🚀 Publier ton site</h1>
              <p className="text-gray-500 mt-1">Mets ton site en ligne en 1 clic</p>
            </div>
            {deployed ? (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h2 className="text-xl font-bold text-green-400">Site publié !</h2>
                  <a href={deployedUrl} target="_blank" className="text-green-500 underline block mt-2">{deployedUrl}</a>
                </div>
                <a href={deployedUrl} target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all">
                  🌐 Voir mon site en ligne →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                    <span className="text-3xl">⚡</span>
                    <div>
                      <p className="font-semibold">Déploiement Vercel</p>
                      <p className="text-gray-400 text-sm">URL: {businessName.toLowerCase().replace(/\s/g, '-')}.vercel.app</p>
                    </div>
                    <span className="ml-auto text-green-400 text-xs font-semibold bg-green-900/30 px-3 py-1 rounded-full">Gratuit</span>
                  </div>
                </div>
                <button onClick={deploy} disabled={!html}
                  className="w-full bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-6 rounded-2xl transition-all text-xl">
                  🚀 Publier maintenant
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 7 — Domaine */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">🌐 Ton domaine</h1>
              <p className="text-gray-500 mt-1">Achète ton adresse web professionnelle</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Domaine suggéré pour ton business :</p>
                <div className="space-y-2">
                  {['.com', '.fr', '.io', '.app'].map(ext => (
                    <div key={ext} className="flex items-center justify-between bg-gray-700 rounded-xl p-3">
                      <span className="font-mono font-semibold">{businessName.toLowerCase().replace(/\s/g, '')}{ext}</span>
                      <a href={`https://www.namecheap.com/domains/registration/results/?domain=${businessName.toLowerCase().replace(/\s/g, '')}${ext}`}
                        target="_blank"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 px-4 rounded-lg transition-all">
                        Acheter →
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">⚙️ Configuration DNS Vercel</p>
                <div className="font-mono text-xs space-y-2 text-green-400">
                  <div className="flex gap-4"><span className="w-16 text-gray-400">Type</span><span className="w-16 text-gray-400">Name</span><span className="text-gray-400">Value</span></div>
                  <div className="flex gap-4"><span className="w-16">A</span><span className="w-16">@</span><span>76.76.21.21</span></div>
                  <div className="flex gap-4"><span className="w-16">CNAME</span><span className="w-16">www</span><span>cname.vercel-dns.com</span></div>
                </div>
              </div>

              <button onClick={() => router.push('/domains')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl">
                🌐 Ouvrir Domain Manager →
              </button>
            </div>
          </div>
        )}

        {/* Step 8 — Analytics */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">📊 Analytics</h1>
              <p className="text-gray-500 mt-1">Suis les visites et performances de ton site</p>
            </div>

            {deployed && (
              <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="font-semibold text-green-400">Ton site est en ligne !</p>
                  <a href={deployedUrl} target="_blank" className="text-green-500 text-sm underline">{deployedUrl}</a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Visites', value: '0', icon: '👁️', color: 'text-blue-400' },
                { label: 'Clics', value: '0', icon: '🖱️', color: 'text-green-400' },
                { label: 'Contacts', value: '0', icon: '📧', color: 'text-purple-400' },
                { label: 'Score SEO', value: '—', icon: '🔍', color: 'text-orange-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold">Félicitations !</h2>
              <p className="text-gray-400">Ton site <strong className="text-white">{businessName}</strong> est complet et en ligne !</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {deployed && <a href={deployedUrl} target="_blank" className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-xl">🌐 Voir mon site</a>}
                <button onClick={downloadHTML} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl">📥 Télécharger HTML</button>
                <button onClick={() => router.push('/seo')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl">🔍 Optimiser SEO</button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-gray-800">
          {currentStep > 1 && (
            <button onClick={prev} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all">
              ← Retour
            </button>
          )}
          {currentStep < 8 && (
            <button onClick={next}
              disabled={currentStep === 1 && !businessName}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
              {currentStep === 4 && !html ? '✨ Générer mon site →' : 'Suivant →'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
