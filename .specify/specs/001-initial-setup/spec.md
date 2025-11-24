# Feature Specification: Initial Universo Platformo Nuxt Setup

**Feature Branch**: `001-initial-setup`  
**Created**: 2025-11-15  
**Status**: Draft  
**Input**: User description: "Initialize Universo Platformo Nuxt project with monorepo structure, PNPM, TypeScript, Supabase, and documentation setup"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Repository Foundation Setup (Priority: P1)

A developer clones the repository and can immediately understand its purpose, structure, and how to get started. The repository has proper documentation in both English and Russian, clear project structure, and basic configuration files.

**Why this priority**: Without proper repository setup and documentation, developers cannot effectively work on the project. This is the absolute foundation that everything else depends on.

**Independent Test**: Can be fully tested by cloning the repository, reading the README files, and verifying all basic configuration files are present and properly structured.

**Acceptance Scenarios**:

1. **Given** an empty repository, **When** a developer clones it, **Then** they find comprehensive README files in English and Russian explaining project purpose and structure
2. **Given** the repository setup, **When** a developer examines the project structure, **Then** they find properly configured package.json, tsconfig.json, and .gitignore files
3. **Given** the README documentation, **When** a developer reads it, **Then** they understand the project's relationship to Universo Platformo React and the architectural approach
4. **Given** the README documentation, **When** a developer looks for governance, **Then** they find a link to the constitution (.specify/memory/constitution.md) and understand its authority
5. **Given** the README documentation, **When** a developer needs to create an issue or PR, **Then** they find links to GitHub workflow instruction files and can follow the documented process
6. **Given** the README documentation, **When** a developer reads about the database layer, **Then** they understand the abstraction requirement and why direct database access is forbidden
7. **Given** the README documentation, **When** a developer reads about the three-entity pattern, **Then** they understand it as a core architectural concept that will be replicated across features
8. **Given** the README documentation, **When** a developer wants to monitor the React repository, **Then** they find clear guidance on what to look for and how to adapt new features

---

### User Story 2 - Monorepo Structure Initialization (Priority: P2)

A developer sets up the monorepo structure with PNPM workspaces, enabling management of multiple packages with shared dependencies and consistent tooling across the entire project.

**Why this priority**: The monorepo structure is fundamental to how packages will be organized and managed. It must be established before any feature packages can be created.

**Independent Test**: Can be tested by running PNPM install, verifying workspace detection, and checking that the package manager correctly handles the monorepo structure.

**Acceptance Scenarios**:

1. **Given** the repository with monorepo configuration, **When** a developer runs package installation, **Then** PNPM correctly identifies and manages all workspaces
2. **Given** the packages directory structure, **When** a developer creates a new package, **Then** it follows the standardized base/ folder convention
3. **Given** the monorepo setup, **When** a developer updates a shared dependency, **Then** changes propagate correctly across all packages
4. **Given** the package creation documentation, **When** a new developer follows the guide, **Then** they can create a compliant package in under 10 minutes without assistance
5. **Given** the .gitignore configuration, **When** a developer builds the project, **Then** build artifacts (node_modules/, .nuxt/, .output/, dist/) are automatically excluded from version control
6. **Given** the documentation, **When** a developer wants to understand the specification workflow, **Then** they find clear explanation of the .specify/ directory structure and its purpose

---

### User Story 3 - GitHub Repository Organization (Priority: P3)

A project manager organizes the repository with proper labels for issues and pull requests, enabling effective project management and tracking of work across different functional areas and technical domains.

**Why this priority**: Proper issue and PR organization improves team collaboration and project tracking, but the project can function without it initially.

**Independent Test**: Can be tested by creating a test issue or PR and verifying that appropriate labels can be applied according to the labeling guidelines.

**Acceptance Scenarios**:

1. **Given** the repository labels are configured, **When** a developer creates an issue, **Then** they can select from appropriate type, area, and priority labels
2. **Given** an issue or PR, **When** it's labeled according to guidelines, **Then** the labels accurately reflect the work type and affected areas
3. **Given** the label documentation, **When** a team member needs to label something, **Then** they can clearly understand which labels to apply

---

### User Story 4 - Base TypeScript Configuration (Priority: P2)

A developer can write TypeScript code with proper type checking, linting, and formatting across the entire monorepo, ensuring code quality and consistency.

**Why this priority**: TypeScript configuration is essential for maintaining code quality and must be established early, but initial documentation can exist without it.

**Independent Test**: Can be tested by creating a sample TypeScript file and verifying it's properly type-checked, linted, and formatted according to project standards.

**Acceptance Scenarios**:

1. **Given** the TypeScript configuration, **When** a developer writes code with type errors, **Then** the type checker identifies and reports these errors
2. **Given** the linting configuration, **When** a developer runs the linter, **Then** it enforces consistent code style across all packages
3. **Given** a TypeScript file in any package, **When** the developer imports from another package, **Then** type resolution works correctly across package boundaries
4. **Given** the TypeScript configuration, **When** a developer inspects tsconfig.json, **Then** they see strict mode is explicitly enabled as required by the constitution
5. **Given** the package.json scripts, **When** a developer runs quality checks, **Then** all scripts (typecheck, lint, format:check) execute successfully
6. **Given** the testing framework documentation, **When** a developer wants to write tests, **Then** they understand that Vitest is the chosen framework and why
7. **Given** all package.json scripts, **When** a developer lists available commands, **Then** they find at least 9 essential scripts for development workflow

---

### User Story 5 - Documentation Quality and Bilingual Validation (Priority: P2)

A developer or reviewer can automatically validate that bilingual documentation (English/Russian) maintains consistency in structure and line count, ensuring the NON-NEGOTIABLE bilingual requirement is enforced systematically rather than manually.

**Why this priority**: Bilingual documentation is NON-NEGOTIABLE per constitution (Principle III). Manual validation is error-prone and doesn't scale. Automated validation ensures compliance and catches issues early.

**Independent Test**: Can be tested by creating test documentation files with mismatched line counts and verifying the validation mechanism detects the discrepancy.

**Acceptance Scenarios**:

1. **Given** bilingual README files, **When** the validation script runs, **Then** it reports success if line counts match within ±2 lines
2. **Given** bilingual README files with >2 line difference, **When** the validation script runs, **Then** it reports failure with specific line count details
3. **Given** the validation script, **When** integrated into PR workflow, **Then** it automatically checks documentation consistency before merge
4. **Given** the documentation, **When** a developer needs to validate bilingual docs, **Then** they find clear instructions on running the validation

---

### Edge Cases

- What happens when a developer tries to create a package without following the base/ folder convention?
- How does the system handle packages that only need frontend or only backend (not both)?
- What happens when someone tries to add a new workspace that conflicts with existing package names?
- How does the documentation update process work when only one language version is modified?
- What happens if PNPM is not installed on a developer's machine?
- What happens if a developer implements database access directly without using the abstraction layer?
- How is TypeScript strict mode compliance enforced if a developer tries to disable it?
- What happens when documentation links to GitHub instruction files that don't exist yet?
- How does the project handle updates from universo-platformo-react that conflict with Nuxt implementation approaches?
- What happens if bilingual documentation line count validation fails during PR review?
- How does the system prevent accidental commits of node_modules/ or build artifacts?
- What happens when a new developer isn't aware of the constitution or specification-driven workflow?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Repository MUST contain README.md and README-RU.md files with identical structure and content (translated)
- **FR-002**: Repository MUST use PNPM as the package manager with workspace configuration
- **FR-003**: Project MUST be organized as a monorepo with packages/ directory for all feature packages
- **FR-004**: Each package that requires both frontend and backend MUST separate them into -frt and -srv packages (e.g., clusters-frt, clusters-srv)
- **FR-005**: Every package MUST contain a base/ root folder to allow for future multiple implementations
- **FR-006**: Repository MUST have TypeScript configuration supporting the monorepo structure
- **FR-007**: Repository MUST include .gitignore configured for Node.js, TypeScript, and Nuxt projects
- **FR-008**: Repository MUST document its relationship to Universo Platformo React as the conceptual reference
- **FR-009**: Repository MUST include guidelines for creating bilingual documentation (English/Russian)
- **FR-010**: Repository MUST have configured GitHub labels following the project's labeling guidelines
- **FR-011**: README files MUST explain the key differences from React implementation (Nuxt-based, different patterns)
- **FR-012**: Documentation MUST note that Supabase is the initial database with plans for multi-database support
- **FR-013**: Documentation MUST reference the intention to use Passport.js for authentication with Supabase connector
- **FR-014**: Documentation MUST reference the intention to use Vuetify 3 (Vue Material Design) for UI components
- **FR-015**: Repository setup MUST NOT include a docs/ directory (will be in separate repository)
- **FR-016**: Repository MUST include package.json with necessary scripts for development, build, and testing
- **FR-017**: All documentation files MUST be created first in English, then translated to Russian with identical line count and structure
- **FR-018**: README MUST explain the three-entity pattern (Clusters/Domains/Resources) as the core architectural template for all future features
- **FR-019**: Repository MUST document and link to the project constitution (.specify/memory/constitution.md) from README
- **FR-020**: Repository MUST include .gitignore that explicitly excludes node_modules/, .nuxt/, .output/, dist/, and build artifacts while preserving .specify/ directory
- **FR-021**: TypeScript configuration MUST enable strict mode as required by project constitution
- **FR-022**: Repository MUST include package.json scripts for: install, dev, build, typecheck, lint, lint:fix, format, format:check, and quality checks
- **FR-023**: Documentation MUST include instructions for monitoring Universo Platformo React repository for new features to implement
- **FR-024**: Documentation MUST describe the database abstraction layer architecture requirement (repository pattern) to prevent direct database access in business logic
- **FR-025**: Documentation MUST reference and link to GitHub workflow instruction files (.github/instructions/github-issues.md, github-pr.md, github-labels.md)
- **FR-026**: Documentation MUST explain the specification-driven development workflow (.specify/ directory structure and purpose)
- **FR-027**: Documentation MUST include comprehensive package creation guide with step-by-step instructions
- **FR-028**: Repository MUST include bilingual documentation validation mechanism to enforce line count matching (±2 lines)
- **FR-029**: Documentation MUST reference testing framework selection (Vitest) and its role in the project

