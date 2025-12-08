# Tasks: Initial Universo Platformo Nuxt Setup

**Input**: Design documents from `.specify/specs/001-initial-setup/`  
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅)

**Tests**: Configuration validation tests included. No traditional unit/integration tests needed for this infrastructure feature.

**Organization**: Tasks grouped by user story (US1-US5) to enable independent implementation and testing. Priority order: P1 → P2 → P3.

**Updated**: 2025-11-25 - Enhanced with comprehensive package structure aligned with universo-platformo-react (added missing packages: projects, storages, analytics, multiplayer; expanded node-components with detailed node categories; added flowise-\* legacy migration note)

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Parallelizable (different files, no dependencies)
- **[Story]**: User story mapping (US1, US2, US3, US4, US5)
- **File paths**: Absolute paths from repository root

## Path Conventions

Repository root structure for initial setup:

- Configuration: `/package.json`, `/tsconfig.json`, `/.eslintrc.cjs`, etc.
- Documentation: `/README.md`, `/README-RU.md`
- Workspace: `/packages/` (initially empty with `.gitkeep`)
- Specifications: `/.specify/specs/001-initial-setup/`

**Future Package Structure** (documented for context, not implemented in this feature):

```
packages/
├── auth-frt/base/              # Authentication UI components
├── auth-srv/base/              # Passport.js + Supabase backend
├── clusters-frt/base/          # Clusters management frontend
├── clusters-srv/base/          # Clusters backend API
├── metaverses-frt/base/        # Metaverses management frontend
├── metaverses-srv/base/        # Metaverses backend API
├── uniks-frt/base/             # Workspace management frontend (equiv. to organizations)
├── uniks-srv/base/             # Workspace backend API
├── projects-frt/base/          # Project management frontend
├── projects-srv/base/          # Project management backend
├── spaces-frt/base/            # Spaces/Canvases frontend
├── spaces-srv/base/            # Spaces backend API
├── space-builder-frt/base/     # AI-powered space builder frontend
├── space-builder-srv/base/     # Space builder LLM integration
├── publish-frt/base/           # Publication system frontend
├── publish-srv/base/           # Publication backend
├── profile-frt/base/           # User profile frontend
├── profile-srv/base/           # User profile backend
├── storages-frt/base/          # File storage frontend
├── storages-srv/base/          # File storage backend
├── analytics-frt/base/         # Analytics dashboard
├── multiplayer-srv/base/       # Real-time multiplayer (Colyseus)
├── updl/base/                  # UPDL node definitions
├── node-components/base/       # LangChain and custom node library
├── @universo/
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Shared utilities
│   ├── api-client/             # API client library
│   ├── i18n/                   # Internationalization
│   ├── template-vuetify/       # Vuetify 3 components and themes
│   └── rest-docs/              # REST API documentation
├── template-mmoomm/base/       # PlayCanvas MMO template
└── template-quiz/base/         # AR.js quiz template
```

---

## 📋 Package Structure Strategy

**Context**: This repository creates a Nuxt.js implementation of Universo Platformo that replicates the functionality of [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) with optimal modular architecture from the start.

### Key Architectural Principles

1. **Frontend/Backend Separation**: All features with both UI and API split into `-frt` (frontend) and `-srv` (server/backend) packages
2. **base/ Folder Convention**: Every package contains `/base/` directory to support future multiple implementations
3. **Avoid Monolithic Packages**: Unlike the React version which has large `flowise-components` and `flowise-server` packages that need splitting, we create focused packages from the beginning
4. **Independent Packages**: Each package should be ready to extract into a separate repository with minimal changes

### Package Categories

**Core Feature Packages** (frontend + backend pairs):

