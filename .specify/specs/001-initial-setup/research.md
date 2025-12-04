# Research: Best Practices for Nuxt TypeScript Fullstack Monorepo

**Feature**: 001-initial-setup  
**Date**: 2025-11-17  
**Purpose**: Research best technical solutions, patterns, and practices for implementing Universo Platformo Nuxt

## Executive Summary

This research consolidates best practices for building a fullstack monorepo using Nuxt 3, TypeScript, PNPM workspaces, Supabase, and associated technologies. The findings will inform implementation decisions for the Universo Platformo Nuxt project, ensuring we adopt proven patterns rather than copying legacy issues from the React version.

### Key Decisions Made

1. **Monorepo Structure**: Use `apps/` and `packages/` structure with PNPM workspaces
2. **TypeScript**: Strict mode enabled with comprehensive type checking
3. **UI Library**: Vuetify 3 (not Material UI React) as Vue-native Material Design implementation
4. **Testing**: Vitest with `@nuxt/test-utils` for Nuxt-aware testing
5. **Database**: Repository pattern with Supabase integration using official `@nuxtjs/supabase` module
6. **PNPM Configuration**: Use `shamefully-hoist=true` for Nuxt compatibility

---

## 1. Monorepo Architecture with PNPM

### Decision: Apps/Packages Structure

**Rationale**: Modern Nuxt monorepos separate applications from shared libraries, providing better scalability and maintainability.

**Implementation**:
```
/
├── apps/              # Nuxt applications
│   ├── main-app/
│   └── admin-app/
├── packages/          # Shared packages
│   ├── ui/            # Shared UI components (Nuxt layer)
│   ├── types/         # Shared TypeScript types
│   └── utils/         # Shared utilities
├── pnpm-workspace.yaml
├── .npmrc
├── tsconfig.base.json
└── package.json
```

**Configuration** (`pnpm-workspace.yaml`):
```yaml
packages:
  - "apps/**"
  - "packages/**"
```

**Alternatives Considered**:
- Flat structure with all packages in `packages/` only
- Rejected because: Doesn't scale well when multiple applications are needed

**Sources**: Vue School Nuxt Monorepo Guide, Dev.to Nuxt Monorepo Examples

---

## 2. Nuxt Layers for Code Sharing

### Decision: Use Nuxt Layers for shared components and configurations

**Rationale**: Nuxt Layers provide native framework support for sharing code between applications, superior to manual imports.

**Implementation**:
```typescript
// apps/main-app/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@my-monorepo/ui'], // Layer from packages/ui
})
```

**Benefits**:
- Share configurations automatically
- Components auto-imported across apps
- Type-safe sharing mechanism
- No build step needed for layers

**Alternatives Considered**:
- Nuxt Modules: More complex, better for plugins/advanced integrations
- Plain shared packages: Requires manual imports, less integrated

**Sources**: Nuxt Layers Documentation, Serkodev Nuxt Monorepo Template

---

## 3. TypeScript Strict Mode Configuration

### Decision: Enable strict mode globally with base configuration

**Rationale**: Strict TypeScript catches errors early and ensures type safety across entire monorepo. Non-negotiable per constitution.

**Implementation** (`tsconfig.base.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

**Nuxt-specific** (`nuxt.config.ts`):
```typescript
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  }
})
```

**Key Points**:
- Use `moduleResolution: "bundler"` for Nuxt 3 compatibility
- Enable `typeCheck: true` in Nuxt config for build-time checking
- Each package extends base config for consistency

**Sources**: Nuxt TypeScript Documentation, PNPM TypeScript Guide

---

## 4. PNPM Workspace Configuration

### Decision: Enable shamefully-hoist for Nuxt compatibility

**Rationale**: Nuxt requires flattened dependencies for optimal module resolution. While this reduces PNPM's strict isolation benefits, it's necessary for Nuxt ecosystem compatibility.

**Implementation** (`.npmrc`):
```
shamefully-hoist=true
strict-peer-dependencies=true
```

**Important Notes**:
- `shamefully-hoist` is global (affects entire workspace)
- Required for Nuxt's auto-import system to work properly
- Alternative: Use `public-hoist-pattern` for selective hoisting (more complex)

**Trade-offs**:
- **Pros**: Nuxt compatibility, simpler module resolution
- **Cons**: Loses PNPM's strict isolation, potential phantom dependencies

**Alternatives Considered**:
- `nodeLinker=hoisted`: Too permissive
- No hoisting: Breaks Nuxt auto-imports

**Sources**: Nuxt Monorepo Best Practices, PNPM Documentation

---

## 5. Fullstack API Routes with TypeScript

### Decision: Use Nuxt Server Routes with Zod validation

**Rationale**: Nuxt's integrated server provides type-safe API routes without separate backend framework. Zod adds runtime validation.

**Implementation**:
```typescript
// server/api/example.ts
import { z } from 'zod'

