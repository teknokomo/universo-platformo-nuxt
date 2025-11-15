# Implementation Plan: Initial Universo Platformo Nuxt Setup

**Branch**: `001-initial-setup` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `.specify/features/001-initial-setup/spec.md`

## Summary

This plan establishes the foundational infrastructure for Universo Platformo Nuxt, a fullstack monorepo implementation using Nuxt.js and TypeScript. The feature includes: repository documentation (bilingual English/Russian), monorepo structure with PNPM workspaces, GitHub repository organization with labels, and base TypeScript configuration. This is the absolute foundation that all future features depend on, implementing the first step of the project's incremental development approach.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode, Node.js LTS 18.x+  
**Primary Framework**: Nuxt 3.x (fullstack framework)  
**Package Manager**: PNPM 8.x+ with workspace protocol  
**Primary Dependencies**: Material UI (MUI), Passport.js, Supabase client  
**Storage**: Supabase (PostgreSQL-based) with abstraction layer planned for future  
**Testing**: Vitest (standard for Nuxt/Vite ecosystem)  
**Target Platform**: Modern web browsers (last 2 versions), Node.js server-side  
**Project Type**: Fullstack monorepo - packages separated into `-frt` (frontend) and `-srv` (server/backend)  
**Performance Goals**:

- Package installation < 2 minutes on standard dev machine
- Type checking completes < 30 seconds for initial setup
- Documentation readable within 5 minutes (SC-001)
  **Constraints**:
- Bilingual documentation (English/Russian) is NON-NEGOTIABLE
- All packages must have `base/` folder for future implementations
- No `docs/` directory (will be separate repository)
- No AI agent config files unless explicitly requested
  **Scale/Scope**: Initial setup (no user-facing features), foundation for future 10+ packages

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Verify compliance with constitution principles**:

- [x] **Monorepo Architecture**: Feature establishes the monorepo foundation with PNPM workspaces, `packages/` directory structure, and conventions for `-frt`/`-srv` packages with `base/` folders
- [x] **Specification-Driven**: This plan follows specification workflow (spec.md exists with 4 user stories, 18 functional requirements, and 10 measurable success criteria)
- [x] **Bilingual Documentation**: All documentation will be provided in English (primary) and Russian (exact copy with same line count ±2) - FR-001, FR-009, FR-017
- [x] **Technology Stack**: Establishes mandatory stack infrastructure (Nuxt 3, TypeScript, PNPM, preparation for Supabase, Passport.js, MUI)
- [x] **Incremental Development**: User stories are prioritized P1-P2-P3 with independent testability; P1 (repository foundation) must be completed first
- [x] **Reference Alignment**: Conceptually follows universo-platformo-react structure (monorepo, package naming, three-entity pattern) without copying React code or legacy issues

**Violations requiring justification**: NONE

All constitution principles are fully compliant for this feature. No technology deviations, no missing bilingual documentation, all user stories are independently testable, and database abstraction layer will be established (though not implemented in initial setup phase).

## Project Structure

### Documentation (this feature)

```text
.specify/features/001-initial-setup/
├── spec.md              # Feature specification (exists)
├── plan.md              # This file (implementation plan)
├── tasks.md             # Task breakdown (to be created by /speckit.tasks)
└── checklists/          # Progress tracking (exists)
```

### Source Code (repository root)

```text
# Root configuration
/
├── package.json         # Workspace root, scripts, shared dependencies
├── pnpm-workspace.yaml  # PNPM workspace configuration
├── tsconfig.json        # Base TypeScript configuration
├── .gitignore           # Git ignore rules for Node.js/TypeScript/Nuxt
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── README.md            # English documentation
├── README-RU.md         # Russian documentation (exact copy, translated)
├── .github/
│   └── (labels configuration via GitHub API, not files)
│
├── packages/            # Monorepo packages (empty initially, structure established)
│   └── .gitkeep         # Ensure directory exists in git
│
└── .specify/            # Specification framework (already exists)
    ├── memory/
    │   └── constitution.md
    ├── templates/
    ├── features/
    │   └── 001-initial-setup/  # This feature
    └── reports/

# Future package structure (documented, not implemented in initial setup)
packages/{domain}-frt/   # Frontend packages
├── base/                # Base implementation
│   ├── package.json
│   ├── components/
│   ├── composables/
│   └── pages/
└── README.md

packages/{domain}-srv/   # Backend/server packages
├── base/                # Base implementation
│   ├── package.json
│   ├── api/
│   ├── models/
│   └── services/
└── README.md
```

**Structure Decision**:

This feature establishes a **fullstack monorepo** structure using PNPM workspaces. The root directory contains configuration files and bilingual documentation. The `packages/` directory is created but empty initially - it will house future feature packages following the `-frt` (frontend) and `-srv` (server) naming convention. Each package will have a `base/` folder to support future multiple implementations (as per Principle I of the constitution).

