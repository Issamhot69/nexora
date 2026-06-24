'use client'
import { useState } from 'react'

const fontStyles = [
  { id: 'modern', name: 'Modern', font: 'Inter', sample: 'Clean & Professional', css: "'Inter', system-ui, sans-serif" },
  { id: 'elegant', name: 'Elegant', font: 'Playfair Display', sample: 'Luxury & Prestige', css: "'Playfair Display', Georgia, serif" },
  { id: 'tech', name: 'Tech', font: 'Space Grotesk', sample: 'Digital & Futuristic', css: "'Space Grotesk', monospace" },
  { id: 'friendly', name: 'Friendly', font: 'Nunito', sample: 'Warm & Approachable', css: "'Nunito', sans-serif" },
  { id: 'bold', name: 'Bold', font: 'Montserrat', sample: 'Strong & Impactful', css: "'Montserrat', sans-serif" },
  { id: 'minimal', name: 'Minimal', font: 'DM Sans', sample: 'Simple & Clean', css: "'DM Sans', sans-serif" },
]

const backgrounds = [
  { id: 'dark', name: 'Dark Pro', preview: 'bg-gray-950', css: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)' },
  { id: 'midnight', name: 'Midnight Blue', preview: 'bg-blue-950', css: 'linear-gradient(135deg, #0a0a2e, #000d26)' },
  { id: 'forest', name: 'Forest', preview: 'bg-green-950', css: 'linear-gradient(135deg, #0a1a0a, #001a00)' },
  { id: 'sunset', name: 'Sunset', preview: 'bg-orange-950', css: 'linear-gradient(135deg, #1a0a00, #2d0a00)' },
  { id: 'purple', name: 'Purple Galaxy', preview: 'bg-purple-950', css: 'linear-gradient(135deg, #1a0a2e, #0d0020)' },
  { id: 'light', name: 'Pure Light', preview: 'bg-white border border-gray-200', css: 'linear-gradient(135deg, #ffffff, #f8f9ff)' },
  { id: 'cream', name: 'Warm Cream', preview: 'bg-amber-50 border border-amber-200', css: 'linear-gradient(135deg, #fffbf0, #fff8e7)' },
  { id: 'aurora', name: 'Aurora', preview: 'bg-gradient-to-r from-green-900 to-blue-900', css: 'linear-gradient(135deg, #0a2e1a, #0a1a2e, #1a0a2e)' },
]

const colorThemes = [
  { id: 'indigo', name: 'Indigo', c1: '#6366f1', c2: '#8b5cf6' },
  { id: 'emerald', name: 'Emerald', c1: '#10b981', c2: '#059669' },
  { id: 'rose', name: 'Rose', c1: '#f43f5e', c2: '#e11d48' },
  { id: 'amber', name: 'Amber', c1: '#f59e0b', c2: '#d97706' },
  { id: 'cyan', name: 'Cyan', c1: '#06b6d4', c2: '#0891b2' },
  { id: 'pink', name: 'Pink', c1: '#ec4899', c2: '#db2777' },
  { id: 'orange', name: 'Orange', c1: '#f97316', c2: '#ea580c' },
  { id: 'teal', name: 'Teal', c1: '#14b8a6', c2: '#0d9488' },
]

const imageStyles = [
  { id: 'none', name: 'Aucun fond', preview: '⬛' },
  { id: 'particles', name: 'Particules', preview: '✨' },
  { id: 'waves', name: 'Vagues', preview: '🌊' },
  { id: 'grid', name: 'Grille', preview: '⊞' },
  { id: 'dots', name: 'Points', preview: '⠿' },
  { id: 'gradient', name: 'Dégradé animé', preview: '🌈' },
]

