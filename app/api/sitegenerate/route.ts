import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, template, color, bgImage, generatedBgCSS, logo, userPhotos } = await req.json()
  const hasUserPhotos = userPhotos && userPhotos.length > 0

  // Photos Unsplash par catégorie
  const photos: Record<string, string[]> = {
    restaurant: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    ],
    startup: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    ],
    ecommerce: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    ],
    medical: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
    ],
    fitness: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    ],
    beauty: [
      'https://images.unsplash.com/photo-1560066984-138daaa6107c?w=1200&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
    ],
    travel: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    ],
    realestate: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    ],
    education: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
    agency: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    ],
  }

  const templatePhotos = photos[template] || photos.restaurant
  const heroPhoto = bgImage || (hasUserPhotos ? userPhotos[0] : templatePhotos[0])
  const photo1 = hasUserPhotos ? (userPhotos[1] || userPhotos[0]) : (templatePhotos[1] || templatePhotos[0])
  const photo2 = hasUserPhotos ? (userPhotos[2] || userPhotos[0]) : (templatePhotos[2] || templatePhotos[0])

  // Groq génère le contenu JSON
  const contentRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{
        role: 'system',
        content: 'You are a professional website content writer. Return ONLY valid JSON, no markdown.'
      }, {
        role: 'user',
        content: `Create website content for: ${prompt}

Return ONLY this JSON:
{
  "name": "business name",
  "tagline": "catchy tagline",
  "description": "2-3 sentence description",
  "hero_cta": "call to action button text",
  "features": [
    {"icon": "emoji", "title": "feature", "desc": "description"},
    {"icon": "emoji", "title": "feature", "desc": "description"},
    {"icon": "emoji", "title": "feature", "desc": "description"},
    {"icon": "emoji", "title": "feature", "desc": "description"}
  ],
  "menu_items": [
    {"name": "item name", "price": "price with currency", "desc": "short description", "emoji": "🍔"},
    {"name": "item name", "price": "price with currency", "desc": "short description", "emoji": "🥗"},
    {"name": "item name", "price": "price with currency", "desc": "short description", "emoji": "🍕"},
    {"name": "item name", "price": "price with currency", "desc": "short description", "emoji": "☕"},
    {"name": "item name", "price": "price with currency", "desc": "short description", "emoji": "🍰"},
    {"name": "item name", "price": "price with currency", "desc": "short description", "emoji": "🥤"}
  ],
  "testimonials": [
    {"name": "Client Name", "role": "Customer", "text": "testimonial", "rating": 5},
    {"name": "Client Name", "role": "Regular", "text": "testimonial", "rating": 5},
    {"name": "Client Name", "role": "Client", "text": "testimonial", "rating": 5}
  ],
  "phone": "phone from prompt",
  "whatsapp": "whatsapp from prompt",
  "email": "email from prompt",
  "address": "address from prompt",
  "hours": "hours from prompt",
  "color1": "#hex primary color matching business",
  "color2": "#hex secondary color"
}`
      }]
    })
  })

  const contentData = await contentRes.json()
  let c: any = {}
  try {
    const raw = contentData.choices?.[0]?.message?.content || '{}'
    c = JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    c = {
      name: 'Business', tagline: 'Welcome', description: 'Professional service',
      hero_cta: 'Contact Us', color1: '#6366f1', color2: '#8b5cf6',
      features: [{icon:'⚡',title:'Fast',desc:'Quick service'},{icon:'✅',title:'Quality',desc:'Best quality'},{icon:'🌟',title:'Expert',desc:'Professional team'},{icon:'💰',title:'Affordable',desc:'Best prices'}],
      menu_items: [{name:'Item 1',price:'$10',desc:'Description',emoji:'🍽️'},{name:'Item 2',price:'$15',desc:'Description',emoji:'🥗'},{name:'Item 3',price:'$20',desc:'Description',emoji:'🍕'},{name:'Item 4',price:'$8',desc:'Description',emoji:'☕'},{name:'Item 5',price:'$12',desc:'Description',emoji:'🍰'},{name:'Item 6',price:'$6',desc:'Description',emoji:'🥤'}],
      testimonials: [{name:'John D.',role:'Customer',text:'Excellent service!',rating:5},{name:'Sarah M.',role:'Regular',text:'Love this place!',rating:5},{name:'Ahmed K.',role:'Client',text:'Highly recommended!',rating:5}],
      phone: '', whatsapp: '', email: '', address: '', hours: ''
    }
  }

  // Design DNA par secteur
  const sectorDNA: Record<string, any> = {
    restaurant: {
      primaryColor: '#e85d04', secondaryColor: '#f48c06',
      mood: 'warm, appetizing, cozy',
      heroStyle: 'full-screen food photo with dark overlay',
      font: "'Georgia', serif",
      sections: ['hero', 'about', 'menu', 'gallery', 'testimonials', 'contact'],
    },
    medical: {
      primaryColor: '#0077b6', secondaryColor: '#00b4d8',
      mood: 'clean, professional, trustworthy',
      heroStyle: 'light clean with blue accents',
      font: "'Helvetica Neue', sans-serif",
      sections: ['hero', 'services', 'doctors', 'appointments', 'testimonials', 'contact'],
    },
    fitness: {
      primaryColor: '#2dc653', secondaryColor: '#80b918',
      mood: 'energetic, powerful, motivating',
      heroStyle: 'dark dramatic with green highlights',
      font: "'Impact', sans-serif",
      sections: ['hero', 'programs', 'trainers', 'pricing', 'testimonials', 'contact'],
    },
    beauty: {
      primaryColor: '#e63946', secondaryColor: '#f4a0a8',
      mood: 'elegant, feminine, luxurious',
      heroStyle: 'soft pink with elegant typography',
      font: "'Playfair Display', serif",
      sections: ['hero', 'services', 'gallery', 'team', 'booking', 'contact'],
    },
    law: {
      primaryColor: '#1a1a2e', secondaryColor: '#c9a84c',
      mood: 'serious, authoritative, trustworthy',
      heroStyle: 'dark navy with gold accents',
      font: "'Times New Roman', serif",
      sections: ['hero', 'practice', 'team', 'cases', 'testimonials', 'contact'],
    },
    realestate: {
      primaryColor: '#2b4590', secondaryColor: '#4a90d9',
      mood: 'professional, luxurious, trustworthy',
      heroStyle: 'property photos with blue overlay',
      font: "'Helvetica Neue', sans-serif",
      sections: ['hero', 'properties', 'services', 'agents', 'testimonials', 'contact'],
    },
    education: {
      primaryColor: '#7209b7', secondaryColor: '#3a0ca3',
      mood: 'inspiring, modern, academic',
      heroStyle: 'gradient purple with motivational text',
      font: "'Open Sans', sans-serif",
      sections: ['hero', 'courses', 'instructors', 'results', 'testimonials', 'contact'],
    },
    travel: {
      primaryColor: '#0096c7', secondaryColor: '#48cae4',
      mood: 'adventurous, exciting, wanderlust',
      heroStyle: 'full-screen destination photo',
      font: "'Raleway', sans-serif",
      sections: ['hero', 'destinations', 'packages', 'gallery', 'testimonials', 'contact'],
    },
    ecommerce: {
      primaryColor: '#ff6b6b', secondaryColor: '#ffa500',
      mood: 'energetic, commercial, trendy',
      heroStyle: 'product showcase with bright colors',
      font: "'Poppins', sans-serif",
      sections: ['hero', 'products', 'features', 'deals', 'testimonials', 'contact'],
    },
    startup: {
      primaryColor: '#6366f1', secondaryColor: '#8b5cf6',
      mood: 'innovative, modern, tech-forward',
      heroStyle: 'gradient with floating elements',
      font: "'Inter', sans-serif",
      sections: ['hero', 'features', 'pricing', 'team', 'testimonials', 'contact'],
    },
  }

  const dna = sectorDNA[template] || sectorDNA.startup
  const sectorPrimary = dna.primaryColor
  const sectorSecondary = dna.secondaryColor

  const isDark = color !== 'light'
  const bg = isDark ? '#0f0f0f' : '#ffffff'
  const textColor = isDark ? '#ffffff' : '#1a1a1a'
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa'
  const primary = c.color1 || sectorPrimary
  const secondary = c.color2 || sectorSecondary

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.name}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: ${bg}; color: ${textColor}; }