const schema = z.object({
  title: z.string(),
  body: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validated = schema.parse(body)
  
  // Type-safe validated data
  return { success: true, data: validated }
})
```

**Key Patterns**:
- File-based routing in `/server/api/`
- `defineEventHandler` for all routes
- `readBody(event)` for POST/PUT
- `getQuery(event)` for query parameters
- Zod for runtime + compile-time validation

**Alternatives Considered**:
- tRPC: Excellent for full type safety but adds complexity
- Manual typing: No runtime validation, less safe

**Decision**: Start with Zod, consider tRPC for complex scenarios

**Sources**: Nuxt Server Routes Documentation, Dev.to Nuxt API Guides

---

## 6. Supabase Integration

### Decision: Use @nuxtjs/supabase module with composables

**Rationale**: Official Nuxt module provides SSR-compatible authentication and database access with Vue composables.

**Implementation**:
```typescript
// Installation
pnpm add @nuxtjs/supabase

// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
})

// Usage in components
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Authentication
await supabase.auth.signInWithOtp({ email: email.value })
```

**Key Composables**:
- `useSupabaseClient()`: Access Supabase client
- `useSupabaseUser()`: Reactive user state
- `useSupabaseCookieRedirect()`: Handle post-auth redirects

**Row Level Security Pattern**:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile."
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

**Best Practices**:
- Always enable RLS on tables
- Use composables for auth state
- Type database queries with generated types
- Environment separation (dev/staging/prod)
- Never expose service_role key on client

**Sources**: Supabase Nuxt Documentation, @nuxtjs/supabase Module Docs

---

## 7. Material Design UI Library

### Decision: Use Vuetify 3 (not Material UI React)

**Rationale**: Material UI is React-specific. Vuetify is the mature, Vue-native Material Design implementation with Nuxt 3 compatibility.

**Implementation**:
```typescript
// Installation
pnpm add vuetify@next

// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({ /* config */ })
  nuxtApp.vueApp.use(vuetify)
})
```

**Key Benefits**:
- Native Vue 3 support
- SSR compatible
- Material Design 3 components
- TypeScript support
- Extensive component library

**Alternative**: Nuxt UI (official Nuxt component library)
- **Pros**: Tight Nuxt integration, modern design
- **Cons**: Not Material Design, smaller component set

**Decision Rationale**: Vuetify chosen for Material Design compliance and maturity. Consider Nuxt UI for future utility packages if Material Design not required.

**Sources**: Vuetify 3 Documentation, Nuxt UI Library Comparisons

---

## 8. Testing Framework

### Decision: Vitest with @nuxt/test-utils

**Rationale**: Vitest is the standard testing framework in Nuxt/Vite ecosystem. `@nuxt/test-utils` provides Nuxt-aware testing environment.

**Implementation**:
```typescript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
    globals: true,
  },
})
```

**Workspace Configuration** (Monorepo):
```typescript
import { defineWorkspace } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineWorkspace([
  await defineVitestProject({
    test: {
      name: 'nuxt-app',
      include: ['apps/main-app/tests/**/*.spec.ts'],
      environment: 'nuxt',
    },
  }),
])
```

**Best Practices**:
- Use `defineVitestConfig` (not plain `defineConfig`)
- Set `environment: 'nuxt'` for Nuxt tests
- Separate Nuxt tests from pure unit tests
- Use `@vue/test-utils` for component testing
- Enable `globals: true` for cleaner test syntax

**TypeScript Support**:
```typescript
// nuxt.config.ts
typescript: {
  tsConfig: {
    compilerOptions: {
      types: ['vitest/globals'],
    },
  },
}
```

**Sources**: Nuxt Testing Documentation, @nuxt/test-utils Guides

---

## 9. Authentication Pattern

### Decision: Passport.js via Nuxt server middleware + Supabase connector

**Rationale**: Passport.js provides flexibility for multiple auth strategies. Integration with Supabase enables database-backed sessions with RLS.

**Implementation Approach**:
```typescript
// server/middleware/auth.ts
import passport from 'passport'
import { Strategy as SupabaseStrategy } from 'passport-supabase'

