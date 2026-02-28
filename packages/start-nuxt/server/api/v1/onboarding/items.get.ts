/**
 * GET /api/v1/onboarding/items
 *
 * Get available onboarding items for the authenticated user.
 * Returns Projects (Global Goals), Campaigns (Personal Interests),
 * and Clusters (Platform Features).
 *
 * Requires authentication via sb-access-token cookie.
 */

import type { H3Event } from 'h3'

interface OnboardingItem {
    id: string
    name: string
    description?: string
    isSelected: boolean
}

interface OnboardingItemsResponse {
    projects: OnboardingItem[]
    campaigns: OnboardingItem[]
    clusters: OnboardingItem[]
    onboardingCompleted: boolean
}

export default defineEventHandler(async (event: H3Event): Promise<OnboardingItemsResponse> => {
    const accessToken = getCookie(event, 'sb-access-token')

    if (!accessToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated'
        })
    }

    // Verify the user is authenticated
    const supabase = createSupabaseUserClient(accessToken)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired session'
        })
    }

    // TODO: In a full implementation, this would query the database for:
    // - Projects owned by system admin
    // - Campaigns owned by system admin
    // - Clusters owned by system admin
    // - User's current memberships (to set isSelected)
    // - User's onboarding_completed status from profile table
    //
    // For now, returns empty lists to allow the onboarding wizard to work
    // without requiring a full database setup.

    return {
        projects: [],
        campaigns: [],
        clusters: [],
        onboardingCompleted: false
    }
})
