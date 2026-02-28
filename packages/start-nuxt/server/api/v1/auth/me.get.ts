/**
 * GET /api/v1/auth/me
 *
 * Get the current authenticated user.
 * All Supabase communication happens server-side only.
 * Reads the access token from HTTP-only cookie.
 * Attempts token refresh if access token is expired.
 */

import type { H3Event } from 'h3'

/** 30-day refresh token lifetime in seconds */
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export default defineEventHandler(async (event: H3Event) => {
    const accessToken = getCookie(event, 'sb-access-token')
    const refreshToken = getCookie(event, 'sb-refresh-token')

    if (!accessToken && !refreshToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated'
        })
    }

    // Try to get the user with the access token
    if (accessToken) {
        const supabase = createSupabaseUserClient(accessToken)
        const { data, error } = await supabase.auth.getUser()

        if (!error && data.user) {
            return {
                id: data.user.id,
                email: data.user.email as string
            }
        }
    }

    // Access token invalid/expired - try to refresh using refresh token
    if (refreshToken) {
        const authSupabase = createSupabaseAuthClient()
        const { data, error } = await authSupabase.auth.refreshSession({
            refresh_token: refreshToken
        })

        if (!error && data.session && data.user) {
            const isProduction = process.env.NODE_ENV === 'production'

            // Set new access token cookie
            setCookie(event, 'sb-access-token', data.session.access_token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: data.session.expires_in,
                path: '/'
            })

            // Update refresh token cookie
            setCookie(event, 'sb-refresh-token', data.session.refresh_token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
                path: '/'
            })

            return {
                id: data.user.id,
                email: data.user.email as string
            }
        }
    }

    // Both tokens invalid - clear cookies and return 401
    deleteCookie(event, 'sb-access-token', { path: '/' })
    deleteCookie(event, 'sb-refresh-token', { path: '/' })

    throw createError({
        statusCode: 401,
        statusMessage: 'Session expired'
    })
})
