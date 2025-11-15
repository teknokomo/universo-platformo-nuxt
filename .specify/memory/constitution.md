<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Rationale: Initial constitution ratification - establishes foundational governance for Universo Platformo Nuxt

Modified Principles: N/A (initial version)
Added Sections:
  - Core Principles (6 principles defined)
  - Technology Stack Requirements
  - Development Workflow
  - Governance

Removed Sections: N/A

Templates Status:
  ✅ .specify/templates/plan-template.md - Constitution Check section aligned
  ✅ .specify/templates/spec-template.md - Requirements section aligned
  ✅ .specify/templates/tasks-template.md - Task categorization aligned
  ⚠ Command templates - No command templates directory exists yet

Follow-up TODOs: None - all placeholders resolved
-->

# Universo Platformo Nuxt Constitution

## Core Principles

### I. Monorepo Architecture with PNPM

**Rule**: All packages MUST reside in a single repository managed by PNPM workspaces.

**Requirements**:

- Packages are organized in `packages/` directory
- Frontend packages use `-frt` suffix (e.g., `packages/clusters-frt`)
- Backend packages use `-srv` suffix (e.g., `packages/clusters-srv`)
- Each package MUST contain a `base/` root folder to support future multiple implementations
- Shared dependencies are managed through workspace protocol
- All packages are independently buildable and testable

**Rationale**: Monorepo structure enables code sharing, consistent tooling, atomic cross-package changes, and simplified dependency management while maintaining clear separation between frontend and backend concerns.

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

**Rationale**: Bilingual support ensures accessibility for both international and Russian-speaking team members and users, maintains equal information access, and supports the project's multinational nature.

### IV. Technology Stack Consistency

**Rule**: Core technology stack decisions are binding across all packages unless explicitly justified.

**Mandatory Technologies**:

- **Framework**: Nuxt.js (fullstack) with TypeScript
- **Package Manager**: PNPM with workspace protocol
- **Database**: Supabase (primary), with abstraction layer for future database support
- **Authentication**: Passport.js with Supabase connector
- **UI Framework**: Material UI (MUI library)
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

**Rationale**: Learning from existing implementations accelerates development while avoiding technical debt transfer. Nuxt-specific best practices ensure optimal implementation for the chosen stack.

## Technology Stack Requirements

### Core Stack

- **Runtime**: Node.js LTS (18.x or higher)
- **Framework**: Nuxt 3.x with TypeScript
- **Package Manager**: PNPM 8.x or higher
- **Database**: Supabase (PostgreSQL-based)
- **Authentication**: Passport.js with Supabase strategy
- **UI Library**: Material UI (MUI)
- **Type Checking**: TypeScript 5.x in strict mode

### Database Strategy

- Primary: Supabase with Row Level Security (RLS)
- Architecture MUST use abstraction layer (repository pattern or similar) to enable future database migrations
- Direct database access in business logic is FORBIDDEN - use abstraction layer
- Schema migrations MUST be version controlled

### Package Structure

Each functional domain requiring both frontend and backend MUST be split into separate packages:

- `packages/{domain}-frt/base/` - Frontend implementation
- `packages/{domain}-srv/base/` - Backend implementation

Examples:

- `packages/clusters-frt/base/` and `packages/clusters-srv/base/`
- `packages/metaverses-frt/base/` and `packages/metaverses-srv/base/`

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

**Version**: 1.0.0 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-15
