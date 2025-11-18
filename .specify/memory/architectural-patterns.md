# Architectural Patterns

> **Purpose**: Detailed architectural patterns and best practices adopted from Universo Platformo React. These patterns ensure consistency, maintainability, and scalability across the Nuxt implementation.

**Last Updated**: 2025-11-17  
**Source**: Deep analysis of [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)

---

## Core Patterns (CRITICAL)

### 0. Package-Based Modularity (STRICTEST ENFORCEMENT)

**Rule**: ALL functional code MUST be implemented within packages in the `packages/` directory. Non-package implementations are STRICTLY FORBIDDEN.

**Implementation Structure**:

```text
✅ CORRECT: Package-based implementation
packages/
├── clusters-frt/base/          # Frontend for Clusters feature
│   ├── package.json
│   ├── src/
│   │   ├── components/         # Cluster UI components
│   │   ├── composables/        # Cluster-specific composables
│   │   ├── pages/              # Cluster pages
│   │   └── index.ts            # Package exports
│   └── README.md
├── clusters-srv/base/          # Backend for Clusters feature
│   ├── package.json
│   ├── src/
│   │   ├── api/                # Cluster API routes
│   │   ├── services/           # Cluster business logic
│   │   ├── entities/           # Cluster TypeORM entities
│   │   └── index.ts            # Package exports
│   └── README.md
└── @universo/types/base/       # Shared types
    ├── package.json
    └── src/index.ts

❌ FORBIDDEN: Root-level implementation
src/
├── components/                 # ❌ No root-level components!
├── pages/                      # ❌ No root-level pages!
└── server/                     # ❌ No root-level server code!
app.vue                         # ❌ Only minimal bootstrap allowed!
```

**Decision Matrix for Code Placement**:

| Code Type                    | Placement                          | Allowed in Root? |
|------------------------------|-------------------------------------|------------------|
| Feature UI components        | `packages/{domain}-frt/base/src/`  | ❌ NO           |
| Feature API routes           | `packages/{domain}-srv/base/src/`  | ❌ NO           |
| Feature business logic       | `packages/{domain}-srv/base/src/`  | ❌ NO           |
| Shared types                 | `packages/@universo/types/base/`   | ❌ NO           |
| Shared utilities             | `packages/@universo/utils/base/`   | ❌ NO           |
| Configuration files          | Root directory                      | ✅ YES          |
| Minimal app bootstrap        | Root `app.vue` (loads packages)     | ✅ YES (minimal)|
| Build/deployment scripts     | Root directory                      | ✅ YES          |
| Documentation                | Root `README.md`                    | ✅ YES          |

**Package Extraction Readiness Checklist**:

For each package to be extraction-ready:
- [ ] All dependencies explicitly declared in package.json
- [ ] No imports from outside the package (except workspace deps)
- [ ] Independent build and test scripts
- [ ] Bilingual README with setup instructions
- [ ] Clear public API defined in exports
- [ ] Version number and changelog maintained

**Benefits**:

- **Future-proof**: Packages can be extracted to separate repos
- **Modularity**: Clear boundaries and ownership
- **Reusability**: Packages can be shared across projects
- **Testability**: Each package independently testable
- **Maintainability**: Changes isolated to specific packages
- **Scalability**: Teams can work on different packages in parallel

**Detection of Violations**:

```bash
# Find non-package code (should return empty or config files only)
find . -maxdepth 2 -name "*.vue" -o -name "*.ts" | grep -v node_modules | grep -v packages

# Verify all feature code is in packages
find packages -type d -name "base" | wc -l  # Should match feature count

# Check for forbidden root directories
[ -d "src" ] && echo "❌ VIOLATION: Root src/ directory exists"
[ -d "components" ] && echo "❌ VIOLATION: Root components/ directory exists"
[ -d "pages" ] && echo "❌ VIOLATION: Root pages/ directory exists"
```

**Migration Path** (if violations found):

1. Identify all non-package code
2. Create appropriate package structure (`{domain}-frt` or `{domain}-srv`)
3. Move code to package's `base/src/` directory
4. Update imports to use package references
5. Add package to `pnpm-workspace.yaml`
6. Verify build and tests pass
7. Remove old root-level directories

---

### 1. Repository Pattern for Database Access

**Rule**: ALL database operations MUST go through TypeORM repositories. Direct SQL queries are FORBIDDEN.

