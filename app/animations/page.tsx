'use client'
import { useState } from 'react'

const animations = [
  {
    id: 'ocean',
    icon: '🌊',
    name: 'Océan & Poissons',
    desc: 'Vagues animées avec poissons qui nagent',
    code: `
<div style="width:100%;height:300px;background:linear-gradient(180deg,#006994 0%,#003d6b 100%);position:relative;overflow:hidden;border-radius:16px">
  <!-- Vagues -->
  <svg style="position:absolute;bottom:0;width:100%;height:80px" viewBox="0 0 1440 80" preserveAspectRatio="none">
    <path fill="rgba(255,255,255,0.15)" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z">
      <animateTransform attributeName="transform" type="translate" from="-1440,0" to="0,0" dur="4s" repeatCount="indefinite"/>
    </path>
    <path fill="rgba(255,255,255,0.1)" d="M0,50 C480,10 960,70 1440,30 L1440,80 L0,80 Z">
      <animateTransform attributeName="transform" type="translate" from="0,0" to="-1440,0" dur="6s" repeatCount="indefinite"/>
    </path>
  </svg>
  <!-- Bulles -->
  <div style="position:absolute;width:10px;height:10px;background:rgba(255,255,255,0.3);border-radius:50%;left:20%;bottom:20%;animation:bubble 3s ease-in infinite"></div>
  <div style="position:absolute;width:6px;height:6px;background:rgba(255,255,255,0.2);border-radius:50%;left:50%;bottom:30%;animation:bubble 4s ease-in infinite 1s"></div>
  <div style="position:absolute;width:8px;height:8px;background:rgba(255,255,255,0.25);border-radius:50%;left:70%;bottom:15%;animation:bubble 5s ease-in infinite 2s"></div>
  <!-- Poissons -->
  <div style="position:absolute;font-size:2rem;animation:swim 6s linear infinite;top:30%">🐠</div>
  <div style="position:absolute;font-size:1.5rem;animation:swim 8s linear infinite 2s;top:50%">🐟</div>
  <div style="position:absolute;font-size:2.5rem;animation:swim 10s linear infinite 4s;top:20%">🐡</div>
  <div style="position:absolute;font-size:1rem;animation:swimback 7s linear infinite;top:60%">🦈</div>
  <div style="position:absolute;font-size:3rem;animation:float 3s ease-in-out infinite;top:5%;left:40%">☀️</div>
  <style>
    @keyframes swim { from{left:-10%} to{left:110%} }
    @keyframes swimback { from{left:110%;transform:scaleX(-1)} to{left:-10%;transform:scaleX(-1)} }
    @keyframes bubble { from{transform:translateY(0);opacity:1} to{transform:translateY(-100px);opacity:0} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  </style>
</div>`
  },
  {
    id: 'food',
    icon: '🍽️',
    name: 'Repas Tournant',
    desc: 'Plat qui tourne sur une table avec vapeur',
    code: `
<div style="width:100%;height:300px;background:linear-gradient(135deg,#1a0a00,#3d1a00);position:relative;overflow:hidden;border-radius:16px;display:flex;align-items:center;justify-content:center">
  <!-- Table -->
  <div style="position:absolute;bottom:0;width:100%;height:80px;background:linear-gradient(180deg,#8B4513,#5D2E0C);border-radius:50% 50% 0 0 / 20px 20px 0 0"></div>
  <!-- Nappe -->
  <div style="position:absolute;bottom:60px;width:200px;height:10px;background:white;border-radius:50%;box-shadow:0 4px 20px rgba(0,0,0,0.5)"></div>
  <!-- Assiette -->
  <div style="animation:spin 4s linear infinite;font-size:5rem;position:absolute;bottom:55px">🍝</div>
  <!-- Vapeur -->
  <div style="position:absolute;bottom:120px;left:45%;font-size:1.5rem;animation:steam 2s ease-out infinite">💨</div>
  <div style="position:absolute;bottom:130px;left:50%;font-size:1rem;animation:steam 2s ease-out infinite 0.5s">💨</div>
  <div style="position:absolute;bottom:110px;left:55%;font-size:1.2rem;animation:steam 2s ease-out infinite 1s">💨</div>
  <!-- Couverts -->
  <div style="position:absolute;bottom:65px;left:30%;font-size:2rem;animation:bounce 1s ease-in-out infinite">🍴</div>
  <div style="position:absolute;bottom:65px;right:30%;font-size:2rem;animation:bounce 1s ease-in-out infinite 0.5s">🥄</div>
  <!-- Stars -->
  <div style="position:absolute;top:20px;left:20px;font-size:1rem;animation:twinkle 2s ease-in-out infinite">⭐</div>
  <div style="position:absolute;top:30px;right:30px;font-size:0.8rem;animation:twinkle 3s ease-in-out infinite">✨</div>
  <div style="position:absolute;top:10px;right:50%;font-size:1.2rem;animation:twinkle 2.5s ease-in-out infinite">⭐</div>
  <style>
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes steam { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-50px);opacity:0} }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes twinkle { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
  </style>
</div>`
  },
  {
    id: 'space',
    icon: '🚀',
    name: 'Espace & Planètes',
    desc: 'Fusée dans l\'espace avec planètes qui orbitent',
    code: `
<div style="width:100%;height:300px;background:linear-gradient(135deg,#0a0015,#000d26);position:relative;overflow:hidden;border-radius:16px">
  <!-- Étoiles -->
  <div style="position:absolute;width:2px;height:2px;background:white;border-radius:50%;top:10%;left:15%;animation:twinkle 2s infinite"></div>
  <div style="position:absolute;width:3px;height:3px;background:white;border-radius:50%;top:20%;left:80%;animation:twinkle 3s infinite 1s"></div>
  <div style="position:absolute;width:2px;height:2px;background:white;border-radius:50%;top:60%;left:30%;animation:twinkle 2.5s infinite 0.5s"></div>
  <div style="position:absolute;width:2px;height:2px;background:white;border-radius:50%;top:80%;left:70%;animation:twinkle 2s infinite 1.5s"></div>
  <div style="position:absolute;width:3px;height:3px;background:white;border-radius:50%;top:40%;left:90%;animation:twinkle 3s infinite 2s"></div>
  <!-- Soleil -->
  <div style="position:absolute;top:10%;left:10%;font-size:3rem;animation:glow 2s ease-in-out infinite">☀️</div>
  <!-- Planètes en orbite -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
    <div style="width:120px;height:120px;border:1px solid rgba(255,255,255,0.1);border-radius:50%;animation:orbit 6s linear infinite;position:relative">
      <div style="position:absolute;top:-15px;left:50%;font-size:1.5rem">🌍</div>
    </div>
  </div>
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
    <div style="width:200px;height:200px;border:1px solid rgba(255,255,255,0.05);border-radius:50%;animation:orbit 12s linear infinite reverse;position:relative">
      <div style="position:absolute;top:-15px;left:50%;font-size:1.2rem">🔴</div>
    </div>
  </div>
  <!-- Fusée -->
  <div style="position:absolute;font-size:3rem;animation:rocket 4s ease-in-out infinite;bottom:20%;left:20%">🚀</div>
  <!-- Météorite -->
  <div style="position:absolute;font-size:1.5rem;animation:meteor 3s linear infinite;top:30%">☄️</div>
  <style>
    @keyframes orbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes rocket { 0%,100%{transform:translateY(0) rotate(-45deg)} 50%{transform:translateY(-30px) rotate(-45deg)} }
    @keyframes meteor { from{left:110%;top:10%} to{left:-10%;top:80%} }
    @keyframes twinkle { 0%,100%{opacity:1} 50%{opacity:0.2} }
    @keyframes glow { 0%,100%{filter:drop-shadow(0 0 10px #FFD700)} 50%{filter:drop-shadow(0 0 20px #FFD700)} }
  </style>
</div>`
  },
  {
    id: 'city',
    icon: '🌆',
    name: 'Ville Animée',
    desc: 'Skyline avec voitures, nuages et soleil couchant',
    code: `
<div style="width:100%;height:300px;background:linear-gradient(180deg,#FF6B35 0%,#F7C59F 40%,#1a1a2e 100%);position:relative;overflow:hidden;border-radius:16px">
  <!-- Soleil couchant -->
  <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:4rem;animation:sunset 4s ease-in-out infinite">🌅</div>
  <!-- Nuages -->
  <div style="position:absolute;top:15%;font-size:3rem;animation:cloud 8s linear infinite">☁️</div>
  <div style="position:absolute;top:25%;font-size:2rem;animation:cloud 12s linear infinite 3s">⛅</div>
  <!-- Bâtiments -->
  <div style="position:absolute;bottom:40px;left:5%;width:60px;height:120px;background:#1a1a2e;border-radius:4px 4px 0 0"></div>
  <div style="position:absolute;bottom:40px;left:12%;width:40px;height:80px;background:#16213e;border-radius:4px 4px 0 0"></div>
  <div style="position:absolute;bottom:40px;left:20%;width:80px;height:150px;background:#0f3460;border-radius:4px 4px 0 0"></div>
  <div style="position:absolute;bottom:40px;right:5%;width:70px;height:130px;background:#1a1a2e;border-radius:4px 4px 0 0"></div>
  <div style="position:absolute;bottom:40px;right:15%;width:50px;height:100px;background:#16213e;border-radius:4px 4px 0 0"></div>
  <!-- Fenêtres lumineuses -->
  <div style="position:absolute;bottom:80px;left:7%;width:8px;height:8px;background:#FFD700;animation:blink 2s infinite"></div>
  <div style="position:absolute;bottom:100px;left:22%;width:8px;height:8px;background:#FFD700;animation:blink 3s infinite 1s"></div>
  <div style="position:absolute;bottom:120px;right:7%;width:8px;height:8px;background:#FFD700;animation:blink 2.5s infinite 0.5s"></div>
  <!-- Route -->
  <div style="position:absolute;bottom:0;width:100%;height:40px;background:#333"></div>
  <div style="position:absolute;bottom:18px;width:100%;height:4px;background:rgba(255,255,255,0.3)"></div>
  <!-- Voitures -->
  <div style="position:absolute;bottom:8px;font-size:1.5rem;animation:car 5s linear infinite">🚗</div>
  <div style="position:absolute;bottom:8px;font-size:1.5rem;animation:carback 7s linear infinite 2s">🚕</div>
  <style>
    @keyframes cloud { from{left:-15%} to{left:110%} }
    @keyframes car { from{left:-10%} to{left:110%} }
    @keyframes carback { from{left:110%;transform:scaleX(-1)} to{left:-10%;transform:scaleX(-1)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes sunset { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-10px)} }
  </style>
</div>`
  },
  {
    id: 'nature',
    icon: '🌿',
    name: 'Nature & Forêt',
    desc: 'Arbres qui bougent avec papillons et oiseaux',
    code: `
<div style="width:100%;height:300px;background:linear-gradient(180deg,#87CEEB 0%,#98FB98 60%,#228B22 100%);position:relative;overflow:hidden;border-radius:16px">
  <!-- Soleil -->
  <div style="position:absolute;top:10px;right:20px;font-size:3rem;animation:glow 3s ease-in-out infinite">☀️</div>
  <!-- Nuages -->
  <div style="position:absolute;top:8%;font-size:2.5rem;animation:cloud 10s linear infinite">☁️</div>
  <div style="position:absolute;top:15%;font-size:2rem;animation:cloud 15s linear infinite 5s">☁️</div>
  <!-- Arbres qui bougent -->
  <div style="position:absolute;bottom:30px;left:5%;font-size:4rem;animation:sway 3s ease-in-out infinite;transform-origin:bottom center">🌳</div>
  <div style="position:absolute;bottom:30px;left:20%;font-size:5rem;animation:sway 4s ease-in-out infinite 0.5s;transform-origin:bottom center">🌲</div>
  <div style="position:absolute;bottom:30px;left:40%;font-size:3.5rem;animation:sway 3.5s ease-in-out infinite 1s;transform-origin:bottom center">🌳</div>
  <div style="position:absolute;bottom:30px;right:10%;font-size:4.5rem;animation:sway 3s ease-in-out infinite 1.5s;transform-origin:bottom center">🌲</div>
  <div style="position:absolute;bottom:30px;right:25%;font-size:3rem;animation:sway 4s ease-in-out infinite 2s;transform-origin:bottom center">🌴</div>
  <!-- Sol -->
  <div style="position:absolute;bottom:0;width:100%;height:35px;background:#228B22"></div>
  <!-- Fleurs -->
  <div style="position:absolute;bottom:30px;left:35%;font-size:1.5rem;animation:bounce 2s ease-in-out infinite">🌸</div>
  <div style="position:absolute;bottom:30px;left:60%;font-size:1.2rem;animation:bounce 2.5s ease-in-out infinite 1s">🌺</div>
  <!-- Papillons -->
  <div style="position:absolute;font-size:1.5rem;animation:butterfly 6s ease-in-out infinite;top:40%">🦋</div>
  <div style="position:absolute;font-size:1rem;animation:butterfly 8s ease-in-out infinite 2s;top:50%">🦋</div>
  <!-- Oiseaux -->
  <div style="position:absolute;font-size:1.5rem;animation:bird 7s linear infinite;top:20%">🐦</div>
  <div style="position:absolute;font-size:1rem;animation:bird 10s linear infinite 3s;top:30%">🦅</div>
  <style>
    @keyframes sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
    @keyframes cloud { from{left:-15%} to{left:110%} }
    @keyframes butterfly { 0%,100%{left:10%;top:40%} 25%{left:40%;top:30%} 50%{left:70%;top:45%} 75%{left:40%;top:55%} }
    @keyframes bird { from{left:-10%} to{left:110%} }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes glow { 0%,100%{filter:drop-shadow(0 0 8px #FFD700)} 50%{filter:drop-shadow(0 0 20px #FFD700)} }
  </style>
</div>`
  },
  {
    id: 'tech',
    icon: '💻',
    name: 'Tech & Data',
    desc: 'Dashboard animé avec données qui circulent',
    code: `
<div style="width:100%;height:300px;background:#0a0a1a;position:relative;overflow:hidden;border-radius:16px;padding:20px;font-family:monospace">
  <!-- Grid background -->
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.1) 1px,transparent 1px);background-size:30px 30px"></div>
  <!-- Particules de données -->
  <div style="position:absolute;width:4px;height:4px;background:#6366f1;border-radius:50%;animation:particle 3s linear infinite;top:20%"></div>
  <div style="position:absolute;width:3px;height:3px;background:#8b5cf6;border-radius:50%;animation:particle 4s linear infinite 1s;top:50%"></div>
  <div style="position:absolute;width:5px;height:5px;background:#06b6d4;border-radius:50%;animation:particle 5s linear infinite 2s;top:70%"></div>
  <!-- Stats animées -->
  <div style="position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:15px">
    <div style="background:rgba(99,102,241,0.2);border:1px solid #6366f1;border-radius:8px;padding:10px;text-align:center">
      <div style="color:#6366f1;font-size:1.5rem;font-weight:bold;animation:count 2s ease-in-out infinite">📈</div>
      <div style="color:#a5b4fc;font-size:0.7rem">Revenue</div>
      <div style="color:white;font-weight:bold;animation:pulse 2s infinite">$12.4K</div>
    </div>
    <div style="background:rgba(139,92,246,0.2);border:1px solid #8b5cf6;border-radius:8px;padding:10px;text-align:center">
      <div style="color:#8b5cf6;font-size:1.5rem;animation:count 3s ease-in-out infinite">👥</div>
      <div style="color:#c4b5fd;font-size:0.7rem">Users</div>
      <div style="color:white;font-weight:bold;animation:pulse 3s infinite">2,847</div>
    </div>
    <div style="background:rgba(6,182,212,0.2);border:1px solid #06b6d4;border-radius:8px;padding:10px;text-align:center">
      <div style="color:#06b6d4;font-size:1.5rem;animation:count 2.5s ease-in-out infinite">⚡</div>
      <div style="color:#a5f3fc;font-size:0.7rem">Speed</div>
      <div style="color:white;font-weight:bold;animation:pulse 2.5s infinite">99.9%</div>
    </div>
  </div>
  <!-- Graphique barre animé -->
  <div style="position:relative;z-index:1;display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 10px">
    <div style="flex:1;background:linear-gradient(to top,#6366f1,#8b5cf6);border-radius:4px 4px 0 0;animation:bar1 2s ease-in-out infinite">
    </div>
    <div style="flex:1;background:linear-gradient(to top,#8b5cf6,#a78bfa);border-radius:4px 4px 0 0;animation:bar2 2s ease-in-out infinite 0.2s">
    </div>
    <div style="flex:1;background:linear-gradient(to top,#06b6d4,#22d3ee);border-radius:4px 4px 0 0;animation:bar3 2s ease-in-out infinite 0.4s">
    </div>
    <div style="flex:1;background:linear-gradient(to top,#6366f1,#8b5cf6);border-radius:4px 4px 0 0;animation:bar4 2s ease-in-out infinite 0.6s">
    </div>
    <div style="flex:1;background:linear-gradient(to top,#8b5cf6,#a78bfa);border-radius:4px 4px 0 0;animation:bar5 2s ease-in-out infinite 0.8s">
    </div>
    <div style="flex:1;background:linear-gradient(to top,#06b6d4,#22d3ee);border-radius:4px 4px 0 0;animation:bar6 2s ease-in-out infinite 1s">
    </div>
  </div>
  <!-- Code qui défile -->
  <div style="position:absolute;bottom:10px;left:20px;right:20px;color:#4ade80;font-size:0.6rem;animation:code 3s steps(1) infinite;opacity:0.7">
    > Analyzing data... ✓ Processing 2,847 records... ✓ AI model trained ✓
  </div>
  <style>
    @keyframes particle { from{left:-5%} to{left:105%} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes count { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
    @keyframes bar1 { 0%,100%{height:40px} 50%{height:70px} }
    @keyframes bar2 { 0%,100%{height:60px} 50%{height:30px} }
    @keyframes bar3 { 0%,100%{height:50px} 50%{height:75px} }
    @keyframes bar4 { 0%,100%{height:35px} 50%{height:60px} }
    @keyframes bar5 { 0%,100%{height:65px} 50%{height:40px} }
    @keyframes bar6 { 0%,100%{height:45px} 50%{height:70px} }
    @keyframes code { 0%{opacity:0.7} 50%{opacity:0.3} 100%{opacity:0.7} }
  </style>
</div>`
  },
]

