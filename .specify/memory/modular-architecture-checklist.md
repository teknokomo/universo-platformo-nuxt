# Modular Architecture Validation Checklist

> **Purpose**: Comprehensive checklist to validate that all implementations follow the modular architecture requirements defined in the Constitution. Use this checklist during code reviews, implementation planning, and project audits.

**Last Updated**: 2025-11-17  
**Constitution Version**: 1.3.0  
**Related Documents**: [constitution.md](./constitution.md), [architectural-patterns.md](./architectural-patterns.md)

---

## Pre-Implementation Validation

Use this section BEFORE starting any feature implementation:

### 1. Planning Phase

- [ ] Feature specification exists in `.specify/features/{###-feature-name}/spec.md`
- [ ] Implementation plan identifies target package(s) explicitly
- [ ] Package naming follows convention: `{domain}-frt`, `{domain}-srv`, or `@universo/{name}`
- [ ] Package structure includes `base/` folder
- [ ] Dependencies are properly identified (workspace, external)
- [ ] No plans to implement code in root directories

### 2. Package Structure Preparation

- [ ] Package directory created: `packages/{package-name}/base/`
- [ ] Package has `package.json` with correct name and version
- [ ] Package has bilingual READMEs (`README.md` and `README-RU.md`)
- [ ] Package added to `pnpm-workspace.yaml`
- [ ] Package has proper directory structure (`src/`, tests, etc.)

### 3. Constitution Compliance Check

- [ ] Feature aligns with Principle I (Monorepo Architecture)
- [ ] Feature aligns with Principle II (Specification-Driven)
- [ ] Feature aligns with Principle III (Bilingual Documentation)
- [ ] Feature aligns with Principle VI (Reference Implementation Alignment)
- [ ] No violations or violations explicitly justified

---

## During Implementation Validation

Use this section WHILE implementing features:

### 4. Code Placement Verification

**CRITICAL: Verify NO code exists in forbidden locations:**

- [ ] ❌ No feature code in root `src/` directory
- [ ] ❌ No feature code in root `components/` directory
- [ ] ❌ No feature code in root `pages/` directory
- [ ] ❌ No feature code in root `server/` directory
- [ ] ❌ No feature code in root `composables/` directory
- [ ] ❌ No business logic in root `app.vue` (only minimal bootstrap)
- [ ] ✅ All feature code is in `packages/{package-name}/base/src/`

**Run detection commands:**

```bash
# Should return empty or only config files
find . -maxdepth 2 -name "*.vue" -o -name "*.ts" | grep -v node_modules | grep -v packages

# Check for forbidden directories
[ -d "src" ] && echo "❌ VIOLATION: Root src/ exists"
[ -d "components" ] && echo "❌ VIOLATION: Root components/ exists"
[ -d "pages" ] && echo "❌ VIOLATION: Root pages/ exists"
[ -d "server/api" ] && echo "❌ VIOLATION: Root server/api/ exists"
```

### 5. Package Implementation Quality

- [ ] All imports use package references (no relative paths outside package)
- [ ] Package exports clear public API through `index.ts`
- [ ] Package dependencies declared in `package.json`
- [ ] No direct imports from other packages' internals (use public API)
- [ ] TypeScript types properly exported
- [ ] Build scripts work independently (`pnpm build` in package)
- [ ] Test scripts work independently (`pnpm test` in package)

### 6. Architectural Pattern Compliance

- [ ] Database access uses Repository pattern (no direct SQL)
- [ ] Permission checking uses Guards pattern
- [ ] Factory functions used for reusable logic
- [ ] i18n uses centralized namespace registration
- [ ] Rate limiting implemented where needed
- [ ] Universal role system followed

### 6.1. Nuxt-Specific Pattern Compliance

- [ ] Frontend packages use Nuxt Layers or explicit exports for integration
- [ ] Server routes are properly organized in `server/api/` within packages
- [ ] Composables follow Vue Composition API best practices (use `use*` prefix)
- [ ] Shared types package (`@universo/types`) used for API contracts
- [ ] Type-safe API client pattern followed (Zod schemas + TypeScript types)
- [ ] SSR-safe code patterns used (onMounted for browser-only, process.client guards)
- [ ] Server middleware for authentication/authorization implemented correctly
- [ ] Route middleware for page protection defined properly
- [ ] Server routes include request validation (Zod schemas)
- [ ] Server routes include error handling (createError)
- [ ] Data fetching uses `useAsyncData` or `useFetch` for SSR compatibility
- [ ] No direct localStorage/sessionStorage access without SSR guards
- [ ] TypeScript configuration includes workspace awareness
- [ ] Package exports are properly configured for Nuxt auto-imports

---

## Post-Implementation Validation

Use this section AFTER implementation is complete:

### 7. Package Extraction Readiness

- [ ] Package can be built independently
- [ ] Package can be tested independently
- [ ] Package has no hidden external dependencies
- [ ] Package documentation is complete and bilingual
- [ ] Package version number is set
- [ ] Package has clear public API
- [ ] Package could be published to separate repository

**Test extraction readiness:**

```bash
# Navigate to package
cd packages/{package-name}/base

# Verify independent build
pnpm build

# Verify independent tests
pnpm test

# Check external dependencies
pnpm why {dependency-name}
```

### 8. Documentation Verification

- [ ] Package README.md exists (English)
- [ ] Package README-RU.md exists (Russian translation)
- [ ] Both READMEs have same structure and line count (±2 lines)
- [ ] Installation instructions provided
- [ ] API documentation provided
- [ ] Examples included
- [ ] Contributing guidelines mentioned

