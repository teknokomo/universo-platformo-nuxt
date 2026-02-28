<script setup lang="ts">
/**
 * AppBar - Top navigation bar
 *
 * Features:
 * - Universo Platformo logo (links to home)
 * - Login/Logout button based on auth state
 * - Mobile-friendly
 */

const { t } = useI18n()
const { isAuthenticated, loading, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
    try {
        await logout()
        await router.push('/')
    } catch {
        // Ignore logout errors
    }
}
</script>

<template>
    <header class="appbar">
        <div class="appbar-container">
            <!-- Logo -->
            <NuxtLink to="/" class="appbar-logo">
                <span class="logo-universo">Universo</span>
                <span class="logo-platformo"> Platformo</span>
            </NuxtLink>

            <!-- Auth button -->
            <nav class="appbar-nav">
                <template v-if="!loading">
                    <button v-if="isAuthenticated" class="btn-nav btn-nav-outline" @click="handleLogout">
                        {{ t('appbar.logout') }}
                    </button>
                    <NuxtLink v-else to="/auth" class="btn-nav btn-nav-primary">
                        {{ t('appbar.login') }}
                    </NuxtLink>
                </template>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.appbar {
    position: fixed;
    top: 1.5rem;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0 1rem;
}

.appbar-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1.25rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 9999px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.appbar-logo {
    font-size: 1.125rem;
    font-weight: 800;
    text-decoration: none;
}

.logo-universo {
    color: #6366f1;
}

.logo-platformo {
    color: #1a1a2e;
}

.appbar-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-nav {
    padding: 0.4rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}

.btn-nav-primary {
    background: #6366f1;
    color: white;
    border: 2px solid #6366f1;
}

.btn-nav-primary:hover {
    background: #4f46e5;
    border-color: #4f46e5;
}

.btn-nav-outline {
    background: transparent;
    color: #6366f1;
    border: 2px solid #6366f1;
}

.btn-nav-outline:hover {
    background: #6366f1;
    color: white;
}
</style>