export default function Animations() {
  const [selected, setSelected] = useState('ocean')
  const [copied, setCopied] = useState(false)

  const current = animations.find(a => a.id === selected)!

  const copy = () => {
    navigator.clipboard.writeText(current.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${current.name}</title></head><body style="margin:0;padding:20px;background:#111">${current.code}</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${current.id}-animation.html`
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🎬 Animations IA</h1>
          <p className="text-gray-500 mt-1">Images animées pour ton site — océan, nourriture, espace et plus</p>
        </div>

        {/* Sélection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {animations.map(a => (
            <button key={a.id} onClick={() => setSelected(a.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selected === a.id ? 'bg-indigo-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800'}`}>
              <span className="text-2xl">{a.icon}</span>
              <div>
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="text-xs opacity-60">{a.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className="font-semibold">{current.icon} {current.name}</span>
            <div className="flex gap-2">
              <button onClick={copy}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1.5 px-4 rounded-xl transition-all">
                {copied ? '✅ Copié !' : '📋 Copier HTML'}
              </button>
              <button onClick={download}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-1.5 px-4 rounded-xl transition-all">
                📥 Télécharger
              </button>
            </div>
          </div>
          <div className="p-4">
            <div dangerouslySetInnerHTML={{ __html: current.code }} />
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-4">
          <p className="text-indigo-300 text-sm">💡 Ces animations sont en CSS pur — zéro dépendance, copie le code HTML et colle-le directement dans ton site généré par Nexoro !</p>
        </div>
      </div>
    </main>
  )
}
