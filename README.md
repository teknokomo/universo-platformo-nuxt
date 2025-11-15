# Universo Platformo Nuxt

**Fullstack implementation of Universo Platformo / Universo MMOOMM / Universo Kiberplano built on Nuxt.js and TypeScript**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PNPM](https://img.shields.io/badge/PNPM-8.15+-blue.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82.svg)](https://nuxt.com/)

[🇷🇺 Русская версия](./README-RU.md)

## 📖 About

Universo Platformo Nuxt is a fullstack implementation of the Universo Platformo concept using modern web technologies. This project provides a comprehensive platform for building interconnected digital spaces, metaverses, and collaborative environments.

This is a **Nuxt.js implementation** of the Universo Platformo concept, distinct from but inspired by the React-based version. We use the same conceptual foundation but implement it with Nuxt.js best practices and fullstack capabilities.

## 🔗 Relationship to universo-platformo-react

This project is conceptually based on [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react), which serves as the **reference implementation** for understanding the Universo Platformo architecture and feature set.

**Important distinctions:**

- **Conceptual Reference Only**: We follow the architectural concepts, entity relationships, and feature structure from the React version
- **No Code Copying**: This is a fresh implementation using Nuxt.js/TypeScript best practices, not a port of React code
- **Improved Implementation**: We avoid copying legacy code, unfinished features, or implementation flaws from the React version
- **Fullstack Approach**: Unlike the React version with separate frontend/backend, we leverage Nuxt's fullstack capabilities

**What we adopt from the React version:**

- Overall project architecture and package structure
- Entity relationship patterns (e.g., Clusters/Domains/Resources)
- Feature scope and roadmap
- Monorepo organization principles

**What we do differently:**

- Use Nuxt 3 with TypeScript instead of React
- Implement server-side rendering and API routes natively
- Follow Nuxt ecosystem conventions and best practices
- Use file-based routing instead of React Router
- Implement features progressively with specification-driven development

## 🚀 Key Differences

### Technology Stack

| Aspect          | Universo Platformo React    | Universo Platformo Nuxt         |
| --------------- | --------------------------- | ------------------------------- |
| Framework       | React                       | Nuxt 3 (Vue-based)              |
| Backend         | Express (separate packages) | Nuxt Server Routes (integrated) |
| Routing         | React Router                | File-based routing              |
| Type System     | TypeScript                  | TypeScript (strict mode)        |
| Package Manager | PNPM                        | PNPM                            |
| UI Library      | Material UI (React)         | Material UI (MUI)               |

### Architecture Approach

- **Fullstack Integration**: Nuxt provides integrated frontend and backend in the same framework
- **Server-Side Rendering**: Native SSR support out of the box
- **API Routes**: Server endpoints colocated with pages
- **Best Practices**: Implementation follows Nuxt ecosystem patterns and conventions

## 🛠 Technology Stack

### Core Technologies

- **Framework**: [Nuxt 3.x](https://nuxt.com/) - Fullstack Vue framework with SSR
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/) - Strict mode enabled
- **Package Manager**: [PNPM 8.x+](https://pnpm.io/) - Fast, disk space efficient
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL-based with realtime capabilities
- **Authentication**: [Passport.js](https://www.passportjs.org/) - With Supabase connector
- **UI Library**: [Material UI (MUI)](https://mui.com/) - Comprehensive component library

### Code Quality

- **Linting**: ESLint with TypeScript and Nuxt rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript compiler in strict mode
- **Testing**: Vitest (Nuxt/Vite ecosystem standard)

### Database Strategy

- **Primary Database**: Supabase with Row Level Security (RLS)
- **Abstraction Layer**: Repository pattern to enable future database migrations
- **Schema Management**: Version-controlled migrations
- **Direct Access Forbidden**: All database operations through abstraction layer

## 📁 Repository Structure

This project uses a **monorepo architecture** with PNPM workspaces:

```
universo-platformo-nuxt/
├── .github/                # GitHub workflows and instructions
│   └── instructions/       # Development workflow guidelines
├── .specify/               # Specification-driven development
│   ├── features/          # Feature specifications and plans
│   ├── memory/            # Project constitution and memory
│   └── templates/         # Documentation templates
├── packages/              # Monorepo packages
│   ├── {domain}-frt/     # Frontend packages
│   │   └── base/         # Base implementation
│   └── {domain}-srv/     # Backend/server packages
│       └── base/         # Base implementation
├── package.json          # Workspace root configuration
├── pnpm-workspace.yaml   # PNPM workspace definition
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Package Structure Conventions

All feature packages follow a consistent structure:

- **Frontend Packages**: Use `-frt` suffix (e.g., `packages/clusters-frt`)
- **Backend Packages**: Use `-srv` suffix (e.g., `packages/clusters-srv`)
- **Base Folder**: Every package contains a `base/` root folder to support future multiple implementations
- **Separation**: Frontend and backend are separate packages when both are needed
- **Single-Side Packages**: If a feature only needs frontend or backend, create only that package

**Example package structures:**

```
packages/clusters-frt/base/   # Frontend: Cluster management UI
packages/clusters-srv/base/   # Backend: Cluster API and business logic
packages/ui-components-frt/base/  # Frontend-only: Shared UI components (no -srv needed)
```

## 🏗 Three-Entity Pattern

Universo Platformo is built around a flexible **three-entity pattern** that repeats across different functional domains:

### Base Pattern: Clusters

The foundational implementation uses:

- **Clusters**: Top-level organizational units
- **Domains**: Mid-level groupings within clusters
- **Resources**: Individual items within domains

### Pattern Replication

This same three-level hierarchy is replicated across features:

- **Metaverses** → **Sections** → **Entities**
- **Spaces** → **Canvases** → **Nodes** (for graph-based features)
- **Other domains** following similar patterns

Each domain may adapt this pattern with domain-specific logic while maintaining the core three-level structure. Some features may use partial patterns (2 levels) or extended patterns (4+ levels) as needed.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: LTS version 18.x or higher
- **PNPM**: Version 8.x or higher

To install PNPM globally:

```bash
npm install -g pnpm
```

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/teknokomo/universo-platformo-nuxt.git
cd universo-platformo-nuxt
```

2. **Install dependencies**:

```bash
pnpm install
```

### Development Commands

```bash
# Install all dependencies
pnpm install

# Development mode (once features are implemented)
pnpm dev

# Build for production (once features are implemented)
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Code formatting
pnpm format
pnpm format:check

# Run all code quality checks
pnpm quality
```

## 📦 Creating a New Package

To create a new feature package following project conventions:

1. **Create the package directory**:

```bash
mkdir -p packages/{domain}-{frt|srv}/base
```

2. **Create package.json**:

```json
{
  "name": "@universo/{domain}-{frt|srv}",
  "version": "0.1.0",
  "private": true
}
```

3. **Create bilingual README files**:

- `README.md` (English, primary)
- `README-RU.md` (Russian translation with identical structure)

4. **Install workspace**:

```bash
pnpm install
```

**Estimated time**: Less than 10 minutes following this guide.

## 🗺 Future Roadmap

### Phase 1: Foundation (Current)

- ✅ Repository setup and documentation
- ✅ Monorepo structure with PNPM workspaces
- ✅ TypeScript configuration with strict mode
- ✅ Code quality tooling (ESLint, Prettier)
- ✅ GitHub repository organization

### Phase 2: Core Features

- **Clusters Feature** (First implementation)
  - Three entities: Clusters / Domains / Resources
  - Establishes patterns for future features
  - Full CRUD operations with UI and API
- **Database Abstraction Layer**
  - Repository pattern implementation
  - Supabase integration
  - Migration support

### Phase 3: Authentication & Authorization

- Passport.js integration
- Supabase authentication connector
- Role-based access control
- Session management

### Phase 4: Additional Features

- **Metaverses**: Metaverses / Sections / Entities
- **Spaces**: Advanced graph-based features with LangChain nodes
- **Uniks**: Extended entity patterns
- Additional domains following the three-entity pattern

### Monitoring React Implementation

Per project guidelines, we actively monitor [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) for:

- New features to implement in this Nuxt version
- Improvements to the three-entity pattern
- Better architectural patterns (to adapt, not copy)
- Feature prioritization decisions

## 📚 Documentation & Governance

### Project Constitution

This project follows strict governance principles defined in [.specify/memory/constitution.md](./.specify/memory/constitution.md).

**Key principles:**

1. **Monorepo Architecture**: All packages in single repository with PNPM
2. **Specification-Driven Development**: Every feature starts with complete specification
3. **Bilingual Documentation**: All docs in English and Russian (NON-NEGOTIABLE)
4. **Technology Stack Consistency**: Core technologies are binding across packages
5. **Incremental Development**: Features built with independent, testable user stories (P1→P2→P3)
6. **Reference Alignment**: Follow React concept, implement with Nuxt best practices

### Specifications

Feature specifications and plans are located in [.specify/features/](./.specify/features/).

Each feature includes:

- `spec.md`: User stories, requirements, success criteria
- `plan.md`: Technical approach and architecture
- `tasks.md`: Detailed task breakdown
- `checklists/`: Progress tracking

### GitHub Workflow

Development follows strict GitHub workflows:

- **Issues**: [.github/instructions/github-issues.md](./.github/instructions/github-issues.md)
- **Labels**: [.github/instructions/github-labels.md](./.github/instructions/github-labels.md)
- **Pull Requests**: [.github/instructions/github-pr.md](./.github/instructions/github-pr.md)
- **Internationalization**: [.github/instructions/i18n-docs.md](./.github/instructions/i18n-docs.md)

### Bilingual Documentation Requirements

**All documentation MUST be provided in both English and Russian:**

1. **English is Primary**: Create English documentation first
2. **Immediate Translation**: Russian version must be created immediately after
3. **Identical Structure**: Both versions must have same number of lines, same sections
4. **README Naming**: Russian versions use `-RU.md` suffix (e.g., `README-RU.md`)
5. **Issues/PRs**: Use `<summary>In Russian</summary>` spoiler format (exact tag)

See [.github/instructions/i18n-docs.md](./.github/instructions/i18n-docs.md) for complete guidelines.

## 🤝 Contributing

We welcome contributions! Please ensure you:

1. Read the [constitution](./.specify/memory/constitution.md) and understand project principles
2. Follow the specification-driven development workflow
3. Create GitHub issues before starting work
4. Provide bilingual documentation for all changes
5. Maintain code quality standards (TypeScript strict mode, linting, formatting)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🔗 Links

- **This Repository**: [teknokomo/universo-platformo-nuxt](https://github.com/teknokomo/universo-platformo-nuxt)
- **React Reference**: [teknokomo/universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)
- **Documentation**: Will be hosted at docs.universo.pro (separate repository)
- **Project Constitution**: [.specify/memory/constitution.md](./.specify/memory/constitution.md)

## 📞 Contact

For questions, issues, or contributions, please use GitHub Issues or contact the Universo Platformo team.

---

**Note**: This is an active development project. The current phase focuses on foundational setup. User-facing features will be added incrementally following the specification-driven development workflow.