**Implementation**:

```typescript
// ✅ CORRECT: Repository pattern
import { getDataSource } from './DataSource';
import { User } from './entities/User';

const userRepo = getDataSource().getRepository(User);
const user = await userRepo.findOne({ where: { id: userId } });
await userRepo.save(user);

// ❌ FORBIDDEN: Direct SQL
const result = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Benefits**:

- Type safety with TypeScript
- Automatic Row Level Security (RLS) enforcement
- Easier testing through mocking
- Database migration flexibility
- Consistent error handling

**Detection**:

```bash
# Find direct SQL queries (antipattern)
grep -r "query\(" packages/*/src --exclude-dir=migrations
```

---

### 2. Guards Pattern for Permissions

**Rule**: Use factory functions to generate reusable permission guards.

**Implementation**:

```typescript
// Create guards factory
export const createAccessGuards = <TEntity>(config: {
  entityType: string;
  rolePermissions: Record<string, number>;
}) => {
  return {
    ensureAccess: (requiredRoles: string[]) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const entityId = req.params.id;

        // Check membership and role
        const membership = await getMembership(entityId, userId);
        if (!membership || !requiredRoles.includes(membership.role)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
      };
    },

    assertNotOwner: (member: TEntity) => {
      if (member.role === 'owner') {
        throw new Error('Cannot modify owner');
      }
    },
  };
};

// Usage in routes
const guards = createAccessGuards({
  entityType: 'metaverse',
  rolePermissions: { owner: 4, admin: 3, editor: 2, member: 1 },
});

router.patch('/:id', guards.ensureAccess(['editor', 'admin', 'owner']), handler);
```

**Benefits**:

- DRY (Don't Repeat Yourself)
- Type-safe permission checking
- Consistent error handling
- Centralized permission logic
- Easy to test

---

### 3. Factory Functions for Actions

**Rule**: Use factory functions to generate CRUD actions, reducing code duplication by 90%+.

**Entity Actions Factory**:

```typescript
import { createEntityActions } from '@universo/template-mui';

// For entities with name/description fields
export default createEntityActions<Metaverse, MetaverseData>({
  i18nPrefix: 'metaverses',
  getInitialFormData: (entity) => ({
    initialName: entity.name,
    initialDescription: entity.description,
  }),
});
```

**Member Actions Factory**:

```typescript
import { createMemberActions } from '@universo/template-mui';

// For member management
export default createMemberActions<MetaverseMember>({
  i18nPrefix: 'metaverses',
  entityType: 'metaverse',
});
```

**Benefits**:

- 130 lines → 11 lines (91% reduction)
- Consistent error handling
- Type-safe with generics
- Reusable across modules
- Centralized i18n patterns

---

### 4. Universal Role System

**Rule**: Centralized role hierarchy with consistent permission checking.

**Role Hierarchy**:

```typescript
export enum Role {
  OWNER = 4, // Full control
  ADMIN = 3, // Administrative access
  EDITOR = 2, // Content editing
  MEMBER = 1, // Limited access
  GUEST = 0, // Read-only (if applicable)
}

export const hasRequiredRole = (userRole: Role, requiredRole: Role): boolean => {
  return userRole >= requiredRole;
};

export const canManageRole = (managerRole: Role, targetRole: Role): boolean => {
  return managerRole > targetRole;
};
```

**Usage**:

```typescript
// Check if user can perform action
if (!hasRequiredRole(user.role, Role.EDITOR)) {
  throw new Error('Insufficient permissions');
}

// Check if user can manage another member
if (!canManageRole(user.role, member.role)) {
  throw new Error('Cannot manage users with equal or higher role');
}
```

---

### 5. i18n Architecture

**Rule**: Centralized namespace registration with singleton pattern.

**Implementation**:

```typescript
// In @universo/i18n package
import { getInstance, registerNamespace } from '@universo/i18n';
import metaversesEn from './en.json';
import metaversesRu from './ru.json';

// Register namespace once
getInstance();
registerNamespace('metaverses', {
  en: metaversesEn,
  ru: metaversesRu,
});

// In components
const { t } = useTranslation('metaverses');
const title = t('members.editTitle');
```

**Benefits**:

- Single source of truth
- Prevents duplicate registrations
- Namespace isolation
- Type-safe translations
- Easier testing

**Detection**:

```bash
# Find direct i18next.use() calls (antipattern)
grep -r "i18next.use" packages/*/src
```

---

### 6. Universal List Pattern

**Rule**: Reusable list component with backend pagination, search, and sorting.

**Backend Schema**:

```typescript
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
```

**Frontend Hook**:

```typescript
const { data, isLoading } = usePaginated<MetaverseListItem>({
  queryKey: ['metaverses', filters],
  queryFn: ({ pageParam }) => fetchMetaverses(pageParam),
  initialPageParam: { page: 1, limit: 10 },
});
```

**Benefits**:

- DRY principle
- Consistent UX
- Type-safe
- Easy to test
- Handles loading/error states

---

### 7. RLS Integration Pattern

**Rule**: Row Level Security (RLS) with application-level validation as primary layer.

**Security Layers**:

1. **Primary**: Application-level validation (TypeORM + Guards)
2. **Fallback**: Database RLS policies
3. **Cache**: Request-level membership cache

**Pattern**:

```typescript
// Ensure user has access
const userId = await ensureAccess(req, res, entityId, {
  roles: ['editor', 'admin', 'owner'],
});
if (!userId) return; // Response already sent

