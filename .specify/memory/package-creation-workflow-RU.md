# Процесс Создания Пакетов

> **Цель**: Пошаговое руководство по созданию новых пакетов в Universo Platformo Nuxt с соблюдением требований модульной архитектуры.

**Последнее обновление**: 2025-11-17  
**Версия Конституции**: 1.3.0  
**Связанные документы**: [constitution.md](./constitution.md), [modular-architecture-checklist.md](./modular-architecture-checklist.md)

---

## Обзор

Этот документ предоставляет полный процесс создания новых пакетов в монорепозитории. ВЕСЬ функциональный код ДОЛЖЕН быть реализован в пакетах, следуя строгой модульной архитектуре, определенной в Конституции.

---

## Быстрая Справка

**Типы пакетов:**

- **Feature Frontend**: `packages/{domain}-frt/base/`
- **Feature Backend**: `packages/{domain}-srv/base/`
- **Utility Package**: `packages/@universo/{name}/base/`
- **Template Package**: `packages/template-{name}/base/`

**Обязательные файлы:**

- `package.json` - Конфигурация пакета
- `README.md` - Документация на английском
- `README-RU.md` - Документация на русском
- `tsconfig.json` - Конфигурация TypeScript
- `src/index.ts` - Главная точка входа

---

## Процесс: Создание Пары Feature-пакетов

Для большинства функционалов вам понадобятся оба пакета: фронтенд и бэкенд.

### Шаг 1: Спланируйте Ваш Пакет

Перед созданием пакетов определите:

1. **Имя домена**: Как называется этот функционал? (например, `clusters`, `metaverses`, `spaces`)
2. **Область**: Нужен фронтенд? Бэкенд? Оба?
3. **Зависимости**: От каких других пакетов он будет зависеть?
4. **Публичный API**: Что другие пакеты будут импортировать из него?

**Пример**: Создание функционала "Clusters"

- Frontend пакет: `clusters-frt`
- Backend пакет: `clusters-srv`
- Зависимости: `@universo/types`, `@universo/utils`

### Шаг 2: Создайте Структуру Директорий

```bash
# Перейдите в директорию packages
cd /home/runner/work/universo-platformo-nuxt/universo-platformo-nuxt/packages

# Создайте структуру frontend пакета
mkdir -p clusters-frt/base/src/{components,composables,pages}

# Создайте структуру backend пакета
mkdir -p clusters-srv/base/src/{api,services,entities}
```

### Шаг 3: Создайте Конфигурацию Frontend Пакета

**Файл**: `packages/clusters-frt/base/package.json`

```json
{
  "name": "clusters-frt",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Clusters frontend package - UI and client-side logic",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*",
    "./composables/*": "./src/composables/*"
  },
  "scripts": {
    "dev": "nuxi dev",
    "build": "nuxi build",
    "typecheck": "nuxt typecheck",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@universo/types": "workspace:*",
    "@universo/utils": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "nuxt": "^3.9.0"
  }
}
```

### Шаг 4: Создайте Конфигурацию Backend Пакета

**Файл**: `packages/clusters-srv/base/package.json`

```json
{
  "name": "clusters-srv",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Clusters backend package - API and server-side logic",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./services/*": "./src/services/*",
    "./entities/*": "./src/entities/*"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsdown",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest run"
  },
  "dependencies": {
    "@universo/types": "workspace:*",
    "@universo/utils": "workspace:*",
    "typeorm": "^0.3.19",
    "h3": "^1.9.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tsdown": "^0.2.1",
    "vitest": "^1.1.0",
    "tsx": "^4.7.0"
  }
}
```

### Шаг 5: Создайте Конфигурацию TypeScript

