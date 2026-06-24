'use client'
import { useState, useRef } from 'react'

const videoTypes = [
  { id: 'promo', icon: '🚀', name: 'Promo Startup', desc: 'Présentation animée de ta startup' },
  { id: 'product', icon: '📱', name: 'Product Demo', desc: 'Démo de ton produit/app' },
  { id: 'testimonial', icon: '⭐', name: 'Testimonials', desc: 'Avis clients animés' },
  { id: 'stats', icon: '📊', name: 'Stats & Data', desc: 'Chiffres et métriques animés' },
  { id: 'team', icon: '👥', name: 'Team Intro', desc: 'Présentation de l\'équipe' },
  { id: 'launch', icon: '🎯', name: 'Launch Video', desc: 'Annonce de lancement' },
]

const themes = [
  { id: 'dark', name: '🌙 Dark Pro', bg: '#0f0f1a', text: '#ffffff', accent: '#6366f1' },
  { id: 'light', name: '☀️ Light', bg: '#ffffff', text: '#1a1a1a', accent: '#6366f1' },
  { id: 'gradient', name: '🌈 Gradient', bg: 'linear-gradient(135deg, #667eea, #764ba2)', text: '#ffffff', accent: '#fbbf24' },
  { id: 'neon', name: '💜 Neon', bg: '#0a0a0a', text: '#ffffff', accent: '#a855f7' },
  { id: 'corporate', name: '💼 Corporate', bg: '#1e3a5f', text: '#ffffff', accent: '#3b82f6' },
  { id: 'fire', name: '🔥 Fire', bg: '#1a0a00', text: '#ffffff', accent: '#f97316' },
]