// Proceed with repository operation
const repo = getDataSource().getRepository(Entity);
const entity = await repo.findOne({ where: { id: entityId } });
```

**Benefits**:

- Defense in depth
- Clear error messages
- Performance (caching)
- Audit trail

---

### 8. Data Isolation Pattern

**Rule**: Three-tier data isolation with junction tables.

**Structure**:

```typescript
// Three tiers
Cluster → Domain → Resource
Metaverse → Section → Entity
Space → Canvas → Node

// Junction tables for relationships
entities_metaverses { entity_id, metaverse_id }
sections_metaverses { section_id, metaverse_id }

// Cluster-scoped APIs
GET /api/v1/metaverses/:id/sections
GET /api/v1/metaverses/:id/entities
```

**Benefits**:

- Complete data separation
- Multi-tenant support
- Clear ownership boundaries
- Predictable query patterns

---

### 9. Rate Limiting Architecture (CRITICAL FOR PRODUCTION)

**Rule**: All production deployments MUST implement distributed rate limiting to prevent abuse and ensure service availability.

**Implementation**:

```typescript
// Nuxt server middleware: server/middleware/rate-limit.ts
import { defineEventHandler } from 'h3'
import { createRateLimiter } from '@universo/utils/rate-limiting'

const limiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  redisUrl: process.env.REDIS_URL // Falls back to memory store if not set
})

export default defineEventHandler(async (event) => {
  await limiter(event)
  // Continue to route handler
})
```

**Endpoint-Specific Limits**:

```typescript
// More restrictive limits for auth endpoints
// server/api/auth/login.post.ts
import { defineEventHandler } from 'h3'
import { createRateLimiter } from '@universo/utils/rate-limiting'

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  redisUrl: process.env.REDIS_URL
})

export default defineEventHandler(async (event) => {
  await authLimiter(event)
  // Handle login
})
```

**Production Setup**:

```bash
# Environment variables
REDIS_URL=redis://:password@redis.example.com:6379  # Basic auth
REDIS_URL=rediss://:password@redis.example.com:6380 # TLS (recommended)
```

**Multi-Instance Support**:
- Redis store shares rate limit counters across all server instances
- Works with Docker, Kubernetes, PM2 cluster mode
- Automatic reconnection and error handling
- Event-driven connection pattern (no polling)

**Benefits**:

- Prevents denial-of-service attacks
- Ensures fair resource allocation
- Protects backend services from overload
- Supports horizontal scaling
- Production-ready with automatic failover

**Detection**:

```bash
# Find endpoints without rate limiting
grep -r "defineEventHandler" server/api --exclude-dir=node_modules | \
  grep -v "createRateLimiter"
```

---

## Secondary Patterns

### 10. TanStack Query Pattern (Vue Query)

**Rule**: Declarative `useQuery()` in components, imperative `fetchQuery()` in handlers.

**Query Keys Factory**:

```typescript
export const metaverseKeys = {
  all: ['metaverses'] as const,
  lists: () => [...metaverseKeys.all, 'list'] as const,
  list: (filters: string) => [...metaverseKeys.lists(), { filters }] as const,
  details: () => [...metaverseKeys.all, 'detail'] as const,
  detail: (id: string) => [...metaverseKeys.details(), id] as const,
};
```

**Usage**:

```typescript
// Declarative (auto-fetch on mount)
const { data, isLoading } = useQuery({
  queryKey: metaverseKeys.detail(id),
  queryFn: () => fetchMetaverse(id),
});

