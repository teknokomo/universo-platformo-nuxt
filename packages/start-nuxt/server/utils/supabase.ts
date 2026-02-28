/**
 * Supabase server utility
 *
 * Creates Supabase client instances for server-side usage.
 * Uses service role key for admin operations (bypasses RLS).
 * Uses anon key for user-context operations.
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase admin client (service role - bypasses RLS)
 * Use only for trusted server-side operations
 */
export function createSupabaseAdminClient() {
    const config = useRuntimeConfig()
    const url = config.public.supabaseUrl
    const key = config.supabaseServiceRoleKey

    if (!url || !key) {
        throw new Error(
            'Supabase URL and service role key must be configured. ' +
                'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
        )
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

/**
 * Create a Supabase client with a user's JWT token
 * Respects Row Level Security (RLS)
 */
export function createSupabaseUserClient(accessToken: string) {
    const config = useRuntimeConfig()
    const url = config.public.supabaseUrl
    const anonKey = config.public.supabaseAnonKey

    if (!url || !anonKey) {
        throw new Error(
            'Supabase URL and anon key must be configured. ' +
                'Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
        )
    }

    return createClient(url, anonKey, {
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
