'use client'
import { useState } from 'react'

const logoStyles = [
  { id: 'modern', label: '⚡ Modern', prompt: 'modern minimalist logo, clean lines, vector style, professional' },
  { id: 'luxury', label: '💎 Luxury', prompt: 'luxury premium logo, gold, elegant, sophisticated brand identity' },
  { id: 'tech', label: '🤖 Tech', prompt: 'tech startup logo, futuristic, digital, circuit, neon' },
  { id: 'playful', label: '🎮 Playful', prompt: 'playful colorful logo, fun, vibrant, cartoon style' },
  { id: 'nature', label: '🌿 Nature', prompt: 'organic nature logo, green, eco, leaf, natural' },
  { id: 'bold', label: '💪 Bold', prompt: 'bold strong logo, geometric, powerful, impactful' },
  { id: '3d', label: '🎯 3D', prompt: '3D logo, dimensional, glossy, modern 3d render' },
  { id: 'vintage', label: '🎨 Vintage', prompt: 'vintage retro logo, classic, timeless, badge style' },
]

const colorSchemes = [
  { id: 'blue', label: '🔵 Bleu', colors: 'blue and white' },
  { id: 'gold', label: '🟡 Or', colors: 'gold and black' },
  { id: 'green', label: '🟢 Vert', colors: 'green and white' },
  { id: 'red', label: '🔴 Rouge', colors: 'red and white' },
  { id: 'purple', label: '🟣 Violet', colors: 'purple and white' },
  { id: 'orange', label: '🟠 Orange', colors: 'orange and dark' },
  { id: 'black', label: '⚫ Noir', colors: 'black and white' },
  { id: 'multicolor', label: '🌈 Multi', colors: 'multicolor gradient' },
]

export default function LogoGenerator() {
  const [brand, setBrand] = useState('')
  const [slogan, setSlogan] = useState('')
  const [style, setStyle] = useState('modern')
  const [colorScheme, setColorScheme] = useState('blue')
  const [logos, setLogos] = useState<{url: string, loaded: boolean}[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
  const [tab, setTab] = useState<'generate' | 'upload'>('generate')

  const generate = () => {
    if (!brand.trim()) return
    setLoading(true)
    setLogos([])

    const selectedStyle = logoStyles.find(s => s.id === style)?.prompt || ''
    const selectedColors = colorSchemes.find(c => c.id === colorScheme)?.colors || 'blue and white'

    const fullPrompt = encodeURIComponent(
      `${brand} company logo, ${selectedStyle}, ${selectedColors} colors, white background, centered, no text except brand name, high quality vector logo design`
    )

    const seeds = [Math.floor(Math.random() * 10000), Math.floor(Math.random() * 10000) + 10000, Math.floor(Math.random() * 10000) + 20000, Math.floor(Math.random() * 10000) + 30000]
    const variations = [
      'minimalist flat design',
      'gradient colorful modern',
      '3D dimensional glossy',
      'geometric abstract shape'
    ]
    const newLogos = seeds.map((seed, i) => ({
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(`${brand} logo ${variations[i]}, ${selectedStyle}, ${selectedColors} colors, white background, centered, professional`)  }?width=512&height=512&seed=${seed}&nologo=true`,
      loaded: false
    }))

    setLogos(newLogos)
    setLoading(false)
  }

  const markLoaded = (i: number) => {
    setLogos(prev => prev.map((img, idx) => idx === i ? { ...img, loaded: true } : img))
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const download = (url: string) => window.open(url, '_blank')

  const saveLogo = (url: string) => {
    localStorage.setItem('nexoro_logo', url)
    alert('✅ Logo sauvegardé ! Disponible dans Studio et Site Editor.')
  }

  const saveUploadedLogo = () => {
    if (uploadedLogo) {
      localStorage.setItem('nexoro_logo', uploadedLogo)
      alert('✅ Logo uploadé et sauvegardé !')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">✨ Logo Generator</h1>
          <p className="text-gray-500 mt-1">Génère ou uploade le logo parfait pour ta startup</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setTab('generate')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${tab === 'generate' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            🤖 Générer avec IA
          </button>
          <button onClick={() => setTab('upload')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${tab === 'upload' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            📤 Uploader mon logo
          </button>
        </div>

        {tab === 'generate' ? (
          <>
            {/* Brand info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nom de la marque *</label>
                <input value={brand} onChange={e => setBrand(e.target.value)}
                  placeholder="Ex: Nexoro, FastBite, TechFlow..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Secteur / Description (optionnel)</label>
                <input value={slogan} onChange={e => setSlogan(e.target.value)}
                  placeholder="Ex: startup IA, restaurant fast food, agence marketing..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            {/* Style */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Style du logo</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {logoStyles.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${style === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Couleurs</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {colorSchemes.map(c => (
                  <button key={c.id} onClick={() => setColorScheme(c.id)}
                    className={`p-2 rounded-xl text-xs font-medium transition-all text-center ${colorScheme === c.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={!brand.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
              ✨ Générer 4 logos IA
            </button>

            {/* Logo results */}
            {logos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  <p className="text-yellow-400 text-sm">Génération en cours — patiente 10-30 secondes par logo...</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {logos.map((logo, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                      <div className="bg-white p-4 flex items-center justify-center min-h-48">
                        {!logo.loaded && (
                          <div className="text-center space-y-2">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-400 text-xs">Logo {i+1}...</p>
                          </div>
                        )}
                        <img src={logo.url} alt={`Logo ${i+1}`}
                          className={`max-h-48 max-w-full object-contain transition-all ${logo.loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                          onLoad={() => markLoaded(i)} onError={() => markLoaded(i)} />
                      </div>
                      {logo.loaded && (
                        <div className="p-3 flex gap-2">
                          <button onClick={() => download(logo.url)}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 rounded-xl">
                            📥 Télécharger
                          </button>
                          <button onClick={() => saveLogo(logo.url)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-xl">
                            ✅ Utiliser
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Upload tab */
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">📤 Uploader ton logo</h2>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-12 cursor-pointer hover:border-indigo-500 transition-all">
                {uploadedLogo ? (
                  <img src={uploadedLogo} alt="logo" className="max-h-48 object-contain" />
                ) : (
                  <>
                    <div className="text-5xl mb-4">🖼️</div>
                    <p className="text-gray-400 font-medium">Clique pour uploader ton logo</p>
                    <p className="text-gray-600 text-sm mt-2">PNG, JPG, SVG — fond transparent recommandé</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>

              {uploadedLogo && (
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                    <img src={uploadedLogo} alt="logo preview" className="h-16 object-contain bg-white rounded-lg p-2" />
                    <div>
                      <p className="font-semibold">Logo uploadé ✓</p>
                      <p className="text-gray-400 text-sm">Prêt à utiliser dans Site Builder et Studio</p>
                    </div>
                  </div>
                  <button onClick={saveUploadedLogo}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all">
                    ✅ Sauvegarder et utiliser ce logo
                  </button>
                  <button onClick={() => setUploadedLogo(null)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-xl transition-all">
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-sm">💡 <strong>Conseils :</strong></p>
              <ul className="text-gray-500 text-sm mt-2 space-y-1">
                <li>• PNG avec fond transparent = meilleur résultat</li>
                <li>• Minimum 200x200px recommandé</li>
                <li>• Le logo sera utilisé dans ton site généré</li>
                <li>• Format SVG = qualité parfaite à toute taille</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