// Imperative (manual trigger)
const handleClick = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: metaverseKeys.detail(id),
    queryFn: () => fetchMetaverse(id),
  });
};
```

---

### 11. Testing Environment Pattern

**Rule**: Use happy-dom for 4-9x faster tests vs jsdom.

**Configuration**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    // Mock heavy dependencies
    setupFiles: ['./setupTests.ts'],
  },
});

// setupTests.ts
vi.mock('rehype-mathjax', () => ({ default: () => () => {} }));
```

**Performance**:

- jsdom: 2-5s initialization
- happy-dom: 566ms initialization

---

### 12. Source-Only Package Pattern

**Rule**: Packages with source code only (no dist) MUST use peerDependencies.

**Configuration**:

```json
{
  "name": "@universo/template-mui",
  "peerDependencies": {
    "react": "catalog:react",
    "@mui/material": "catalog:mui",
    "vue": "catalog:vue"
  }
}
```

**Why**: Parent app resolves dependencies; Vite imports source directly.

**Detection**:

```bash
# Find source-only packages with wrong deps
find packages/*/base -name "package.json" -exec grep -L '"main":' {} \; | \
  xargs grep '"dependencies":'
```

---

### 13. Migration Naming Convention

**Rule**: Consistent, descriptive migration names without legacy references.

**Format**:

- `AddEntityNameAndLinked.ts` - Adding new entities with relationships
- `CreateSchemaName.ts` - Creating new database schema
- NO "Flowise" mentions in new migrations

**Examples**:

```typescript
// ✅ GOOD
export class AddUniksAndLinked1234567890 implements MigrationInterface {}
export class CreateMetaversesSchema1234567891 implements MigrationInterface {}

// ❌ BAD
export class CreateUniksTable1234567890 implements MigrationInterface {}
export class FlowiseMetaverses1234567891 implements MigrationInterface {}
```

---

### 14. Event-Driven Data Loading

**Rule**: Listen to server events and invalidate queries for real-time updates.

**Pattern**:

```typescript
// Listen to events
socket.on('entity:updated', (data) => {
  // Invalidate affected queries
  queryClient.invalidateQueries(entityKeys.detail(data.id));
  queryClient.invalidateQueries(entityKeys.lists());
});

// Used in chat messages, real-time collaboration
queryClient.invalidateQueries(messageKeys.all);
```

---

### 15. Dual Build System

**Rule**: Support both CJS and ESM for maximum compatibility.

**Configuration**:

```typescript
// tsdown.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
  platform: 'neutral',
});
```

**Package Exports**:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.cjs",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

---

## Anti-Patterns (What NOT to Do)

### ❌ Direct Database Queries

```typescript
// BAD
const result = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);

// GOOD
const repo = getDataSource().getRepository(User);
const user = await repo.findOne({ where: { id: userId } });
```

### ❌ Direct Supabase Client in Business Logic

```typescript
// BAD
import { supabaseClient } from './supabase';
const { data } = await supabaseClient.from('users').select('*');

// GOOD
const repo = getDataSource().getRepository(User);
const users = await repo.find();
```

### ❌ useEffect() for Data Fetching

```typescript
// BAD
useEffect(() => {
  fetch('/api/data').then((res) => setData(res));
}, []);

// GOOD
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: () => fetchData(),
});
```

### ❌ Source Packages with Dependencies

```json
// BAD: Source-only package
{
  "dependencies": {
    "react": "^18.0.0"
  }
}

// GOOD: Source-only package
{
  "peerDependencies": {
    "react": "catalog:react"
  }
}
```

---

## Nuxt-Specific Adaptations

### Adapt for Nuxt/Vue

1. **TanStack Query** → Use `@tanstack/vue-query` or Nuxt composables with `useFetch`/`useAsyncData`
2. **React Hooks** → Vue Composition API composables (use `use*` prefix)
3. **React StrictMode** → Vue DevTools strict mode
4. **React Router** → Nuxt file-based routing with `pages/` directory
5. **Express Routes** → Nuxt server routes in `server/api/` directory

---

## Nuxt Best Practices (REQUIRED)

