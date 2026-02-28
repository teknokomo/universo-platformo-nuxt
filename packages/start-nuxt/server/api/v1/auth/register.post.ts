/**
 * POST /api/v1/auth/register
 *
 * Register a new user with email and password via Supabase.
 * All Supabase communication happens server-side only.
 * Uses the anon auth client so Supabase handles email confirmation
 * according to the project's auth settings.
 */

import type { H3Event } from 'h3'
import { EMAIL_REGEX } from '~/server/utils/validation'

interface RegisterBody {
    email: string
    password: string
}

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

    // Use the anon auth client for public sign-up.
    // Supabase handles email confirmation based on project auth settings.
    const supabase = createSupabaseAuthClient()

    const { data, error } = await supabase.auth.signUp({
        email: body.email,
        password: body.password
    })

    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        })
    }

    if (!data.user) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Registration failed'
        })
    }

    return {
        id: data.user.id,
        email: data.user.email as string
    }
})