/* NAV */
nav { position: sticky; top: 0; z-index: 100; background: ${isDark ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)'}; backdrop-filter: blur(20px); border-bottom: 1px solid ${primary}20; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 900; color: ${primary}; }
.logo img { height: 40px; width: 40px; object-fit: contain; border-radius: 8px; }
.nav-links { display: flex; gap: 2rem; list-style: none; }
.nav-links a { color: ${textColor}; text-decoration: none; font-weight: 500; transition: color 0.3s; }
.nav-links a:hover { color: ${primary}; }
.nav-cta { background: linear-gradient(135deg, ${primary}, ${secondary}); color: white !important; padding: 0.5rem 1.5rem; border-radius: 50px; font-weight: 700 !important; }
.whatsapp-btn { position: fixed; bottom: 20px; right: 20px; background: #25D366; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; text-decoration: none; box-shadow: 0 4px 20px rgba(37,211,102,0.4); z-index: 999; transition: transform 0.3s; }
.whatsapp-btn:hover { transform: scale(1.1); }

/* HERO */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background: url('${heroPhoto}') center/cover no-repeat; }
.hero-overlay { position: absolute; inset: 0; background: ${isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.5)'}; }
.hero-content { position: relative; z-index: 1; max-width: 700px; padding: 2rem 3rem; }
.hero-badge { display: inline-block; background: ${primary}; color: white; padding: 0.4rem 1.2rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; }
.hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; color: white; line-height: 1.1; margin-bottom: 1rem; text-shadow: 0 2px 20px rgba(0,0,0,0.5); }
.hero h1 span { color: ${primary}; }
.hero p { font-size: 1.2rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; line-height: 1.7; }
.hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
.btn-primary { background: linear-gradient(135deg, ${primary}, ${secondary}); color: white; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 700; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 10px 30px ${primary}50; transition: transform 0.3s; display: inline-block; }
.btn-primary:hover { transform: translateY(-3px); }
.btn-outline { background: transparent; color: white; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.1rem; font-weight: 600; text-decoration: none; border: 2px solid white; transition: all 0.3s; display: inline-block; }
.btn-outline:hover { background: white; color: #1a1a1a; }

/* ABOUT */
.about { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.about-img { border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.about-img img { width: 100%; height: 400px; object-fit: cover; display: block; }
.about-content h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
.about-content h2 span { color: ${primary}; }
.about-content p { opacity: 0.8; line-height: 1.8; margin-bottom: 1.5rem; }
.about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; }
.stat { text-align: center; padding: 1rem; background: ${cardBg}; border-radius: 12px; border: 1px solid ${primary}20; }
.stat-num { font-size: 1.8rem; font-weight: 900; color: ${primary}; }
.stat-label { font-size: 0.75rem; opacity: 0.6; margin-top: 0.3rem; }

/* FEATURES */
.features { padding: 5rem 2rem; background: ${isDark ? '#111' : '#f8f9ff'}; }
.section-header { text-align: center; max-width: 600px; margin: 0 auto 3rem; }
.section-header h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
.section-header p { opacity: 0.7; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto; }
.feature-card { background: ${cardBg}; border-radius: 20px; padding: 2rem; border: 1px solid ${primary}20; transition: all 0.3s; }
.feature-card:hover { transform: translateY(-5px); border-color: ${primary}; box-shadow: 0 20px 40px ${primary}15; }
.feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
.feature-card p { opacity: 0.7; font-size: 0.9rem; line-height: 1.6; }

/* MENU / GALLERY */
.menu { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
.menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.menu-card { background: ${cardBg}; border-radius: 20px; overflow: hidden; border: 1px solid ${primary}20; transition: all 0.3s; }
.menu-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px ${primary}15; }
.menu-card-img { height: 180px; overflow: hidden; position: relative; }
.menu-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.menu-card:hover .menu-card-img img { transform: scale(1.05); }
.menu-card-body { padding: 1.2rem; }
.menu-emoji { font-size: 1.5rem; margin-bottom: 0.5rem; }
.menu-name { font-weight: 700; font-size: 1.1rem; margin-bottom: 0.3rem; }
.menu-desc { opacity: 0.6; font-size: 0.85rem; margin-bottom: 0.8rem; }
.menu-price { font-size: 1.3rem; font-weight: 900; color: ${primary}; }

/* GALLERY */
.gallery { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.gallery-item { border-radius: 16px; overflow: hidden; aspect-ratio: 1; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.gallery-item:hover img { transform: scale(1.05); }

/* TESTIMONIALS */
.testimonials { padding: 5rem 2rem; background: ${isDark ? '#111' : '#f8f9ff'}; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto; }
.testimonial-card { background: ${cardBg}; border-radius: 20px; padding: 2rem; border: 1px solid ${primary}20; }
.stars { color: #FFD700; font-size: 1.2rem; margin-bottom: 1rem; }
.testimonial-text { font-style: italic; opacity: 0.85; line-height: 1.7; margin-bottom: 1.5rem; }
.testimonial-author { display: flex; align-items: center; gap: 1rem; }
.author-avatar { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, ${primary}, ${secondary}); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1.1rem; }
.author-name { font-weight: 700; }
.author-role { font-size: 0.8rem; opacity: 0.6; }

/* CONTACT */
.contact { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
.contact-info h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; }
.contact-item { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
.contact-icon { width: 45px; height: 45px; border-radius: 12px; background: ${primary}20; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
.contact-label { font-size: 0.75rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.05em; }
.contact-value { font-weight: 600; margin-top: 0.2rem; }
.contact-form { background: ${cardBg}; border-radius: 20px; padding: 2rem; border: 1px solid ${primary}20; }
.contact-form h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
.form-group input, .form-group textarea { width: 100%; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'white'}; border: 1px solid ${primary}30; border-radius: 12px; padding: 0.8rem 1rem; color: ${textColor}; font-size: 0.95rem; outline: none; transition: border-color 0.3s; }
.form-group input:focus, .form-group textarea:focus { border-color: ${primary}; }
.form-group textarea { height: 120px; resize: none; }
.form-submit { width: 100%; background: linear-gradient(135deg, ${primary}, ${secondary}); color: white; border: none; padding: 1rem; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: opacity 0.3s; }
.form-submit:hover { opacity: 0.9; }

/* CTA */
.cta-section { background: linear-gradient(135deg, ${primary}, ${secondary}); padding: 5rem 2rem; text-align: center; }
.cta-section h2 { font-size: 2.5rem; font-weight: 900; color: white; margin-bottom: 1rem; }
.cta-section p { color: rgba(255,255,255,0.85); font-size: 1.1rem; margin-bottom: 2rem; }
.btn-white { background: white; color: ${primary}; padding: 1rem 3rem; border-radius: 50px; font-size: 1.1rem; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.btn-white:hover { transform: translateY(-3px); }

/* FOOTER */
footer { background: ${isDark ? '#0a0a0a' : '#1a1a1a'}; color: #9ca3af; padding: 3rem 2rem; }
.footer-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; }
.footer-brand p { margin-top: 1rem; font-size: 0.9rem; line-height: 1.6; }
.footer-links h4 { color: white; font-weight: 700; margin-bottom: 1rem; }
.footer-links ul { list-style: none; }
.footer-links li { margin-bottom: 0.5rem; }
.footer-links a { color: #9ca3af; text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
.footer-links a:hover { color: ${primary}; }
.footer-bottom { max-width: 1200px; margin: 2rem auto 0; padding-top: 2rem; border-top: 1px solid #333; text-align: center; font-size: 0.85rem; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .about { grid-template-columns: 1fr; }
  .contact { grid-template-columns: 1fr; }
  .footer-content { grid-template-columns: 1fr; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-content { padding: 2rem 1.5rem; }
}
</style>
</head>
<body>

<!-- WhatsApp Button -->
${c.whatsapp ? `<a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" class="whatsapp-btn" target="_blank">💬</a>` : ''}

<!-- NAV -->
<nav>
  <div class="logo">
    ${logo ? `<img src="${logo}" alt="${c.name}">` : ''}
    <span>${c.name}</span>
  </div>
  <ul class="nav-links">
    <li><a href="#about">À propos</a></li>
    <li><a href="#menu">Menu</a></li>
    <li><a href="#testimonials">Avis</a></li>
    <li><a href="#contact" class="nav-cta">Contact</a></li>
  </ul>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">⭐ ${c.tagline}</div>
    <h1>${c.name.split(' ').map((w: string, i: number) => i === 0 ? `<span>${w}</span>` : w).join(' ')}</h1>
    <p>${c.description}</p>
    <div class="hero-btns">
      <a href="#contact" class="btn-primary">${c.hero_cta || 'Nous contacter'}</a>
      <a href="#menu" class="btn-outline">Voir le menu</a>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="about" id="about">
  <div class="about-img">
    <img src="${photo1}" alt="${c.name}" loading="lazy">
  </div>
  <div class="about-content">
    <h2>Bienvenue chez <span>${c.name}</span></h2>
    <p>${c.description}</p>
    ${c.hours ? `<p>⏰ ${c.hours}</p>` : ''}
    <a href="#contact" class="btn-primary" style="margin-top:1rem">Réserver une table</a>
    <div class="about-stats">
      <div class="stat"><div class="stat-num">500+</div><div class="stat-label">Clients satisfaits</div></div>
      <div class="stat"><div class="stat-num">50+</div><div class="stat-label">Plats au menu</div></div>
      <div class="stat"><div class="stat-num">5⭐</div><div class="stat-label">Note moyenne</div></div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="features" id="features">
  <div class="section-header">
    <h2>Pourquoi choisir <span style="color:${primary}">${c.name}</span> ?</h2>
    <p>Tout ce dont vous avez besoin, en un seul endroit</p>
  </div>
  <div class="features-grid">
    ${c.features?.map((f: any) => `
    <div class="feature-card">
      <div class="feature-icon">${f.icon}</div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>`).join('') || ''}
  </div>
</section>

<!-- MENU -->
<section class="menu" id="menu">
  <div class="section-header" style="text-align:center;margin-bottom:3rem">
    <h2>Notre Menu</h2>
    <p>Des produits frais, des saveurs authentiques</p>
  </div>
  <div class="menu-grid">
    ${c.menu_items?.map((item: any, i: number) => {
      const itemPhotos: Record<string, string[]> = {
        restaurant: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
          'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',
        ],
        medical: [
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
          'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80',
          'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80',
          'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80',
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
        ],
        fitness: [
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
          'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80',
          'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
          'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',
        ],
        beauty: [
          'https://images.unsplash.com/photo-1560066984-138daaa6107c?w=400&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
          'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
          'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80',
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
          'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&q=80',
        ],
        ecommerce: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
          'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
          'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
          'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&q=80',
        ],
        travel: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
          'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&q=80',
          'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80',
          'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80',
        ],
        education: [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
          'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
          'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80',
          'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
        ],
      }
      const foodPhotos = itemPhotos[template] || itemPhotos.restaurant
      return `
    <div class="menu-card">
      <div class="menu-card-img">
        <img src="${foodPhotos[i % foodPhotos.length]}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card-body">
        <div class="menu-emoji">${item.emoji}</div>
        <div class="menu-name">${item.name}</div>
        <div class="menu-desc">${item.desc}</div>
        <div class="menu-price">${item.price}</div>
      </div>
    </div>`}).join('') || ''}
  </div>
</section>

<!-- GALLERY -->
<section class="gallery">
  <div class="gallery-grid">
    ${[
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      photo1,
      photo2,
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
    ].map(p => `<div class="gallery-item"><img src="${p}" loading="lazy"></div>`).join('')}
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials" id="testimonials">
  <div class="section-header">
    <h2>Ce que disent nos clients</h2>
    <p>Des milliers de clients satisfaits nous font confiance</p>
  </div>
  <div class="testimonials-grid">
    ${c.testimonials?.map((t: any) => `
    <div class="testimonial-card">
      <div class="stars">${'⭐'.repeat(t.rating || 5)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.name.charAt(0)}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>`).join('') || ''}
  </div>
</section>

<!-- CONTACT -->
<section class="contact" id="contact">
  <div class="contact-info">
    <h2>Nous contacter</h2>
    ${c.phone ? `<div class="contact-item"><div class="contact-icon">📞</div><div><div class="contact-label">Téléphone</div><div class="contact-value">${c.phone}</div></div></div>` : ''}
    ${c.whatsapp ? `<div class="contact-item"><div class="contact-icon">💬</div><div><div class="contact-label">WhatsApp</div><div class="contact-value"><a href="https://wa.me/${c.whatsapp.replace(/\D/g,'')}" style="color:${primary};text-decoration:none">${c.whatsapp}</a></div></div></div>` : ''}
    ${c.email ? `<div class="contact-item"><div class="contact-icon">📧</div><div><div class="contact-label">Email</div><div class="contact-value"><a href="mailto:${c.email}" style="color:${primary};text-decoration:none">${c.email}</a></div></div></div>` : ''}
    ${c.address ? `<div class="contact-item"><div class="contact-icon">📍</div><div><div class="contact-label">Adresse</div><div class="contact-value">${c.address}</div></div></div>` : ''}
    ${c.hours ? `<div class="contact-item"><div class="contact-icon">⏰</div><div><div class="contact-label">Horaires</div><div class="contact-value">${c.hours}</div></div></div>` : ''}
    ${c.address ? `<div style="margin-top:2rem;border-radius:16px;overflow:hidden;height:250px"><iframe src="https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed" width="100%" height="250" style="border:0" loading="lazy"></iframe></div>` : ''}
  </div>
  <div class="contact-form">
    <h3>Envoyer un message</h3>
    <div class="form-group"><input type="text" placeholder="Votre nom"></div>
    <div class="form-group"><input type="email" placeholder="Votre email"></div>
    <div class="form-group"><input type="tel" placeholder="Votre téléphone"></div>
    <div class="form-group"><textarea placeholder="Votre message..."></textarea></div>
    <button class="form-submit" onclick="alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.')">📨 Envoyer le message</button>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <h2>Prêt à nous rendre visite ?</h2>
  <p>Réservez votre table dès maintenant et profitez de notre cuisine</p>
  <a href="#contact" class="btn-white">${c.hero_cta || 'Réserver maintenant'} →</a>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-content">
    <div class="footer-brand">
      <div style="font-size:1.5rem;font-weight:900;color:${primary}">${c.name}</div>
      <p>${c.description}</p>
      ${c.phone ? `<p style="margin-top:0.5rem">📞 ${c.phone}</p>` : ''}
    </div>
    <div class="footer-links">
      <h4>Navigation</h4>
      <ul>
        <li><a href="#about">À propos</a></li>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#testimonials">Avis</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>Contact</h4>
      <ul>
        ${c.phone ? `<li><a href="tel:${c.phone}">${c.phone}</a></li>` : ''}
        ${c.email ? `<li><a href="mailto:${c.email}">${c.email}</a></li>` : ''}
        ${c.address ? `<li>${c.address}</li>` : ''}
        ${c.hours ? `<li>${c.hours}</li>` : ''}
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2024 ${c.name}. Tous droits réservés. | Créé avec ⚡ Nexoro AI</p>
  </div>
</footer>

</body>
</html>`

  return NextResponse.json({ html })
}