**Файл**: `packages/clusters-frt/base/tsconfig.json`

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@universo/types": ["../../@universo/types/base/src"],
      "@universo/utils": ["../../@universo/utils/base/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Файл**: `packages/clusters-srv/base/tsconfig.json`

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@universo/types": ["../../@universo/types/base/src"],
      "@universo/utils": ["../../@universo/utils/base/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Шаг 6: Создайте Точки Входа

**Файл**: `packages/clusters-frt/base/src/index.ts`

```typescript
// Экспортировать все публичные компоненты
export { default as ClusterList } from './components/ClusterList.vue';
export { default as ClusterCard } from './components/ClusterCard.vue';

// Экспортировать composables
export { useClusters } from './composables/useClusters';
export { useClusterDetails } from './composables/useClusterDetails';

// Экспортировать типы
export type { Cluster, ClusterFilters } from './types';
```

**Файл**: `packages/clusters-srv/base/src/index.ts`

```typescript
// Экспортировать сервисы
export { ClusterService } from './services/ClusterService';
export { DomainService } from './services/DomainService';

// Экспортировать сущности
export { Cluster } from './entities/Cluster';
export { Domain } from './entities/Domain';

// Экспортировать API обработчики
export { clusterRoutes } from './api/clusters';

// Экспортировать типы
export type { ClusterDTO, CreateClusterDTO } from './types';
```

### Шаг 7: Создайте Двуязычные README Файлы

**Файл**: `packages/clusters-frt/base/README.md`

````markdown
# Clusters Frontend Package

Frontend package for Clusters functionality in Universo Platformo Nuxt.

[🇷🇺 Русская версия](./README-RU.md)

## Overview

This package provides UI components, composables, and pages for managing Clusters in the Universo Platformo.

## Features

- Cluster list view with pagination
- Cluster creation and editing forms
- Cluster details view
- Domain management within clusters
- Resource management within domains

## Installation

This package is part of the Universo Platformo Nuxt monorepo and uses workspace dependencies.

```bash
pnpm install
```
````

## Usage

### In Nuxt Pages

```vue
<script setup lang="ts">
import { useClusters } from 'clusters-frt';

const { clusters, loading, error } = useClusters();
</script>

<template>
  <ClusterList :clusters="clusters" :loading="loading" />
</template>
```

### Importing Components

```typescript
import { ClusterCard, ClusterList } from 'clusters-frt';
```

## Development

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Dependencies

- `@universo/types` - Shared TypeScript types
- `@universo/utils` - Shared utility functions
- `clusters-srv` - Backend API (implicit dependency)

## Structure

```
src/
├── components/     # Vue components
├── composables/    # Composable functions
├── pages/          # Nuxt pages
├── types/          # TypeScript types
└── index.ts        # Package exports
```

## Related Packages

- `clusters-srv` - Backend API for clusters
- `@universo/types` - Shared types
- `@universo/utils` - Shared utilities

## License

Omsk Open License

````

**Файл**: `packages/clusters-frt/base/README-RU.md`

```markdown
# Пакет Clusters Frontend

Фронтенд-пакет для функционала Кластеров в Universo Platformo Nuxt.

[🇬🇧 English version](./README.md)

## Обзор

Этот пакет предоставляет UI-компоненты, composables и страницы для управления Кластерами в Universo Platformo.

## Возможности

- Просмотр списка кластеров с пагинацией
- Формы создания и редактирования кластеров
- Просмотр деталей кластера
- Управление доменами внутри кластеров
- Управление ресурсами внутри доменов

## Установка

Этот пакет является частью монорепозитория Universo Platformo Nuxt и использует workspace-зависимости.

```bash
pnpm install
````

## Использование

### В страницах Nuxt

```vue
<script setup lang="ts">
import { useClusters } from 'clusters-frt';

const { clusters, loading, error } = useClusters();
</script>

<template>
  <ClusterList :clusters="clusters" :loading="loading" />
</template>
```

### Импорт компонентов

```typescript
import { ClusterCard, ClusterList } from 'clusters-frt';
```

## Разработка

```bash
# Проверка типов
pnpm typecheck

# Линтинг
pnpm lint

# Исправление проблем линтинга
pnpm lint:fix
```

## Зависимости

- `@universo/types` - Общие TypeScript типы
- `@universo/utils` - Общие утилитарные функции
- `clusters-srv` - Backend API (неявная зависимость)

## Структура

```
src/
├── components/     # Vue компоненты
├── composables/    # Composable функции
├── pages/          # Nuxt страницы
├── types/          # TypeScript типы
└── index.ts        # Экспорты пакета
```

## Связанные пакеты

- `clusters-srv` - Backend API для кластеров
- `@universo/types` - Общие типы
- `@universo/utils` - Общие утилиты

## Лицензия

Omsk Open License

````

### Шаг 8: Обновите Конфигурацию Workspace

**Файл**: `pnpm-workspace.yaml` (корень)

Убедитесь, что включено:

```yaml
packages:
  - 'packages/**/base'
````

### Шаг 9: Установите Зависимости

```bash
# Из корня репозитория
cd /home/runner/work/universo-platformo-nuxt/universo-platformo-nuxt

# Установите все workspace-зависимости
pnpm install
```

### Шаг 10: Проверьте Настройку Пакета

```bash
# Перейдите к frontend пакету
cd packages/clusters-frt/base

# Проверьте, что можно собрать
pnpm typecheck

# Проверьте, что линтинг работает
pnpm lint

# Перейдите к backend пакету
cd ../../clusters-srv/base

# Проверьте, что можно собрать
pnpm build

# Проверьте, что тесты работают
pnpm test
```

### Шаг 11: Создайте Начальную Реализацию

Теперь вы можете начать реализовывать код функционала:

**Frontend**: Создайте компоненты в `src/components/`
**Backend**: Создайте сервисы в `src/services/`, сущности в `src/entities/`, API роуты в `src/api/`

---

## Процесс: Создание Utility Пакета

Utility пакеты используются совместно несколькими feature пакетами.

### Пример: Создание `@universo/api-client`

```bash
# Создайте структуру директорий
mkdir -p packages/@universo/api-client/base/src

# Создайте package.json
cat > packages/@universo/api-client/base/package.json << 'EOF'
{
  "name": "@universo/api-client",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Shared API client for Universo Platformo",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsdown",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "peerDependencies": {
    "@nuxtjs/supabase": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tsdown": "^0.2.1",
    "vitest": "^1.1.0"
  }
}
EOF

# Создайте tsconfig.json
cat > packages/@universo/api-client/base/tsconfig.json << 'EOF'
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Создайте точку входа
cat > packages/@universo/api-client/base/src/index.ts << 'EOF'
export { ApiClient } from './ApiClient';
export { createApiClient } from './factory';
export type { ApiClientConfig, ApiResponse } from './types';
EOF
```

Затем создайте двуязычные README, следуя тому же паттерну, что и для feature пакетов.

---

## Процесс: Создание Template Пакета

Template пакеты содержат переиспользуемые шаблоны компонентов.

### Пример: Создание `template-mmoomm`

```bash
# Создайте структуру директорий
mkdir -p packages/template-mmoomm/base/src/components

# Создайте package.json с peerDependencies
cat > packages/template-mmoomm/base/package.json << 'EOF'
{
  "name": "template-mmoomm",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "MMOOMM template components for Universo Platformo",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*"
  },
  "peerDependencies": {
    "vue": "^3.4.0",
    "vuetify": "^3.5.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF
```

**Примечание**: Template пакеты содержат только исходный код (без шага сборки) и используют `peerDependencies`, чтобы избежать дублирования зависимостей.

---

## Лучшие Практики

### 1. Именование Пакетов

- ✅ **ДЕЛАЙТЕ**: Используйте kebab-case: `clusters-frt`, `metaverses-srv`
- ✅ **ДЕЛАЙТЕ**: Используйте scope для утилит: `@universo/types`
- ❌ **НЕ ДЕЛАЙТЕ**: Используйте camelCase: `clustersFrt`
- ❌ **НЕ ДЕЛАЙТЕ**: Смешивайте соглашения об именовании

### 2. Зависимости

- ✅ **ДЕЛАЙТЕ**: Используйте `workspace:*` для внутренних зависимостей
- ✅ **ДЕЛАЙТЕ**: Объявляйте все зависимости явно
- ✅ **ДЕЛАЙТЕ**: Используйте `peerDependencies` для template/source-only пакетов
- ❌ **НЕ ДЕЛАЙТЕ**: Полагайтесь на поднятые зависимости
- ❌ **НЕ ДЕЛАЙТЕ**: Импортируйте из внутренних частей пакетов

### 3. Экспорты

- ✅ **ДЕЛАЙТЕ**: Экспортируйте четкий публичный API через `index.ts`
- ✅ **ДЕЛАЙТЕ**: Используйте именованные экспорты
- ✅ **ДЕЛАЙТЕ**: Документируйте экспортируемые элементы
- ❌ **НЕ ДЕЛАЙТЕ**: Экспортируйте всё с помощью `*`
- ❌ **НЕ ДЕЛАЙТЕ**: Экспортируйте внутренние утилиты

### 4. Документация

- ✅ **ДЕЛАЙТЕ**: Создавайте и README.md, и README-RU.md
- ✅ **ДЕЛАЙТЕ**: Поддерживайте соответствие количества строк (допуск ±2 строки)
- ✅ **ДЕЛАЙТЕ**: Включайте примеры использования
- ✅ **ДЕЛАЙТЕ**: Документируйте все публичные API
- ❌ **НЕ ДЕЛАЙТЕ**: Пропускайте русскую версию
- ❌ **НЕ ДЕЛАЙТЕ**: Создавайте директорию docs/ в пакете

### 5. Структура

- ✅ **ДЕЛАЙТЕ**: Держите `base/` как корневую папку в пакете
- ✅ **ДЕЛАЙТЕ**: Организуйте по функционалу внутри `src/`
- ✅ **ДЕЛАЙТЕ**: Разделяйте ответственность (components, services и т.д.)
- ❌ **НЕ ДЕЛАЙТЕ**: Размещайте код вне папки `base/`
- ❌ **НЕ ДЕЛАЙТЕ**: Смешивайте frontend и backend в одном пакете

---

## Общие Паттерны

### Паттерн 1: Full-Stack Feature

```
packages/
├── {domain}-frt/base/    # Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── pages/
│   │   └── index.ts
│   ├── package.json
│   ├── README.md
│   └── README-RU.md
└── {domain}-srv/base/    # Backend
    ├── src/
    │   ├── api/
    │   ├── services/
    │   ├── entities/
    │   └── index.ts
    ├── package.json
    ├── README.md
    └── README-RU.md
```

### Паттерн 2: Frontend-Only Feature

```
packages/
└── {domain}-frt/base/
    ├── src/
    │   ├── components/
    │   ├── composables/
    │   └── index.ts
    ├── package.json
    ├── README.md
    └── README-RU.md
```

### Паттерн 3: Shared Utility

```
packages/
└── @universo/{name}/base/
    ├── src/
    │   ├── utils/
    │   ├── types/
    │   └── index.ts
    ├── package.json
    ├── README.md
    └── README-RU.md
```

---

## Устранение Неполадок

### Проблема: "Cannot find module"

**Решение**: Убедитесь, что пакет есть в `pnpm-workspace.yaml` и выполните `pnpm install`

```bash
# Проверьте конфигурацию workspace
cat pnpm-workspace.yaml

# Переустановите зависимости
pnpm install
```

### Проблема: "TypeScript can't find types"

**Решение**: Проверьте пути в `tsconfig.json` и убедитесь, что пакеты `@types` установлены

```bash
# Проверьте конфигурацию TypeScript
cat packages/{package}/base/tsconfig.json

# Установите отсутствующие типы
pnpm add -D @types/node
```

### Проблема: "Build fails"

**Решение**: Проверьте конфигурацию сборки и зависимости

```bash
# Проверьте скрипты package.json
cat packages/{package}/base/package.json | grep build

# Попробуйте чистую сборку
rm -rf packages/{package}/base/dist
pnpm build
```

### Проблема: "Linting errors"

**Решение**: Запустите автоисправление линтинга и обновите код

```bash
# Автоисправление проблем
pnpm lint:fix

# Проверьте оставшиеся проблемы
pnpm lint
```

---

## Контрольный Список Валидации

После создания пакета проверьте:

- [ ] Директория пакета создана в `packages/`
- [ ] Папка `base/` существует как корень в пакете
- [ ] `package.json` с правильным именем и зависимостями
- [ ] `tsconfig.json` с правильной конфигурацией
- [ ] Точка входа `src/index.ts` существует
- [ ] `README.md` (английский) существует
- [ ] `README-RU.md` (русский) существует
- [ ] Оба README имеют одинаковую структуру
- [ ] Пакет добавлен в workspace (неявно через `packages/**/base`)
- [ ] Зависимости установлены (`pnpm install`)
- [ ] TypeScript компилируется (`pnpm typecheck`)
- [ ] Линтинг проходит (`pnpm lint`)
- [ ] Пакет может быть собран независимо

---

## Следующие Шаги

После создания пакетов:

1. **Реализуйте функционал**: Добавьте реальную функциональность в `src/`
2. **Напишите тесты**: Добавьте тестовые файлы для вашего кода
3. **Обновите документацию**: Держите README синхронизированными с реализацией
4. **Создайте спецификацию**: Задокументируйте в `.specify/features/`
5. **Создайте GitHub Issue**: Следуйте `.github/instructions/github-issues.md`
6. **Создайте Pull Request**: Следуйте `.github/instructions/github-pr.md`

---

## Связанные Документы

- [Конституция Принцип I](./constitution.md#i-monorepo-architecture-with-pnpm) - Правила архитектуры монорепозитория
- [Архитектурный Паттерн 0](./architectural-patterns.md#0-package-based-modularity) - Паттерн модульности пакетов
- [Контрольный Список Модульной Архитектуры](./modular-architecture-checklist.md) - Контрольный список валидации
- [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) - Референсная реализация

---

## Заключение

Следование этому процессу гарантирует:

- ✅ Соответствие модульной архитектуре
- ✅ Готовность к извлечению пакетов в будущем
- ✅ Согласованную структуру между пакетами
- ✅ Правильное управление зависимостями
- ✅ Двуязычную документацию

**Помните**: ВЕСЬ код функционала ДОЛЖЕН быть в пакетах. Без исключений.
