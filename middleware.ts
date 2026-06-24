import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/auth', '/pricing', '/marketplace']
const publicPrefixes = ['/api/', '/_next/', '/favicon']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Routes publiques
  if (publicRoutes.includes(pathname)) return NextResponse.next()
  if (publicPrefixes.some(p => pathname.startsWith(p))) return NextResponse.next()

  // Vérifier le token
  const token = req.cookies.get('nexoro_token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
