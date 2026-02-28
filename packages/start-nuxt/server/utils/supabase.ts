/**
 * Supabase server utility
 *
 * Creates Supabase client instances for server-side usage.
 * All Supabase credentials are kept server-only; the frontend
 * never communicates with Supabase directly.
 *
 * Three client types:
 * - Admin client  : service role key, bypasses RLS — use only for trusted ops
 * - Auth client   : anon key, no user token — use for sign-in / sign-up
 * - User client   : anon key + user JWT — respects RLS, use for user-scoped ops
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Read and validate the required Supabase URL from server-only runtimeConfig.
 * Throws a clear error at startup rather than a cryptic one at request time.
 */
function getSupabaseUrl(): string {
    const config = useRuntimeConfig()
    const url = config.supabaseUrl
    if (!url) {
        throw new Error(
            'SUPABASE_URL is not configured. Set the SUPABASE_URL environment variable.'
        )
    }
    return url
}

/**
 * Create a Supabase admin client (service role key — bypasses RLS).
 * Use ONLY for privileged server-side operations such as creating users
 * or accessing data that normal users cannot reach.
 */
export function createSupabaseAdminClient() {
    const config = useRuntimeConfig()
    const key = config.supabaseServiceRoleKey
    if (!key) {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is not configured. ' +
                'Set the SUPABASE_SERVICE_ROLE_KEY environment variable.'
        )
    }

    return createClient(getSupabaseUrl(), key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

/**
 * Create a Supabase client for public auth operations (sign-in, sign-up,
 * session refresh).  Uses the anon key without a user JWT.
 * This is the correct client for operations that must work before the user
 * has an authenticated session.
 */
export function createSupabaseAuthClient() {
    const config = useRuntimeConfig()
    const anonKey = config.supabaseAnonKey
    if (!anonKey) {
        throw new Error(
            'SUPABASE_ANON_KEY is not configured. ' +
                'Set the SUPABASE_ANON_KEY environment variable.'
        )
    }

    return createClient(getSupabaseUrl(), anonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

/**
 * Create a Supabase client scoped to a specific user JWT.
 * Respects Row Level Security (RLS) — use for data operations on behalf of
 * an already-authenticated user.
 */
export function createSupabaseUserClient(accessToken: string) {
    const config = useRuntimeConfig()
    const anonKey = config.supabaseAnonKey
    if (!anonKey) {
        throw new Error(
            'SUPABASE_ANON_KEY is not configured. ' +
                'Set the SUPABASE_ANON_KEY environment variable.'
        )
    }

    return createClient(getSupabaseUrl(), anonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