### Key Entities

This feature primarily deals with repository structure and configuration, not user-facing data entities. However, it establishes conventions for future entities:

- **Package**: A functional module containing either frontend (frt), backend (srv), or both components, with base/ folder for implementation variants
- **Workspace**: A PNPM workspace entry representing a package or group of packages in the monorepo
- **Documentation Set**: Paired English/Russian documentation files maintaining identical structure

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A developer unfamiliar with the project can clone the repository and understand its purpose within 5 minutes of reading the documentation
- **SC-002**: Package installation completes successfully within 2 minutes on a standard development machine with internet connection
- **SC-003**: All source code files in the repository pass static type checking with zero errors
- **SC-004**: Both English and Russian README files contain the same number of lines (±2 lines for formatting differences)
- **SC-005**: Repository structure inspection shows all required configuration files present and properly structured
- **SC-006**: Creating a new package following the documented conventions takes less than 10 minutes
- **SC-007**: Repository has at least 8 properly configured issue labels covering type, area, and priority categories
- **SC-008**: Running code quality checks completes with zero errors on all existing files
- **SC-009**: Documentation clearly distinguishes between conceptual references and implementation requirements
- **SC-010**: The packages directory structure is visible and properly configured for future package additions
- **SC-011**: TypeScript configuration explicitly enables strict mode (verifiable by inspecting tsconfig.json)
- **SC-012**: Documentation includes at least one link to the project constitution
- **SC-013**: Documentation includes working links to all three GitHub workflow instruction files (issues, PRs, labels)
- **SC-014**: Documentation explains the specification-driven development workflow with concrete examples
- **SC-015**: Package creation guide includes complete step-by-step instructions that a new developer can follow independently
- **SC-016**: Documentation clearly explains the database abstraction layer requirement with rationale
- **SC-017**: Documentation includes a section on monitoring the React repository with actionable guidance
- **SC-018**: All required package.json scripts are present and functional (at least 9 scripts: install, dev, build, typecheck, lint, lint:fix, format, format:check, quality)
- **SC-019**: The three-entity pattern is described as a core architectural concept, not merely a future feature
- **SC-020**: Testing framework (Vitest) is documented with its purpose and integration approach

## Assumptions _(mandatory)_

- Developers working on this project have basic familiarity with Nuxt.js and TypeScript
- PNPM version 8.x or higher will be used for package management
- The project will primarily target modern web browsers (last 2 versions of major browsers)
- Development will primarily occur on Unix-like systems (Linux, macOS) though Windows support is desirable
- Supabase will provide authentication, database, and storage services initially
- The Universo Platformo React repository is accessible for reference but will not be directly migrated
- Documentation in Russian is required because the development team includes Russian-speaking members
- GitHub is the primary platform for repository hosting and issue tracking
- The repository will eventually contain multiple packages but starts with just the base structure
- Future packages will follow similar patterns to those in Universo Platformo React but with Nuxt-appropriate implementations
- The project constitution (.specify/memory/constitution.md) has been ratified and supersedes all other development guidelines
- GitHub workflow instruction files (.github/instructions/\*.md) exist and provide the authoritative guidance for issues, PRs, and labels
- TypeScript strict mode is non-negotiable and will be enforced in all code
- The three-entity pattern (Clusters/Domains/Resources) will be the foundational architectural template for future features
- All developers will follow the specification-driven development workflow (.specify/ directory structure)
- Bilingual documentation will be validated automatically through tooling, not manual review alone
- Database abstraction layer will be implemented in future features, not in initial setup
- Testing infrastructure (Vitest) will be established when first testable code is written, not in initial setup