export default defineEventHandler(async (event) => {
  // Initialize passport with Supabase strategy
  passport.use(new SupabaseStrategy({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  }))
})
```

**Note**: This is a planned implementation. Current best practice is to start with `@nuxtjs/supabase` composables and add Passport.js when additional auth strategies are needed.

**Progressive Enhancement**:
1. **Phase 1**: Use `@nuxtjs/supabase` for OAuth/OTP
2. **Phase 2**: Add Passport.js for custom strategies
3. **Phase 3**: Implement multi-provider support

**Sources**: Passport.js Documentation, Nuxt Authentication Patterns

---

## 10. Package Naming Convention

### Decision: Adopt scope-based naming with clear suffixes

**Rationale**: Clear naming prevents conflicts and indicates package purpose. Aligns with existing constitution while adding clarity.

**Convention**:
- **Feature packages**: `{domain}-frt` / `{domain}-srv` (no scope)
  - Examples: `clusters-frt`, `clusters-srv`
- **Utility packages**: `@universo/{function}` (with scope)
  - Examples: `@universo/types`, `@universo/utils`, `@universo/api-client`
- **Template packages**: `template-{name}` (no scope)
  - Examples: `template-mmoomm`, `template-quiz`

**Directory Structure**:
```
packages/
├── clusters-frt/          # Feature frontend
├── clusters-srv/          # Feature backend
├── @universo/
│   ├── types/            # Shared types
│   ├── utils/            # Shared utilities
│   └── api-client/       # API client
└── template-mmoomm/      # Template
```

**Benefits**:
- Clear separation of concerns
- No naming conflicts
- Easy to identify package type
- Scope prevents npm registry conflicts

**Sources**: React Repository Analysis, NPM Scope Best Practices

---

## 11. Database Abstraction Layer

### Decision: Repository Pattern with TypeORM-style abstractions

**Rationale**: Prevents vendor lock-in, enables testing, maintains clean architecture. Required by constitution Principle VIII.

**Implementation Approach**:
```typescript
// packages/@universo/database/base/repositories/BaseRepository.ts
export interface IRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(filters?: any): Promise<T[]>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// Supabase implementation
export class SupabaseRepository<T> implements IRepository<T> {
  constructor(
    private client: SupabaseClient,
    private tableName: string
  ) {}
  
  async findById(id: string): Promise<T | null> {
    const { data } = await this.client
      .from(this.tableName)
      .select()
      .eq('id', id)
      .single()
    return data
  }
  // ... other methods
}
```

**Key Principles**:
- No direct database calls in business logic
- All queries through repository interface
- Easy to swap implementations (Supabase → PostgreSQL → MySQL)
- Testable with mock repositories

**Sources**: React Repository Pattern Analysis, Clean Architecture Patterns

---

## 12. Build System

### Decision: Native Nuxt build with package-specific configurations

**Rationale**: Nuxt provides integrated build system. Only use specialized tools (tsdown, unbuild) for utility packages without Nuxt context.

**Decision Matrix**:
- **Nuxt apps**: Use `nuxi build` (built-in)
- **Nuxt layers**: No build step needed (consumed directly)
- **Utility packages**: Use `unbuild` or `tsdown`
- **Types-only packages**: Use `tsc --emitDeclarationOnly`

**Root Scripts** (`package.json`):
```json
{
  "scripts": {
    "dev": "pnpm --filter ./apps/* run dev",
    "build": "pnpm --filter ./packages/* run build && pnpm --filter ./apps/* run build",
    "typecheck": "pnpm --recursive run typecheck",
    "lint": "pnpm --recursive run lint"
  }
}
```

**Sources**: React Repository Build Analysis, Nuxt Build Documentation

---

## 13. Code Quality Tools

### Decision: ESLint + Prettier + TypeScript strict mode

**Implementation**:
```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  rules: {
    // Custom rules
  }
}

// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

**Quality Scripts**:
```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "nuxi typecheck"
}
```

**CI/CD Integration**: Run all checks before merge

**Sources**: Nuxt ESLint Configuration, TypeScript Best Practices

---

## 14. Documentation Validation

### Decision: Automated bilingual documentation line count validation

**Rationale**: Manual validation of bilingual docs doesn't scale. Automation enforces constitution Principle III (NON-NEGOTIABLE bilingual documentation).

