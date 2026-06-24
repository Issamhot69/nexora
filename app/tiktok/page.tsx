'use client'
import { useState } from 'react'

const niches = ['Business & Finance', 'Health & Fitness', 'Food & Cooking', 'Travel', 'Tech & AI', 'Fashion & Beauty', 'Education', 'Comedy', 'Motivation', 'Real Estate']
const goals = ['Get Followers', 'Sell Product', 'Build Brand', 'Educate', 'Entertain', 'Go Viral']

export default function TikTok() {
  const [niche, setNiche] = useState('Business & Finance')
  const [goal, setGoal] = useState('Go Viral')
  const [count, setCount] = useState(5)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)

  const generate = async () => {
    setLoading(true)
    setData(null)
    try {
      const res = await fetch('/api/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goal, count })
      })
      const json = await res.json()
      setData(json)
      setSelected(0)
    } catch {}
    setLoading(false)
  }

  const script = data?.scripts?.[selected]

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">📱 TikTok Script Generator</h1>
          <p className="text-gray-500 mt-1">Scripts viraux générés par IA pour TikTok & Reels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-3">🎯 Niche</h2>
            <div className="grid grid-cols-2 gap-2">
              {niches.map(n => (
                <button key={n} onClick={() => setNiche(n)}
                  className={`p-2 rounded-xl text-xs font-medium transition-all text-left ${niche === n ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">🎯 Goal</h2>
              <div className="grid grid-cols-2 gap-2">
                {goals.map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`p-2 rounded-xl text-xs font-medium transition-all ${goal === g ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">📝 Number of scripts</h2>
              <div className="flex gap-2">
                {[3, 5, 10].map(n => (
                  <button key={n} onClick={() => setCount(n)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${count === n ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
          {loading ? '📱 Generating scripts...' : `📱 Generate ${count} Viral Scripts`}
        </button>

        {data?.scripts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              {data.scripts.map((s: any, i: number) => (
                <button key={i} onClick={() => setSelected(i)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${selected === i ? 'bg-pink-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800'}`}>
                  <div className="font-semibold text-sm truncate">{s.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs opacity-70">{s.type}</span>
                    <span className="text-xs opacity-70">⏱️ {s.duration}</span>
                    <span className="text-xs">🔥 {s.virality_score}/10</span>
                  </div>
                </button>
              ))}
            </div>

            {script && (
              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-900 border border-pink-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-pink-400">{script.title}</h3>
                    <div className="flex gap-2">
                      <span className="bg-pink-900/30 text-pink-400 text-xs px-3 py-1 rounded-full">{script.type}</span>
                      <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">⏱️ {script.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                      <p className="text-xs text-red-400 font-semibold mb-1">🎣 HOOK (First 3 seconds)</p>
                      <p className="text-white font-semibold">"{script.hook}"</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-xs text-gray-400 font-semibold mb-2">📝 SCRIPT</p>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{script.content}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                      <p className="text-xs text-green-400 font-semibold mb-1">📣 CALL TO ACTION</p>
                      <p className="text-white">{script.cta}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">🏷️ Hashtags</p>
                      <div className="flex flex-wrap gap-2">
                        {script.hashtags?.map((h: string) => (
                          <span key={h} className="bg-pink-900/30 text-pink-400 text-xs px-2 py-1 rounded-lg">{h}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(`${script.hook}\n\n${script.content}\n\n${script.cta}\n\n${script.hashtags?.join(' ')}`)}
                      className="w-full bg-pink-600 hover:bg-pink-500 text-white font-semibold py-2 rounded-xl transition-all">
                      📋 Copy Full Script
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
