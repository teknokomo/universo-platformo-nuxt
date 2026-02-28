<script setup lang="ts">
/**
 * OnboardingWizard - Multi-step wizard for new user onboarding
 *
 * Steps:
 * 1. Welcome - Introduction message
 * 2. Projects (Global Goals) - Select global goals
 * 3. Campaigns (Personal Interests) - Select personal interests
 * 4. Clusters (Platform Features) - Select platform features
 * 5. Completion - Final message
 */

interface Props {
    onComplete?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
    complete: []
}>()

const { t } = useI18n()

interface OnboardingItem {
    id: string
    name: string
    description?: string
    isSelected: boolean
}

interface OnboardingItems {
    projects: OnboardingItem[]
    campaigns: OnboardingItem[]
    clusters: OnboardingItem[]
    onboardingCompleted: boolean
}

type OnboardingStep = 'welcome' | 'projects' | 'campaigns' | 'clusters' | 'completion'

const STEPS: OnboardingStep[] = ['welcome', 'projects', 'campaigns', 'clusters', 'completion']

const activeStep = ref(0)
const items = ref<OnboardingItems | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)

const selectedProjects = ref<string[]>([])
const selectedCampaigns = ref<string[]>([])
const selectedClusters = ref<string[]>([])

const currentStepName = computed(() => STEPS[activeStep.value])
const isFirstStep = computed(() => activeStep.value === 0)
const isLastStep = computed(() => activeStep.value === STEPS.length - 1)

const stepLabels = computed(() => [
    t('onboarding.steps.welcome'),
    t('onboarding.steps.projects'),
    t('onboarding.steps.campaigns'),
    t('onboarding.steps.clusters'),
    t('onboarding.steps.completion')
])

// Load items on mount
onMounted(async () => {
    try {
        isLoading.value = true
        error.value = null
        const data = await $fetch<OnboardingItems>('/api/v1/onboarding/items', {
            credentials: 'include'
        })
        items.value = data

        // Initialize selections from already-selected items
        const projectsSelected = data.projects.filter((p) => p.isSelected).map((p) => p.id)
        const campaignsSelected = data.campaigns.filter((c) => c.isSelected).map((c) => c.id)
        const clustersSelected = data.clusters.filter((c) => c.isSelected).map((c) => c.id)

        // Auto-select first item if nothing is pre-selected (consistent with React reference implementation)
        // This ensures users always have at least one item selected per category
        if (projectsSelected.length === 0 && data.projects.length > 0) {
            projectsSelected.push(data.projects[0].id)
        }
        if (campaignsSelected.length === 0 && data.campaigns.length > 0) {
            campaignsSelected.push(data.campaigns[0].id)
        }
        if (clustersSelected.length === 0 && data.clusters.length > 0) {
            clustersSelected.push(data.clusters[0].id)
        }

        selectedProjects.value = projectsSelected
        selectedCampaigns.value = campaignsSelected
        selectedClusters.value = clustersSelected
    } catch (err) {
        console.error('[OnboardingWizard] Failed to load items:', err)
        error.value = t('onboarding.errors.loadFailed')
    } finally {
        isLoading.value = false
    }
})

const toggleSelection = (arr: string[], id: string) => {
    const idx = arr.indexOf(id)
    if (idx === -1) {
        arr.push(id)
    } else {
        arr.splice(idx, 1)
    }
}

const handleNext = async () => {
    if (currentStepName.value === 'clusters') {
        // Save selections when moving from clusters to completion
        try {
            isSaving.value = true
            error.value = null
            await $fetch('/api/v1/onboarding/join', {
                method: 'POST',
                body: {
                    projectIds: selectedProjects.value,
                    campaignIds: selectedCampaigns.value,
                    clusterIds: selectedClusters.value
                },
                credentials: 'include'
            })
        } catch (err) {
            console.error('[OnboardingWizard] Failed to save selections:', err)
            error.value = t('onboarding.errors.saveFailed')
            isSaving.value = false
            return
        } finally {
            isSaving.value = false
        }
    }

    if (activeStep.value < STEPS.length - 1) {
        activeStep.value++
        if (STEPS[activeStep.value] === 'completion') {
            emit('complete')
            props.onComplete?.()
        }
    }
}

const handleBack = () => {
    if (activeStep.value > 0) {
        activeStep.value--
    }
}
</script>

