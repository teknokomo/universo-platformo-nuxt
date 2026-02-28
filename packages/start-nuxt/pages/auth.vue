<script setup lang="ts">
/**
 * Auth Page - Login and registration for Supabase authentication
 *
 * Features:
 * - Email/password login
 * - Email/password registration
 * - Toggle between login and register modes
 * - Error display
 * - Redirect to home after successful auth
 */

const { t } = useI18n()
const { login, isAuthenticated, loading, initialize } = useAuth()
const router = useRouter()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref('')
const isSubmitting = ref(false)

// Redirect if already authenticated
onMounted(async () => {
    await initialize()
    if (isAuthenticated.value) {
        await router.push('/')
    }
})

watch(isAuthenticated, (val) => {
    if (val) {
        router.push('/')
    }
})

const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    formError.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
}

const handleSubmit = async () => {
    formError.value = ''

    if (!email.value || !password.value) {
        formError.value = t('auth.errors.fieldsRequired')
        return
    }

    if (!isLoginMode.value && password.value !== confirmPassword.value) {
        formError.value = t('auth.errors.passwordMismatch')
        return
    }

    if (password.value.length < 6) {
        formError.value = t('auth.errors.passwordTooShort')
        return
    }

    isSubmitting.value = true

    try {
        if (isLoginMode.value) {
            await login(email.value, password.value)
        } else {
            // Registration: use backend signup endpoint
            await $fetch('/api/v1/auth/register', {
                method: 'POST',
                body: { email: email.value, password: password.value },
                credentials: 'include'
            })
            // After registration, log in automatically
            await login(email.value, password.value)
        }
        await router.push('/')
    } catch (err: unknown) {
        const errorData = err as { data?: { statusMessage?: string }; message?: string }
        formError.value =
            errorData?.data?.statusMessage || errorData?.message || t('auth.errors.genericError')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-container">
            <!-- Logo and title -->
            <div class="auth-header">
                <NuxtLink to="/" class="auth-logo">
                    <span class="auth-logo-universo">Universo</span>
                    <span class="auth-logo-platformo"> Platformo</span>
                </NuxtLink>
                <h1 class="auth-title">
                    {{ isLoginMode ? t('auth.login.title') : t('auth.register.title') }}
                </h1>
                <p class="auth-subtitle">
                    {{ isLoginMode ? t('auth.login.subtitle') : t('auth.register.subtitle') }}
                </p>
            </div>

            <!-- Auth form -->
            <form class="auth-form" @submit.prevent="handleSubmit">
                <!-- Error message -->
                <div v-if="formError" class="auth-error">
                    {{ formError }}
                </div>

                <!-- Email field -->
                <div class="form-group">
                    <label for="email" class="form-label">{{ t('auth.fields.email') }}</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="form-input"
                        :placeholder="t('auth.fields.emailPlaceholder')"
                        autocomplete="email"
                        required
                    />
                </div>

                <!-- Password field -->
                <div class="form-group">
                    <label for="password" class="form-label">{{ t('auth.fields.password') }}</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        class="form-input"
                        :placeholder="t('auth.fields.passwordPlaceholder')"
                        autocomplete="current-password"
                        required
                    />
                </div>

                <!-- Confirm password (register only) -->
                <div v-if="!isLoginMode" class="form-group">
                    <label for="confirmPassword" class="form-label">{{
                        t('auth.fields.confirmPassword')
                    }}</label>
                    <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        class="form-input"
                        :placeholder="t('auth.fields.confirmPasswordPlaceholder')"
                        autocomplete="new-password"
                        required
                    />
                </div>

                <!-- Submit button -->
                <button type="submit" class="btn-primary" :disabled="isSubmitting || loading">
                    <span v-if="isSubmitting" class="btn-spinner" />
                    <span v-else>
                        {{ isLoginMode ? t('auth.login.button') : t('auth.register.button') }}
                    </span>
                </button>
            </form>

            <!-- Toggle login/register -->
            <div class="auth-toggle">
                <span class="auth-toggle-text">
                    {{
                        isLoginMode ? t('auth.login.noAccount') : t('auth.register.hasAccount')
                    }}
                </span>
                <button class="btn-link" @click="toggleMode">
                    {{ isLoginMode ? t('auth.login.link') : t('auth.register.link') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
}

.auth-container {
    background: white;
    border-radius: 1rem;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-logo {
    display: inline-block;
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-decoration: none;
}

.auth-logo-universo {
    color: #6366f1;
}

.auth-logo-platformo {
    color: #1a1a2e;
}

.auth-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
}

.auth-subtitle {
    color: #6b7280;
    font-size: 0.95rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.auth-error {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.form-input {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
    outline: none;
    width: 100%;
}

.form-input:focus {
    border-color: #6366f1;
}

.btn-primary {
    padding: 0.875rem;
    background: #6366f1;
    color: white;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    transition: background 0.2s;
    margin-top: 0.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;
}

.btn-primary:hover:not(:disabled) {
    background: #4f46e5;
}

.btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.btn-spinner {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
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

.auth-toggle {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
}

.auth-toggle-text {
    color: #6b7280;
}

.btn-link {
    background: none;
    border: none;
    color: #6366f1;
    font-weight: 600;
    cursor: pointer;
    padding: 0 0.25rem;
    font-size: 0.875rem;
    text-decoration: underline;
}

.btn-link:hover {
    color: #4f46e5;
}
</style>
