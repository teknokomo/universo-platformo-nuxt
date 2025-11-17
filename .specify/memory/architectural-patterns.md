# Architectural Patterns

> **Purpose**: Detailed architectural patterns and best practices adopted from Universo Platformo React. These patterns ensure consistency, maintainability, and scalability across the Nuxt implementation.

**Last Updated**: 2025-11-17  
**Source**: Deep analysis of [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)

---

## Core Patterns (CRITICAL)

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

## Secondary Patterns

### 9. TanStack Query Pattern (Vue Query)

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

### 10. Testing Environment Pattern

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

### 11. Source-Only Package Pattern

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

### 12. Migration Naming Convention

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

### 13. Event-Driven Data Loading

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

### 14. Dual Build System

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

1. **TanStack Query** → Use Vue Query or Nuxt composables
2. **React Hooks** → Vue Composition API composables
3. **React StrictMode** → Vue DevTools strict mode
4. **React Router** → Nuxt file-based routing
5. **Express Routes** → Nuxt server routes

### Nuxt Patterns to Add

1. **Server Routes**: Use `server/api/` directory
2. **Composables**: Create reusable composition functions
3. **Middleware**: Auth and validation middleware
4. **Nitro Utilities**: Server-side utilities
5. **Auto-imports**: Configure auto-import patterns
6. **SSR-Safe**: Ensure patterns work with SSR

---

## Detection Commands

Run these to find anti-patterns in the codebase:

```bash
# Direct SQL queries
grep -r "query\(" packages/*/src --exclude-dir=migrations

# Direct Supabase client usage
grep -r "supabaseClient" packages/*/src

# useEffect for data fetching
grep -r "useEffect.*fetch\|useEffect.*axios" packages/*/src

# Source packages with dependencies
find packages/*/base -name "package.json" -exec grep -L '"main":' {} \; | \
  xargs grep '"dependencies":'

# Direct i18next usage
grep -r "i18next.use" packages/*/src

# Unconditional StrictMode (adapt for Vue)
grep -r "StrictMode" packages/*/src/main.tsx | grep -v "isProduction"
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