export default function VideoGen() {
  const [brand, setBrand] = useState('')
  const [tagline, setTagline] = useState('')
  const [features, setFeatures] = useState('Feature 1\nFeature 2\nFeature 3')
  const [videoType, setVideoType] = useState('promo')
  const [theme, setTheme] = useState('dark')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [loading, setLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const selectedTheme = themes.find(t => t.id === theme)!
  const featureList = features.split('\n').filter(f => f.trim())

  const generate = async () => {
    if (!brand.trim()) return
    setLoading(true)

    const t = selectedTheme
    const bg = t.bg.startsWith('linear') ? t.bg : t.bg

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1280px; height: 720px; overflow: hidden;
  background: ${bg};
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: ${t.text};
}

/* Slide container */
.slides { width: 100%; height: 100%; position: relative; }
.slide {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  opacity: 0; animation: slideIn 0.8s ease forwards;
  padding: 60px;
  text-align: center;
}

/* Slide 1 - Hero */
.slide-1 { animation-delay: 0.5s; animation-duration: 0.8s; animation-fill-mode: both; }
.slide-1 .brand {
  font-size: 80px; font-weight: 900;
  background: linear-gradient(135deg, ${t.accent}, #a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: scaleIn 1s ease 1s both;
}
.slide-1 .tagline {
  font-size: 28px; opacity: 0.8; margin-top: 20px;
  animation: fadeUp 1s ease 1.5s both;
}
.slide-1 .badge {
  margin-top: 30px; display: inline-block;
  background: ${t.accent}30; border: 1px solid ${t.accent};
  color: ${t.accent}; padding: 8px 24px; border-radius: 50px;
  font-size: 16px; font-weight: 600;
  animation: fadeUp 1s ease 2s both;
}

/* Slide 2 - Features */
.slide-2 { animation-delay: 4s; }
.slide-2 h2 { font-size: 48px; font-weight: 800; margin-bottom: 40px; animation: fadeUp 0.8s ease 4.3s both; }
.features-grid { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; }
.feature-card {
  background: ${t.accent}15; border: 1px solid ${t.accent}40;
  border-radius: 20px; padding: 30px; flex: 1; min-width: 200px; max-width: 280px;
  animation: scaleIn 0.6s ease both;
}
.feature-card:nth-child(1) { animation-delay: 4.5s; }
.feature-card:nth-child(2) { animation-delay: 4.8s; }
.feature-card:nth-child(3) { animation-delay: 5.1s; }
.feature-icon { font-size: 40px; margin-bottom: 15px; }
.feature-name { font-size: 18px; font-weight: 700; }

/* Slide 3 - Stats */
.slide-3 { animation-delay: 8s; }
.slide-3 h2 { font-size: 48px; font-weight: 800; margin-bottom: 50px; animation: fadeUp 0.8s ease 8.3s both; }
.stats-grid { display: flex; gap: 40px; justify-content: center; }
.stat-item { text-align: center; animation: scaleIn 0.6s ease both; }
.stat-item:nth-child(1) { animation-delay: 8.5s; }
.stat-item:nth-child(2) { animation-delay: 8.8s; }
.stat-item:nth-child(3) { animation-delay: 9.1s; }
.stat-number {
  font-size: 72px; font-weight: 900;
  background: linear-gradient(135deg, ${t.accent}, #a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.stat-label { font-size: 18px; opacity: 0.7; margin-top: 8px; }

/* Slide 4 - CTA */
.slide-4 { animation-delay: 12s; }
.slide-4 .cta-title { font-size: 64px; font-weight: 900; margin-bottom: 20px; animation: scaleIn 0.8s ease 12.3s both; }
.slide-4 .cta-sub { font-size: 24px; opacity: 0.7; margin-bottom: 40px; animation: fadeUp 0.8s ease 12.8s both; }
.cta-btn {
  background: linear-gradient(135deg, ${t.accent}, #a855f7);
  color: white; padding: 20px 60px; border-radius: 50px;
  font-size: 22px; font-weight: 800; border: none; cursor: pointer;
  animation: pulse 2s ease 13.5s infinite;
  box-shadow: 0 20px 60px ${t.accent}50;
}

/* Background effects */
.bg-circle-1 {
  position: fixed; width: 400px; height: 400px; border-radius: 50%;
  background: ${t.accent}10; top: -100px; right: -100px;
  animation: float 6s ease-in-out infinite;
}
.bg-circle-2 {
  position: fixed; width: 300px; height: 300px; border-radius: 50%;
  background: #a855f750; bottom: -50px; left: -50px;
  animation: float 8s ease-in-out infinite reverse;
}

/* Progress bar */
.progress {
  position: fixed; bottom: 0; left: 0; height: 4px;
  background: linear-gradient(90deg, ${t.accent}, #a855f7);
  animation: progress 16s linear forwards;
}

/* Slide indicators */
.indicators {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 8px;
}
.dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: ${t.text}40;
}
.dot.active { background: ${t.accent}; transform: scale(1.3); }

/* Logo watermark */
.watermark {
  position: fixed; bottom: 20px; right: 20px;
  font-size: 14px; opacity: 0.4; font-weight: 600;
}

@keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 0.8; transform: translateY(0); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
@keyframes pulse { 0%,100% { box-shadow: 0 20px 60px ${t.accent}50; } 50% { box-shadow: 0 20px 80px ${t.accent}80; } }
@keyframes progress { from { width: 0; } to { width: 100%; } }

/* Slide visibility */
.slide-1 { opacity: 0; animation: slideIn 0.8s ease 0.5s forwards; }
.slide-2 { opacity: 0; animation: slideIn 0.8s ease 4s forwards; }
.slide-3 { opacity: 0; animation: slideIn 0.8s ease 8s forwards; }
.slide-4 { opacity: 0; animation: slideIn 0.8s ease 12s forwards; }

/* Hide previous slides */
.slide-1 { animation: slideIn 0.8s ease 0.5s forwards, hideSlide 0s ease 3.8s forwards; }
.slide-2 { animation: slideIn 0.8s ease 4s forwards, hideSlide 0s ease 7.8s forwards; }
.slide-3 { animation: slideIn 0.8s ease 8s forwards, hideSlide 0s ease 11.8s forwards; }
@keyframes hideSlide { to { opacity: 0; pointer-events: none; } }
</style>
</head>
<body>
<div class="bg-circle-1"></div>
<div class="bg-circle-2"></div>

<div class="slides">
  <!-- Slide 1: Hero -->
  <div class="slide slide-1">
    <div class="brand">${brand}</div>
    <div class="tagline">${tagline || 'The future starts here'}</div>
    <div class="badge">🚀 Powered by AI</div>
  </div>

  <!-- Slide 2: Features -->
  <div class="slide slide-2">
    <h2>✨ Pourquoi ${brand} ?</h2>
    <div class="features-grid">
      ${featureList.slice(0, 3).map((f, i) => `
      <div class="feature-card">
        <div class="feature-icon">${['⚡', '🔒', '🌍'][i] || '✅'}</div>
        <div class="feature-name">${f}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Slide 3: Stats -->
  <div class="slide slide-3">
    <h2>📊 ${brand} en chiffres</h2>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">10K+</div>
        <div class="stat-label">Utilisateurs</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">99%</div>
        <div class="stat-label">Satisfaction</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">24/7</div>
        <div class="stat-label">Support IA</div>
      </div>
    </div>
  </div>

  <!-- Slide 4: CTA -->
  <div class="slide slide-4">
    <div class="cta-title">Rejoins ${brand} 🚀</div>
    <div class="cta-sub">${tagline || 'Commence gratuitement aujourd\'hui'}</div>
    <button class="cta-btn">Démarrer maintenant →</button>
  </div>
</div>

<div class="progress"></div>
<div class="watermark">⚡ Nexoro</div>
</body>
</html>`

    setGeneratedHTML(html)
    setLoading(false)
  }

  const download = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brand}-video-nexoro.html`
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">🎬 Video Generator</h1>
            <p className="text-gray-500 mt-1">Génère des vidéos de présentation animées professionnelles</p>
          </div>
          {generatedHTML && (
            <button onClick={download}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-xl">
              📥 Télécharger HTML
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Type de vidéo</h2>
            <div className="grid grid-cols-2 gap-2">
              {videoTypes.map(v => (
                <button key={v.id} onClick={() => setVideoType(v.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${videoType === v.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-xl">{v.icon}</span>
                  <div>
                    <div className="text-xs font-semibold">{v.name}</div>
                    <div className="text-xs opacity-60">{v.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Thème visuel</h2>
            <div className="grid grid-cols-2 gap-2">
              {themes.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${theme === t.id ? 'ring-2 ring-indigo-500' : ''}`}
                  style={{ background: t.bg.startsWith('linear') ? t.bg : t.bg, color: t.text }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nom de la startup *</label>
              <input value={brand} onChange={e => setBrand(e.target.value)}
                placeholder="Ex: Nexoro, FastBite..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tagline / Slogan</label>
              <input value={tagline} onChange={e => setTagline(e.target.value)}
                placeholder="Ex: The future of food delivery"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Features (une par ligne)</label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-indigo-500" />
          </div>
          <button onClick={generate} disabled={!brand.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
            {loading ? '⏳ Génération...' : '🎬 Générer la vidéo'}
          </button>
        </div>

        {/* Preview */}
        {generatedHTML && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-xs ml-2">🎬 {brand} — Vidéo 16 secondes</span>
              </div>
              <button onClick={generate}
                className="text-indigo-400 text-xs hover:text-indigo-300">
                🔄 Regénérer
              </button>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                ref={iframeRef}
                srcDoc={generatedHTML}
                className="absolute inset-0 w-full h-full border-0"
                sandbox="allow-scripts"
                title="Video Preview"
              />
            </div>
          </div>
        )}

        <div className="bg-indigo-900/20 border border-indigo-800 rounded-2xl p-4">
          <p className="text-indigo-300 text-sm">💡 <strong>Runway ML</strong> (vraies vidéos IA) sera ajouté prochainement — abonnement $10/mois pour générer des vidéos réelles depuis tes images.</p>
        </div>
      </div>
    </main>
  )
}
