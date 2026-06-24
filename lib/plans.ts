import { neon } from '@neondatabase/serverless'
import { jwtVerify } from 'jose'

export const PLANS = {
  free: { limit: 3, name: 'Free' },
  pro: { limit: -1, name: 'Pro' },
  agency: { limit: -1, name: 'Agency' },
  enterprise: { limit: -1, name: 'Enterprise' },
}

export async function checkGenerationLimit(token: string | undefined): Promise<{
  allowed: boolean
  remaining: number
  plan: string
  userId?: number
}> {
  if (!token) return { allowed: true, remaining: 3, plan: 'guest' }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'nexoro_secret')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as number

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT * FROM users WHERE id = ${userId}`
    if (result.length === 0) return { allowed: true, remaining: 3, plan: 'guest' }

    const user = result[0]
    const plan = user.plan || 'free'
    const planConfig = PLANS[plan as keyof typeof PLANS] || PLANS.free

    // Plan illimité
    if (planConfig.limit === -1) return { allowed: true, remaining: -1, plan, userId }

    // Vérifier reset mensuel
    const resetDate = new Date(user.generations_reset)
    const now = new Date()
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      await sql`UPDATE users SET generations_count = 0, generations_reset = NOW() WHERE id = ${userId}`
      return { allowed: true, remaining: planConfig.limit, plan, userId }
    }

    const count = user.generations_count || 0
    const remaining = planConfig.limit - count

    return {
      allowed: remaining > 0,
      remaining,
      plan,
      userId
    }
  } catch {
    return { allowed: true, remaining: 3, plan: 'guest' }
  }
}

export async function incrementGenerations(userId: number) {
  const sql = neon(process.env.DATABASE_URL!)
  await sql`UPDATE users SET generations_count = generations_count + 1 WHERE id = ${userId}`
}
