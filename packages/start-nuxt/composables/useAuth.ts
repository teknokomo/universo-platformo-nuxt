/**
 * useAuth composable - Authentication state management via backend API
 *
 * Provides:
 * - isAuthenticated: boolean reactive state
 * - loading: boolean reactive state while checking auth
 * - user: current user data or null
 * - login(email, password): login via backend API
 * - logout(): logout via backend API
 * - refresh(): refresh current auth state
 *
 * Uses Nuxt's `useState` to ensure SSR-safe state isolation between requests.
 */

export interface AuthUser {
    id: string
    email: string
}

export function useAuth() {
    // Use Nuxt's useState for SSR-safe state (isolated per request on server, shared on client)
    const user = useState<AuthUser | null>('auth:user', () => null)
    const loading = useState<boolean>('auth:loading', () => true)
    const error = useState<string | null>('auth:error', () => null)
    const initialized = useState<boolean>('auth:initialized', () => false)

    const isAuthenticated = computed(() => user.value !== null)

    /**
     * Fetch current user from the backend /auth/me endpoint
     */
    async function fetchCurrentUser(): Promise<AuthUser | null> {
        try {
            const data = await $fetch<AuthUser>('/api/v1/auth/me', {
                credentials: 'include'
            })
            user.value = data
            return data
        } catch {
            user.value = null
            return null
        }
    }

    /**
     * Initialize auth state (fetch current user on first call)
     */
    async function initialize(): Promise<void> {
        if (initialized.value) return
        initialized.value = true
        loading.value = true
        error.value = null
        try {
            await fetchCurrentUser()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Auth initialization failed'
        } finally {
            loading.value = false
        }
    }

    /**
     * Login with email and password
     */
    async function login(email: string, password: string): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<AuthUser>('/api/v1/auth/login', {
                method: 'POST',
                body: { email, password },
                credentials: 'include'
            })
            user.value = data
        } catch (err: unknown) {
            const errorData = (err as { data?: { statusMessage?: string; message?: string } })?.data
            const message =
                errorData?.statusMessage ||
                errorData?.message ||
                (err instanceof Error ? err.message : 'Login failed')
            error.value = message
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Logout current user
     */
    async function logout(): Promise<void> {
        loading.value = true
        error.value = null
        try {
            await $fetch('/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            user.value = null
            initialized.value = false
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Logout failed'
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Refresh auth state from backend
     */
    async function refresh(): Promise<AuthUser | null> {
        loading.value = true
        error.value = null
        try {
            const authUser = await fetchCurrentUser()
            return authUser
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Refresh failed'
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        user: computed(() => user.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        isAuthenticated,
        login,
        logout,
        refresh,
        initialize
    }
}
