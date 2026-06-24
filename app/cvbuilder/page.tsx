'use client'
import { useState } from 'react'

const templates = [
  { id: 'modern', name: '⚡ Modern', color: '#6366f1' },
  { id: 'classic', name: '🎩 Classic', color: '#1a1a1a' },
  { id: 'creative', name: '🎨 Creative', color: '#ec4899' },
  { id: 'minimal', name: '⬜ Minimal', color: '#6b7280' },
]
const languages = ['English', 'French', 'Arabic', 'Spanish']

export default function CVBuilder() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [experience, setExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [education, setEducation] = useState('')
  const [template, setTemplate] = useState('modern')
  const [language, setLanguage] = useState('English')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!name || !title) return
    setLoading(true)
    setData(null)
    try {
      const res = await fetch('/api/cvbuilder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, experience, skills, education, language })
      })
      const json = await res.json()
      setData(json)
    } catch {}
    setLoading(false)
  }

  const selectedTemplate = templates.find(t => t.id === template)!

  const exportPDF = () => {
    if (!data) return
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CV - ${data.name}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Helvetica Neue',sans-serif;color:#1a1a1a;max-width:800px;margin:0 auto}
      .header{background:${selectedTemplate.color};color:white;padding:40px;display:flex;align-items:center;gap:30px}
      .avatar{width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:bold}
      .header-info h1{font-size:2rem;font-weight:900}
      .header-info p{opacity:0.9;font-size:1.1rem;margin-top:4px}
      .body{display:grid;grid-template-columns:1fr 2fr;min-height:calc(100vh - 160px)}
      .sidebar{background:#f8f9fa;padding:30px}
      .main{padding:30px}
      .section{margin-bottom:24px}
      .section-title{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${selectedTemplate.color};margin-bottom:12px;padding-bottom:4px;border-bottom:2px solid ${selectedTemplate.color}}
      .skill-tag{display:inline-block;background:${selectedTemplate.color}20;color:${selectedTemplate.color};padding:4px 10px;border-radius:20px;font-size:0.75rem;margin:3px;font-weight:600}
      .exp-item{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e5e7eb}
      .exp-item:last-child{border-bottom:none}
      .exp-title{font-weight:700;color:#1a1a1a}
      .exp-company{color:${selectedTemplate.color};font-weight:600;font-size:0.9rem}
      .exp-period{color:#6b7280;font-size:0.8rem;margin-bottom:8px}
      .achievement{font-size:0.85rem;color:#374151;padding:2px 0}
      .achievement::before{content:"▸ ";color:${selectedTemplate.color}}
      .summary{font-size:0.9rem;line-height:1.7;color:#374151}
      .edu-item{margin-bottom:12px}
      .edu-degree{font-weight:700}
      .edu-school{color:#6b7280;font-size:0.85rem}
      .lang-item{display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem}
      .footer{background:#1a1a1a;color:white;padding:12px;text-align:center;font-size:0.75rem;opacity:0.5}
    </style></head><body>
    <div class="header">
      <div class="avatar">${data.name?.charAt(0) || 'N'}</div>
      <div class="header-info">
        <h1>${data.name}</h1>
        <p>${data.title}</p>
      </div>
    </div>
    <div class="body">
      <div class="sidebar">
        <div class="section">
          <div class="section-title">Skills</div>
          <div>${data.skills?.technical?.map((s: string) => `<span class="skill-tag">${s}</span>`).join('') || ''}</div>
        </div>
        <div class="section">
          <div class="section-title">Soft Skills</div>
          <div>${data.skills?.soft?.map((s: string) => `<span class="skill-tag">${s}</span>`).join('') || ''}</div>
        </div>
        <div class="section">
          <div class="section-title">Education</div>
          ${data.education?.map((e: any) => `<div class="edu-item"><div class="edu-degree">${e.degree}</div><div class="edu-school">${e.school} • ${e.year}</div></div>`).join('') || ''}
        </div>
        <div class="section">
          <div class="section-title">Languages</div>
          ${data.languages?.map((l: string) => `<div class="lang-item"><span>${l}</span></div>`).join('') || ''}
        </div>
        ${data.certifications?.length ? `<div class="section"><div class="section-title">Certifications</div>${data.certifications.map((c: string) => `<div style="font-size:0.85rem;margin-bottom:6px">🏆 ${c}</div>`).join('')}</div>` : ''}
      </div>
      <div class="main">
        <div class="section">
          <div class="section-title">Profile</div>
          <p class="summary">${data.summary}</p>
        </div>
        <div class="section">
          <div class="section-title">Experience</div>
          ${data.experience?.map((e: any) => `
          <div class="exp-item">
            <div class="exp-title">${e.role}</div>
            <div class="exp-company">${e.company}</div>
            <div class="exp-period">${e.period}</div>
            ${e.achievements?.map((a: string) => `<div class="achievement">${a}</div>`).join('') || ''}
          </div>`).join('') || ''}
        </div>
      </div>
    </div>
    <div class="footer">Generated by ⚡ Nexoro AI CV Builder</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">📄 CV Builder IA</h1>
            <p className="text-gray-500 mt-1">CV professionnel généré par IA en 2 minutes</p>
          </div>
          {data && <button onClick={exportPDF} className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-xl">📥 Export PDF</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">🎨 Template</h2>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all ${template === t.id ? 'ring-2 ring-white' : 'hover:opacity-80'}`}
                  style={{ background: t.color, color: 'white' }}>
                  {t.name}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-400 mb-2">🌍 Language</h2>
              <div className="flex gap-2 flex-wrap">
                {languages.map(l => (
                  <button key={l} onClick={() => setLanguage(l)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${language === l ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Full Name *"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Job Title * — Ex: Senior Software Engineer"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
            <textarea value={experience} onChange={e => setExperience(e.target.value)}
              placeholder="Work Experience — Ex: 5 years at Google as Frontend Dev, 3 years at Startup as CTO..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
            <textarea value={skills} onChange={e => setSkills(e.target.value)}
              placeholder="Skills — Ex: React, Node.js, Python, Leadership, Communication..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-16 focus:outline-none focus:border-indigo-500" />
            <input value={education} onChange={e => setEducation(e.target.value)}
              placeholder="Education — Ex: MIT Computer Science 2018, Harvard MBA 2020"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <button onClick={generate} disabled={loading || !name || !title}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
          {loading ? '📄 Generating CV...' : '📄 Generate Professional CV'}
        </button>

        {data && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
              <span className="font-semibold">✅ CV Generated — {data.name}</span>
              <button onClick={exportPDF} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-1.5 px-4 rounded-xl">📥 Download PDF</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl overflow-hidden border border-gray-700">
                <div className="p-4 text-white" style={{ background: selectedTemplate.color }}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">{data.name?.charAt(0)}</div>
                    <div>
                      <h2 className="text-2xl font-black">{data.name}</h2>
                      <p className="opacity-90">{data.title}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-gray-800">
                  <div className="col-span-1 p-4 border-r border-gray-700">
                    <p className="text-xs font-semibold mb-2" style={{ color: selectedTemplate.color }}>SKILLS</p>
                    <div className="flex flex-wrap gap-1">
                      {data.skills?.technical?.map((s: string) => (
                        <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ background: selectedTemplate.color + '30', color: selectedTemplate.color }}>{s}</span>
                      ))}
                    </div>
                    <p className="text-xs font-semibold mt-3 mb-2" style={{ color: selectedTemplate.color }}>EDUCATION</p>
                    {data.education?.map((e: any) => (
                      <div key={e.school} className="mb-2">
                        <p className="text-xs font-semibold text-white">{e.degree}</p>
                        <p className="text-xs text-gray-400">{e.school} • {e.year}</p>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-2 p-4">
                    <p className="text-xs font-semibold mb-2" style={{ color: selectedTemplate.color }}>PROFILE</p>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">{data.summary}</p>
                    <p className="text-xs font-semibold mb-2" style={{ color: selectedTemplate.color }}>EXPERIENCE</p>
                    {data.experience?.map((e: any) => (
                      <div key={e.company} className="mb-3">
                        <p className="text-sm font-bold text-white">{e.role}</p>
                        <p className="text-xs font-semibold" style={{ color: selectedTemplate.color }}>{e.company} • {e.period}</p>
                        {e.achievements?.slice(0,2).map((a: string) => (
                          <p key={a} className="text-xs text-gray-400 mt-1">▸ {a}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