### 9. Integration Verification

- [ ] Package properly integrated in workspace
- [ ] Other packages can import from this package
- [ ] No circular dependencies
- [ ] Build order is correct
- [ ] Application boots and loads package correctly

---

## Code Review Checklist

Use this section during PULL REQUEST REVIEWS:

### 10. PR Review Requirements

- [ ] PR references GitHub Issue
- [ ] PR follows naming convention: `GH{issue_number}`
- [ ] PR description includes bilingual content
- [ ] All code changes are within `packages/` directory
- [ ] No violations of modular architecture
- [ ] Constitution compliance verified in PR description
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed

### 11. Violation Detection

**REJECT PR if any of these are true:**

- [ ] ❌ Feature code added to root directories
- [ ] ❌ New package created without `base/` folder
- [ ] ❌ Package missing bilingual READMEs
- [ ] ❌ Direct SQL queries (not using Repository pattern)
- [ ] ❌ Direct imports of internal package code
- [ ] ❌ Missing constitution compliance check
- [ ] ❌ Missing specification reference

### 12. Enforcement Actions

If violations found:

1. Request changes on PR
2. Reference this checklist and constitution
3. Provide migration path to fix violations
4. Block merge until violations resolved

---

## Automated Checks (Future)

Checks to implement in CI/CD:

### 13. Automated Validation Scripts

```bash
# Script: check-package-structure.sh
# Verify all feature code is in packages

#!/bin/bash
set -e

# Check for forbidden directories
forbidden_dirs=("src" "components" "pages" "server/api" "composables")
violations=0

for dir in "${forbidden_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "❌ VIOLATION: Root directory '$dir' exists"
        violations=$((violations + 1))
    fi
done

# Check for code files in root
root_code=$(find . -maxdepth 2 \( -name "*.vue" -o -name "*.ts" \) \
    | grep -v node_modules \
    | grep -v packages \
    | grep -v "\.config\." \
    | grep -v "\.eslintrc" \
    | wc -l)

if [ "$root_code" -gt 0 ]; then
    echo "❌ VIOLATION: $root_code code files found in root"
    find . -maxdepth 2 \( -name "*.vue" -o -name "*.ts" \) \
        | grep -v node_modules \
        | grep -v packages
    violations=$((violations + 1))
fi

# Check package base folders
packages_without_base=$(find packages -mindepth 1 -maxdepth 1 -type d \
    | while read pkg; do
        if [ ! -d "$pkg/base" ]; then
            echo "$pkg"
        fi
    done | wc -l)

if [ "$packages_without_base" -gt 0 ]; then
    echo "❌ VIOLATION: $packages_without_base packages missing base/ folder"
    violations=$((violations + 1))
fi

if [ "$violations" -eq 0 ]; then
    echo "✅ All modular architecture checks passed"
    exit 0
else
    echo "❌ $violations violation(s) found"
    exit 1
fi
```

### 14. Pre-commit Hook

```bash
# File: .husky/pre-commit
# Add to prevent commits with violations

#!/bin/bash
pnpm run validate:architecture || {
    echo "❌ Modular architecture validation failed"
    echo "Fix violations before committing"
    exit 1
}
```

---

## Migration Path for Violations

If violations found in existing code:

### 15. Fixing Non-Package Implementations

**Step-by-step migration:**

1. **Identify violation**:

   ```bash
   find . -maxdepth 2 -name "*.vue" -o -name "*.ts" | grep -v node_modules | grep -v packages
   ```

2. **Determine appropriate package**:
   - Frontend code → `{domain}-frt`
   - Backend code → `{domain}-srv`
   - Shared code → `@universo/{name}`

3. **Create package structure**:

   ```bash
   mkdir -p packages/{package-name}/base/src
   cd packages/{package-name}/base
   pnpm init
   ```

4. **Move code to package**:

   ```bash
   mv ../../src/components/MyComponent.vue src/components/
   ```

5. **Update imports**:
   - Change relative imports to package imports
   - Example: `import { Foo } from './foo'` → `import { Foo } from '{package-name}'`

6. **Add to workspace**:

   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'packages/**/base'
   ```

7. **Verify build**:

   ```bash
   pnpm install
   pnpm build
   pnpm test
   ```

8. **Remove old root directories**:
   ```bash
   rm -rf src/
   ```

---

## Reporting and Metrics

### 16. Project Health Metrics

Track these metrics to ensure modular architecture compliance:

- **Package Count**: Total number of packages
- **Package Extraction Readiness**: % of packages ready for extraction
- **Root Code Violations**: Count of files in forbidden locations (should be 0)
- **Base Folder Compliance**: % of packages with `base/` folder (should be 100%)
- **Bilingual Documentation**: % of packages with both READMEs (should be 100%)

### 17. Regular Audits

Schedule regular audits:

- **Weekly**: Automated checks in CI/CD
- **Monthly**: Manual review of new packages
- **Quarterly**: Full project audit using this checklist

---

## Conclusion

**Zero Tolerance Policy**: Non-compliance with modular architecture is **NOT ACCEPTABLE**.

This project is designed from the ground up for modularity and future package extraction. Any code that violates these principles creates **technical debt** that blocks the project's fundamental goals.

When in doubt, follow this simple rule:

> **If it's feature code, it goes in a package. No exceptions.**

For questions or clarification, refer to:

- [Constitution Principle I](./constitution.md#i-monorepo-architecture-with-pnpm)
- [Architectural Pattern 0](./architectural-patterns.md#0-package-based-modularity)
- [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) reference implementation
