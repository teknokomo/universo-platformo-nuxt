<!--
SYNC IMPACT REPORT
==================
Version Change: 1.3.0 → 1.3.1
Rationale: Patch version - corrected UI framework reference from template-mui (React) to template-vuetify (Vue/Nuxt)

Modified Principles:
  - Principle VII (Utility Package Organization): Changed @universo/template-mui to @universo/template-vuetify

Clarification:
  - MUI (Material UI) is a React-specific library
  - Vuetify 3 is the Vue-native Material Design library for Nuxt projects
  - This change aligns constitution with the actual technology stack (Vue/Nuxt)

Previous Version (1.3.0):
  Ratified: 2025-11-17
  Minor version - strengthened modular architecture enforcement with explicit prohibitions against non-package implementations

Previous Version (1.2.0):
  Ratified: 2025-11-17
  Minor version - added Rate Limiting principle and enhanced Build System guidance from React repository deep analysis

Previous Version (1.1.0):
  Ratified: 2025-11-17
  Minor version - added new architectural principles from React repository analysis

Previous Version (1.0.1):
  Ratified: 2025-11-16
  Patch amendment - clarifications to existing principles

Previous Version (1.0.0):
  Ratified: 2025-11-15
  Initial constitution ratification - establishes foundational governance
-->

# Universo Platformo Nuxt Constitution

## Core Principles

### I. Monorepo Architecture with PNPM (CRITICAL - STRICTLY ENFORCED)

**Rule**: All packages MUST reside in a single repository managed by PNPM workspaces. ALL functional code MUST be implemented within packages in the `packages/` directory.

**CRITICAL PROHIBITION: Non-Package Implementations**

**FORBIDDEN**: Implementing ANY feature functionality outside of the `packages/` directory structure is **STRICTLY PROHIBITED**.

The following are **EXPLICITLY FORBIDDEN**:

- ❌ Creating feature code in project root directories (e.g., `src/`, `components/`, `pages/`, `server/`)
- ❌ Implementing business logic outside of packages
- ❌ Creating non-modular monolithic implementations
- ❌ Direct implementation in `app.vue`, `nuxt.config.ts`, or root-level application files (except for minimal bootstrapping/configuration)
- ❌ Bypassing package structure "for convenience" or "rapid prototyping"

**ALLOWED** root-level files (exceptions to package requirement):

- ✅ Configuration files only: `nuxt.config.ts`, `tsconfig.json`, `.eslintrc.js`, etc.
- ✅ Workspace management: `package.json`, `pnpm-workspace.yaml`
- ✅ Documentation: `README.md`, `README-RU.md`
- ✅ Build/deployment scripts and tooling configuration
- ✅ Minimal application bootstrapping that loads packages (launcher functionality)

**Justification**: This project is designed for **future modularization** where individual packages will be extracted into separate repositories. Any code implemented outside of packages will **block repository separation** and violate the core architectural principle. Non-compliance makes the codebase **unmaintainable** and **impossible to modularize**.

**Requirements**:

- **ALL functional code** MUST be in `packages/` directory
- Packages are organized in `packages/` directory
- **Feature packages** use `-frt` suffix for frontend (e.g., `packages/clusters-frt`)
- **Feature packages** use `-srv` suffix for backend (e.g., `packages/clusters-srv`)
- **Utility packages** use `@universo/` scope for shared code (e.g., `@universo/types`, `@universo/utils`)
- **Template packages** use `template-` prefix for reusable templates (e.g., `template-mmoomm`)
- Each package MUST contain a `base/` root folder to support future multiple implementations
- Shared dependencies are managed through workspace protocol
- All packages are independently buildable and testable
- Each package MUST be designed for potential extraction to a separate repository

**Package Types**:

- **Feature Packages**: Domain-specific functionality requiring frontend and/or backend (`*-frt`, `*-srv` - NO scope prefix)
- **Utility Packages**: Shared code without domain logic (`@universo/types`, `@universo/utils`, `@universo/api-client`, `@universo/i18n` - WITH `@universo/` scope)
- **Template Packages**: Reusable component templates (`template-*` - NO scope prefix)

**Package Naming Convention**:

- Feature packages: `{domain}-frt` / `{domain}-srv` (e.g., `clusters-frt`, `clusters-srv`)
- Utility packages: `@universo/{function}` (e.g., `@universo/types`, `@universo/utils`)
- Template packages: `template-{name}` (e.g., `template-mmoomm`, `template-quiz`)

