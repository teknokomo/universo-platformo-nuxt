<script setup lang="ts">
/**
 * Testimonials - Universo ecosystem product cards
 *
 * Displays 4 product cards in a grid:
 * - Universo Kompendio - Knowledge management
 * - Universo Platformo - Abstract management layer
 * - Universo Kiberplano - Planning and execution system
 * - Universo Grandaringo - Creative and media tools
 */

const { t } = useI18n()

const products = [
    {
        name: 'Kompendio',
        titleKey: 'landing.testimonials.kompendio.title',
        descriptionKey: 'landing.testimonials.kompendio.description'
    },
    {
        name: 'Platformo',
        titleKey: 'landing.testimonials.platformo.title',
        descriptionKey: 'landing.testimonials.platformo.description'
    },
    {
        name: 'Kiberplano',
        titleKey: 'landing.testimonials.kiberplano.title',
        descriptionKey: 'landing.testimonials.kiberplano.description'
    },
    {
        name: 'Grandaringo',
        titleKey: 'landing.testimonials.grandaringo.title',
        descriptionKey: 'landing.testimonials.grandaringo.description'
    }
]
</script>

<template>
    <section class="testimonials">
        <div class="testimonials-container">
            <div class="testimonials-grid">
                <div v-for="product in products" :key="product.name" class="product-card">
                    <h3 class="product-title">
                        <span class="product-title-universo">Universo</span>
                        {{ ' ' + t(product.titleKey) }}
                    </h3>
                    <p class="product-description">{{ t(product.descriptionKey) }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.testimonials {
    flex-shrink: 0;
}

.testimonials-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1rem 0.5rem;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 640px) {
    .testimonials-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .testimonials-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.product-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 0.75rem;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.product-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.3;
}

.product-title-universo {
    color: #6366f1;
}

.product-description {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
}
</style>
