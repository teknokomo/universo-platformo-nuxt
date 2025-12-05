# Package Creation Workflow

> **Purpose**: Step-by-step guide for creating new packages in Universo Platformo Nuxt following modular architecture requirements.

**Last Updated**: 2025-11-17  
**Constitution Version**: 1.3.0  
**Related Documents**: [constitution.md](./constitution.md), [modular-architecture-checklist.md](./modular-architecture-checklist.md)

---

## Overview

This document provides a complete workflow for creating new packages in the monorepo. ALL feature functionality MUST be implemented in packages, following the strict modular architecture defined in the Constitution.

---

## Quick Reference

**Package Types:**

- **Feature Frontend**: `packages/{domain}-frt/base/`
- **Feature Backend**: `packages/{domain}-srv/base/`
- **Utility Package**: `packages/@universo/{name}/base/`
- **Template Package**: `packages/template-{name}/base/`

**Required Files:**

- `package.json` - Package configuration
- `README.md` - English documentation
- `README-RU.md` - Russian documentation
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Main entry point

---

## Workflow: Creating a Feature Package Pair

For most features, you'll need both frontend and backend packages.

### Step 1: Plan Your Package

Before creating packages, determine:

1. **Domain name**: What is this feature called? (e.g., `clusters`, `metaverses`, `spaces`)
2. **Scope**: Does it need frontend? Backend? Both?
3. **Dependencies**: What other packages will it depend on?
4. **Public API**: What will other packages import from it?

**Example**: Creating a "Clusters" feature

- Frontend package: `clusters-frt`
- Backend package: `clusters-srv`
- Dependencies: `@universo/types`, `@universo/utils`

### Step 2: Create Directory Structure

```bash
# Navigate to packages directory
cd /home/runner/work/universo-platformo-nuxt/universo-platformo-nuxt/packages

# Create frontend package structure
mkdir -p clusters-frt/base/src/{components,composables,pages}

# Create backend package structure
mkdir -p clusters-srv/base/src/{api,services,entities}
```

### Step 3: Create Frontend Package Configuration

**File**: `packages/clusters-frt/base/package.json`

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

### Step 4: Create Backend Package Configuration

**File**: `packages/clusters-srv/base/package.json`

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

### Step 5: Create TypeScript Configuration

**File**: `packages/clusters-frt/base/tsconfig.json`

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

**File**: `packages/clusters-srv/base/tsconfig.json`

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

### Step 6: Create Entry Points

**File**: `packages/clusters-frt/base/src/index.ts`

```typescript
// Export all public components
export { default as ClusterList } from './components/ClusterList.vue';
export { default as ClusterCard } from './components/ClusterCard.vue';

// Export composables
export { useClusters } from './composables/useClusters';
export { useClusterDetails } from './composables/useClusterDetails';

// Export types
export type { Cluster, ClusterFilters } from './types';
```

**File**: `packages/clusters-srv/base/src/index.ts`

```typescript
// Export services
export { ClusterService } from './services/ClusterService';
export { DomainService } from './services/DomainService';

// Export entities
export { Cluster } from './entities/Cluster';
export { Domain } from './entities/Domain';

// Export API handlers
export { clusterRoutes } from './api/clusters';

// Export types
export type { ClusterDTO, CreateClusterDTO } from './types';
```

### Step 7: Create Bilingual README Files

**File**: `packages/clusters-frt/base/README.md`

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

**File**: `packages/clusters-frt/base/README-RU.md`

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

### Step 8: Update Workspace Configuration

**File**: `pnpm-workspace.yaml` (root)

Verify it includes:

```yaml
packages:
  - 'packages/**/base'
````

### Step 9: Install Dependencies

```bash
# From repository root
cd /home/runner/work/universo-platformo-nuxt/universo-platformo-nuxt

# Install all workspace dependencies
pnpm install
```

### Step 10: Verify Package Setup

```bash
# Navigate to frontend package
cd packages/clusters-frt/base

# Verify it can be built
pnpm typecheck

# Verify linting works
pnpm lint

# Navigate to backend package
cd ../../clusters-srv/base

# Verify it can be built
pnpm build

# Verify tests work
pnpm test
```

### Step 11: Create Initial Implementation

Now you can start implementing the actual feature code:

**Frontend**: Create components in `src/components/`
**Backend**: Create services in `src/services/`, entities in `src/entities/`, API routes in `src/api/`

---

## Workflow: Creating a Utility Package

Utility packages are shared across multiple feature packages.

### Example: Creating `@universo/api-client`

```bash
# Create directory structure
mkdir -p packages/@universo/api-client/base/src

# Create package.json
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

# Create tsconfig.json
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