- `auth-frt` + `auth-srv`: Authentication pages and session management
- `clusters-frt` + `clusters-srv`: Clusters/Domains/Resources (Three-entity pattern foundation)
- `metaverses-frt` + `metaverses-srv`: Metaverses/Sections/Entities (Three-entity pattern)
- `uniks-frt` + `uniks-srv`: Workspace management (conceptual equivalent to React's organizations)
- `spaces-frt` + `spaces-srv`: Spaces/Canvases flow editor
- `space-builder-frt` + `space-builder-srv`: AI-powered prompt-to-flow generation
- `publish-frt` + `publish-srv`: Application publishing and export system
- `profile-frt` + `profile-srv`: User profile management
- `projects-frt` + `projects-srv`: Project management within workspaces
- `storages-frt` + `storages-srv`: File storage and asset management
- `analytics-frt`: Analytics dashboard and metrics visualization

**Multiplayer & Real-time Packages**:

- `multiplayer-srv/base`: Real-time multiplayer server (Colyseus-based)

**Node System Packages**:

- `updl/base`: UPDL node definitions (Entity, Component, Action, Event, Data, Space, Universo)
- `node-components/base`: Comprehensive node library including:
  - **LLM Nodes**: ChatOpenAI, ChatAnthropic, ChatGoogle, local models
  - **Chain Nodes**: LLMChain, SequentialChain, ConversationChain
  - **Agent Nodes**: OpenAI Functions Agent, ReAct Agent, Plan-and-Execute
  - **Tool Nodes**: Calculator, WebBrowser, Custom API, SerpAPI
  - **Memory Nodes**: BufferMemory, ConversationSummary, Redis, Postgres
  - **Vector Store Nodes**: Pinecone, Supabase, Chroma, FAISS
  - **Embeddings Nodes**: OpenAI, HuggingFace, Cohere
  - **Document Loader Nodes**: PDF, CSV, JSON, Web Scraper, Notion
  - **Text Splitter Nodes**: Character, Recursive, Token-based
  - **Cache Nodes**: InMemory, Redis, Upstash
  - **Output Parser Nodes**: Structured, List, DateTime
  - **Custom AI Nodes**: Universo-specific integrations
  - **Data Processing Nodes**: Transform, Filter, Aggregate

**Shared Utility Packages** (scoped with `@universo/`):

- `@universo/types`: Shared TypeScript interfaces and types
- `@universo/utils`: Shared utility functions and helpers
- `@universo/api-client`: Type-safe API client for backend services
- `@universo/i18n`: Centralized internationalization (EN/RU)
- `@universo/template-vuetify`: Vuetify 3 component library and themes
- `@universo/rest-docs`: REST API documentation generator

**Template Packages**:

- `template-mmoomm/base`: PlayCanvas MMO space template
- `template-quiz/base`: AR.js quiz template
- `template-{future}/base`: Additional templates as needed

**Note on Legacy Flowise Packages**: The React repository contains `flowise-*` prefixed packages (flowise-components, flowise-server, flowise-ui, etc.) which are legacy packages from the original Flowise project. In this Nuxt implementation, we DO NOT create flowise-prefixed packages. Instead:

- `flowise-components` functionality → absorbed into `node-components/base` and `spaces-frt` + `spaces-srv`
- `flowise-server` functionality → absorbed into `spaces-srv` and feature-specific `-srv` packages
- `flowise-ui` functionality → absorbed into `spaces-frt` and `@universo/template-vuetify`
- `flowise-store` functionality → absorbed into `storages-frt` + `storages-srv`

### Implementation Roadmap (Post-Initial Setup)

**Phase 1: Foundation** (Feature 001 - This feature)

- Repository structure and documentation
- PNPM workspace configuration
- TypeScript strict mode setup
- Base tooling and quality checks

**Phase 2: Shared Foundation & Authentication** (Feature 002)

- `@universo/types`: Shared TypeScript interfaces (required by all features)
- `@universo/utils`: Common utility functions
- `auth-frt`: Login/register pages, session guards
- `auth-srv`: Passport.js + Supabase integration
- Session management and middleware

**Phase 3: Three-Entity Pattern Foundation** (Feature 003)

- `clusters-frt` + `clusters-srv`: First implementation of Clusters/Domains/Resources pattern
- Establishes pattern that will be replicated in Metaverses and other features
- `@universo/api-client`: Type-safe API client (foundation for all API calls)

**Phase 4: Workspace & Project Management** (Feature 004)

- `uniks-frt` + `uniks-srv`: Workspace creation and management (equivalent to React's organizations)
- `projects-frt` + `projects-srv`: Project management within workspaces
- Multi-user collaboration preparation

**Phase 5: Metaverses** (Feature 005)

- `metaverses-frt` + `metaverses-srv`: Second implementation of three-entity pattern
- Demonstrates pattern reusability

**Phase 6: Spaces & Node System** (Feature 006)

- `spaces-frt` + `spaces-srv`: Visual flow editor (Spaces/Canvases)
- `updl/base`: UPDL node definitions (Entity, Component, Action, Event, Data, Space, Universo)
- `node-components/base`: Initial node library with core LangChain nodes:
  - LLM Nodes (ChatOpenAI, ChatAnthropic)
  - Chain Nodes (LLMChain, ConversationChain)
  - Memory Nodes (BufferMemory, ConversationSummary)
  - Basic Tool Nodes (Calculator, Custom API)

**Phase 7: Node Library Expansion** (Feature 007)

- Expand `node-components/base` with full LangChain integration:
  - Agent Nodes (OpenAI Functions, ReAct, Plan-and-Execute)
  - Vector Store Nodes (Pinecone, Supabase, Chroma, FAISS)
  - Embeddings Nodes (OpenAI, HuggingFace, Cohere)
  - Document Loader Nodes (PDF, CSV, JSON, Web Scraper)
  - Text Splitter Nodes (Character, Recursive, Token-based)
  - Cache Nodes (InMemory, Redis, Upstash)
  - Output Parser Nodes (Structured, List, DateTime)
- Add custom AI nodes for Universo-specific integrations
- Add data processing and integration nodes

**Phase 8: AI Space Builder** (Feature 008)

- `space-builder-frt` + `space-builder-srv`: Prompt-to-flow AI generation
- LLM integration for automated space creation

**Phase 9: Publishing & Storage System** (Feature 009)

- `publish-frt` + `publish-srv`: Export and publication functionality
- `storages-frt` + `storages-srv`: File storage and asset management
- `template-mmoomm/base`: PlayCanvas MMO template
- `template-quiz/base`: AR.js quiz template

**Phase 10: Profiles & Analytics** (Feature 010)

- `profile-frt` + `profile-srv`: User profile management
- `analytics-frt`: Analytics dashboard and metrics visualization
- `@universo/rest-docs`: REST API documentation generator

**Phase 11: Multiplayer & Advanced Features** (Feature 011+)

- `multiplayer-srv/base`: Real-time multiplayer server (Colyseus-based)
- Additional templates and integrations
- `@universo/template-vuetify` enhancements
- `@universo/i18n`: Full internationalization setup
- Advanced features as needed

### Reference Monitoring

**Active monitoring of universo-platformo-react**:

- Track new features for implementation in Nuxt version
- Identify improved patterns and architectural decisions
- Avoid copying legacy code or unfinished features
- Adapt concepts to Nuxt.js best practices

**Key React packages to reference**:

- [flowise-components](https://github.com/teknokomo/universo-platformo-react/tree/main/packages/flowise-components) - Node library structure
- [updl/base](https://github.com/teknokomo/universo-platformo-react/tree/main/packages/updl/base) - UPDL node definitions
- All `-frt`/`-srv` package pairs - Frontend/backend separation patterns

---

## Phase 1: Setup - Repository Foundation (User Story 1 - Priority P1) 🎯 MVP

**Goal**: Establish bilingual documentation and basic repository structure so developers can understand the project immediately.

**Independent Test**: Clone repository, read README.md, verify understanding within 5 minutes. Check all configuration files exist.

**Success Criteria**: SC-001, SC-004, SC-005, SC-009

### English Documentation (Primary)

- [x] T001 [P] [US1] Create `/README.md` with project overview section
  - Project name: Universo Platformo Nuxt
  - Brief description: Fullstack platform built on Nuxt.js and TypeScript
  - Statement: "This is a Nuxt.js implementation of Universo Platformo concept"
  - Badges for License, PNPM, TypeScript, Nuxt

- [x] T002 [P] [US1] Add "Relationship to universo-platformo-react" section in `/README.md`
  - Explain: React version as conceptual reference
  - Explain: Nuxt version uses same concepts, different implementation
  - Explain: No code copying, Nuxt best practices applied
  - Link: https://github.com/teknokomo/universo-platformo-react

- [x] T003 [P] [US1] Add "Key Differences" section with comparison table in `/README.md`
  - Technology stack comparison (Nuxt vs React, integrated vs separate backend)
  - Architecture differences (file-based routing vs React Router)
  - Implementation philosophy differences

- [x] T004 [P] [US1] Add "Technology Stack" section in `/README.md`
  - Core: Nuxt 3.x, TypeScript 5.x (strict), PNPM 8.x+
  - Database: Supabase with abstraction layer
  - Auth: Passport.js with Supabase connector
  - UI: Vuetify 3 (Material Design for Vue)
  - Quality: ESLint, Prettier, Vitest

- [x] T005 [P] [US1] Add "Repository Structure" section in `/README.md`
  - Explain monorepo organization with PNPM workspaces
  - Document `packages/` directory purpose
  - Explain `-frt` (frontend) and `-srv` (backend) naming
  - Explain `base/` folder requirement
  - Include directory tree diagram

- [x] T006 [P] [US1] Add "Three-Entity Pattern" section in `/README.md`
  - Explain base pattern: Clusters/Domains/Resources
  - Show pattern replication: Metaverses/Sections/Entities
  - Explain as core architectural concept
  - Note: Pattern repeats across all features

- [x] T007 [P] [US1] Add "Getting Started" section in `/README.md`
  - Prerequisites: Node.js 18.x+, PNPM 8.x+
  - Installation: Clone, `pnpm install`
  - Development commands: dev, build, typecheck, lint, format
  - Quality check: `pnpm quality`

- [x] T008 [P] [US1] Add "Creating a New Package" section in `/README.md`
  - Step 1: Create directory structure with base/ folder
  - Step 2: Create package.json
  - Step 3: Create bilingual README files
  - Step 4: Run `pnpm install`
  - Estimated time: < 10 minutes

- [x] T009 [P] [US1] Add "Future Roadmap & Package Structure" section in `/README.md`
  - Overview: Explain modular package approach inspired by universo-platformo-react
  - Phase 1: Foundation (current - repository setup, documentation, tooling)
  - Phase 2: Authentication (`auth-frt` + `auth-srv` packages)
  - Phase 3: Three-Entity Pattern (`clusters-frt` + `clusters-srv` as foundation)
  - Phase 4: Workspace Management (`uniks-frt` + `uniks-srv`)
  - Phase 5: Metaverses (`metaverses-frt` + `metaverses-srv`)
  - Phase 6: Spaces & Nodes (`spaces-frt` + `spaces-srv`, `updl/base`, `node-components/base`)
  - Phase 7: Node Library Expansion (LangChain integration, custom nodes)
  - Phase 8: AI Space Builder (`space-builder-frt` + `space-builder-srv`)
  - Phase 9: Publishing System (`publish-frt` + `publish-srv`, templates)
  - Phase 10+: Profiles and Additional Features
  - Include: Package naming conventions (-frt/-srv, base/ folder, @universo/ scope)
  - Include: Link to reference React packages structure
  - Note: Monitor universo-platformo-react for feature updates and improvements

- [x] T010 [P] [US1] Add "Documentation & Governance" section in `/README.md`
  - Link to constitution: `.specify/memory/constitution.md`
  - Link to architectural patterns (English & Russian)
  - Link to specifications: `.specify/specs/`
  - Link to GitHub instructions: `.github/instructions/`
  - Explain bilingual documentation requirement

- [x] T010A [P] [US1] Add "Package Categories & Node System" section in `/README.md`
  - Core Feature Packages: List main `-frt` + `-srv` pairs (auth, clusters, metaverses, uniks, spaces, space-builder, publish, profile)
  - Node System: Explain UPDL nodes and node-components library
  - Node Types: LangChain nodes (LLMs, chains, agents, tools), Custom AI nodes, Data processing, Integration nodes
  - Shared Utilities: @universo/types, @universo/utils, @universo/api-client, @universo/i18n, @universo/template-vuetify
  - Template Packages: template-mmoomm, template-quiz, future templates
  - Include: Brief explanation of each category's purpose

- [x] T011 [US1] Review and finalize `/README.md` structure
  - Verify all sections complete and well-organized
  - Check all internal links work
  - Count lines for Russian translation baseline
  - Ensure constitution principles referenced

### Russian Translation

- [x] T012 [US1] Create `/README-RU.md` translating `/README.md`
  - Translate all text content to Russian
  - Keep technical terms in English where appropriate
  - Maintain identical section structure
  - Keep code blocks untranslated
  - Preserve all links and URLs

- [x] T013 [US1] Verify `/README-RU.md` line count matches `/README.md` ±2 lines
  - Count lines: `wc -l README.md README-RU.md`
  - If difference > 2, adjust formatting
  - Document counts in commit message

### Base Configuration Files

- [ ] T014 [P] [US1] Ensure `/package.json` has complete workspace configuration
  - Package name: `universo-platformo-nuxt`
  - Version: `0.1.0`
  - Private: true
  - Scripts: (already exist - verify complete)
  - DevDependencies: (already exist - verify complete)
  - Engines: Node >=18.0.0, PNPM >=8.0.0

- [ ] T015 [P] [US1] Verify `/.gitignore` comprehensiveness
  - Ignores: `node_modules/`, `.nuxt/`, `.output/`, `dist/`
  - Ignores: `.env`, `.env.*` (but not `.env.example`)
  - Ignores: IDE files (`.vscode/`, `.idea/`, `*.swp`)
  - Does NOT ignore: `.specify/` directory
  - Ignores: Build artifacts and logs

### Validation

- [ ] T016 [US1] Run fresh clone test (SC-001)
  - Clone repository to temporary location
  - Read README.md
  - Time the understanding process (should be < 5 minutes)
  - Document feedback

- [ ] T017 [US1] Verify configuration files exist (SC-005)
  - Check: README.md, README-RU.md exist
  - Check: package.json, tsconfig.json exist
  - Check: .gitignore, .eslintrc.cjs, .prettierrc exist
  - Check: pnpm-workspace.yaml exists

- [ ] T018 [US1] Validate bilingual line counts (SC-004)
  - Run: `wc -l README.md README-RU.md`
  - Verify: Difference ≤ 2 lines
  - Document: Actual counts

**Checkpoint Phase 1**: Repository foundation complete with bilingual documentation

---

## Phase 2: Foundational - Monorepo Structure (User Story 2 - Priority P2)

**Goal**: Establish PNPM workspace structure enabling package management and future feature development.

**Independent Test**: Run `pnpm install`, verify workspace detection, confirm packages/ directory ready.

**Success Criteria**: SC-002, SC-006, SC-010

### Workspace Configuration

- [ ] T020 [US2] Verify `/pnpm-workspace.yaml` configuration
  - Pattern: `packages/*` defined
  - Add comments explaining workspace structure
  - Verify syntax is correct

- [ ] T021 [US2] Verify `/.npmrc` has Nuxt-compatible settings
  - Setting: `shamefully-hoist=true` (required for Nuxt)
  - Setting: `strict-peer-dependencies=true`
  - Add comment explaining why shamefully-hoist is needed

- [ ] T022 [US2] Update workspace scripts in `/package.json`
  - Verify: `install:all`, `clean`, `clean:all` scripts
  - Add: `dev:all` for running all package dev servers
  - Add: `build:all` for building all packages

### Package Directory

- [ ] T023 [US2] Ensure `/packages/` directory exists
  - Create if doesn't exist: `mkdir -p packages`
  - Purpose: Houses all feature packages

- [ ] T024 [US2] Create `/packages/.gitkeep` file
  - Empty file to preserve empty directory in Git
  - Add comment: "Preserves packages directory structure"

### Documentation Updates

- [ ] T025 [US2] Verify "Package Structure Conventions" in README.md
  - Document: Domain naming with `-frt`/`-srv` suffixes
  - Document: All packages require `base/` folder
  - Examples: `packages/clusters-frt/base/`, `packages/clusters-srv/base/`
  - Document: Utility packages use `@universo/` scope

- [ ] T026 [US2] Verify "Creating a New Package" guide in README.md
  - Complete step-by-step instructions
  - Estimated time documented (< 10 minutes)
  - Include package.json template example

- [ ] T027 [US2] Update Russian README with package documentation
  - Translate new package sections
  - Verify line count still matches ±2

### Workspace Installation

- [ ] T028 [US2] Run full workspace installation
  - Execute: `pnpm install` at repository root
  - Verify: No errors
  - Verify: `pnpm-lock.yaml` updated
  - Time: Should complete < 2 minutes (SC-002)

- [ ] T029 [US2] Test workspace detection
  - Run: `pnpm list --depth 0`
  - Verify: Workspace recognized
  - Verify: No package errors

### Validation

- [ ] T030 [US2] Installation time test (SC-002)
  - Fresh clone on clean environment
  - Time `pnpm install` execution
  - Verify: < 2 minutes
  - Document: Actual time

- [ ] T031 [US2] Packages directory verification (SC-010)
  - Check: `/packages/` exists and tracked by Git
  - Check: `.gitkeep` preserves structure
  - Test: Create dummy package, verify workspace detection

- [ ] T032 [US2] Package creation guide test (SC-006)
  - Follow README guide to create test package
  - Time the process
  - Verify: < 10 minutes
  - Clean up test package
  - Document: Any improvements needed

**Checkpoint Phase 2**: Monorepo workspace configured and operational

---

## Phase 3: Foundational - TypeScript Configuration (User Story 4 - Priority P2)

**Goal**: Configure TypeScript strict mode, linting, and formatting for monorepo-wide code quality.

**Independent Test**: Create test .ts file, verify type checking, linting, formatting work correctly.

**Success Criteria**: SC-003, SC-008, SC-011, SC-018

**Note**: User Story 4 before US3 because TypeScript is more critical than GitHub labels.

### TypeScript Setup

- [ ] T040 [P] [US4] Verify TypeScript and Nuxt installation
  - Check: `typescript`, `@types/node` in devDependencies
  - Check: `nuxt` in dependencies
  - Verify versions: TypeScript 5.x, Nuxt 3.x

- [ ] T041 [P] [US4] Verify `/tsconfig.json` strict mode configuration (SC-011)
  - Critical: `"strict": true` MUST be set (constitution requirement)
  - Setting: `"esModuleInterop": true`
  - Setting: `"skipLibCheck": true`
  - Setting: `"moduleResolution": "bundler"` (Nuxt 3 compatible)
  - Setting: `"target": "ESNext"`
  - Include: Path aliases for packages

- [ ] T042 [P] [US4] Document TypeScript configuration in README
  - Explain: Strict mode is non-negotiable
  - Explain: Path aliases for monorepo
  - Explain: Nuxt-specific settings
  - Reference: Constitution Principle IV

### Linting Configuration

- [ ] T043 [P] [US4] Verify ESLint installation and configuration
  - Check: `eslint`, `@nuxtjs/eslint-config-typescript` installed
  - Check: `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
  - Verify: `/.eslintrc.cjs` exists and configured

- [ ] T044 [P] [US4] Verify `/.eslintrc.cjs` rules
  - Extends: `@nuxtjs/eslint-config-typescript`
  - Parser: `@typescript-eslint/parser`
  - Rules: Appropriate for TypeScript/Nuxt
  - Ignores: `node_modules/`, `.nuxt/`, `dist/`, `.output/`

- [ ] T045 [P] [US4] Verify `/.eslintignore` file
  - Ignore: Build directories and artifacts
  - Ignore: Dependencies
  - Do not ignore: Source code

### Formatting Configuration

- [ ] T046 [P] [US4] Verify Prettier installation
  - Check: `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
  - Verify: Integration with ESLint

- [ ] T047 [P] [US4] Verify `/.prettierrc` configuration
  - Settings: `semi`, `singleQuote`, `tabWidth`, `trailingComma`
  - Settings: `printWidth`, `arrowParens`
  - Consistent with project style

- [ ] T048 [P] [US4] Verify `/.prettierignore` file
  - Ignore: Build artifacts
  - Ignore: `pnpm-lock.yaml`, `package-lock.json`
  - Ignore: `.min.js`, `.min.css` files

### Quality Scripts

- [ ] T049 [US4] Verify package.json quality scripts (SC-018)
  - Script: `typecheck` → `nuxi typecheck`
  - Script: `lint` → `eslint .`
  - Script: `lint:fix` → `eslint . --fix`
  - Script: `format` → `prettier --write .`
  - Script: `format:check` → `prettier --check .`
  - Script: `quality` → runs all checks
  - Count: At least 9 essential scripts

### Initial Quality Check

- [ ] T050 [US4] Format all existing files
  - Run: `pnpm format`
  - Verify: All files formatted
  - Review: Check formatting is correct

- [ ] T051 [US4] Run linting on all files (SC-008)
  - Run: `pnpm lint`
  - Verify: Zero errors
  - Fix: Any issues found
  - Document: Results

- [ ] T052 [US4] Run type checking (SC-003)
  - Run: `pnpm typecheck`
  - Verify: Zero type errors
  - Verify: Strict mode is active
  - Document: Results

- [ ] T053 [US4] Run full quality check
  - Run: `pnpm quality`
  - Verify: All checks pass
  - Verify: Zero errors across all tools

### Validation

- [ ] T054 [US4] Create test TypeScript file
  - Create: `/test-typescript.ts` with type annotations
  - Run: `pnpm typecheck`
  - Verify: Type checking works
  - Delete: test file after validation

- [ ] T055 [US4] Test linting error detection
  - Create: `/test-lint.ts` with intentional violations
  - Run: `pnpm lint`
  - Verify: Errors detected
  - Delete: test file after validation

- [ ] T056 [US4] Test formatting
  - Create: `/test-format.ts` with poor formatting
  - Run: `pnpm format`
  - Verify: File properly formatted
  - Delete: test file after validation

- [ ] T057 [US4] Strict mode verification (SC-011)
  - Open: `/tsconfig.json`
  - Verify: `"strict": true` is explicitly set
  - Verify: Not inherited implicitly
  - Document: Constitution compliance confirmed

**Checkpoint Phase 3**: TypeScript strict mode and quality tools operational

---

## Phase 4: Enhancement - GitHub Repository Organization (User Story 3 - Priority P3)

**Goal**: Configure GitHub labels for effective project management and issue tracking.

**Independent Test**: Check GitHub repository, verify ≥8 labels exist following guidelines.

**Success Criteria**: SC-007

**Note**: Requires GitHub API access or web interface.

### Label Analysis

- [ ] T060 [P] [US3] Review `.github/instructions/github-labels.md` guidelines
  - Read: Complete labeling guidelines
  - Identify: Required label categories
  - Identify: Recommended labels
  - Document: Current requirements

- [ ] T061 [P] [US3] Query existing GitHub labels
  - Use: GitHub web interface or API
  - Document: Current labels (name, color, description)
  - Identify: Labels to keep vs modify

### Label Design

- [ ] T062 [US3] Design type labels
  - `type:feature` (green #0e8a16) - New features
  - `type:bug` (red #d73a4a) - Bug fixes
  - `type:docs` (blue #0075ca) - Documentation
  - `type:refactor` (yellow #fbca04) - Code refactoring
  - `type:chore` (light yellow #fef2c0) - Maintenance

- [ ] T063 [US3] Design area labels
  - `area:infrastructure` (purple #d4c5f9) - Infrastructure
  - `area:clusters` (purple #d4c5f9) - Clusters feature
  - `area:metaverses` (purple #d4c5f9) - Metaverses feature
  - `area:auth` (purple #d4c5f9) - Authentication
  - Note: More areas added as features develop

- [ ] T064 [US3] Design priority labels
  - `priority:P1` (dark red #b60205) - MVP critical
  - `priority:P2` (orange #ff9800) - Important
  - `priority:P3` (light yellow #fef2c0) - Nice to have

- [ ] T065 [US3] Design status labels (optional)
  - `status:blocked` (light red #e99695) - Blocked
  - `status:in-progress` (light green #c2e0c6) - In progress
  - `status:review` (light blue #bfdadc) - In review

### Label Creation

- [ ] T066 [P] [US3] Create type labels in GitHub repository
  - Create: All 5 type labels via GitHub interface
  - Set: Correct colors and descriptions
  - Verify: Labels visible in repository

- [ ] T067 [P] [US3] Create area labels in GitHub repository
  - Create: All 4 initial area labels
  - Set: Correct colors and descriptions
  - Verify: Labels visible

- [ ] T068 [P] [US3] Create priority labels in GitHub repository
  - Create: All 3 priority labels
  - Set: Correct colors and descriptions
  - Verify: Labels visible

- [ ] T069 [P] [US3] Create status labels (optional)
  - Create: All 3 status labels if desired
  - Set: Correct colors and descriptions
  - Verify: Labels visible

### Documentation

- [ ] T070 [US3] Add "GitHub Labels" section to README.md
  - Explain: Label categories and purpose
  - Explain: When to use each label
  - Link: `.github/instructions/github-labels.md`
  - Examples: Proper label usage

- [ ] T071 [US3] Translate labels section to README-RU.md
  - Translate: GitHub Labels section
  - Verify: Line count matches ±2

### Validation

- [ ] T072 [US3] Label count verification (SC-007)
  - Count: Total GitHub labels
  - Verify: ≥ 8 labels configured
  - Document: Actual count and categories

- [ ] T073 [US3] Label category coverage
  - Verify: Type labels (5)
  - Verify: Area labels (4+)
  - Verify: Priority labels (3)
  - Total: Should be 12+ labels

- [ ] T074 [US3] Test label application
  - Create: Test issue
  - Apply: Labels from different categories
  - Verify: Labels apply correctly
  - Close/delete: Test issue

**Checkpoint Phase 4**: GitHub repository organized with comprehensive labels

---

## Phase 5: Enhancement - Bilingual Documentation Validation (User Story 5 - Priority P2)

**Goal**: Implement automated validation for bilingual documentation consistency.

**Independent Test**: Create test docs with mismatched line counts, verify validation detects discrepancy.

**Success Criteria**: SC-004 (automated enforcement)

### Validation Script Creation

- [ ] T080 [P] [US5] Create `/scripts/` directory
  - Create: `/scripts/` at repository root
  - Add to: `.gitignore` if scripts are temporary
  - Or: Keep scripts for CI/CD integration

- [ ] T081 [P] [US5] Create `/scripts/validate-i18n-docs.sh` validation script
  - Function: Compare line counts of README.md vs README-RU.md
  - Logic: Calculate difference, check if ≤ 2 lines
  - Output: Success/failure with line counts
  - Exit: 0 for success, 1 for failure

- [ ] T082 [US5] Make validation script executable
  - Run: `chmod +x scripts/validate-i18n-docs.sh`
  - Test: Run script manually
  - Verify: Works correctly

### Script Enhancement

- [ ] T083 [P] [US5] Add support for multiple file pairs
  - Extend: Script to check multiple README pairs
  - Pattern: Find all `*-RU.md` files, match with base
  - Report: All mismatches, not just first

- [ ] T084 [P] [US5] Add detailed reporting
  - Output: Clear success/failure messages
  - Output: Actual line counts for each file
  - Output: Difference value
  - Output: Which files passed/failed

### Documentation

- [ ] T085 [US5] Add validation instructions to README.md
  - Section: "Bilingual Documentation Validation"
  - Explain: How to run validation script
  - Explain: What the script checks (±2 line requirement)
  - Example: `./scripts/validate-i18n-docs.sh`

- [ ] T086 [US5] Document validation in `.github/instructions/i18n-docs.md`
  - Add: Automated validation section
  - Explain: Script usage
  - Explain: CI integration (future)

- [ ] T087 [US5] Update Russian README with validation info
  - Translate: Validation sections
  - Verify: Line count matches ±2

### Validation

- [ ] T088 [US5] Test validation with matching files
  - Run: Validation script on current READMEs
  - Verify: Passes (reports success)
  - Document: Results

- [ ] T089 [US5] Test validation with mismatched files
  - Create: Test files with >2 line difference
  - Run: Validation script
  - Verify: Fails (reports mismatch)
  - Clean: Delete test files

- [ ] T090 [US5] Test detailed reporting
  - Run: Validation with verbose output
  - Verify: Shows line counts for all files
  - Verify: Clear pass/fail indicators

**Checkpoint Phase 5**: Automated bilingual validation implemented

---

## Phase 6: Final Validation & Completion

**Purpose**: Verify all user stories complete, all success criteria met, create GitHub issue/PR.

### Cross-Story Validation

- [ ] T095 [P] Final bilingual documentation check
  - Verify: README.md and README-RU.md exist
  - Verify: Line counts match ±2
  - Verify: All sections translated
  - Run: Automated validation script

- [ ] T096 [P] Final configuration verification
  - Verify: All config files present (package.json, tsconfig.json, etc.)
  - Verify: All tools configured (ESLint, Prettier, TypeScript)
  - Verify: Workspace properly configured

- [ ] T097 [P] Final code quality check
  - Run: `pnpm quality`
  - Verify: Zero type errors (SC-003)
  - Verify: Zero lint errors (SC-008)
  - Verify: All files formatted

- [ ] T098 [P] Final package structure check
  - Verify: `/packages/` directory exists (SC-010)
  - Verify: `.gitkeep` present
  - Verify: README documents package creation

### Success Criteria Validation

- [ ] T099 Complete success criteria checklist
  - ✅ SC-001: 5-minute understanding test
  - ✅ SC-002: 2-minute installation test
  - ✅ SC-003: Zero type errors
  - ✅ SC-004: Bilingual line count ±2
  - ✅ SC-005: All config files present
  - ✅ SC-006: 10-minute package creation
  - ✅ SC-007: 8+ GitHub labels
  - ✅ SC-008: Zero lint errors
  - ✅ SC-009: Clear documentation
  - ✅ SC-010: Packages directory visible
  - Additional: SC-011, SC-018 from enhanced spec

### End-to-End Validation

- [ ] T100 Fresh clone end-to-end test
  - Clone: Repository to clean location
  - Read: README.md (time: should be < 5 min)
  - Install: `pnpm install` (time: should be < 2 min)
  - Test: `pnpm quality` (should pass)
  - Create: Test package per guide (time: should be < 10 min)
  - Document: All timings and results

### Documentation Finalization

- [ ] T101 [P] Review and polish README.md
  - Review: All sections clear and complete
  - Fix: Typos or unclear sections
  - Verify: All links work
  - Verify: Formatting consistent

- [ ] T102 [P] Review and polish README-RU.md
  - Review: Translation accuracy
  - Fix: Any translation issues
  - Verify: Matches English structure
  - Verify: Line count ±2

- [ ] T103 Update specification status
  - Update: `spec.md` status from "Draft" to "Implemented"
  - Add: Implementation completion date
  - Add: Link to final PR

### GitHub Issue & PR Creation

- [ ] T104 Create GitHub Issue for feature completion
  - Follow: `.github/instructions/github-issues.md`
  - Title: "Initial Universo Platformo Nuxt Setup - Feature Complete"
  - Description: Bilingual (English + Russian in spoiler)
  - Labels: `type:feature`, `area:infrastructure`, `priority:P1`
  - Link: To specification and this PR
  - Link: To tasks.md for reference

- [ ] T105 Update Pull Request description
  - Update: PR description with final status
  - Include: All changes summary
  - Include: Success criteria validation results
  - Reference: Issue number with "Fixes #N"
  - Include: Testing evidence

**Checkpoint Phase 6**: Feature complete and ready for merge

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (US1 - P1): Repository Foundation
         ↓
    Can start in parallel:
         ├─→ Phase 2 (US2 - P2): Monorepo Structure
         ├─→ Phase 3 (US4 - P2): TypeScript Config
         ├─→ Phase 4 (US3 - P3): GitHub Labels
         └─→ Phase 5 (US5 - P2): Doc Validation
         ↓
Phase 6: Final Validation & Completion
```

### Critical Path

**Sequential (minimum time)**:

1. Phase 1: Foundation (4-6 hours)
2. Phase 2: Monorepo (3-4 hours)
3. Phase 6: Validation (2-3 hours)

**Total: 9-13 hours minimum**

### Parallel Opportunities

**After Phase 1 completes** (with 4 developers):

- Developer A: Phase 2 (Monorepo) - 3-4 hours
- Developer B: Phase 3 (TypeScript) - 3-4 hours
- Developer C: Phase 4 (GitHub Labels) - 2-3 hours
- Developer D: Phase 5 (Doc Validation) - 2-3 hours

**Parallel completion: ~4 hours after Phase 1**

**Total with parallelism: ~10-11 hours**

### Within-Phase Parallelism

Tasks marked `[P]` can run simultaneously:

- Phase 1: 10 parallel tasks (T001-T010)
- Phase 2: 3 parallel tasks
- Phase 3: 9 parallel tasks (T040-T048)
- Phase 4: 8 parallel tasks
- Phase 5: 4 parallel tasks
- Phase 6: 4 parallel tasks

---

## Implementation Strategy

### MVP-First Approach (Recommended)

1. **Complete Phase 1** (US1 - P1)
   - STOP: Validate developers understand project
   - Decision: Continue or adjust documentation

2. **Complete Phase 2** (US2 - P2)
   - STOP: Validate workspace installation works
   - Decision: Continue or fix workspace issues

3. **Complete Phase 3** (US4 - P2)
   - STOP: Validate code quality checks pass
   - Decision: Continue or fix configuration

4. **Optional: Phases 4-5** (US3 - P3, US5 - P2)
   - These enhance but aren't critical
   - Can defer if time constrained

5. **Complete Phase 6**
   - Final validation
   - Create issue and update PR
   - Request review

### Incremental Delivery Milestones

- **Milestone 1** (Phase 1): Repository readable and understandable
- **Milestone 2** (Phase 2): Packages can be added and managed
- **Milestone 3** (Phase 3): Code quality enforced
- **Milestone 4** (Phase 4-5): Management and validation tools
- **Milestone 5** (Phase 6): Production-ready foundation

Each milestone is independently valuable and deployable.

---

## Notes

- **[P] tasks**: Can run in parallel (different files, no blocking dependencies)
- **[Story] labels**: Map tasks to user stories for traceability (US1-US5)
- **File paths**: All paths absolute from repository root
- **Checkpoints**: Stop and validate after each phase
- **Commit frequency**: Commit after completing each phase or logical task group
- **Validation**: Run quality checks frequently during implementation
- **Constitution**: All tasks comply with project constitution principles
- **Bilingual**: NON-NEGOTIABLE - both English and Russian always updated together
- **Package Structure**: This feature documents the optimal modular structure; actual packages created in subsequent features
- **React Reference**: Use [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) as CONCEPT reference, not code to copy
- **Modular Design**: Create focused, single-purpose packages from the start for better maintainability and future extraction

---

## Estimated Effort

### By Phase

- Phase 1 (US1): 4-6 hours (documentation, configuration)
- Phase 2 (US2): 3-4 hours (monorepo setup, workspace)
- Phase 3 (US4): 3-4 hours (TypeScript, linting, formatting)
- Phase 4 (US3): 2-3 hours (GitHub labels)
- Phase 5 (US5): 2-3 hours (validation script)
- Phase 6: 2-3 hours (final validation, issue/PR)

### Total

- **Sequential**: 16-23 hours
- **With 4 developers**: 10-11 hours
- **MVP only** (Phases 1-3, 6): 11-16 hours

### Task Count

- **Total tasks**: 87
- **Parallelizable**: 34 tasks marked [P]
- **Per user story**:
  - US1 (P1): 18 tasks
  - US2 (P2): 13 tasks
  - US4 (P2): 18 tasks
  - US3 (P3): 15 tasks
  - US5 (P2): 11 tasks
  - Final: 12 tasks

---

**Generated**: Based on spec.md, plan.md, research.md, and universo-platformo-react analysis  
**Last Updated**: 2025-11-25  
**Status**: Enhanced with comprehensive modular package structure aligned with universo-platformo-react - Ready for implementation