**Future Repository Separation Strategy**:

This monorepo is designed as a **temporary unified workspace**. As the project matures:

1. Individual packages will be **extracted to separate repositories**
2. Only essential launcher/bootstrapping packages will remain in this repository
3. Each extracted package must be independently deployable and maintainable
4. Package dependencies will be managed through proper versioning and npm/git references

**Enforcement**:

- Code reviews MUST reject any implementation outside `packages/` directory
- Implementation plans MUST explicitly state which package(s) will contain the feature
- Pull requests MUST include verification that all code is properly packaged
- Automated checks SHOULD be implemented to prevent non-package code commits

**Rationale**: Modular architecture is **NON-NEGOTIABLE** for this project. The monorepo is a workspace strategy, not a destination. Each package must be self-contained and extractable to enable:

- Independent deployment and scaling
- Clear ownership boundaries
- Technology stack evolution per package
- Selective feature adoption by other projects
- Simplified testing and maintenance

Consistent naming with scope prefixes prevents package name conflicts and clearly identifies package purpose.

### II. Specification-Driven Development

**Rule**: Every feature MUST begin with complete specification documentation before implementation starts.

**Requirements**:

- Features are documented in `.specify/` directory structure
- Specifications MUST include: user stories with priorities, functional requirements, success criteria
- Implementation plans MUST reference specifications
- Tasks MUST map to user stories for traceability
- GitHub Issues MUST be created following `.github/instructions/github-issues.md` before starting work
- Pull Requests MUST follow `.github/instructions/github-pr.md` format and reference Issues

**Rationale**: Specification-first approach ensures requirements are clear, testable, and approved before engineering effort is expended, reducing rework and miscommunication.

### III. Bilingual Documentation (NON-NEGOTIABLE)

**Rule**: ALL documentation MUST be provided in both English and Russian with identical structure and content.

**Requirements**:

- English is the primary language and MUST be created first
- Russian version MUST be created immediately after
- Both versions MUST have the same number of lines, same sections, same structure
- README files use `-RU.md` suffix for Russian versions
- Issues and PRs use `<summary>In Russian</summary>` spoiler format (exact tag required)
- All changes to English docs MUST be replicated in Russian docs
- Follow `.github/instructions/i18n-docs.md` strictly
- **Validation**: Automated tooling SHOULD be implemented to verify line count matching (±2 lines tolerance) and prevent non-compliant merges

**Rationale**: Bilingual support ensures accessibility for both international and Russian-speaking team members and users, maintains equal information access, and supports the project's multinational nature. Automated validation reduces manual review burden and ensures consistent enforcement.

### IV. Technology Stack Consistency

**Rule**: Core technology stack decisions are binding across all packages unless explicitly justified.

**Mandatory Technologies**:

- **Framework**: Nuxt.js (fullstack) with TypeScript
- **Package Manager**: PNPM with workspace protocol
- **Database**: Supabase (primary), with abstraction layer for future database support
- **Authentication**: Passport.js with Supabase connector
- **UI Framework**: Vuetify 3 (Vue Material Design component framework)
- **Type System**: TypeScript strict mode enabled

**Rationale**: Consistent technology choices reduce cognitive load, enable code reuse, simplify onboarding, and ensure team expertise is focused rather than fragmented.

### V. Incremental Feature Development

**Rule**: Features MUST be developed incrementally with independent, testable user stories prioritized from P1 (MVP) to P3+.

**Requirements**:

- Each user story MUST be independently implementable and testable
- P1 user stories define the Minimum Viable Product (MVP)
- Higher priority stories (P1) MUST be completed before lower priority (P2, P3)
- Each completed user story MUST be demonstrable and deliverable on its own
- Foundation phase MUST be complete before any user story implementation begins
- Tasks MUST be organized by user story in `.specify/` tasks files

**Rationale**: Incremental development enables early value delivery, reduces risk, allows for course corrections, and ensures the project can ship partial functionality if needed.

### VI. Reference Implementation Alignment

**Rule**: Universo Platformo React serves as the conceptual reference but NOT as code to copy.

**Guidelines**:

- Follow the CONCEPT and STRUCTURE from universo-platformo-react repository
- Implement using Nuxt/TypeScript best practices, NOT by copying React patterns
- DO NOT replicate legacy code, unfinished features, or implementation flaws from React version
- DO NOT create standalone `docs/` directory (will be separate repository)
- DO NOT create AI agent configuration files unless user explicitly requests them
- DO monitor universo-platformo-react for new features to implement in this project
- Key concepts to follow: package structure, entity relationships (Clusters/Domains/Resources pattern), incremental feature rollout
- **Core Pattern**: The three-entity pattern (Clusters/Domains/Resources, Metaverses/Sections/Entities, etc.) is a foundational architectural concept that MUST be replicated across features, with documentation explaining its central role in the platform architecture

**Architectural Patterns to Adopt**:

- **Repository Pattern**: All database operations via TypeORM repositories (never direct SQL)
- **Guards Pattern**: Centralized permission checking with factory functions
- **Factory Functions**: Reusable action generators for CRUD operations
- **Universal Role System**: Hierarchy (owner > admin > editor > member > guest)
- **i18n Architecture**: Centralized namespace registration pattern
- **Universal List Pattern**: Reusable list components with backend pagination
- **Data Isolation Pattern**: Three-tier isolation with junction tables
- **RLS Integration**: Row Level Security with application-level validation

**Anti-Patterns to Avoid**:

- NO direct database queries (use Repository pattern)
- NO direct Supabase client usage in business logic (use abstraction layer)
- NO useEffect() for data fetching (use TanStack Query or Nuxt equivalents)
- NO source-only packages with dependencies (use peerDependencies)

**Rationale**: Learning from existing implementations accelerates development while avoiding technical debt transfer. Nuxt-specific best practices ensure optimal implementation for the chosen stack. The three-entity pattern provides consistency and predictability across the platform's feature set.

**Detailed Implementation Patterns**: For comprehensive Nuxt-specific implementation patterns including server routes, composables, middleware, SSR-safe code, and package integration, see `.specify/memory/architectural-patterns.md` and `.specify/memory/architectural-patterns-RU.md`.

### VII. Utility Package Organization

**Rule**: Shared code MUST be organized into utility packages without `-frt` or `-srv` suffixes.

**Required Utility Packages**:

- **@universo/types**: Centralized TypeScript type definitions and interfaces
- **@universo/utils**: Common utility functions and helpers
- **@universo/api-client**: Shared API client library for backend communication
- **@universo/i18n**: Internationalization configuration and namespace management
- **@universo/template-vuetify**: Shared UI components and templates (Vuetify 3 for Vue/Nuxt)

**Requirements**:

- Utility packages MUST NOT contain domain-specific business logic
- Package names MUST use `@universo/` scope
- All types shared across packages MUST be defined in `@universo/types`
- Utility packages SHOULD use peerDependencies for framework dependencies
- Each utility package MUST have bilingual documentation

**Rationale**: Centralized utility packages prevent code duplication, ensure consistent behavior across features, simplify dependency management, and provide a single source of truth for shared functionality.

### VIII. Repository Pattern Enforcement (Database Abstraction)

**Rule**: ALL database operations MUST go through the Repository pattern. Direct database access in business logic is FORBIDDEN.

**Requirements**:

- Use TypeORM repositories: `getDataSource().getRepository(Entity)`
- Repository methods: `find()`, `findOne()`, `save()`, `delete()`, etc.
- User context MUST be propagated for Row Level Security (RLS)
- Direct SQL queries are FORBIDDEN except in migrations
- Business logic MUST NOT import database clients directly
- Abstraction layer MUST support future database migrations

**Database Access Pattern**:

```typescript
// ✅ CORRECT: Repository pattern
import { getDataSource } from './DataSource';
import { User } from './entities/User';

const userRepo = getDataSource().getRepository(User);
const user = await userRepo.findOne({ where: { id: userId } });

// ❌ FORBIDDEN: Direct SQL
const result = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Rationale**: Repository pattern provides type safety, automatic RLS enforcement, easier testing through mocking, and database migration flexibility. Direct database access creates tight coupling and bypasses security policies.

### IX. Universal Role System

**Rule**: All access control MUST use a centralized role hierarchy and permission checking system.

**Role Hierarchy** (highest to lowest):

1. **owner** (4): Full control, can delete entity, manage all members
2. **admin** (3): Administrative access, can manage most settings and members
3. **editor** (2): Can edit content but not manage members or critical settings
4. **member** (1): Read access with limited write permissions
5. **guest** (0): Read-only access (if applicable)

**Requirements**:

- Role types MUST be centralized in `@universo/types`
- Permission checking MUST use Guards pattern with factory functions
- Role hierarchy MUST be enforced: higher roles inherit lower role permissions
- Permission utilities: `hasRequiredRole()`, `canManageRole()`, `ensureAccess()`
- Each entity type SHOULD have `createAccessGuards()` factory for permission checks

**Guards Pattern**:

```typescript
// Factory creates reusable guards
const guards = createAccessGuards({
  entityType: 'metaverse',
  roles: { owner: 4, admin: 3, editor: 2, member: 1 },
});

