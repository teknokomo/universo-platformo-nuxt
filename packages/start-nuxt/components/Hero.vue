<script setup lang="ts">
/**
 * Hero - Landing page hero section
 *
 * Displays:
 * - Main heading with highlighted text
 * - Subtitle describing the platform
 * - "To the future" button linking to auth page
 */

const { t } = useI18n()
</script>

<template>
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">
                    <span class="hero-title-prefix">{{ t('landing.hero.titlePrefix') }}</span>
                    <span class="hero-title-highlight">&nbsp;{{ t('landing.hero.titleHighlight') }}</span>
                </h1>
                <p class="hero-description">
                    {{ t('landing.hero.description') }}
                </p>
                <div class="hero-actions">
                    <NuxtLink to="/auth" class="btn-hero">
                        {{ t('landing.hero.button') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.hero-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7rem 1rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 700px;
    text-align: center;
}

.hero-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

@media (min-width: 640px) {
    .hero-title {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
}

.hero-title-prefix {
    color: #1a1a2e;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.hero-title-highlight {
    color: #6366f1;
    text-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.hero-description {
    font-size: 1.15rem;
    color: #1a1a2e;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    max-width: 560px;
    line-height: 1.6;
}

.hero-actions {
    margin-top: 1.5rem;
}

.btn-hero {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: #6366f1;
    color: white;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    transition: all 0.2s;
}

.btn-hero:hover {
    background: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}
</style>