# Create entry point
cat > packages/@universo/api-client/base/src/index.ts << 'EOF'
export { ApiClient } from './ApiClient';
export { createApiClient } from './factory';
export type { ApiClientConfig, ApiResponse } from './types';
EOF
```

Then create bilingual READMEs following the same pattern as feature packages.

---

## Workflow: Creating a Template Package

Template packages contain reusable component templates.

### Example: Creating `template-mmoomm`

```bash
# Create directory structure
mkdir -p packages/template-mmoomm/base/src/components

# Create package.json with peerDependencies
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

**Note**: Template packages are source-only (no build step) and use `peerDependencies` to avoid dependency duplication.

---

## Best Practices

### 1. Package Naming

- ✅ **DO**: Use kebab-case: `clusters-frt`, `metaverses-srv`
- ✅ **DO**: Use scope for utilities: `@universo/types`
- ❌ **DON'T**: Use camelCase: `clustersFrt`
- ❌ **DON'T**: Mix naming conventions

### 2. Dependencies

- ✅ **DO**: Use `workspace:*` for internal dependencies
- ✅ **DO**: Declare all dependencies explicitly
- ✅ **DO**: Use `peerDependencies` for template/source-only packages
- ❌ **DON'T**: Rely on hoisted dependencies
- ❌ **DON'T**: Import from package internals

### 3. Exports

- ✅ **DO**: Export clear public API through `index.ts`
- ✅ **DO**: Use named exports
- ✅ **DO**: Document exported items
- ❌ **DON'T**: Export everything with `*`
- ❌ **DON'T**: Export internal utilities

### 4. Documentation

- ✅ **DO**: Create both README.md and README-RU.md
- ✅ **DO**: Keep line counts matching (±2 lines tolerance)
- ✅ **DO**: Include usage examples
- ✅ **DO**: Document all public APIs
- ❌ **DON'T**: Skip Russian version
- ❌ **DON'T**: Create docs/ directory in package

### 5. Structure

- ✅ **DO**: Keep `base/` as root folder in package
- ✅ **DO**: Organize by feature within `src/`
- ✅ **DO**: Separate concerns (components, services, etc.)
- ❌ **DON'T**: Put code outside `base/` folder
- ❌ **DON'T**: Mix frontend and backend in same package

---

## Common Patterns

### Pattern 1: Full-Stack Feature

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

### Pattern 2: Frontend-Only Feature

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

### Pattern 3: Shared Utility

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

## Troubleshooting

### Issue: "Cannot find module"

**Solution**: Ensure package is in `pnpm-workspace.yaml` and run `pnpm install`

```bash
# Check workspace config
cat pnpm-workspace.yaml

# Reinstall dependencies
pnpm install
```

### Issue: "TypeScript can't find types"

**Solution**: Check `tsconfig.json` paths and ensure `@types` packages are installed

```bash
# Verify TypeScript config
cat packages/{package}/base/tsconfig.json

# Install missing types
pnpm add -D @types/node
```

### Issue: "Build fails"

**Solution**: Verify build configuration and dependencies

```bash
# Check package.json scripts
cat packages/{package}/base/package.json | grep build

# Try clean build
rm -rf packages/{package}/base/dist
pnpm build
```

### Issue: "Linting errors"

**Solution**: Run lint fix and update code

```bash
# Auto-fix issues
pnpm lint:fix

# Check remaining issues
pnpm lint
```

---

## Validation Checklist

After creating a package, verify:

- [ ] Package directory created in `packages/`
- [ ] `base/` folder exists as root in package
- [ ] `package.json` with correct name and dependencies
- [ ] `tsconfig.json` with proper configuration
- [ ] `src/index.ts` entry point exists
- [ ] `README.md` (English) exists
- [ ] `README-RU.md` (Russian) exists
- [ ] Both READMEs have same structure
- [ ] Package added to workspace (implicitly via `packages/**/base`)
- [ ] Dependencies installed (`pnpm install`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Package can be built independently

---

## Next Steps

After creating packages:

1. **Implement features**: Add actual functionality to `src/`
2. **Write tests**: Add test files for your code
3. **Update documentation**: Keep READMEs in sync with implementation
4. **Create specification**: Document in `.specify/features/`
5. **Create GitHub Issue**: Follow `.github/instructions/github-issues.md`
6. **Create Pull Request**: Follow `.github/instructions/github-pr.md`

---

## Related Documents

- [Constitution Principle I](./constitution.md#i-monorepo-architecture-with-pnpm) - Monorepo architecture rules
- [Architectural Pattern 0](./architectural-patterns.md#0-package-based-modularity) - Package modularity pattern
- [Modular Architecture Checklist](./modular-architecture-checklist.md) - Validation checklist
- [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) - Reference implementation

---

## Conclusion

Following this workflow ensures:

- ✅ Modular architecture compliance
- ✅ Future package extraction readiness
- ✅ Consistent structure across packages
- ✅ Proper dependency management
- ✅ Bilingual documentation

**Remember**: ALL feature code MUST be in packages. No exceptions.
