<script setup lang="ts">
/**
 * StartFooter - Footer component for start pages
 *
 * Displays contact information:
 * - Owner name (Telegram link)
 * - Email address
 * - Terms of Service link
 * - Privacy Policy link
 *
 * Supports two variants: 'guest' (white text) and 'internal' (dark text)
 */

interface Props {
    variant?: 'guest' | 'internal'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'guest'
})

const { t } = useI18n()

const footerItems = computed(() => [
    {
        text: t('landing.footer.owner'),
        href: 'https://t.me/diverslaboristo',
        external: true,
        icon: '✈️'
    },
    {
        text: t('landing.footer.email'),
        href: 'mailto:support@universo-platformo.com',
        external: true,
        icon: '✉️'
    },
    {
        text: t('landing.footer.termsOfService'),
        href: '/terms',
        external: false,
        icon: '📄'
    },
    {
        text: t('landing.footer.privacyPolicy'),
        href: '/privacy',
        external: false,
        icon: '🔒'
    }
])
</script>

<template>
    <footer class="start-footer" :class="{ 'start-footer--internal': props.variant === 'internal' }">
        <div class="start-footer-container">
            <div class="start-footer-grid">
                <a
                    v-for="item in footerItems"
                    :key="item.text"
                    :href="item.href"
                    :target="item.external ? '_blank' : undefined"
                    :rel="item.external ? 'noopener noreferrer' : undefined"
                    class="footer-item"
                    :class="{ 'footer-item--internal': props.variant === 'internal' }"
                >
                    <span class="footer-item-icon">{{ item.icon }}</span>
                    <span class="footer-item-text">{{ item.text }}</span>
                </a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.start-footer {
    flex-shrink: 0;
    padding: 0.5rem 0;
}

.start-footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.start-footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

@media (min-width: 640px) {
    .start-footer-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .start-footer-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.footer-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: white;
    text-decoration: none;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    transition: all 0.2s;
    padding: 0.25rem;
}

.footer-item:hover {
    transform: translateY(-2px);
    opacity: 0.85;
}

.footer-item--internal {
    color: #6b7280;
    text-shadow: none;
}

.footer-item--internal:hover {
    color: #6366f1;
}

.footer-item-icon {
    font-size: 0.875rem;
}

.footer-item-text {
    font-size: 0.8125rem;
}
</style>