### 22. Nuxt Package Integration Pattern

**Rule**: Packages MUST integrate with Nuxt using Nuxt Layers or explicit exports.

**Nuxt Layer Approach** (for UI/component packages):

```typescript
// packages/clusters-frt/base/nuxt.config.ts
export default defineNuxtConfig({
  // Layer configuration
  components: true,
  composables: {
    dirs: ['composables']
  }
})

// Root nuxt.config.ts extends the layer
export default defineNuxtConfig({
  extends: [
    './packages/clusters-frt/base'
  ]
})
```

**Explicit Export Approach** (for utility packages):

```typescript
// packages/@universo/types/base/package.json
{
  "name": "@universo/types",
  "exports": {
    ".": "./src/index.ts",
    "./entities": "./src/entities/index.ts"
  }
}

// Import in any package
import { User, Cluster } from '@universo/types'
import { UserEntity } from '@universo/types/entities'
```

**Benefits**:
- Hot Module Replacement (HMR) for package changes
- Auto-imports from packages
- Type-safe across packages
- SSR-compatible

**Detection**:

```bash
# Find packages without Nuxt integration
find packages/*/base -name "package.json" | while read f; do
  dir=$(dirname "$f")
  if [ ! -f "$dir/nuxt.config.ts" ] && ! grep -q '"exports"' "$f"; then
    echo "Missing integration: $dir"
  fi
done
```

---

### 23. Server API Route Organization Pattern

**Rule**: Server routes MUST be organized by feature within package `server/` directories.

**Structure**:

```
packages/clusters-srv/base/
├── server/
│   ├── api/
│   │   ├── clusters/
│   │   │   ├── index.get.ts          # GET /api/clusters
│   │   │   ├── index.post.ts         # POST /api/clusters
│   │   │   ├── [id].get.ts           # GET /api/clusters/:id
│   │   │   ├── [id].patch.ts         # PATCH /api/clusters/:id
│   │   │   ├── [id].delete.ts        # DELETE /api/clusters/:id
│   │   │   └── [id]/
│   │   │       ├── domains.get.ts    # GET /api/clusters/:id/domains
│   │   │       └── members.get.ts    # GET /api/clusters/:id/members
│   │   └── health.get.ts             # GET /api/health
│   ├── middleware/
│   │   ├── auth.ts                   # Authentication middleware
│   │   └── validate.ts               # Request validation
│   └── utils/
│       ├── db.ts                     # Database utilities
│       └── guards.ts                 # Permission guards
```

**Server Route Implementation**:

```typescript
// packages/clusters-srv/base/server/api/clusters/index.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  // Validate query params
  const query = querySchema.parse(getQuery(event))
  
  // Get user from auth middleware
  const user = event.context.user
  
  // Fetch data using repository pattern
  const clusters = await getClustersRepository().findPaginated(query, user.id)
  
  return {
    data: clusters,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: clusters.length
    }
  }
})
```

**Benefits**:
- Clear API structure
- File-based routing
- Type-safe request/response
- Automatic hot reload
- SSR and API routes in same codebase

---

### 24. Composables Pattern

**Rule**: Reusable logic MUST be extracted into composables following Vue best practices.

**Composable Structure**:

```
packages/clusters-frt/base/composables/
├── useClusters.ts                # Main data fetching
├── useClusterForm.ts             # Form state management
├── useClusterPermissions.ts      # Permission checks
└── index.ts                      # Barrel export
```

**Data Fetching Composable**:

```typescript
// packages/clusters-frt/base/composables/useClusters.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Cluster, ClusterCreateInput } from '@universo/types'

export const useClusters = () => {
  const queryClient = useQueryClient()
  
  // Fetch list
  const { data: clusters, isLoading } = useQuery({
    queryKey: ['clusters'],
    queryFn: () => $fetch<Cluster[]>('/api/clusters')
  })
  
  // Create mutation
  const createCluster = useMutation({
    mutationFn: (data: ClusterCreateInput) => 
      $fetch('/api/clusters', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusters'] })
    }
  })
  
  return {
    clusters,
    isLoading,
    createCluster
  }
}
```

**Form Composable**:

```typescript
// packages/clusters-frt/base/composables/useClusterForm.ts
import { ref, computed } from 'vue'
import { z } from 'zod'

const clusterSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional()
})

export const useClusterForm = (initialData?: Partial<Cluster>) => {
  const formData = ref({
    name: initialData?.name ?? '',
    description: initialData?.description ?? ''
  })
  
  const errors = ref<Record<string, string>>({})
  
  const validate = () => {
    try {
      clusterSchema.parse(formData.value)
      errors.value = {}
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.value = Object.fromEntries(
          err.errors.map(e => [e.path[0], e.message])
        )
      }
      return false
    }
  }
  
  const isValid = computed(() => Object.keys(errors.value).length === 0)
  
  return {
    formData,
    errors,
    validate,
    isValid
  }
}
```

**Benefits**:
- Reusable across components
- Type-safe
- Testable in isolation
- Auto-imported by Nuxt
- SSR-compatible with proper lifecycle handling

---

### 25. Type-Safe API Client Pattern

**Rule**: Frontend-Backend communication MUST use shared types and type-safe clients.

**Shared Types Package**:

```typescript
// packages/@universo/types/base/src/api/clusters.ts
import { z } from 'zod'

// Request schemas
export const clusterCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional()
})

export const clusterUpdateSchema = clusterCreateSchema.partial()

// Response types
export interface Cluster {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// Type inference
export type ClusterCreateInput = z.infer<typeof clusterCreateSchema>
export type ClusterUpdateInput = z.infer<typeof clusterUpdateSchema>
```

**Backend Usage**:

```typescript
// packages/clusters-srv/base/server/api/clusters/index.post.ts
import { clusterCreateSchema, type Cluster } from '@universo/types/api/clusters'

export default defineEventHandler(async (event): Promise<Cluster> => {
  const body = await readBody(event)
  
  // Validate with shared schema
  const data = clusterCreateSchema.parse(body)
  
  // Create using repository
  const cluster = await getClustersRepository().create(data)
  
  return cluster
})
```

**Frontend Usage**:

```typescript
// packages/clusters-frt/base/composables/useClusters.ts
import type { Cluster, ClusterCreateInput } from '@universo/types/api/clusters'

export const useClusters = () => {
  const createCluster = async (data: ClusterCreateInput): Promise<Cluster> => {
    return $fetch('/api/clusters', {
      method: 'POST',
      body: data
    })
  }
  
  return { createCluster }
}
```

**Benefits**:
- Single source of truth for types
- Compile-time type checking
- Runtime validation with Zod
- API contract enforcement
- Refactoring safety

---

### 26. SSR-Safe Composables Pattern

**Rule**: Composables MUST handle SSR correctly using lifecycle hooks.

**Browser-Only Code**:

```typescript
// packages/clusters-frt/base/composables/useLocalStorage.ts
import { ref, watch, onMounted } from 'vue'

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const data = ref<T>(defaultValue)
  const isReady = ref(false)
  
  // Only access localStorage on client
  onMounted(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        data.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse localStorage:', e)
      }
    }
    isReady.value = true
  })
  
  // Watch for changes (only on client)
  if (process.client) {
    watch(data, (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    }, { deep: true })
  }
  
  return { data, isReady }
}
```

**API Calls with SSR**:

```typescript
// packages/clusters-frt/base/composables/useClusters.ts
export const useClusterDetail = (id: string) => {
  // useAsyncData works on both server and client
  const { data, pending, error, refresh } = useAsyncData(
    `cluster-${id}`,
    () => $fetch<Cluster>(`/api/clusters/${id}`),
    {
      // Cache for 5 minutes
      getCachedData: (key) => useNuxtApp().payload.data[key],
    }
  )
  
  return {
    cluster: data,
    loading: pending,
    error,
    refresh
  }
}
```

**Benefits**:
- No hydration mismatches
- Proper SSR data fetching
- Client-only code isolation
- Performance optimization

---

### 27. Middleware Pattern

**Rule**: Authentication and authorization MUST use Nuxt middleware.

**Server Middleware** (for API routes):

```typescript
// packages/auth-srv/base/server/middleware/auth.ts
import { defineEventHandler, createError } from 'h3'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  // Skip auth for public routes
  if (event.path.startsWith('/api/public')) {
    return
  }
  
  // Get token from header
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Missing authentication token'
    })
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Verify and decode token
    const user = await verifyToken(token)
    
    // Attach user to event context
    event.context.user = user
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid authentication token'
    })
  }
})
```

**Route Middleware** (for pages):