export default function StyleAI() {
  const [font, setFont] = useState('modern')
  const [bg, setBg] = useState('dark')
  const [theme, setTheme] = useState('indigo')
  const [imgStyle, setImgStyle] = useState('particles')
  const [startup, setStartup] = useState('')
  const [generatedCSS, setGeneratedCSS] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const selectedFont = fontStyles.find(f => f.id === font)!
  const selectedBg = backgrounds.find(b => b.id === bg)!
  const selectedTheme = colorThemes.find(t => t.id === theme)!

  const generateStyle = async () => {
    if (!startup) return
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Génère un style CSS complet pour la startup "${startup}" avec: Police: ${selectedFont.font}, Fond: ${selectedBg.name}, Couleur principale: ${selectedTheme.c1}, Style image: ${imgStyle}. Génère des variables CSS personnalisées et des classes utilitaires.`,
          module: 'brand'
        })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''
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
            result += json.choices?.[0]?.delta?.content || ''
            setGeneratedCSS(result)
          } catch {}
        }
      }
    } catch {}
    setLoading(false)
    setPreview(true)
  }

  const exportCSS = () => {
    const css = `:root {
  --font-primary: ${selectedFont.css};
  --bg-primary: ${selectedBg.css};
  --color-primary: ${selectedTheme.c1};
  --color-secondary: ${selectedTheme.c2};
}

body {
  font-family: var(--font-primary);
  background: var(--bg-primary);
}

.btn-primary {
  background: linear-gradient(135deg, ${selectedTheme.c1}, ${selectedTheme.c2});
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-family: var(--font-primary);
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.heading {
  font-family: var(--font-primary);
  background: linear-gradient(135deg, ${selectedTheme.c1}, ${selectedTheme.c2});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid ${selectedTheme.c1}30;
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}
`
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${startup}-style.css`
    a.click()
  }

  const previewHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=${selectedFont.font.replace(' ', '+')}:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: '${selectedFont.font}', sans-serif; background: ${selectedBg.css}; color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.container { text-align: center; padding: 3rem; max-width: 600px; }
h1 { font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, ${selectedTheme.c1}, ${selectedTheme.c2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
p { font-size: 1.2rem; opacity: 0.7; margin-bottom: 2rem; line-height: 1.6; }
.btn { background: linear-gradient(135deg, ${selectedTheme.c1}, ${selectedTheme.c2}); color: white; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 10px 30px ${selectedTheme.c1}40; }
.badge { display: inline-block; background: ${selectedTheme.c1}20; color: ${selectedTheme.c1}; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem; margin-bottom: 1.5rem; border: 1px solid ${selectedTheme.c1}40; }
</style>
</head>
<body>
<div class="container">
  <div class="badge">✨ Powered by Nexoro AI</div>
  <h1>${startup || 'Ma Startup'}</h1>
  <p>Style: ${selectedFont.name} · ${selectedBg.name} · ${selectedTheme.name}</p>
  <button class="btn">Commencer maintenant →</button>
</div>
</body>
</html>`

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🎨 Style AI</h1>
          <p className="text-gray-500 mt-1">Génère le style parfait — polices, couleurs, fonds et animations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Polices */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">🔤 Police</h2>
            <div className="space-y-2">
              {fontStyles.map(f => (
                <button key={f.id} onClick={() => setFont(f.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${font === f.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-sm opacity-70">{f.sample}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Couleurs */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">🎨 Couleur principale</h2>
            <div className="grid grid-cols-4 gap-2">
              {colorThemes.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl transition-all text-center ${theme === t.id ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`}
                  style={{ background: `linear-gradient(135deg, ${t.c1}, ${t.c2})` }}>
                  <div className="text-white text-xs font-semibold">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fonds */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">🖼️ Fond</h2>
            <div className="grid grid-cols-2 gap-2">
              {backgrounds.map(b => (
                <button key={b.id} onClick={() => setBg(b.id)}
                  className={`p-3 rounded-xl transition-all text-left ${bg === b.id ? 'ring-2 ring-indigo-500' : ''} ${b.preview}`}>
                  <span className={`text-sm font-semibold ${b.id === 'light' || b.id === 'cream' ? 'text-gray-800' : 'text-white'}`}>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style image */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">✨ Effet de fond</h2>
            <div className="grid grid-cols-3 gap-2">
              {imageStyles.map(s => (
                <button key={s.id} onClick={() => setImgStyle(s.id)}
                  className={`p-3 rounded-xl transition-all text-center ${imgStyle === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <div className="text-2xl mb-1">{s.preview}</div>
                  <div className="text-xs font-medium">{s.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nom startup */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <input value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Nom de ta startup — Ex: FastFoodGenie"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <div className="flex gap-3">
            <button onClick={() => setPreview(true)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all">
              👁️ Preview style
            </button>
            <button onClick={exportCSS}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-all">
              📥 Export CSS
            </button>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {selectedFont.name} · {selectedBg.name} · {selectedTheme.name}
              </span>
            </div>
            <iframe srcDoc={previewHTML} className="w-full h-64" sandbox="allow-scripts" title="Style Preview" />
          </div>
        )}

        {/* CSS généré */}
        {generatedCSS && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-3">CSS généré par IA</h2>
            <pre className="text-green-400 text-xs overflow-auto max-h-48 font-mono">{generatedCSS}</pre>
          </div>
        )}
      </div>
    </main>
  )
}
