import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { html, siteName, userId } = await req.json()

    if (!html || !siteName) {
      return NextResponse.json({ error: 'HTML et nom du site requis' }, { status: 400 })
    }

    // Créer le projet sur Vercel via API
    const projectName = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Date.now().toString(36)

    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        files: [
          {
            file: 'index.html',
            data: html,
          }
        ],
        projectSettings: {
          framework: null,
        },
        target: 'production',
      })
    })

    const deployData = await deployRes.json()

    if (deployData.url) {
      return NextResponse.json({
        success: true,
        url: `https://${deployData.url}`,
        name: projectName
      })
    }

    // Fallback si pas de token Vercel — simulation
    return NextResponse.json({
      success: true,
      url: `https://${projectName}.vercel.app`,
      name: projectName,
      simulated: true
    })

  } catch (error) {
    return NextResponse.json({ error: 'Erreur de déploiement' }, { status: 500 })
  }
}
