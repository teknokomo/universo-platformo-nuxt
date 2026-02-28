# start-nuxt

**Стартовая страница на Nuxt 3 с аутентификацией Supabase для Universo Platformo**

[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82.svg)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E.svg)](https://supabase.com/)

[🇬🇧 English Version](./README.md)

## 📖 Обзор

`packages/start-nuxt` — это входное приложение Universo Platformo, построенное на
**Nuxt 3** как полнофункциональном фреймворке. Оно реализует стартовые страницы и
аутентификацию Supabase по образцу эталонной реализации на React.

Фронтенд **никогда не взаимодействует с Supabase напрямую**. Весь доступ к Supabase
происходит исключительно через серверные API-маршруты Nuxt, что гарантирует
хранение всех учётных данных только на сервере.

## 🗂 Структура пакета

```
packages/start-nuxt/
├── app.vue                        # Корневой компонент приложения Nuxt
├── nuxt.config.ts                 # Конфигурация Nuxt
├── package.json                   # Зависимости пакета
├── tsconfig.json                  # Конфигурация TypeScript
├── .env.example                   # Шаблон обязательных переменных окружения
│
├── pages/
│   ├── index.vue                  # Стартовая страница (гостевая или авторизованная)
│   └── auth.vue                   # Страница входа / регистрации
│
├── components/
│   ├── AppBar.vue                 # Верхняя навигационная панель
│   ├── GuestStartPage.vue         # Лендинг для неавторизованных пользователей
│   ├── AuthenticatedStartPage.vue # Онбординг-визард для авторизованных
│   ├── Hero.vue                   # Секция Hero с призывом к действию
│   ├── Testimonials.vue           # Карточки продуктов экосистемы Universo
│   ├── StartFooter.vue            # Футер (варианты: гостевой / внутренний)
│   └── OnboardingWizard.vue       # Многошаговый визард онбординга
│
├── composables/
│   └── useAuth.ts                 # SSR-безопасное состояние авторизации (useState)
│
├── server/
│   ├── utils/
│   │   └── supabase.ts            # Фабрики Supabase-клиентов (только сервер)
│   └── api/v1/
│       ├── auth/
│       │   ├── login.post.ts      # POST /api/v1/auth/login
│       │   ├── logout.post.ts     # POST /api/v1/auth/logout
│       │   ├── me.get.ts          # GET  /api/v1/auth/me
│       │   └── register.post.ts   # POST /api/v1/auth/register
│       └── onboarding/
│           ├── items.get.ts       # GET  /api/v1/onboarding/items
│           └── join.post.ts       # POST /api/v1/onboarding/join
│
├── i18n/locales/
│   ├── en.json                    # Переводы на английский
│   └── ru.json                    # Переводы на русский
│
└── assets/css/
    └── main.css                   # Глобальные стили
```

## 🚀 Возможности

### Страницы

| Маршрут | Описание                                                          |
| ------- | ----------------------------------------------------------------- |
| `/`     | Стартовая — показывает `GuestStartPage` или `AuthenticatedStartPage` |
| `/auth` | Форма входа / регистрации с переключением и отображением ошибок   |

### Процесс аутентификации

1. Пользователь отправляет email + пароль на `/auth`
2. `POST /api/v1/auth/login` вызывает Supabase на сервере и устанавливает HTTP-only куки
3. Последующие запросы передают куки — фронтенд никогда не хранит токены в JS
4. `GET /api/v1/auth/me` проверяет куку и автоматически обновляет истёкшие токены
5. `POST /api/v1/auth/logout` инвалидирует сессию Supabase и очищает куки

### Онбординг-визард

Пятишаговый визард, отображаемый для авторизованных пользователей:

1. **Добро пожаловать** — приветственное сообщение
2. **Проекты** — выбор глобальных целей
3. **Кампании** — выбор личных интересов
4. **Кластеры** — выбор функций платформы
5. **Завершение** — подтверждение с возможностью обновить предпочтения

## 🛠 Технологический стек

| Слой                    | Технология                          |
| ----------------------- | ----------------------------------- |
| Фреймворк               | Nuxt 3 (Vue 3 + Nitro)              |
| Язык                    | TypeScript (строгий режим)          |
| Авторизация / БД        | Supabase (через серверные маршруты) |
| Интернационализация     | @nuxtjs/i18n (en + ru)              |
| Стили                   | Scoped CSS (без UI-библиотеки)      |
| Менеджер пакетов        | PNPM                                |

## 🔒 Архитектура безопасности

- **Учётные данные Supabase — только на сервере**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  и `SUPABASE_SERVICE_ROLE_KEY` никогда не отправляются в браузер.
- **HTTP-only куки**: Токены доступа и обновления хранятся в куках с атрибутами
  `HttpOnly; SameSite=Lax` — недоступны для JavaScript в браузере.
- **Три типа Supabase-клиентов**:
  - `createSupabaseAdminClient()` — service role, обходит RLS (только привилегированные операции)
  - `createSupabaseAuthClient()` — anon key, без токена (вход / обновление токенов)
  - `createSupabaseUserClient(token)` — anon key + JWT пользователя, соблюдает RLS

## ⚙️ Переменные окружения

Скопируйте `.env.example` в `.env` и заполните учётные данные проекта Supabase:

```bash
cp .env.example .env
```

| Переменная                 | Обязательно | Описание                                 |
| -------------------------- | ----------- | ---------------------------------------- |
| `SUPABASE_URL`             | ✅          | URL проекта Supabase                     |
| `SUPABASE_ANON_KEY`        | ✅          | Публичный anon-ключ (здесь — только сервер) |
| `SUPABASE_SERVICE_ROLE_KEY`| ✅          | Service role ключ (привилегированные операции) |
| `NODE_ENV`                 | необязательно | `development` (по умолчанию) / `production` |

## 🧩 Разработка

```bash
# Установка зависимостей (из корня монорепозитория)
pnpm install

# Запуск сервера разработки
cd packages/start-nuxt
pnpm dev

# Сборка для продакшена
pnpm build

# Предпросмотр продакшен-сборки
pnpm preview

# Проверка типов
pnpm typecheck
```

## 🌐 Интернационализация

Файлы переводов находятся в `i18n/locales/`. Локаль по умолчанию — **русский** (`ru`).
Приложение также поддерживает **английский** (`en`). Определение локали использует
куку браузера (`i18n_redirected`).

## 📄 Лицензия

MIT — см. [LICENSE](../../LICENSE)