This is the minimal setup required before any feature development can begin. Future features (starting with Clusters) will add packages to the `packages/` directory.

## Technical Approach

### Phase 0: Foundation Setup (P1 - User Story 1)

**Goal**: Create repository foundation with bilingual documentation

**Steps**:

1. **Root Configuration Files**
   - Create `package.json` with workspace configuration
   - Create `pnpm-workspace.yaml` defining workspace packages
   - Configure scripts: `dev`, `build`, `typecheck`, `lint`, `format`
   - Set up shared dependencies at root level

2. **Git Configuration**
   - Create `.gitignore` for Node.js, TypeScript, Nuxt projects
   - Exclude: `node_modules/`, `.nuxt/`, `dist/`, `.output/`, `.env`
   - Include: `.specify/` directory structure

3. **Documentation - English (Primary)**
   - Create `README.md` with:
     - Project purpose and description
     - Relationship to universo-platformo-react (conceptual reference)
     - Key differences (Nuxt vs React, fullstack approach)
     - Technology stack overview (Nuxt, TypeScript, PNPM, Supabase, Passport.js, MUI)
     - Repository structure explanation
     - Getting started guide (installation, development)
     - Future roadmap (three-entity pattern: Clusters/Domains/Resources)
     - Link to constitution (`.specify/memory/constitution.md`)
     - Link to specifications (`.specify/features/`)

4. **Documentation - Russian (Translation)**
   - Create `README-RU.md` as exact translation of README.md
   - Verify line count matches ±2 lines (SC-004)
   - Use same section structure, code blocks, and formatting
   - Translate all text content, keep technical terms in English where appropriate

**Success Criteria**:

- SC-001: Developer can understand project within 5 minutes
- SC-004: English and Russian READMEs have same line count ±2
- SC-005: All required configuration files present
- SC-009: Documentation clearly distinguishes conceptual reference from implementation

**Estimated Effort**: 4-6 hours

---

### Phase 1: Monorepo Structure (P2 - User Story 2)

**Goal**: Establish PNPM workspace with package structure conventions

**Steps**:

1. **PNPM Workspace Configuration**
   - Configure `pnpm-workspace.yaml`:
     ```yaml
     packages:
       - 'packages/*'
     ```
   - Set up workspace protocol in package.json
   - Configure shared dependencies and dev dependencies

2. **Packages Directory Structure**
   - Create `packages/` directory
   - Add `.gitkeep` file to preserve directory in git
   - Document package creation conventions in README

3. **Package Template Documentation**
   - Document standard package structure in README:
     - Frontend packages: `packages/{domain}-frt/base/`
     - Backend packages: `packages/{domain}-srv/base/`
   - Document required files: package.json, README.md, README-RU.md
   - Document naming conventions and structure

4. **Workspace Verification**
   - Run `pnpm install` to verify workspace detection
   - Test workspace commands: `pnpm -r <command>` (recursive)
   - Verify dependency resolution across workspaces

**Success Criteria**:

- SC-002: Package installation completes within 2 minutes
- SC-006: New package creation takes less than 10 minutes (documented process)
- SC-010: Packages directory visible and properly configured

**Estimated Effort**: 3-4 hours

---

### Phase 2: TypeScript Configuration (P2 - User Story 4)

**Goal**: Configure TypeScript with strict mode for monorepo

**Steps**:

1. **Base TypeScript Configuration**
   - Create root `tsconfig.json` with:
     - `"strict": true` (NON-NEGOTIABLE per constitution)
     - Nuxt 3 compatible options
     - Path aliases for monorepo packages
     - Modern ES modules support
   - Configure include/exclude patterns

2. **Linting Configuration**
   - Install and configure ESLint:
     - `@nuxtjs/eslint-config-typescript`
     - TypeScript ESLint plugin
     - Vue/Nuxt rules
   - Create `.eslintrc.js` with monorepo-aware configuration
   - Add lint scripts to package.json

3. **Formatting Configuration**
   - Install and configure Prettier
   - Create `.prettierrc` with project style rules
   - Integrate with ESLint (eslint-config-prettier)
   - Add format scripts to package.json

4. **Code Quality Scripts**
   - Add `typecheck` script: `nuxi typecheck`
   - Add `lint` script: `eslint .`
   - Add `lint:fix` script: `eslint . --fix`
   - Add `format` script: `prettier --write .`
   - Add `format:check` script: `prettier --check .`

5. **Initial Validation**
   - Run type checking on existing files (should pass with 0 errors)
   - Run linting on existing files (should pass with 0 errors)
   - Verify all configuration files are formatted correctly

**Success Criteria**:

- SC-003: All source code passes static type checking with zero errors
- SC-008: Code quality checks complete with zero errors
- Type resolution works across package boundaries (once packages exist)

**Estimated Effort**: 3-4 hours

---

### Phase 3: GitHub Repository Organization (P3 - User Story 3)

**Goal**: Configure GitHub labels for project management

**Steps**:

1. **Fetch Existing Labels**
   - Query GitHub API for current repository labels
   - Document existing labels
   - Identify labels to keep vs replace

2. **Label Design**
   - Follow `.github/instructions/github-labels.md` guidelines
   - Define label categories:
     - **Type**: `type:feature`, `type:bug`, `type:docs`, `type:refactor`, `type:chore`
     - **Area**: `area:infrastructure`, `area:clusters`, `area:metaverses`, `area:auth`, etc.
     - **Priority**: `priority:P1`, `priority:P2`, `priority:P3`
     - **Status**: `status:blocked`, `status:in-progress`, `status:review`
   - Choose colors and descriptions for each label

3. **Label Creation**
   - Create labels via GitHub API or web interface
   - Document label usage guidelines
   - Update `.github/instructions/github-labels.md` if needed

4. **Documentation Update**
   - Document labeling process in README
   - Link to label guidelines
   - Provide examples of proper label usage

**Success Criteria**:

- SC-007: At least 8 properly configured issue labels

**Estimated Effort**: 2-3 hours

---

## Implementation Order

Execute phases sequentially with verification between each:

```text
Phase 0: Foundation Setup (P1)        → Verify: SC-001, SC-004, SC-005, SC-009
         ↓
Phase 1: Monorepo Structure (P2)      → Verify: SC-002, SC-006, SC-010
         ↓
Phase 2: TypeScript Configuration (P2) → Verify: SC-003, SC-008
         ↓
Phase 3: GitHub Organization (P3)      → Verify: SC-007
```

**Total Estimated Effort**: 12-17 hours

**Critical Path**: Phase 0 → Phase 1 → Phase 2 (Phase 3 can be done in parallel after Phase 0)

## Edge Cases & Mitigation

### 1. Package Creation Without base/ Folder