// Use in routes
router.patch('/:id', guards.ensureAccess(['editor']), async (req, res) => {
  // Handler logic
});
```

**Rationale**: Centralized role system ensures consistent access control across all features, simplifies permission management, reduces security vulnerabilities through standardization, and makes authorization logic easy to test and audit.

### X. Rate Limiting for Production Security

**Rule**: All public-facing API endpoints MUST implement rate limiting to prevent abuse and ensure service availability.

**Requirements**:

- Rate limiting MUST be implemented using `@universo/utils/rate-limiting` package
- Production deployments MUST use Redis-based distributed rate limiting
- Development environments MAY use in-memory rate limiting
- Rate limits SHOULD be configurable via environment variables
- Critical endpoints (auth, data modification) MUST have stricter limits
- Rate limit responses MUST return standard HTTP 429 (Too Many Requests) status

**Implementation Pattern (Nuxt)**:

```typescript
// Server middleware: server/middleware/rate-limit.ts
import { defineEventHandler } from 'h3';
import { createRateLimiter } from '@universo/utils/rate-limiting';

const limiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  redisUrl: process.env.REDIS_URL, // Falls back to memory store if not set
});

export default defineEventHandler(async (event) => {
  await limiter(event);
});
```

**Production Setup**:

```bash
# Environment variables
REDIS_URL=redis://:password@redis.example.com:6379  # Basic auth
REDIS_URL=rediss://:password@redis.example.com:6380 # TLS (recommended)
```

**Configuration Options**:

- `windowMs`: Time window for rate limit (milliseconds)
- `max`: Maximum requests per window per IP
- `redisUrl`: Redis connection string (optional, falls back to memory)
- `skipSuccessfulRequests`: Don't count successful requests
- `skipFailedRequests`: Don't count failed requests

**Multi-Instance Support**: Redis store automatically shares rate limit counters across multiple server instances (Docker, Kubernetes, PM2 cluster mode).

**Rationale**: Rate limiting prevents denial-of-service attacks, ensures fair resource allocation, protects backend services from overload, and is essential for production-grade applications. Redis-based solution supports horizontal scaling and multi-instance deployments.

## Technology Stack Requirements

### Core Stack

- **Runtime**: Node.js LTS (18.x or higher)
- **Framework**: Nuxt 3.x with TypeScript
- **Package Manager**: PNPM 8.x or higher
- **Database**: Supabase (PostgreSQL-based)
- **Authentication**: Passport.js with Supabase strategy
- **UI Library**: Vuetify 3 (Material Design for Vue)
- **Type Checking**: TypeScript 5.x in strict mode
- **Testing**: Vitest with happy-dom environment (4-9x faster than jsdom)
- **Build System**: Nuxt's native build system (or tsdown for utility packages)
- **Data Fetching**: TanStack Query (Vue Query) or Nuxt composables
- **i18n**: Vue I18n or Nuxt i18n module with centralized namespace registration
- **Rate Limiting**: Redis-based distributed rate limiting for production deployments

### Database Strategy

- Primary: Supabase with Row Level Security (RLS)
- Architecture MUST use abstraction layer (Repository pattern) to enable future database migrations
- Direct database access in business logic is FORBIDDEN - use abstraction layer
- Schema migrations MUST be version controlled
- TypeORM for entity definitions and repository pattern
- Migration naming convention: `AddEntityNameAndLinked` or `CreateSchemaName` (no "Flowise" mentions)

### Package Structure

Each functional domain requiring both frontend and backend MUST be split into separate packages:

- `packages/{domain}-frt/base/` - Frontend implementation
- `packages/{domain}-srv/base/` - Backend implementation

Utility packages without domain logic use no suffix:

- `packages/universo-types/base/` - Type definitions
- `packages/universo-utils/base/` - Utility functions
- `packages/universo-api-client/base/` - API client library
- `packages/universo-i18n/base/` - i18n configuration
- `packages/template-{name}/base/` - Reusable templates

Examples:

- `packages/clusters-frt/base/` and `packages/clusters-srv/base/` (feature packages)
- `packages/metaverses-frt/base/` and `packages/metaverses-srv/base/` (feature packages)
- `packages/universo-types/base/` (utility package - no suffix)

### Build System Standards

- **Package-Specific Build Tools**:
  - **Nuxt Packages** (full-stack apps): Use Nuxt's native build system
  - **Server Utility Packages**: Use tsdown for dual CJS/ESM output
  - **Frontend Utility Packages**: Use Vite library mode
  - **Template Packages**: Source-only (no build step, use peerDependencies)
- **Dual Format**: Built packages SHOULD support both CJS and ESM when consumed by different systems
- **Source-Only Packages**: Packages with source code only (no dist) MUST use peerDependencies
- **Type Declarations**: All packages MUST generate TypeScript declarations (.d.ts)
- **Tree-Shaking**: Build configuration SHOULD support tree-shaking for optimal bundle size

**Build Tool Decision Matrix**:

```
Package Type          → Build Tool
─────────────────────────────────────
Nuxt app packages     → Nuxt build
Server utilities      → tsdown
Frontend utilities    → Vite library mode
Template packages     → None (source-only)
```

### Code Quality Standards

- TypeScript strict mode MUST be enabled
- ESLint MUST be configured and passing
- Prettier MUST be used for code formatting
- All TypeScript errors MUST be resolved before merge
- No `any` types without explicit justification

## Development Workflow

### Issue Creation

- Every feature/bug MUST have a GitHub Issue created before work begins
- Issues MUST follow the format in `.github/instructions/github-issues.md`
- Issues MUST include both English and Russian descriptions
- Issues MUST use appropriate labels from `.github/instructions/github-labels.md`
- Fetch current repository labels dynamically - do not assume labels exist

### Pull Request Workflow

- PRs MUST be created from feature branches
- PR titles MUST start with `GH{issue_number}`
- PR descriptions MUST follow `.github/instructions/github-pr.md` template
- PR descriptions MUST include bilingual content (English + Russian spoiler)
- PRs MUST include "Additional Work" section listing all supplementary changes
- PRs MUST reference the Issue they close (`Fixes #123`)

