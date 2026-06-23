'use client'
import { useState } from 'react'

export default function WhiteLabel() {
  const [config, setConfig] = useState({
    brandName: '',
    logo: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    domain: '',
    email: '',
    plan: 'agency'
  })
  const [saved, setSaved] = useState(false)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setConfig(prev => ({ ...prev, logo: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const save = () => {
    localStorage.setItem('nexoro_whitelabel', JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🏷️ White Label</h1>
          <p className="text-gray-500 mt-1">Personnalise Nexoro avec ta marque et revends-le à tes clients</p>
        </div>

        {/* Preview */}
        <div className="rounded-2xl overflow-hidden border border-gray-700">
          <div className="p-4 flex items-center gap-3" style={{ background: config.primaryColor }}>
            {config.logo
              ? <img src={config.logo} alt="logo" className="h-8 object-contain" />
              : <span className="text-2xl font-bold text-white">{config.brandName || '⚡ Votre Marque'}</span>
            }
            <span className="text-white/70 text-sm">AI Startup Factory</span>
          </div>
          <div className="bg-gray-900 p-6 text-center">
            <p className="text-gray-400 text-sm">Prévisualisation de votre marque blanche</p>
          </div>
        </div>

        {/* Config */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">🎨 Configuration marque</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nom de votre marque</label>
              <input value={config.brandName} onChange={e => setConfig(p => ({ ...p, brandName: e.target.value }))}
                placeholder="Ex: MyAgency AI"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Domaine custom</label>
              <input value={config.domain} onChange={e => setConfig(p => ({ ...p, domain: e.target.value }))}
                placeholder="app.votreagence.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Couleur principale</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={config.primaryColor}
                  onChange={e => setConfig(p => ({ ...p, primaryColor: e.target.value }))}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent" />
                <span className="text-gray-400 text-sm">{config.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Couleur secondaire</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={config.secondaryColor}
                  onChange={e => setConfig(p => ({ ...p, secondaryColor: e.target.value }))}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent" />
                <span className="text-gray-400 text-sm">{config.secondaryColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Logo</label>
            <label className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer hover:border-indigo-500 transition-all">
              {config.logo
                ? <img src={config.logo} alt="logo" className="h-8 object-contain" />
                : <span className="text-gray-400 text-sm">📤 Uploader votre logo</span>
              }
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email support</label>
            <input value={config.email} onChange={e => setConfig(p => ({ ...p, email: e.target.value }))}
              placeholder="support@votreagence.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          </div>

          <button onClick={save}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all">
            {saved ? '✅ Configuration sauvegardée !' : '💾 Sauvegarder la configuration'}
          </button>
        </div>

        {/* Info */}
        <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3">🏷️ White Label Agency — $199/mois</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2"><span className="text-green-400">✓</span> Votre logo et couleurs sur toute la plateforme</li>
            <li className="flex gap-2"><span className="text-green-400">✓</span> Domaine custom (app.votreagence.com)</li>
            <li className="flex gap-2"><span className="text-green-400">✓</span> Clients illimités sous votre marque</li>
            <li className="flex gap-2"><span className="text-green-400">✓</span> Nexoro invisible — votre marque uniquement</li>
            <li className="flex gap-2"><span className="text-green-400">✓</span> Revendez à $500+/mois par client</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
