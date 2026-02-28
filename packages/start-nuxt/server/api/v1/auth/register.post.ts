/**
 * POST /api/v1/auth/register
 *
 * Register a new user with email and password via Supabase.
 * All Supabase communication happens server-side only.
 * Uses the admin client to create the user account with confirmed email.
 */

import type { H3Event } from 'h3'

interface RegisterBody {
    email: string
    password: string
}

/** Basic email format check (RFC 5321 simplified) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<RegisterBody>(event)

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

    if (body.password.length < 6) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Password must be at least 6 characters'
        })
    }

    // Use admin client — creating a user is a privileged operation
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true
    })

    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        })
    }

    return {
        id: data.user.id,
        email: data.user.email as string
    }
})
