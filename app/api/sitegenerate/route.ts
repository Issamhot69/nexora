import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, template, color } = await req.json()

  // Étape 1: Groq génère le contenu JSON
  const contentRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{
        role: 'system',
        content: 'You are a startup branding expert. Return ONLY valid JSON, no markdown, no explanation.'
      }, {
        role: 'user',
        content: `For this startup: "${prompt}"
Return ONLY this JSON structure:
{
  "name": "startup name",
  "tagline": "powerful one-line tagline",
  "description": "2 sentence description",
  "color1": "#hexcolor (primary brand color)",
  "color2": "#hexcolor (secondary brand color)",
  "features": [
    {"icon": "emoji", "title": "feature name", "desc": "feature description"},
    {"icon": "emoji", "title": "feature name", "desc": "feature description"},
    {"icon": "emoji", "title": "feature name", "desc": "feature description"},
    {"icon": "emoji", "title": "feature name", "desc": "feature description"}
  ],
  "pricing": [
    {"name": "Starter", "price": "$X", "desc": "for who", "features": ["feat1", "feat2", "feat3"]},
    {"name": "Pro", "price": "$X", "desc": "for who", "features": ["feat1", "feat2", "feat3", "feat4"]},
    {"name": "Enterprise", "price": "$X", "desc": "for who", "features": ["feat1", "feat2", "feat3", "feat4", "feat5"]}
  ],
  "testimonials": [
    {"name": "Full Name", "role": "Job Title, Company", "text": "testimonial text"},
    {"name": "Full Name", "role": "Job Title, Company", "text": "testimonial text"},
    {"name": "Full Name", "role": "Job Title, Company", "text": "testimonial text"}
  ],
  "cta": "call to action button text",
  "nav": ["Home", "Features", "Pricing", "Contact"]
}`
      }]
    })
  })

  const contentData = await contentRes.json()
  let content: any = {}
  
  try {
    const raw = contentData.choices?.[0]?.message?.content || '{}'
    const cleaned = raw.replace(/```json|```/g, '').trim()
    content = JSON.parse(cleaned)
  } catch {
    content = {
      name: prompt.split(',')[0] || 'Startup',
      tagline: 'The future starts here',
      description: 'An innovative platform that transforms your business.',
      color1: '#6366f1',
      color2: '#8b5cf6',
      features: [
        {icon: '⚡', title: 'Fast', desc: 'Lightning fast performance'},
        {icon: '🔒', title: 'Secure', desc: 'Enterprise grade security'},
        {icon: '🌍', title: 'Global', desc: 'Available worldwide'},
        {icon: '🤖', title: 'AI Powered', desc: 'Intelligent automation'}
      ],
      pricing: [
        {name: 'Starter', price: '$29', desc: 'For individuals', features: ['5 projects', 'Basic analytics', 'Email support']},
        {name: 'Pro', price: '$79', desc: 'For teams', features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'API access']},
        {name: 'Enterprise', price: '$299', desc: 'For large companies', features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'Custom contract']}
      ],
      testimonials: [
        {name: 'Sarah Johnson', role: 'CEO, TechCorp', text: 'This platform transformed our business completely.'},
        {name: 'Mike Chen', role: 'CTO, StartupXYZ', text: 'The best investment we made this year.'},
        {name: 'Emma Davis', role: 'Founder, InnovateCo', text: 'Incredible product, amazing team support.'}
      ],
      cta: 'Get Started Free',
      nav: ['Home', 'Features', 'Pricing', 'Contact']
    }
  }

  const isDark = color === 'dark'
  const isGradient = color === 'gradient'
  
  const bg = isDark ? '#0f0f0f' : isGradient ? '#0f0172' : '#ffffff'
  const text = isDark || isGradient ? '#ffffff' : '#1a1a1a'
  const cardBg = isDark ? '#1a1a2e' : isGradient ? 'rgba(255,255,255,0.1)' : '#f8f9fa'
  const navBg = isDark ? '#16213e' : isGradient ? 'rgba(0,0,0,0.2)' : '#ffffff'

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${content.name}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: ${bg}; color: ${text}; }
nav { background: ${navBg}; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
.logo { font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, ${content.color1}, ${content.color2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links { display: flex; gap: 2rem; list-style: none; }
.nav-links a { color: ${text}; text-decoration: none; font-weight: 500; transition: color 0.3s; }
.nav-links a:hover { color: ${content.color1}; }
.nav-cta { background: linear-gradient(135deg, ${content.color1}, ${content.color2}); color: white !important; padding: 0.5rem 1.5rem; border-radius: 50px; font-weight: 600; }
.hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; background: ${isGradient ? `linear-gradient(135deg, ${content.color1}22, ${content.color2}22)` : isDark ? `linear-gradient(135deg, #0f0f0f, #1a1a2e)` : `linear-gradient(135deg, #f8f9ff, #ffffff)`}; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%; background: ${content.color1}15; top: -200px; right: -200px; }
.hero::after { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: ${content.color2}15; bottom: -100px; left: -100px; }
.hero-content { position: relative; z-index: 1; max-width: 800px; }
.hero h1 { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; background: linear-gradient(135deg, ${content.color1}, ${content.color2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero p { font-size: 1.3rem; margin-bottom: 2.5rem; opacity: 0.8; line-height: 1.6; }
.hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-primary { background: linear-gradient(135deg, ${content.color1}, ${content.color2}); color: white; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 700; text-decoration: none; border: none; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 10px 30px ${content.color1}40; }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px ${content.color1}60; }
.btn-secondary { background: transparent; color: ${text}; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 600; text-decoration: none; border: 2px solid ${content.color1}; cursor: pointer; transition: all 0.3s; }
.btn-secondary:hover { background: ${content.color1}20; }
.badge { display: inline-block; background: ${content.color1}20; color: ${content.color1}; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; border: 1px solid ${content.color1}40; }
section { padding: 5rem 2rem; }
.section-title { text-align: center; font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
.section-sub { text-align: center; opacity: 0.7; font-size: 1.1rem; margin-bottom: 3rem; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.feature-card { background: ${cardBg}; border-radius: 20px; padding: 2rem; border: 1px solid ${content.color1}20; transition: transform 0.3s, box-shadow 0.3s; }
.feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px ${content.color1}20; border-color: ${content.color1}; }
.feature-icon { font-size: 3rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; }
.feature-card p { opacity: 0.7; line-height: 1.6; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto; }
.pricing-card { background: ${cardBg}; border-radius: 20px; padding: 2.5rem; border: 2px solid ${content.color1}20; text-align: center; transition: all 0.3s; position: relative; }
.pricing-card.popular { border-color: ${content.color1}; transform: scale(1.05); }
.popular-badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, ${content.color1}, ${content.color2}); color: white; padding: 0.3rem 1.5rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; white-space: nowrap; }
.pricing-card h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.price { font-size: 3rem; font-weight: 900; color: ${content.color1}; margin: 1rem 0; }
.price span { font-size: 1rem; opacity: 0.7; }
.pricing-desc { opacity: 0.7; margin-bottom: 1.5rem; }
.pricing-features { list-style: none; text-align: left; margin-bottom: 2rem; }
.pricing-features li { padding: 0.4rem 0; opacity: 0.8; }
.pricing-features li::before { content: '✓ '; color: ${content.color1}; font-weight: 700; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.testimonial-card { background: ${cardBg}; border-radius: 20px; padding: 2rem; border: 1px solid ${content.color1}20; }
.testimonial-text { font-size: 1.05rem; line-height: 1.7; opacity: 0.85; margin-bottom: 1.5rem; font-style: italic; }
.testimonial-text::before { content: '"'; font-size: 3rem; color: ${content.color1}; line-height: 0; vertical-align: -1rem; margin-right: 0.3rem; }
.testimonial-author { display: flex; align-items: center; gap: 1rem; }
.author-avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, ${content.color1}, ${content.color2}); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; color: white; }
.author-name { font-weight: 700; }
.author-role { font-size: 0.85rem; opacity: 0.6; }
.cta-section { background: linear-gradient(135deg, ${content.color1}, ${content.color2}); text-align: center; padding: 5rem 2rem; }
.cta-section h2 { font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 1rem; }
.cta-section p { color: rgba(255,255,255,0.85); font-size: 1.1rem; margin-bottom: 2rem; }
.btn-white { background: white; color: ${content.color1}; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.3s; }
.btn-white:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0,0,0,0.2); }
footer { background: ${isDark ? '#0a0a0a' : '#1a1a1a'}; color: #999; text-align: center; padding: 2rem; }
footer a { color: #999; text-decoration: none; margin: 0 1rem; }
footer a:hover { color: ${content.color1}; }
.footer-links { margin-bottom: 1rem; }
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero h1 { font-size: 2.5rem; }
  .pricing-card.popular { transform: scale(1); }
}
</style>
</head>
<body>
<nav>
  <div class="logo">${content.name}</div>
  <ul class="nav-links">
    ${(content.nav || []).map((item: string, i: number) => 
      `<li><a href="#${item.toLowerCase()}" ${i === content.nav.length - 1 ? 'class="nav-cta"' : ''}>${item}</a></li>`
    ).join('')}
  </ul>
</nav>

<section class="hero" id="home">
  <div class="hero-content">
    <div class="badge">🚀 Powered by AI</div>
    <h1>${content.name}</h1>
    <p>${content.tagline}<br><small style="font-size:0.85em;opacity:0.7">${content.description}</small></p>
    <div class="hero-btns">
      <a href="#pricing" class="btn-primary">${content.cta || 'Get Started'}</a>
      <a href="#features" class="btn-secondary">Learn More</a>
    </div>
  </div>
</section>

<section id="features">
  <h2 class="section-title">Why Choose ${content.name}?</h2>
  <p class="section-sub">Everything you need to succeed, in one platform</p>
  <div class="features-grid">
    ${(content.features || []).map((f: any) => `
    <div class="feature-card">
      <div class="feature-icon">${f.icon}</div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>`).join('')}
  </div>
</section>

<section id="pricing" style="background:${isDark ? '#111' : '#f8f9fa'}">
  <h2 class="section-title">Simple, Transparent Pricing</h2>
  <p class="section-sub">Choose the plan that works for you</p>
  <div class="pricing-grid">
    ${(content.pricing || []).map((p: any, i: number) => `
    <div class="pricing-card ${i === 1 ? 'popular' : ''}">
      ${i === 1 ? '<div class="popular-badge">⭐ Most Popular</div>' : ''}
      <h3>${p.name}</h3>
      <div class="price">${p.price}<span>/mo</span></div>
      <p class="pricing-desc">${p.desc}</p>
      <ul class="pricing-features">
        ${(p.features || []).map((f: string) => `<li>${f}</li>`).join('')}
      </ul>
      <a href="#" class="btn-primary" style="display:block;text-align:center">Get Started</a>
    </div>`).join('')}
  </div>
</section>

<section id="testimonials">
  <h2 class="section-title">What Our Customers Say</h2>
  <p class="section-sub">Trusted by thousands of businesses worldwide</p>
  <div class="testimonials-grid">
    ${(content.testimonials || []).map((t: any) => `
    <div class="testimonial-card">
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.name.charAt(0)}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>`).join('')}
  </div>
</section>

<section class="cta-section" id="contact">
  <h2>Ready to Get Started?</h2>
  <p>Join thousands of businesses already using ${content.name}</p>
  <a href="#" class="btn-white">${content.cta || 'Start Free Trial'} →</a>
</section>

<footer>
  <div class="footer-links">
    <a href="#">Privacy</a>
    <a href="#">Terms</a>
    <a href="#">Contact</a>
    <a href="#">Blog</a>
  </div>
  <p>© 2024 ${content.name}. All rights reserved. Built with ⚡ Nexoro</p>
</footer>
</body>
</html>`

  return new Response(JSON.stringify({ html }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