```typescript
// packages/clusters-frt/base/middleware/cluster-access.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const clusterId = to.params.id
  
  // Check if user has access to cluster
  const hasAccess = await $fetch(`/api/clusters/${clusterId}/check-access`)
  
  if (!hasAccess) {
    return navigateTo('/unauthorized')
  }
})
```

**Page Usage**:

```vue
<!-- packages/clusters-frt/base/pages/clusters/[id].vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'cluster-access']
})
</script>
```

**Benefits**:
- Centralized auth logic
- Type-safe route protection
- SSR-compatible
- Reusable across routes

---

### 28. Nuxt Layers for Package Sharing

**Rule**: Frontend packages SHOULD expose Nuxt Layers for component/composable sharing.

**Layer Configuration**:

```typescript
// packages/clusters-frt/base/nuxt.config.ts
export default defineNuxtConfig({
  // Enable auto-imports from this layer
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  
  // Auto-import composables
  imports: {
    dirs: ['composables']
  },
  
  // Layer-specific config
  runtimeConfig: {
    public: {
      clustersApiBase: '/api/clusters'
    }
  }
})
```

**Root App Integration**:

```typescript
// Root nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // Include all frontend package layers
    './packages/clusters-frt/base',
    './packages/auth-frt/base',
    './packages/@universo/ui/base'
  ],
  
  // Override/extend layer config as needed
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000'
    }
  }
})
```

**Benefits**:
- Share components across apps
- Auto-import from packages
- Layer-specific configuration
- Composable reusability
- Hot reload for package changes

---

### 29. TypeScript Configuration in Monorepo

**Rule**: Use TypeScript project references for better type checking and build performance.

**Base tsconfig**:

```json
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

**Package tsconfig**:

```json
// packages/clusters-frt/base/tsconfig.json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@universo/types": ["../../@universo/types/base/src"],
      "@universo/utils": ["../../@universo/utils/base/src"]
    }
  },
  "include": ["**/*.ts", "**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

**Nuxt TypeScript Integration**:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  typescript: {
    strict: true,
    shim: false,
    // Include workspace packages for type checking
    includeWorkspace: true,
    // Hoist common types
    hoist: [
      '@nuxt/schema',
      'nuxt',
      'vue',
      'vue-router'
    ]
  }
})
```

**Benefits**:
- Fast incremental builds
- Better IDE support
- Type errors in packages
- Shared type definitions
- Monorepo-aware type checking

---

## Detection Commands

Run these to find anti-patterns in the codebase:

```bash
# Direct SQL queries
grep -r "query\(" packages/*/src --exclude-dir=migrations

# Direct Supabase client usage
grep -r "supabaseClient" packages/*/src

# useEffect for data fetching (React antipattern - should not exist in Nuxt)
grep -r "useEffect.*fetch\|useEffect.*axios" packages/*/src

# Source packages with dependencies
find packages/*/base -name "package.json" -exec grep -L '"main":' {} \; | \
  xargs grep '"dependencies":'

# Direct i18next usage
grep -r "i18next.use" packages/*/src

# Packages without Nuxt integration
find packages/*/base -name "package.json" | while read f; do
  dir=$(dirname "$f")
  if [ ! -f "$dir/nuxt.config.ts" ] && ! grep -q '"exports"' "$f"; then
    echo "Missing integration: $dir"
  fi
done

# Non-SSR-safe localStorage usage
grep -r "localStorage\|sessionStorage" packages/*/src | grep -v "onMounted\|process.client"

# Direct fetch without proper SSR handling
grep -r "\$fetch\|fetch(" packages/*/composables | grep -v "useAsyncData\|useFetch"

# Server routes without validation
grep -r "defineEventHandler" packages/*/server/api | grep -v "schema\.parse\|validate"

# Middleware without error handling
grep -r "defineEventHandler" packages/*/server/middleware | grep -v "createError\|try.*catch"
```

---

## References

- **Source Repository**: [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)
- **System Patterns**: `memory-bank/systemPatterns.md` in React repo
- **Product Context**: `memory-bank/productContext.md` in React repo
- **Tech Context**: `memory-bank/techContext.md` in React repo
- **RLS Integration**: `memory-bank/rls-integration-pattern.md` in React repo

---

**Note**: This document focuses on architectural patterns. For feature-specific details (UPDL, Space Builder, Multiplayer), see respective feature specifications when implementing those systems.
