'use client'
import { useState } from 'react'

const styles = [
  { id: 'realistic', label: '📷 Réaliste', prompt: 'photorealistic, high quality, 8k, detailed' },
  { id: 'cinematic', label: '🎬 Cinématique', prompt: 'cinematic, movie still, dramatic lighting, epic' },
  { id: 'artistic', label: '🎨 Artistique', prompt: 'digital art, artistic, beautiful painting, masterpiece' },
  { id: 'anime', label: '🎌 Anime', prompt: 'anime style, japanese animation, vibrant' },
  { id: 'fantasy', label: '🧙 Fantasy', prompt: 'fantasy art, magical, epic, mystical' },
  { id: 'minimal', label: '⬜ Minimaliste', prompt: 'minimalist, clean, simple, elegant' },
]

const examples = [
  'Une femme sur un cheval au coucher de soleil à côté de la mer',
  'Un dragon volant au-dessus d\'une montagne enneigée',
  'Un restaurant élégant avec vue sur Paris la nuit',
  'Une ville futuriste avec des voitures volantes',
  'Une plage tropicale avec eau turquoise et palmiers',
  'Un astronaute sur la lune avec la Terre en arrière-plan',
  'Un loup sous la pleine lune dans une forêt mystique',
  'Un chef cuisinier dans une cuisine moderne étoilée',
]

export default function ImageGen() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [images, setImages] = useState<{url: string, loaded: boolean}[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(2)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)

    const selectedStyle = styles.find(s => s.id === style)?.prompt || ''
    const fullPrompt = encodeURIComponent(`${prompt}, ${selectedStyle}`)

    const seeds = [
      Math.floor(Math.random() * 9999) + 1,
      Math.floor(Math.random() * 9999) + 10000,
      Math.floor(Math.random() * 9999) + 20000,
      Math.floor(Math.random() * 9999) + 30000
    ].slice(0, count)

    const variations = [
      'photorealistic professional portrait',
      'with equipment and tools',
      'working environment professional',
      'close-up professional headshot'
    ]

    setImages([])
    setLoading(false)
    
    for (let i = 0; i < seeds.length; i++) {
      await new Promise(r => setTimeout(r, i * 4000))
      const fullPrompt = `${prompt}, ${variations[i]}, ${selectedStyle}, highly detailed, 8k`
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=768&seed=${seeds[i]}&nologo=true&model=flux`
      setImages(prev => [...prev, { url, loaded: false }])
    }
  }

  const markLoaded = (i: number) => {
    setImages(prev => prev.map((img, idx) => idx === i ? { ...img, loaded: true } : img))
  }

  const download = (url: string, i: number) => {
    window.open(url, '_blank')
  }

  const addToSitePhotos = (url: string) => {
    const existing = JSON.parse(localStorage.getItem('nexoro_site_photos') || '[]')
    if (!existing.includes(url)) {
      existing.push(url)
      localStorage.setItem('nexoro_site_photos', JSON.stringify(existing.slice(0, 10)))
    }
    const count = JSON.parse(localStorage.getItem('nexoro_site_photos') || '[]').length
    alert('✅ Photo ajoutée au site ! (' + count + '/10) — Retourne sur /create pour générer ton site')
  }

  const useAsBg = (url: string) => {
    localStorage.setItem('nexoro_bg_image', url)
    navigator.clipboard.writeText(url)
    alert('✅ URL copiée ! Va dans Site Builder → Upload → colle l\'URL')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🎨 Image Generator IA</h1>
          <p className="text-gray-500 mt-1">Génère de vraies images IA — gratuit et illimité avec Pollinations AI</p>
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-4">
          <p className="text-blue-300 text-sm">⏳ Les images prennent <strong>10-30 secondes</strong> à générer — c'est normal ! Patiente après avoir cliqué.</p>
        </div>

        {/* Exemples */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-3">💡 Exemples — clique pour utiliser :</p>
          <div className="flex flex-wrap gap-2">
            {examples.map(ex => (
              <button key={ex} onClick={() => setPrompt(ex)}
                className="bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white text-xs px-3 py-2 rounded-xl transition-all text-left">
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Style</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {styles.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className={`p-2 rounded-xl text-xs font-medium transition-all ${style === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Nombre :</span>
            {[1, 2, 4].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${count === n ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {n}
              </button>
            ))}
          </div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && generate()}
            placeholder="Décris ton image en détail — Ex: Une femme élégante sur un cheval brun au coucher de soleil orange, à côté de la mer, style cinématique..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none h-28 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={!prompt.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
            🎨 Générer {count} image{count > 1 ? 's' : ''} IA
          </button>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <p className="text-yellow-400 text-sm">Génération en cours — les images apparaissent progressivement (10-30 sec)...</p>
            </div>
            <div className={`grid gap-4 ${count === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {images.map((img, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="relative">
                    {!img.loaded && (
                      <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-gray-400 text-sm">Génération image {i+1}...</p>
                        </div>
                      </div>
                    )}
                    <img
                      src={img.url}
                      alt={`Generated ${i+1}`}
                      className={`w-full object-cover transition-all duration-500 ${img.loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                      style={{ maxHeight: '500px' }}
                      onLoad={() => markLoaded(i)}
                      onError={() => markLoaded(i)}
                    />
                  </div>
                  {img.loaded && (
                    <div className="p-3 flex gap-2 flex-wrap">
                      <button onClick={() => download(img.url, i)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-xl transition-all">
                        📥 Télécharger
                      </button>
                      <button onClick={() => addToSitePhotos(img.url)}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm py-2 rounded-xl transition-all">
                        ✅ Ajouter au site
                      </button>
                      <button onClick={() => useAsBg(img.url)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-xl transition-all">
                        🌐 Utiliser comme fond hero
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-sm">🎨 Powered by <strong className="text-white">Pollinations AI</strong> — 100% Gratuit & Illimité</p>
        </div>
      </div>
    </main>
  )
}
