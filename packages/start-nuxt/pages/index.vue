<script setup lang="ts">
/**
 * Start Page (index) - Conditional start page based on authentication status
 *
 * Shows:
 * - GuestStartPage for non-authenticated users (landing with hero + testimonials)
 * - AuthenticatedStartPage for authenticated users (onboarding wizard)
 */

const { isAuthenticated, loading, initialize } = useAuth()

// Initialize auth state on page mount
onMounted(async () => {
    await initialize()
})
</script>

<template>
    <div>
        <!-- Loading state while checking authentication -->
        <div v-if="loading" class="loading-center">
            <div class="spinner" />
        </div>

        <!-- Authenticated users: show onboarding wizard -->
        <AuthenticatedStartPage v-else-if="isAuthenticated" />

        <!-- Non-authenticated users: show landing page -->
        <GuestStartPage v-else />
    </div>
</template>