### Specification Workflow

Before implementing any feature:

1. Create detailed specification in `.specify/specs/{###-feature-name}/`
2. Write `spec.md` with user stories, requirements, success criteria
3. Create `plan.md` with technical approach and architecture
4. Generate `tasks.md` breaking work into trackable units
5. Create GitHub Issue linking to specification
6. Implement following task order and priorities

### Quality Gates

- Constitution compliance MUST be verified in plan.md
- All specifications MUST be reviewed before implementation starts
- Code changes MUST maintain or improve test coverage
- Breaking changes MUST be documented and versioned appropriately
- Security vulnerabilities MUST be addressed before merge

## Governance

### Authority

This constitution supersedes all other development practices, guidelines, and conventions within the Universo Platformo Nuxt project. In case of conflict, constitution principles take precedence.

### Amendment Process

1. Amendments require clear justification and impact analysis
2. Version number MUST be updated following semantic versioning:
   - MAJOR: Backward incompatible governance changes, principle removal/redefinition
   - MINOR: New principles added, material expansions to guidance
   - PATCH: Clarifications, wording improvements, typo fixes
3. Sync Impact Report MUST be added as HTML comment at top of constitution file
4. All dependent template files MUST be reviewed and updated for consistency
5. Amendment MUST include migration plan if existing work is affected

### Compliance

- All Pull Requests MUST verify constitution compliance
- Specification plans MUST include "Constitution Check" section
- Violations MUST be explicitly justified in "Complexity Tracking" section
- Team members MAY question apparent violations and request clarification
- Constitution violations without documented justification are grounds for PR rejection

### Living Document

- This constitution is a living document expected to evolve with project needs
- Regular reviews (quarterly suggested) SHOULD assess whether principles remain appropriate
- Team members MAY propose amendments through normal GitHub Issue process
- Historical versions MUST be preserved in git history

**Version**: 1.3.1 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-25
