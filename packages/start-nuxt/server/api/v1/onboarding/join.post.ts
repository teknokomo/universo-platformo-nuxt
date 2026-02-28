/**
 * POST /api/v1/onboarding/join
 *
 * Join selected onboarding items (Projects, Campaigns, Clusters) and
 * return counts of the selected items.
 *
 * Requires authentication via sb-access-token cookie.
 *
 * NOTE: This is currently a stub that acknowledges selections without
 * persisting them. Full implementation will create membership records
 * and update the user's onboarding status.
 */

import type { H3Event } from 'h3'

interface JoinItemsRequest {
    projectIds: string[]
    campaignIds: string[]
    clusterIds: string[]
}

interface JoinItemsResponse {
    success: boolean
    joined: {
        projects: number
        campaigns: number
        clusters: number
    }
}

export default defineEventHandler(async (event: H3Event): Promise<JoinItemsResponse> => {
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

    const body = await readBody<JoinItemsRequest>(event)

    if (!body) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request body is required'
        })
    }

    const { projectIds = [], campaignIds = [], clusterIds = [] } = body

    // TODO: In a full implementation, this would:
    // 1. Create ProjectUser records for selected projects
    // 2. Create CampaignMember records for selected campaigns
    // 3. Create ClusterUser records for selected clusters
    // 4. Update user's profile.onboarding_completed = true
    //
    // For now, acknowledge the request and return success

    return {
        success: true,
        joined: {
            projects: projectIds.length,
            campaigns: campaignIds.length,
            clusters: clusterIds.length
        }
    }
})
