// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    devtools: { enabled: true },

    // TypeScript strict mode
    typescript: {
        strict: true,
        typeCheck: false
    },

    // Runtime config - all Supabase credentials are server-only.
    // The frontend never communicates with Supabase directly;
    // all Supabase access goes through Nuxt server API routes.
    runtimeConfig: {
        // Private (server-only) - never sent to the client browser
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        jwtSecret: process.env.JWT_SECRET || '',

        // Public (exposed to client) - intentionally empty for Supabase
        public: {}
    },

    // Modules
    modules: ['@nuxtjs/i18n'],

    // i18n configuration
    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'ru', name: 'Русский', file: 'ru.json' }
        ],
        defaultLocale: 'ru',
        langDir: 'locales/',
        strategy: 'no_prefix'
    },

    // SSR enabled for full-stack Nuxt
    ssr: true,

    // App head configuration
    app: {
        head: {
            title: 'Universo Platformo',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Universo Platformo - Unified platform for all worlds'
                }
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
        }
    },

    // CSS
    css: ['~/assets/css/main.css'],

    // Nitro server configuration
    nitro: {
        experimental: {
            openAPI: false
        }
    }
})
