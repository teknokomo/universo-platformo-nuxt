<script setup lang="ts">
/**
 * AuthenticatedStartPage - Onboarding wizard for authenticated users
 *
 * Displays a multi-step wizard to help users select their interests:
 * - Projects (Global Goals)
 * - Campaigns (Personal Interests)
 * - Clusters (Platform Features)
 *
 * If onboarding is already completed, shows a completion message directly.
 * Footer with contact information shown at the bottom.
 */

const isReady = ref(false)
const onboardingCompleted = ref<boolean | null>(null)

interface OnboardingItemsResponse {
    onboardingCompleted: boolean
}

// Check onboarding status on mount
onMounted(async () => {
    try {
        const data = await $fetch<OnboardingItemsResponse>('/api/v1/onboarding/items', {
            credentials: 'include'
        })
        onboardingCompleted.value = data.onboardingCompleted
    } catch (err) {
        console.error('[AuthenticatedStartPage] Failed to check onboarding status:', err)
        // Default to showing wizard on error
        onboardingCompleted.value = false
    }
    isReady.value = true
})

const handleOnboardingComplete = () => {
    onboardingCompleted.value = true
}

const handleStartOver = () => {
    onboardingCompleted.value = false
}
</script>

<template>
    <div class="authenticated-page">
        <!-- Navigation bar -->
        <AppBar />

        <!-- Loading state -->
        <div v-if="!isReady" class="auth-page-loading">
            <div class="spinner" />
        </div>

        <template v-else>
            <!-- Completed onboarding: show success message -->
            <div v-if="onboardingCompleted" class="auth-page-content">
                <div class="auth-page-inner">
                    <div class="completion-card">
                        <div class="completion-icon">🎉</div>
                        <h1 class="completion-title">
                            {{ $t('onboarding.completion.title') }}
                        </h1>
                        <p class="completion-description">
                            {{ $t('onboarding.completion.description') }}
                        </p>
                        <button class="btn-start-over" @click="handleStartOver">
                            {{ $t('onboarding.completion.startOver') }}
                        </button>
                    </div>
                </div>
                <StartFooter variant="internal" />
            </div>

            <!-- Not completed: show onboarding wizard -->
            <div v-else class="auth-page-content">
                <div class="auth-page-inner">
                    <OnboardingWizard :on-complete="handleOnboardingComplete" />
                </div>
                <StartFooter variant="internal" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.authenticated-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f9fafb;
}

.auth-page-loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 7rem;
}

.auth-page-inner {
    flex: 1;
    padding: 0 1rem 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

.completion-card {
    background: white;
    border-radius: 1rem;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.completion-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
}

.completion-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
}

.completion-description {
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto 2rem;
}

.btn-start-over {
    padding: 0.75rem 2rem;
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-start-over:hover {
    background: #6366f1;
    color: white;
}
</style>