<template>
    <div class="wizard">
        <!-- Loading state -->
        <div v-if="isLoading" class="wizard-loading">
            <div class="spinner" />
        </div>

        <template v-else>
            <!-- Stepper navigation -->
            <div class="wizard-stepper">
                <div
                    v-for="(label, idx) in stepLabels"
                    :key="idx"
                    class="stepper-item"
                    :class="{
                        'stepper-item--active': idx === activeStep,
                        'stepper-item--completed': idx < activeStep
                    }"
                >
                    <div class="stepper-dot">
                        <span v-if="idx < activeStep">✓</span>
                        <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <span class="stepper-label">{{ label }}</span>
                </div>
            </div>

            <!-- Error alert -->
            <div v-if="error" class="wizard-error">
                {{ error }}
            </div>

            <!-- Step content -->
            <div class="wizard-content">
                <!-- Welcome step -->
                <div v-if="currentStepName === 'welcome'" class="step-content">
                    <div class="step-welcome">
                        <h2 class="step-title">{{ t('onboarding.welcome.title') }}</h2>
                        <p class="step-description">{{ t('onboarding.welcome.description') }}</p>
                        <p class="step-hint">{{ t('onboarding.welcome.hint') }}</p>
                    </div>
                </div>

                <!-- Projects step -->
                <div v-else-if="currentStepName === 'projects'" class="step-content">
                    <h2 class="step-title">{{ t('onboarding.projects.title') }}</h2>
                    <p class="step-description">{{ t('onboarding.projects.description') }}</p>
                    <div v-if="items && items.projects.length > 0" class="items-grid">
                        <div
                            v-for="item in items.projects"
                            :key="item.id"
                            class="selectable-card"
                            :class="{ 'selectable-card--selected': selectedProjects.includes(item.id) }"
                            role="checkbox"
                            :aria-checked="selectedProjects.includes(item.id)"
                            tabindex="0"
                            @click="toggleSelection(selectedProjects, item.id)"
                            @keydown.enter="toggleSelection(selectedProjects, item.id)"
                            @keydown.space.prevent="toggleSelection(selectedProjects, item.id)"
                        >
                            <div class="card-check">
                                <span v-if="selectedProjects.includes(item.id)">✓</span>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">{{ item.name }}</h3>
                                <p v-if="item.description" class="card-description">
                                    {{ item.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="items-empty">
                        <p>{{ t('onboarding.projects.empty') }}</p>
                    </div>
                </div>

                <!-- Campaigns step -->
                <div v-else-if="currentStepName === 'campaigns'" class="step-content">
                    <h2 class="step-title">{{ t('onboarding.campaigns.title') }}</h2>
                    <p class="step-description">{{ t('onboarding.campaigns.description') }}</p>
                    <div v-if="items && items.campaigns.length > 0" class="items-grid">
                        <div
                            v-for="item in items.campaigns"
                            :key="item.id"
                            class="selectable-card"
                            :class="{ 'selectable-card--selected': selectedCampaigns.includes(item.id) }"
                            role="checkbox"
                            :aria-checked="selectedCampaigns.includes(item.id)"
                            tabindex="0"
                            @click="toggleSelection(selectedCampaigns, item.id)"
                            @keydown.enter="toggleSelection(selectedCampaigns, item.id)"
                            @keydown.space.prevent="toggleSelection(selectedCampaigns, item.id)"
                        >
                            <div class="card-check">
                                <span v-if="selectedCampaigns.includes(item.id)">✓</span>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">{{ item.name }}</h3>
                                <p v-if="item.description" class="card-description">
                                    {{ item.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="items-empty">
                        <p>{{ t('onboarding.campaigns.empty') }}</p>
                    </div>
                </div>

                <!-- Clusters step -->
                <div v-else-if="currentStepName === 'clusters'" class="step-content">
                    <h2 class="step-title">{{ t('onboarding.clusters.title') }}</h2>
                    <p class="step-description">{{ t('onboarding.clusters.description') }}</p>
                    <div v-if="items && items.clusters.length > 0" class="items-grid">
                        <div
                            v-for="item in items.clusters"
                            :key="item.id"
                            class="selectable-card"
                            :class="{ 'selectable-card--selected': selectedClusters.includes(item.id) }"
                            role="checkbox"
                            :aria-checked="selectedClusters.includes(item.id)"
                            tabindex="0"
                            @click="toggleSelection(selectedClusters, item.id)"
                            @keydown.enter="toggleSelection(selectedClusters, item.id)"
                            @keydown.space.prevent="toggleSelection(selectedClusters, item.id)"
                        >
                            <div class="card-check">
                                <span v-if="selectedClusters.includes(item.id)">✓</span>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">{{ item.name }}</h3>
                                <p v-if="item.description" class="card-description">
                                    {{ item.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="items-empty">
                        <p>{{ t('onboarding.clusters.empty') }}</p>
                    </div>
                </div>

                <!-- Completion step -->
                <div v-else-if="currentStepName === 'completion'" class="step-content">
                    <div class="step-completion">
                        <div class="completion-icon">🎉</div>
                        <h2 class="step-title">{{ t('onboarding.completion.title') }}</h2>
                        <p class="step-description">{{ t('onboarding.completion.description') }}</p>
                    </div>
                </div>
            </div>

            <!-- Navigation buttons -->
            <div class="wizard-nav" :class="{ 'wizard-nav--end': isFirstStep }">
                <button
                    v-if="!isFirstStep && !isLastStep"
                    class="btn-back"
                    :disabled="isSaving"
                    @click="handleBack"
                >
                    {{ t('onboarding.nav.back') }}
                </button>
                <button
                    v-if="!isLastStep"
                    class="btn-next"
                    :disabled="isSaving"
                    @click="handleNext"
                >
                    <span v-if="isSaving" class="btn-spinner-small" />
                    <span v-else>{{ t('onboarding.nav.next') }}</span>
                </button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.wizard {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.wizard-loading {
    display: flex;
    justify-content: center;
    padding: 3rem;
}

.wizard-error {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
}

.wizard-stepper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    overflow-x: auto;
    gap: 0.25rem;
}

.stepper-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    flex: 1;
    min-width: 60px;
}

.stepper-dot {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #e5e7eb;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    transition: all 0.2s;
}

.stepper-item--active .stepper-dot {
    background: #6366f1;
    color: white;
}

.stepper-item--completed .stepper-dot {
    background: #10b981;
    color: white;
}

.stepper-label {
    font-size: 0.6875rem;
    color: #9ca3af;
    text-align: center;
    font-weight: 500;
}

.stepper-item--active .stepper-label {
    color: #6366f1;
    font-weight: 700;
}

.stepper-item--completed .stepper-label {
    color: #10b981;
}

.wizard-content {
    min-height: 300px;
    margin-bottom: 2rem;
}

.step-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.step-welcome {
    text-align: center;
    padding: 2rem 0;
}

.step-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
}

.step-description {
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
}

.step-hint {
    color: #9ca3af;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.items-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
}

@media (min-width: 640px) {
    .items-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.selectable-card {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.selectable-card:hover {
    border-color: #c7d2fe;
    background: #eef2ff;
}

.selectable-card--selected {
    border-color: #6366f1;
    background: #eef2ff;
}

.card-check {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.375rem;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #6366f1;
    font-size: 0.875rem;
    font-weight: 700;
}

.selectable-card--selected .card-check {
    background: #6366f1;
    border-color: #6366f1;
    color: white;
}

.card-body {
    flex: 1;
}

.card-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1a1a2e;
}

.card-description {
    font-size: 0.8125rem;
    color: #6b7280;
    margin-top: 0.25rem;
    line-height: 1.4;
}

.items-empty {
    color: #9ca3af;
    text-align: center;
    padding: 3rem 0;
    font-size: 0.9375rem;
}

.step-completion {
    text-align: center;
    padding: 2rem 0;
}

.completion-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.wizard-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.wizard-nav--end {
    justify-content: flex-end;
}

.btn-back,
.btn-next {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 6rem;
    min-height: 2.75rem;
}

.btn-back {
    background: white;
    color: #4b5563;
    border: 2px solid #e5e7eb;
}

.btn-back:hover:not(:disabled) {
    border-color: #9ca3af;
    color: #1a1a2e;
}

.btn-next {
    background: #6366f1;
    color: white;
    border: 2px solid #6366f1;
}

.btn-next:hover:not(:disabled) {
    background: #4f46e5;
    border-color: #4f46e5;
}

.btn-back:disabled,
.btn-next:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.btn-spinner-small {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
