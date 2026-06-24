'use client'
import { useState } from 'react'

const animations = [
  {
    id: 'sushi',
    icon: '🍣',
    name: 'Sushis Tournants',
    desc: 'Plateau de sushis qui tourne',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a0a00; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; overflow: hidden; }
.scene { position: relative; width: 400px; height: 400px; }
.plate { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 300px; height: 30px; background: linear-gradient(180deg, #f5f5f0, #e0e0d8); border-radius: 50%; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: plateSpin 4s linear infinite; }
.plate-inner { position: absolute; top: 2px; left: 10px; right: 10px; height: 20px; background: linear-gradient(180deg, #ffffff, #f0f0e8); border-radius: 50%; }
.sushi-orbit { position: absolute; bottom: 25px; left: 50%; transform-origin: 0 0; animation: orbit 4s linear infinite; }
.sushi-orbit:nth-child(2) { animation-delay: -1s; }
.sushi-orbit:nth-child(3) { animation-delay: -2s; }
.sushi-orbit:nth-child(4) { animation-delay: -3s; }
.sushi { font-size: 2.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
.steam { position: absolute; font-size: 1.5rem; animation: steam 2s ease-out infinite; }
.steam:nth-child(1) { left: 30%; animation-delay: 0s; }
.steam:nth-child(2) { left: 50%; animation-delay: 0.5s; }
.steam:nth-child(3) { left: 70%; animation-delay: 1s; }
.title { position: absolute; top: 20px; width: 100%; text-align: center; color: #ff6b35; font-size: 1.5rem; font-weight: bold; text-shadow: 0 2px 10px rgba(255,107,53,0.5); animation: pulse 2s ease-in-out infinite; }
.chopsticks { position: absolute; right: 20px; bottom: 60px; font-size: 3rem; animation: chopstick 2s ease-in-out infinite; transform-origin: bottom; }
.bg-japanese { position: fixed; inset: 0; background: radial-gradient(ellipse at center, #2d1a0a 0%, #1a0a00 100%); }
.circle-deco { position: fixed; width: 200px; height: 200px; border: 2px solid #ff6b3520; border-radius: 50%; animation: expand 4s ease-out infinite; }
.circle-deco:nth-child(2) { animation-delay: 1.5s; width: 350px; height: 350px; }
.circle-deco:nth-child(3) { animation-delay: 3s; width: 500px; height: 500px; }
@keyframes orbit { from { transform: rotate(0deg) translateX(120px) rotate(0deg); } to { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
@keyframes plateSpin { from { transform: translateX(-50%) rotateY(0deg); } to { transform: translateX(-50%) rotateY(360deg); } }
@keyframes steam { 0% { transform: translateY(0); opacity: 0.8; } 100% { transform: translateY(-60px); opacity: 0; } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes chopstick { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
@keyframes expand { 0% { opacity: 0.8; transform: translate(-50%,-50%) scale(0.5); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(2); } }
</style></head><body>
<div class="bg-japanese"></div>
<div class="circle-deco" style="position:fixed;top:50%;left:50%;"></div>
<div class="circle-deco" style="position:fixed;top:50%;left:50%;"></div>
<div class="circle-deco" style="position:fixed;top:50%;left:50%;"></div>
<div class="scene">
  <div class="title">🍣 Sushi Paradise</div>
  <div class="steam" style="position:absolute;bottom:80px;">💨</div>
  <div class="steam" style="position:absolute;bottom:80px;">💨</div>
  <div class="steam" style="position:absolute;bottom:80px;">💨</div>
  <div class="sushi-orbit"><div class="sushi">🍣</div></div>
  <div class="sushi-orbit"><div class="sushi">🍱</div></div>
  <div class="sushi-orbit"><div class="sushi">🥢</div></div>
  <div class="sushi-orbit"><div class="sushi">🍤</div></div>
  <div class="plate"><div class="plate-inner"></div></div>
  <div class="chopsticks">🥢</div>
</div>
</body></html>`
  },
  {
    id: 'pizza',
    icon: '🍕',
    name: 'Pizza Tournante',
    desc: 'Pizza qui tourne avec vapeur',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a0500; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
.pizza-scene { position: relative; width: 350px; height: 350px; }
.pizza { font-size: 10rem; animation: spin 8s linear infinite; display: block; text-align: center; filter: drop-shadow(0 20px 40px rgba(255,100,0,0.5)); }
.steam { position: absolute; font-size: 2rem; animation: steamUp 1.5s ease-out infinite; }
.ingredients { position: absolute; font-size: 2rem; animation: orbit 3s linear infinite; }
.ingredients:nth-child(3) { animation-delay: -1s; }
.ingredients:nth-child(4) { animation-delay: -2s; }
.title { position: absolute; bottom: -20px; width: 100%; text-align: center; color: #ff6b35; font-size: 2rem; font-weight: 900; }
.bg { position: fixed; inset: 0; background: radial-gradient(ellipse, #3d1500, #1a0500); }
.flame { position: fixed; bottom: 0; font-size: 4rem; animation: flicker 0.5s ease-in-out infinite alternate; }
.flame:nth-child(2) { left: 10%; animation-delay: 0.1s; }
.flame:nth-child(3) { left: 30%; animation-delay: 0.2s; }
.flame:nth-child(4) { left: 50%; animation-delay: 0.15s; }
.flame:nth-child(5) { left: 70%; animation-delay: 0.05s; }
.flame:nth-child(6) { left: 85%; animation-delay: 0.25s; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes steamUp { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-80px);opacity:0} }
@keyframes orbit { from{transform:rotate(0deg)translateX(160px)rotate(0deg)} to{transform:rotate(360deg)translateX(160px)rotate(-360deg)} }
@keyframes flicker { from{transform:scaleY(1)} to{transform:scaleY(1.3)} }
</style></head><body>
<div class="bg"></div>
<div class="flame">🔥</div><div class="flame">🔥</div><div class="flame">🔥</div><div class="flame">🔥</div><div class="flame">🔥</div>
<div class="pizza-scene">
  <div class="pizza">🍕</div>
  <div class="steam" style="top:-30px;left:30%">💨</div>
  <div class="steam" style="top:-20px;left:50%;animation-delay:0.5s">💨</div>
  <div class="steam" style="top:-40px;left:65%;animation-delay:1s">💨</div>
  <div class="ingredients" style="position:absolute;top:50%;left:50%;transform-origin:0 0">🧀</div>
  <div class="ingredients" style="position:absolute;top:50%;left:50%;transform-origin:0 0">🍅</div>
  <div class="title">🍕 Bella Pizza</div>
</div>
</body></html>`
  },
  {
    id: 'burger',
    icon: '🍔',
    name: 'Burger Assemblage',
    desc: 'Burger qui s\'assemble couche par couche',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1000; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; font-family: sans-serif; }
.burger-stack { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.layer { font-size: 4rem; animation: dropIn 0.5s ease both; transform-origin: center; }
.layer:nth-child(1){animation-delay:0.5s} .layer:nth-child(2){animation-delay:1s}
.layer:nth-child(3){animation-delay:1.5s} .layer:nth-child(4){animation-delay:2s}
.layer:nth-child(5){animation-delay:2.5s} .layer:nth-child(6){animation-delay:3s}
.layer:nth-child(7){animation-delay:3.5s}
.title { font-size: 2.5rem; font-weight: 900; color: #ff6b35; margin-top: 20px; animation: fadeIn 1s ease 4s both; text-shadow: 0 0 30px #ff6b3580; }
.stars { position: fixed; font-size: 1.5rem; animation: twinkle 2s ease-in-out infinite; }
.bg { position: fixed; inset: 0; background: radial-gradient(ellipse, #3d2800, #1a1000); }
@keyframes dropIn { from{transform:translateY(-200px) scale(0);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
@keyframes fadeIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
@keyframes twinkle { 0%,100%{opacity:1} 50%{opacity:0.3} }
</style></head><body>
<div class="bg"></div>
<div class="stars" style="top:10%;left:10%">⭐</div>
<div class="stars" style="top:20%;right:15%;animation-delay:0.5s">✨</div>
<div class="stars" style="top:70%;left:20%;animation-delay:1s">⭐</div>
<div class="stars" style="top:80%;right:10%;animation-delay:1.5s">✨</div>
<div class="burger-stack">
  <div class="layer">🍞</div>
  <div class="layer">🥬</div>
  <div class="layer">🍅</div>
  <div class="layer">🧀</div>
  <div class="layer">🥩</div>
  <div class="layer">🥒</div>
  <div class="layer">🍞</div>
</div>
<div class="title">🍔 Le Burger Parfait</div>
</body></html>`
  },
  {
    id: 'cocktail',
    icon: '🍹',
    name: 'Cocktail Bar',
    desc: 'Cocktails qui se préparent',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a001a; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
.bar-scene { position: relative; width: 500px; height: 400px; text-align: center; }
.cocktail-main { font-size: 8rem; animation: float 3s ease-in-out infinite; filter: drop-shadow(0 0 30px rgba(255,100,200,0.8)); }
.orbit-drink { position: absolute; font-size: 3rem; animation: orbit 5s linear infinite; top: 50%; left: 50%; transform-origin: 0 0; }
.orbit-drink:nth-child(3){animation-delay:-1.5s} .orbit-drink:nth-child(4){animation-delay:-3s}
.bubbles { position: absolute; font-size: 1rem; animation: bubble 2s ease-in infinite; }
.title { position: absolute; bottom: 0; width: 100%; color: #ff69b4; font-size: 2rem; font-weight: 900; text-shadow: 0 0 20px #ff69b480; animation: pulse 2s ease-in-out infinite; }
.neon { position: fixed; top: 20px; font-size: 1.5rem; font-weight: bold; color: #ff69b4; text-shadow: 0 0 20px #ff69b4; animation: neonFlicker 3s ease-in-out infinite; width: 100%; text-align: center; }
.bg { position: fixed; inset: 0; background: radial-gradient(ellipse at 30% 70%, #1a0033, #0a001a); }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
@keyframes orbit { from{transform:rotate(0deg)translateX(150px)rotate(0deg)} to{transform:rotate(360deg)translateX(150px)rotate(-360deg)} }
@keyframes bubble { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-100px);opacity:0} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
@keyframes neonFlicker { 0%,100%{opacity:1} 50%{opacity:0.8} 75%{opacity:1} 80%{opacity:0.5} }
</style></head><body>
<div class="bg"></div>
<div class="neon">🍹 COCKTAIL BAR 🍹</div>
<div class="bar-scene">
  <div class="cocktail-main">🍹</div>
  <div class="orbit-drink">🍸</div>
  <div class="orbit-drink">🥂</div>
  <div class="orbit-drink">🍾</div>
  <div class="bubbles" style="left:30%;top:20%">🫧</div>
  <div class="bubbles" style="left:50%;top:30%;animation-delay:0.5s">🫧</div>
  <div class="bubbles" style="left:70%;top:15%;animation-delay:1s">🫧</div>
  <div class="title">Shake it, Make it! ✨</div>
</div>
</body></html>`
  },
  {
    id: 'cake',
    icon: '🎂',
    name: 'Gâteau Célébration',
    desc: 'Gâteau d\'anniversaire animé',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a0a1a; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
.cake { font-size: 10rem; animation: bounce 1s ease-in-out infinite; filter: drop-shadow(0 0 40px rgba(255,200,0,0.6)); }
.candles { font-size: 3rem; display: flex; gap: 10px; margin-top: -20px; animation: flicker 0.3s ease-in-out infinite alternate; }
.confetti { position: fixed; font-size: 2rem; animation: fall linear infinite; }
.title { font-size: 3rem; font-weight: 900; color: #ffd700; text-shadow: 0 0 30px #ffd70080; animation: rainbow 3s linear infinite; margin-top: 20px; }
.subtitle { color: #ff69b4; font-size: 1.2rem; margin-top: 10px; animation: pulse 2s ease-in-out infinite; }
.bg { position: fixed; inset: 0; background: radial-gradient(ellipse, #2d0a2d, #1a0a1a); }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
@keyframes flicker { from{opacity:1} to{opacity:0.7} }
@keyframes fall { 0%{transform:translateY(-100px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(360deg);opacity:0} }
@keyframes rainbow { 0%{color:#ffd700} 33%{color:#ff69b4} 66%{color:#00bfff} 100%{color:#ffd700} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
</style></head><body>
<div class="bg"></div>
${Array.from({length: 15}, (_, i) => `<div class="confetti" style="left:${Math.random()*100}%;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*2}s">${['🎉','🎊','⭐','✨','🌟'][Math.floor(Math.random()*5)]}</div>`).join('')}
<div class="cake">🎂</div>
<div class="candles">🕯️🕯️🕯️🕯️🕯️</div>
<div class="title">🎉 Joyeux Anniversaire !</div>
<div class="subtitle">✨ Souffle les bougies ✨</div>
</body></html>`
  },
  {
    id: 'ramen',
    icon: '🍜',
    name: 'Ramen Fumant',
    desc: 'Bol de ramen avec vapeur',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0505; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; font-family: sans-serif; }
.bowl { font-size: 10rem; animation: wobble 3s ease-in-out infinite; filter: drop-shadow(0 20px 40px rgba(255,100,0,0.4)); }
.steam-container { position: relative; height: 80px; width: 200px; }
.steam { position: absolute; font-size: 2.5rem; animation: steamRise 2s ease-out infinite; }
.steam:nth-child(1){left:20%;animation-delay:0s}
.steam:nth-child(2){left:45%;animation-delay:0.6s}
.steam:nth-child(3){left:70%;animation-delay:1.2s}
.chopstick { position: absolute; font-size: 4rem; animation: stir 4s ease-in-out infinite; }
.chopstick-1 { right: 80px; animation-delay: 0s; }
.chopstick-2 { right: 60px; animation-delay: 0.2s; }
.title { color: #ff4500; font-size: 2.5rem; font-weight: 900; margin-top: 20px; text-shadow: 0 0 30px rgba(255,69,0,0.5); }
.subtitle { color: #ffa500; font-size: 1rem; margin-top: 8px; opacity: 0.8; }
.bg { position: fixed; inset: 0; background: radial-gradient(ellipse, #200808, #0a0505); }
.lantern { position: fixed; font-size: 3rem; animation: swing 4s ease-in-out infinite; }
.lantern-1 { top: 20px; left: 20px; }
.lantern-2 { top: 20px; right: 20px; animation-delay: 2s; }
@keyframes wobble { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
@keyframes steamRise { 0%{transform:translateY(0) scale(1);opacity:0.9} 100%{transform:translateY(-80px) scale(1.5);opacity:0} }
@keyframes stir { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(20deg)} }
@keyframes swing { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
</style></head><body>
<div class="bg"></div>
<div class="lantern lantern-1">🏮</div>
<div class="lantern lantern-2">🏮</div>
<div class="steam-container">
  <div class="steam">💨</div>
  <div class="steam">💨</div>
  <div class="steam">💨</div>
</div>
<div style="position:relative">
  <div class="bowl">🍜</div>
  <div class="chopstick chopstick-1">🥢</div>
</div>
<div class="title">🍜 Ramen Maison</div>
<div class="subtitle">Recette traditionnelle japonaise 🇯🇵</div>
</body></html>`
  },
]

export default function FoodAnim() {
  const [selected, setSelected] = useState('sushi')
  const [copied, setCopied] = useState(false)
  const current = animations.find(a => a.id === selected)!

  const copy = () => {
    navigator.clipboard.writeText(current.html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([current.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${current.id}-animation.html`
    a.click()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🍽️ Food Animations</h1>
          <p className="text-gray-500 mt-1">Animations culinaires pour ton site restaurant</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {animations.map(a => (
            <button key={a.id} onClick={() => setSelected(a.id)}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all text-left ${selected === a.id ? 'bg-indigo-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800'}`}>
              <span className="text-3xl">{a.icon}</span>
              <div>
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-xs opacity-60">{a.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className="font-semibold">{current.icon} {current.name}</span>
            <div className="flex gap-2">
              <button onClick={copy}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1.5 px-4 rounded-xl">
                {copied ? '✅ Copié !' : '📋 Copier HTML'}
              </button>
              <button onClick={download}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-1.5 px-4 rounded-xl">
                📥 Télécharger
              </button>
            </div>
          </div>
          <div className="relative w-full h-96">
            <iframe srcDoc={current.html} className="w-full h-full border-0"
              sandbox="allow-scripts" title={current.name} />
          </div>
        </div>

        <div className="bg-gray-900 border border-indigo-800 rounded-2xl p-4">
          <p className="text-indigo-300 text-sm">💡 Copie le HTML et colle-le directement dans ton site généré par Nexoro — zéro dépendance, fonctionne partout !</p>
        </div>
      </div>
    </main>
  )
}
