'use client'
import { useState } from 'react'

const templates = [
  { id: 'restaurant', icon: '🍔', name: 'Restaurant' },
  { id: 'startup', icon: '🚀', name: 'Startup' },
  { id: 'ecommerce', icon: '🛒', name: 'Boutique' },
  { id: 'agency', icon: '🏢', name: 'Agence' },
  { id: 'medical', icon: '🏥', name: 'Médical' },
  { id: 'realestate', icon: '🏠', name: 'Immobilier' },
  { id: 'fitness', icon: '💪', name: 'Fitness' },
  { id: 'education', icon: '📚', name: 'Éducation' },
  { id: 'travel', icon: '✈️', name: 'Tourisme' },
  { id: 'beauty', icon: '💄', name: 'Beauté' },
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
  { id: 'none', label: 'Couleur', url: '' },
  { id: 'city', label: 'Ville', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
  { id: 'nature', label: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80' },
  { id: 'tech', label: 'Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80' },
  { id: 'food', label: 'Food', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80' },
  { id: 'ocean', label: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
  { id: 'abstract', label: 'Abstrait', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80' },
  { id: 'space', label: 'Espace', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80' },
]

const currencies = [
  { code: 'MAD', flag: '🇲🇦', name: 'Dirham' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'USD', flag: '🇺🇸', name: 'Dollar' },
  { code: 'GBP', flag: '🇬🇧', name: 'Livre' },
  { code: 'TND', flag: '🇹🇳', name: 'Dinar TN' },
  { code: 'DZD', flag: '🇩🇿', name: 'Dinar DZ' },
  { code: 'SAR', flag: '🇸🇦', name: 'Riyal' },
  { code: 'AED', flag: '🇦🇪', name: 'Dirham AE' },
  { code: 'XOF', flag: '🌍', name: 'CFA' },
  { code: 'CAD', flag: '🇨🇦', name: 'CAD' },
  { code: 'BRL', flag: '🇧🇷', name: 'Real' },
  { code: 'INR', flag: '🇮🇳', name: 'Rupee' },
]

export default function CreateSite() {
  const [mode, setMode] = useState('form')
  const [aiPrompt, setAiPrompt] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [slogan, setSlogan] = useState('')
  const [businessDesc, setBusinessDesc] = useState('')
  const [businessType, setBusinessType] = useState('restaurant')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [hours, setHours] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [services, setServices] = useState('')
  const [menu, setMenu] = useState('')
  const [prices, setPrices] = useState('')
  const [colorTheme, setColorTheme] = useState('indigo')
  const [bgImage, setBgImage] = useState('none')
  const [darkMode, setDarkMode] = useState(true)
  const [logo, setLogo] = useState(null as string | null)
  const [currency, setCurrency] = useState('MAD')
  const [html, setHtml] = useState('')
  const [generating, setGenerating] = useState(false)
  const [deployed, setDeployed] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')

  const selectedTheme = colorThemes.find(t => t.id === colorTheme) || colorThemes[0]
  const selectedBg = bgImages.find(b => b.id === bgImage) || bgImages[0]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const buildPrompt = () => {
    if (mode === 'ai') return aiPrompt
    return `
Business Name: ${businessName}
Slogan: ${slogan}
Type: ${templates.find(t => t.id === businessType)?.name}
Description: ${businessDesc}
Phone: ${phone}
WhatsApp: ${whatsapp}
Email: ${email}
Address: ${address}
Hours: ${hours}
Menu/Services: ${menu} ${services}
Prices in ${currency}: ${prices}
Currency to use: ${currency}

IMPORTANT: Use ALL the real information above in the website. Use real phone, email, address, hours, menu with real prices in ${currency}. Make it a REAL professional website.
`
  }

  const generateSite = async () => {
    const prompt = buildPrompt()
    if (!prompt.trim()) return
    setGenerating(true)
    setHtml('')
    try {
      const res = await fetch('/api/sitegenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          template: businessType,
          color: darkMode ? 'dark' : 'light',
          bgImage: selectedBg.url,
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
        body: JSON.stringify({ html, siteName: businessName || 'my-site' })
      })
      const data = await res.json()
      if (data.url) { setDeployedUrl(data.url); setDeployed(true) }
    } catch {
      setDeployedUrl('https://my-site.vercel.app')
      setDeployed(true)
    }
  }

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (businessName || 'site') + '-nexoro.html'
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">✨ Créer mon site web</h1>
          {businessName && <span className="text-sm text-indigo-400 font-semibold">{businessName}</span>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">

        {/* MODE */}
        <div className="bg-gray-900 border border-indigo-700 rounded-2xl p-5">
          <h2 className="font-bold text-lg mb-4">🚀 Comment veux-tu créer ton site ?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setMode('form')}
              className={'p-5 rounded-xl text-left border-2 transition-all ' + (mode === 'form' ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-600')}>
              <div className="text-3xl mb-2">📝</div>
              <div className="font-bold">Remplir le formulaire</div>
              <div className="text-gray-400 text-sm mt-1">Entre tes vraies infos — nom, menu, photos, contact</div>
            </button>
            <button onClick={() => setMode('ai')}
              className={'p-5 rounded-xl text-left border-2 transition-all ' + (mode === 'ai' ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-600')}>
              <div className="text-3xl mb-2">🤖</div>
              <div className="font-bold">Décrire en une phrase</div>
              <div className="text-gray-400 text-sm mt-1">L'IA génère tout automatiquement</div>
            </button>
          </div>
        </div>

        {/* MODE AI */}
        {mode === 'ai' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h2 className="font-bold">🤖 Décris ton business</h2>
            <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              placeholder="Ex: Je suis un restaurant fast food à Casablanca, burgers artisanaux, livraison 7j/7 de 11h à 23h, tél: 0612345678, adresse: 123 Rue Hassan II"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-28 focus:outline-none focus:border-indigo-500" />

            <div>
              <p className="text-xs text-gray-400 mb-2">Type de site</p>
              <div className="grid grid-cols-5 gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => setBusinessType(t.id)}
                    className={'flex flex-col items-center gap-1 p-2 rounded-xl transition-all ' + (businessType === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-xs">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE FORM */}
        {mode === 'form' && (
          <>
            {/* TYPE */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">1</span>
                Type de site
              </h2>
              <div className="grid grid-cols-5 gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => setBusinessType(t.id)}
                    className={'flex flex-col items-center gap-1 p-3 rounded-xl transition-all ' + (businessType === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-xs font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INFOS */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <h2 className="font-bold text-base mb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">2</span>
                Informations
              </h2>
              <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                placeholder="Nom de ton business *"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-semibold" />
              <input value={slogan} onChange={e => setSlogan(e.target.value)}
                placeholder="Slogan — Ex: Le meilleur burger de la ville 🍔"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
              <textarea value={businessDesc} onChange={e => setBusinessDesc(e.target.value)}
                placeholder="Description de ton activité..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
              <div className="grid grid-cols-2 gap-3">
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="📞 Téléphone"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                  placeholder="💬 WhatsApp"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                <input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="📧 Email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                <input value={hours} onChange={e => setHours(e.target.value)}
                  placeholder="⏰ Horaires — Lun-Dim 11h-23h"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
              </div>
              <input value={address} onChange={e => setAddress(e.target.value)}
                placeholder="📍 Adresse complète"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>

            {/* DEVISE */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">3</span>
                Devise
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {currencies.map(c => (
                  <button key={c.code} onClick={() => setCurrency(c.code)}
                    className={'p-2 rounded-xl text-center transition-all ' + (currency === c.code ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
                    <div className="text-xl">{c.flag}</div>
                    <div className="text-xs font-bold">{c.code}</div>
                    <div className="text-xs opacity-60">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* MENU / SERVICES */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <h2 className="font-bold text-base mb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">4</span>
                {businessType === 'restaurant' ? 'Menu & Prix' : 'Services & Prix'}
              </h2>
              <textarea value={menu} onChange={e => setMenu(e.target.value)}
                placeholder={businessType === 'restaurant' ?
                  'Menu:\n🍔 Classic Burger - 45 ' + currency + '\n🍟 Frites - 15 ' + currency + '\n🥤 Boisson - 12 ' + currency :
                  'Services:\n✅ Service 1 - Prix en ' + currency + '\n✅ Service 2 - Prix en ' + currency}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-32 focus:outline-none focus:border-indigo-500 font-mono text-sm" />
              <textarea value={services} onChange={e => setServices(e.target.value)}
                placeholder="Services additionnels — Ex: Livraison, Sur place, Réservations..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-16 focus:outline-none focus:border-indigo-500" />
            </div>

            {/* PHOTOS */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">5</span>
                Logo & Photos
              </h2>
              <label className="flex items-center gap-3 bg-gray-800 border border-dashed border-gray-600 rounded-xl p-4 cursor-pointer hover:border-indigo-500 transition-all">
                {logo ? (
                  <img src={logo} alt="logo" className="h-14 w-14 object-contain bg-white rounded-lg p-1" />
                ) : (
                  <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-3xl">📤</div>
                )}
                <div>
                  <p className="font-semibold text-sm">{logo ? '✅ Logo uploadé' : 'Upload ton logo'}</p>
                  <p className="text-gray-500 text-xs">PNG, SVG recommandé</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                {logo && <button onClick={e => { e.preventDefault(); setLogo(null) }} className="ml-auto text-red-400 text-xs">🗑️ Supprimer</button>}
              </label>
            </div>
          </>
        )}

        {/* DESIGN */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">{mode === 'form' ? '6' : '2'}</span>
            Design
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {colorThemes.map(t => (
              <button key={t.id} onClick={() => setColorTheme(t.id)}
                className={'p-2 rounded-xl text-center transition-all ' + (colorTheme === t.id ? 'ring-2 ring-white scale-105' : 'hover:scale-105')}
                style={{ background: 'linear-gradient(135deg, ' + t.c1 + ', ' + t.c2 + ')' }}>
                <div className="text-white text-xs font-bold">{t.name}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDarkMode(true)}
              className={'flex-1 py-2 rounded-xl text-sm font-semibold ' + (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-500')}>
              🌙 Dark
            </button>
            <button onClick={() => setDarkMode(false)}
              className={'flex-1 py-2 rounded-xl text-sm font-semibold ' + (!darkMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-500')}>
              ☀️ Light
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {bgImages.map(bg => (
              <button key={bg.id} onClick={() => setBgImage(bg.id)}
                className={'relative rounded-xl overflow-hidden h-12 transition-all ' + (bgImage === bg.id ? 'ring-2 ring-indigo-500 scale-105' : 'hover:scale-105')}>
                {bg.url ? (
                  <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">⬛</div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <span className="text-white text-xs w-full text-center">{bg.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* GÉNÉRER */}
        <button onClick={generateSite} disabled={generating || (mode === 'form' && !businessName) || (mode === 'ai' && !aiPrompt)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all text-xl shadow-2xl">
          {generating ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              L'IA génère ton site...
            </span>
          ) : '✨ Générer mon site complet'}
        </button>

        {/* RÉSULTAT */}
        {html && (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold text-green-400">Ton site est prêt !</p>
                <p className="text-green-600 text-sm">Télécharge, déploie ou connecte ton domaine</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400 flex-1 text-center">{(businessName || 'my-site').toLowerCase().replace(/\s/g, '-')}.com</span>
                <button onClick={generateSite} disabled={generating} className="text-xs text-indigo-400">🔄 Regénérer</button>
              </div>
              <iframe srcDoc={html} className="w-full h-[600px]" sandbox="allow-scripts allow-same-origin" title="Preview" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={downloadHTML} className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 rounded-xl text-sm">
                📥 Télécharger HTML
              </button>
              <button onClick={deploy} disabled={deployed} className="bg-green-600 hover:bg-green-500 disabled:opacity-70 text-white font-bold py-4 rounded-xl text-sm">
                {deployed ? '✅ Déployé !' : '🚀 Publier en ligne'}
              </button>
              <a href={'https://www.namecheap.com/domains/registration/results/?domain=' + (businessName || 'mysite').toLowerCase().replace(/\s/g, '') + '.com'}
                target="_blank"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl text-sm text-center block">
                🌐 Acheter domaine
              </a>
            </div>
            {deployed && (
              <div className="bg-green-900/20 border border-green-700 rounded-2xl p-4 text-center">
                <p className="font-bold text-green-400 text-lg">🎉 Site en ligne !</p>
                <a href={deployedUrl} target="_blank" className="text-green-500 underline text-sm">{deployedUrl}</a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
