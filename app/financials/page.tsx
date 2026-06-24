'use client'
import { useState } from 'react'

const models = ['SaaS', 'Marketplace', 'E-commerce', 'Agency', 'Freemium']

export default function Financials() {
  const [startup, setStartup] = useState('')
  const [model, setModel] = useState('SaaS')
  const [price, setPrice] = useState('49')
  const [growth, setGrowth] = useState('20')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup) return
    setLoading(true)
    setData(null)
    try {
      const res = await fetch('/api/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, model, price, growth })
      })
      const json = await res.json()
      setData(json)
    } catch {}
    setLoading(false)
  }

  const maxRevenue = data ? Math.max(...data.months.map((m: any) => m.revenue)) : 0
  const maxCustomers = data ? Math.max(...data.months.map((m: any) => m.customers)) : 0

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">📊 Financials IA</h1>
          <p className="text-gray-500 mt-1">Projections financières interactives sur 12 mois</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Modèle</label>
              <select value={model} onChange={e => setModel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500">
                {models.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Prix ($)/mois</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Croissance %/mois</label>
              <input type="number" value={growth} onChange={e => setGrowth(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Startup</label>
              <input value={startup} onChange={e => setStartup(e.target.value)}
                placeholder="Ex: FastFoodGenie"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <button onClick={generate} disabled={loading || !startup}
            className="w-full bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
            {loading ? '📊 Calcul en cours...' : '📊 Générer les projections'}
          </button>
        </div>

        {data && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Revenus An 1', value: `$${data.year1?.toLocaleString()}`, color: 'text-green-400' },
                { label: 'Revenus An 2', value: `$${data.year2?.toLocaleString()}`, color: 'text-blue-400' },
                { label: 'Revenus An 3', value: `$${data.year3?.toLocaleString()}`, color: 'text-purple-400' },
                { label: 'Break-even', value: data.breakeven, color: 'text-orange-400' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{kpi.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">${data.cac?.toLocaleString()}</div>
                <div className="text-gray-500 text-sm mt-1">CAC (Coût acquisition client)</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">${data.ltv?.toLocaleString()}</div>
                <div className="text-gray-500 text-sm mt-1">LTV (Valeur vie client)</div>
              </div>
            </div>

            {/* Graphique revenus */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">💰 Revenus mensuels</h2>
              <div className="flex items-end gap-2 h-48">
                {data.months.map((m: any) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-green-400 font-semibold">
                      {m.revenue > 0 ? `$${(m.revenue/1000).toFixed(0)}k` : ''}
                    </div>
                    <div className="w-full rounded-t-lg transition-all"
                      style={{
                        height: maxRevenue > 0 ? `${(m.revenue / maxRevenue) * 160}px` : '4px',
                        background: 'linear-gradient(to top, #059669, #34d399)',
                        minHeight: '4px'
                      }} />
                    <div className="text-xs text-gray-500">{m.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphique clients */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">👥 Clients mensuels</h2>
              <div className="flex items-end gap-2 h-48">
                {data.months.map((m: any) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-blue-400 font-semibold">
                      {m.customers > 0 ? m.customers : ''}
                    </div>
                    <div className="w-full rounded-t-lg transition-all"
                      style={{
                        height: maxCustomers > 0 ? `${(m.customers / maxCustomers) * 160}px` : '4px',
                        background: 'linear-gradient(to top, #2563eb, #60a5fa)',
                        minHeight: '4px'
                      }} />
                    <div className="text-xs text-gray-500">{m.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <h2 className="text-lg font-semibold p-4 border-b border-gray-800">📋 Tableau détaillé</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3 text-left text-gray-400">Mois</th>
                      <th className="p-3 text-right text-gray-400">Clients</th>
                      <th className="p-3 text-right text-gray-400">Revenus</th>
                      <th className="p-3 text-right text-gray-400">Dépenses</th>
                      <th className="p-3 text-right text-gray-400">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.months.map((m: any, i: number) => (
                      <tr key={m.month} className={`border-t border-gray-800 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}`}>
                        <td className="p-3 font-medium">{m.month}</td>
                        <td className="p-3 text-right text-blue-400">{m.customers}</td>
                        <td className="p-3 text-right text-green-400">${m.revenue?.toLocaleString()}</td>
                        <td className="p-3 text-right text-red-400">${m.expenses?.toLocaleString()}</td>
                        <td className={`p-3 text-right font-semibold ${m.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${m.profit?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.summary && (
              <div className="bg-indigo-900/20 border border-indigo-800 rounded-2xl p-4">
                <p className="text-indigo-300 text-sm leading-relaxed">💡 {data.summary}</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