**Implementation Approach**:
```bash
#!/bin/bash
# scripts/validate-i18n-docs.sh

validate_pair() {
  local en_file=$1
  local ru_file=$2
  
  local en_lines=$(wc -l < "$en_file")
  local ru_lines=$(wc -l < "$ru_file")
  local diff=$((en_lines - ru_lines))
  local abs_diff=${diff#-}
  
  if [ $abs_diff -gt 2 ]; then
    echo "❌ Line count mismatch: $en_file ($en_lines) vs $ru_file ($ru_lines)"
    return 1
  fi
  
  echo "✅ Valid: $en_file ($en_lines lines) matches $ru_file ($ru_lines lines)"
  return 0
}

# Validate all README pairs
validate_pair README.md README-RU.md
```

**CI Integration**: Add to GitHub Actions workflow

**Sources**: Constitution Principle III, React Repository Best Practices

---

## 15. Rate Limiting

### Decision: Use Nuxt API Shield or custom middleware

**Rationale**: Production security requirement from React repository analysis. Prevents abuse of API endpoints.

**Implementation Options**:

**Option A: Nuxt API Shield Module**
```typescript
export default defineNuxtConfig({
  modules: ['nuxt-api-shield'],
  apiShield: {
    limit: 100,
    window: 60000, // 1 minute
  }
})
```

**Option B: Custom Middleware**
```typescript
// server/middleware/rate-limit.ts
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
})

export default defineEventHandler((event) => {
  const ip = getRequestIP(event)
  const count = cache.get(ip) || 0
  
  if (count > 100) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests'
    })
  }
  
  cache.set(ip, count + 1)
})
```

**Decision**: Implement custom middleware for flexibility, use API Shield for simpler cases

**Sources**: Nuxt API Shield Documentation, React Repository Security Analysis

---

## Implementation Recommendations

### Priority Order

1. **P0 - Foundation** (Week 1)
   - PNPM workspace configuration
   - TypeScript strict mode setup
   - Base documentation structure

2. **P1 - Core Infrastructure** (Week 2)
   - Nuxt apps and layers structure
   - Supabase integration
   - Testing framework setup

3. **P2 - Development Tools** (Week 3)
   - Vuetify integration
   - Code quality tools
   - Bilingual documentation validation

4. **P3 - Advanced Features** (Week 4+)
   - Repository pattern implementation
   - Rate limiting
   - Passport.js integration

### Technical Debt to Avoid (from React Repository)

- ❌ Don't create separate `docs/` directory (will be separate repo)
- ❌ Don't mix legacy Flowise code
- ❌ Don't skip RLS on database tables
- ❌ Don't allow direct database access in business logic
- ❌ Don't disable TypeScript strict mode
- ❌ Don't skip bilingual documentation

### Success Metrics

- ✅ All packages build successfully
- ✅ TypeScript strict mode: 0 errors
- ✅ Tests pass with >80% coverage
- ✅ Bilingual docs validated automatically
- ✅ Development server starts in <5 seconds
- ✅ Package installation completes in <2 minutes

---

## References

### Official Documentation
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PNPM Documentation](https://pnpm.io)
- [Vitest Documentation](https://vitest.dev)
- [Vuetify 3 Documentation](https://vuetifyjs.com)

### Community Resources
- Vue School: Scalable Nuxt 3 Monorepos with PNPM Workspaces
- Dev.to: Nuxt Server Routes and Full-Stack Development
- GitHub: serkodev/nuxt-monorepo (template)
- GitHub: supabase-community/nuxt3-quickstarter

### Project-Specific
- universo-platformo-react: Reference implementation
- .specify/memory/constitution.md: Project governance
- .specify/reports/architectural-analysis-2025-11-17.md: React analysis

---

## Conclusion

This research provides a comprehensive foundation for implementing Universo Platformo Nuxt using industry best practices. Key decisions prioritize:

1. **Type Safety**: Strict TypeScript throughout
2. **Developer Experience**: Modern tooling and conventions
3. **Scalability**: Monorepo structure supporting multiple apps
4. **Security**: RLS, rate limiting, authentication patterns
5. **Maintainability**: Clean architecture, testing, documentation

All recommendations align with project constitution and improve upon the React implementation while maintaining conceptual compatibility.

**Next Steps**: Update implementation plan with specific technical details from this research, then proceed with Phase 0 implementation.
