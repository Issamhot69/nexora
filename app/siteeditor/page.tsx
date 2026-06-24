'use client'
import { useState, useEffect } from 'react'

export default function SiteEditor() {
  const [logo, setLogo] = useState<string | null>(null)
  const [siteName, setSiteName] = useState('FastBite')
  const [tagline, setTagline] = useState('Manger rapide, vivre mieux')
  const [color1, setColor1] = useState('#6366f1')
  const [color2, setColor2] = useState('#8b5cf6')
  const [ctaText, setCtaText] = useState('Commander maintenant')
  const [html, setHtml] = useState('')
  const [tab, setTab] = useState<'content' | 'design' | 'preview'>('content')

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const generatePreview = () => {
    const preview = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${siteName}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f0f; color: #fff; }
nav { background: #16213e; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
.logo-area { display: flex; align-items: center; gap: 12px; }
.logo-img { height: 40px; width: 40px; object-fit: contain; border-radius: 8px; }
.logo-text { font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, ${color1}, ${color2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #0f0f0f, #1a1a2e); }
.hero h1 { font-size: 4rem; font-weight: 900; background: linear-gradient(135deg, ${color1}, ${color2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1.5rem; }
.hero p { font-size: 1.3rem; opacity: 0.8; margin-bottom: 2rem; }
.btn { background: linear-gradient(135deg, ${color1}, ${color2}); color: white; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 700; text-decoration: none; display: inline-block; }
footer { background: #0a0a0a; color: #666; text-align: center; padding: 2rem; }
</style>
</head>
<body>
<nav>
  <div class="logo-area">
    ${logo ? `<img src="${logo}" class="logo-img" alt="logo">` : ''}
    <span class="logo-text">${siteName}</span>
  </div>
  <div style="display:flex;gap:2rem">
    <a href="#" style="color:#fff;text-decoration:none">Accueil</a>
    <a href="#" style="color:#fff;text-decoration:none">Features</a>
    <a href="#" style="color:#fff;text-decoration:none">Tarifs</a>
    <a href="#" style="background:linear-gradient(135deg,${color1},${color2});color:white;padding:0.5rem 1.5rem;border-radius:50px;text-decoration:none;font-weight:600">Contact</a>
  </div>
</nav>
<section class="hero">
  <div>
    ${logo ? `<img src="${logo}" style="height:80px;margin-bottom:2rem;border-radius:16px" alt="logo">` : ''}
    <h1>${siteName}</h1>
    <p>${tagline}</p>
    <a href="#" class="btn">${ctaText}</a>
  </div>
</section>
<footer>© 2024 ${siteName}. Built with ⚡ Nexoro</footer>
</body>
</html>`
    setHtml(preview)
    setTab('preview')
  }

  const download = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${siteName}-nexoro.html`
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">✏️ Site Editor</h1>
            <p className="text-gray-500 mt-1">Modifie ton site — logo, couleurs, textes</p>
          </div>
          {html && (
            <button onClick={download}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-xl transition-all">
              📥 Télécharger HTML
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['content', 'design', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {t === 'content' ? '📝 Contenu' : t === 'design' ? '🎨 Design' : '👁️ Preview'}
            </button>
          ))}
        </div>

        {tab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo upload */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">🖼️ Logo</h2>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition-all">
                {logo ? (
                  <img src={logo} alt="logo" className="h-16 object-contain mb-2" />
                ) : (
                  <>
                    <div className="text-4xl mb-2">📤</div>
                    <p className="text-gray-400 text-sm">Upload ton logo</p>
                    <p className="text-gray-600 text-xs mt-1">PNG, JPG, SVG</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
              {logo && (
                <button onClick={() => setLogo(null)}
                  className="mt-3 w-full text-red-400 text-sm hover:text-red-300">
                  🗑️ Supprimer le logo
                </button>
              )}
            </div>

            {/* Textes */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">📝 Textes</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nom du site</label>
                <input value={siteName} onChange={e => setSiteName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tagline / Slogan</label>
                <input value={tagline} onChange={e => setTagline(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Bouton CTA</label>
                <input value={ctaText} onChange={e => setCtaText(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>
        )}

        {tab === 'design' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold">🎨 Couleurs de marque</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Couleur principale</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={color1} onChange={e => setColor1(e.target.value)}
                    className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent" />
                  <div>
                    <div className="font-semibold">{color1}</div>
                    <div className="text-xs text-gray-500">Titres, boutons, accents</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Couleur secondaire</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={color2} onChange={e => setColor2(e.target.value)}
                    className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent" />
                  <div>
                    <div className="font-semibold">{color2}</div>
                    <div className="text-xs text-gray-500">Dégradés, hovers</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Preview couleurs */}
            <div className="rounded-xl p-4 text-center font-bold text-white text-lg"
              style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}>
              Aperçu du dégradé — {siteName}
            </div>
          </div>
        )}

        {tab === 'preview' && html ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-400">
                🌐 {siteName.toLowerCase().replace(/\s/g,'-')}.nexoro.app
              </div>
            </div>
            <iframe srcDoc={html} className="w-full h-[600px] bg-white"
              sandbox="allow-scripts" title="Site Preview" />
          </div>
        ) : tab === 'preview' && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">👁️</div>
            <p>Clique sur "Générer Preview" pour voir ton site</p>
          </div>
        )}

        <button onClick={generatePreview}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all text-lg">
          ✨ Générer Preview avec mes modifications
        </button>
      </div>
    </main>
  )
}
