/**
 * POST /api/v1/auth/logout
 *
 * Logout current user by invalidating session in Supabase
 * and clearing auth cookies.
 */

import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const accessToken = getCookie(event, 'sb-access-token')

    if (accessToken) {
        try {
            // Invalidate the session in Supabase
            const supabase = createSupabaseUserClient(accessToken)
            await supabase.auth.signOut()
        } catch {
            // Ignore errors during sign out - we still clear cookies
        }
    }

    // Clear auth cookies regardless
    deleteCookie(event, 'sb-access-token', { path: '/' })
    deleteCookie(event, 'sb-refresh-token', { path: '/' })

    return { success: true }
})