**Issue**: Developer creates package without following base/ convention (Edge Case #1 from spec)  
**Impact**: Future multiple implementations blocked  
**Mitigation**:

- Document base/ requirement prominently in README
- Include in package creation guide
- Add to PR review checklist

### 2. Frontend-Only or Backend-Only Packages

**Issue**: Some features may only need frontend or backend, not both (Edge Case #2 from spec)  
**Impact**: Potential confusion about when to split packages  
**Mitigation**:

- Document in README: "If feature needs only one, create only that package"
- Examples: `packages/ui-components-frt/` (no -srv needed)
- Still require base/ folder even for single-side packages

### 3. Workspace Naming Conflicts

**Issue**: New workspace conflicts with existing package name (Edge Case #3 from spec)  
**Impact**: PNPM workspace resolution failure  
**Mitigation**:

- Document naming convention: `{domain}-{frt|srv}`
- Check existing packages before creating new ones
- PNPM will error if duplicate, preventing silent conflicts

### 4. Partial Documentation Updates

**Issue**: English documentation updated but Russian not synchronized (Edge Case #4 from spec)  
**Impact**: Violates NON-NEGOTIABLE bilingual requirement  
**Mitigation**:

- Document in README: "Always update both versions together"
- Add to PR checklist: "English and Russian docs both updated"
- Future: Consider automated line count verification

### 5. Missing PNPM Installation

**Issue**: Developer doesn't have PNPM installed (Edge Case #5 from spec)  
**Impact**: Cannot run project  
**Mitigation**:

- Document PNPM installation in README prerequisites
- Provide installation command: `npm install -g pnpm`
- Include version requirement: PNPM 8.x+

### 6. React Pattern Copying Temptation

**Issue**: Developer copies React code directly instead of implementing Nuxt patterns  
**Impact**: Poor implementation, violates Principle VI  
**Mitigation**:

- README explicitly states: "Use React repo as CONCEPT only, not code to copy"
- Link to constitution Principle VI
- Code review focus on Nuxt best practices

### 7. Direct Database Access in Business Logic

**Issue**: Future developers might add Supabase calls directly in components/services  
**Impact**: Violates Technology Stack Requirements (line 132 of constitution)  
**Mitigation**:

- Document abstraction layer requirement in README
- Note: "All database access must go through abstraction layer"
- Include in future code review checklists

## Complexity Tracking

No complexity violations. This feature fully complies with all constitution principles:

✅ **Monorepo Architecture**: Establishes foundation with PNPM workspaces and package conventions  
✅ **Specification-Driven**: Following spec.md → plan.md → tasks.md workflow  
✅ **Bilingual Documentation**: Both README versions will be created with line count matching  
✅ **Technology Stack**: Uses all mandatory technologies (Nuxt, TypeScript, PNPM, etc.)  
✅ **Incremental Development**: User stories prioritized P1→P2→P3 with independent tests  
✅ **Reference Alignment**: Follows React concept without copying code

## Testing Strategy

### Automated Tests

For initial setup, automated tests focus on configuration validation:

1. **Configuration Validation**
   - TypeScript configuration compiles without errors
   - ESLint configuration runs without errors
   - Prettier configuration runs without errors
   - PNPM workspace properly configured

2. **Documentation Validation**
   - README.md and README-RU.md exist
   - Line count matches within ±2 lines
   - All required sections present in both versions

3. **Structure Validation**
   - All required files exist (package.json, tsconfig.json, etc.)
   - packages/ directory exists
   - .gitignore properly configured

**Test Framework**: Vitest (script-based validation tests)

### Manual Testing

1. **Fresh Clone Test** (SC-001)
   - Clone repository on clean machine
   - Read README.md
   - Verify understanding within 5 minutes
   - Record time and feedback

2. **Installation Test** (SC-002)
   - Run `pnpm install` on standard dev machine
   - Verify completes within 2 minutes
   - Record actual time

3. **Type Checking Test** (SC-003)
   - Run `pnpm typecheck`
   - Verify zero type errors
   - Document any errors found

4. **Package Creation Test** (SC-006)
   - Follow README guide to create test package
   - Verify process takes < 10 minutes
   - Test package follows conventions (base/ folder, etc.)

5. **Label Verification Test** (SC-007)
   - Check GitHub repository labels
   - Verify ≥8 labels exist
   - Verify labels follow guidelines

## Success Validation

Before marking this feature complete, verify all 10 success criteria:

- [ ] **SC-001**: Developer can understand project within 5 minutes (user testing)
- [ ] **SC-002**: Package installation completes within 2 minutes (timing test)
- [ ] **SC-003**: All source code passes type checking with zero errors (automated)
- [ ] **SC-004**: English and Russian READMEs have same line count ±2 (automated check)
- [ ] **SC-005**: All required configuration files present and properly structured (automated)
- [ ] **SC-006**: New package creation takes < 10 minutes (user testing with guide)
- [ ] **SC-007**: At least 8 properly configured issue labels (GitHub API check)
- [ ] **SC-008**: Code quality checks complete with zero errors (automated)
- [ ] **SC-009**: Documentation clearly distinguishes conceptual vs implementation (review)
- [ ] **SC-010**: Packages directory visible and properly configured (file check)

**Acceptance**: All 10 criteria must pass before feature is considered complete.

## Dependencies & Prerequisites

### External Dependencies

- Node.js LTS 18.x or higher (installed on dev machine)
- PNPM 8.x or higher (will be documented for installation)
- GitHub account with access to repository (for label creation)
- Git (for version control)

### Internal Dependencies

- Constitution exists (✅ `.specify/memory/constitution.md`)
- Specification exists (✅ `.specify/features/001-initial-setup/spec.md`)
- This plan.md exists (✅ this file)
- Tasks.md will be created by `/speckit.tasks` command

### Blocking Issues

None. This is the first feature and has no dependencies on other features.

## Future Considerations

### After Initial Setup

1. **First Feature Implementation**: Clusters functionality
   - Three entities: Clusters / Domains / Resources
   - Will establish pattern for future features
   - See original requirement 5

2. **Database Abstraction Layer**
   - Not implemented in initial setup
   - First feature requiring database will establish pattern
   - Must prevent direct Supabase calls in business logic

3. **Authentication Setup**
   - Passport.js integration with Supabase
   - First feature requiring auth will implement
   - Initial setup only documents intention

4. **UI Component Library**
   - Material UI (MUI) integration
   - First feature with UI will establish patterns
   - Initial setup only documents intention

### Monitoring universo-platformo-react

As per Principle VI and original requirement 6, actively monitor the React repository for:

- New features to implement in this Nuxt version
- Improvements to the three-entity pattern
- Better architectural patterns (to adapt, not copy)
- Features to prioritize in this implementation

### Documentation Evolution

- README files will evolve as features are added
- Keep bilingual synchronization (NON-NEGOTIABLE)
- Update three-entity pattern documentation as first feature (Clusters) is implemented
- Add migration guide when React→Nuxt patterns become clearer

## Notes

- This plan follows constitution workflow: spec.md → plan.md → tasks.md → implementation
- All constitution principles verified as compliant
- No complexity tracking needed (no violations)
- Foundation phase must complete before any feature user stories begin
- Next step: Run `/speckit.tasks` to generate tasks.md from this plan and spec.md
