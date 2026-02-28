/**
 * POST /api/v1/auth/login
 *
 * Authenticate user with email and password via Supabase.
 * All Supabase communication happens server-side only.
 * Sets HTTP-only cookies for access and refresh tokens.
 */

import type { H3Event } from 'h3'

interface LoginBody {
    email: string
    password: string
}

/** 30-day refresh token lifetime in seconds */
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

/** Basic email format check (RFC 5321 simplified) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<LoginBody>(event)

    if (!body?.email || !body?.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and password are required'
        })
    }

    if (!EMAIL_REGEX.test(body.email)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid email format'
        })
    }

    // Use the public auth client — signInWithPassword does not require admin privileges
    const supabase = createSupabaseAuthClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password
    })

    if (error || !data.session || !data.user) {
        throw createError({
            statusCode: 401,
            statusMessage: error?.message || 'Invalid credentials'
        })
    }

    const { session, user } = data
    const isProduction = process.env.NODE_ENV === 'production'

    // Set access token cookie (short-lived)
    setCookie(event, 'sb-access-token', session.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: session.expires_in,
        path: '/'
    })

    // Set refresh token cookie (long-lived)
    setCookie(event, 'sb-refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
        path: '/'
    })

    return {
        id: user.id,
        email: user.email as string
    }
})
