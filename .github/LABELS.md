# GitHub Labels Setup Guide

This document provides the recommended label structure for the Universo Platformo Nuxt repository. Labels should be created via GitHub's web interface (Settings → Labels) or using the GitHub API.

## Label Categories

### Type Labels (Required)

These labels classify the nature of the work.

| Label Name | Color | Description |
|------------|-------|-------------|
| `type:feature` | `#0e8a16` (green) | New functionality or capabilities |
| `type:bug` | `#d73a4a` (red) | Something isn't working correctly |
| `type:docs` | `#0075ca` (blue) | Documentation improvements or additions |
| `type:refactor` | `#fbca04` (yellow) | Code restructuring without changing functionality |
| `type:chore` | `#fef2c0` (light yellow) | Maintenance tasks, dependency updates, etc. |

### Area Labels (Applied as Relevant)

These labels indicate which part of the project is affected.

| Label Name | Color | Description |
|------------|-------|-------------|
| `area:infrastructure` | `#d4c5f9` (purple) | Repository setup, build systems, deployment |
| `area:clusters` | `#d4c5f9` (purple) | Clusters feature domain |
| `area:metaverses` | `#d4c5f9` (purple) | Metaverses feature domain |
| `area:auth` | `#d4c5f9` (purple) | Authentication and authorization |
| `area:database` | `#d4c5f9` (purple) | Database operations and migrations |
| `area:ui` | `#d4c5f9` (purple) | User interface and components |

**Note**: Additional area labels will be added as new features are implemented.

### Priority Labels (Optional)

These labels indicate the importance and urgency of the work.

| Label Name | Color | Description |
|------------|-------|-------------|
| `priority:P1` | `#b60205` (dark red) | MVP - Must have for initial release |
| `priority:P2` | `#ff9800` (orange) | Important - Should have soon |
| `priority:P3` | `#fef2c0` (light yellow) | Nice to have - Can be deferred |

### Status Labels (Optional)

These labels track workflow state.

| Label Name | Color | Description |
|------------|-------|-------------|
| `status:blocked` | `#e99695` (light red) | Cannot proceed due to external dependency |
| `status:in-progress` | `#c2e0c6` (light green) | Currently being worked on |
| `status:review` | `#bfdadc` (light blue) | Awaiting code review |

### Default GitHub Labels (Keep These)

GitHub provides several default labels that should be retained:

- `bug` - Legacy bug label (can coexist with `type:bug`)
- `documentation` - Legacy docs label (can coexist with `type:docs`)
- `duplicate` - This issue or pull request already exists
- `enhancement` - New feature or request (can coexist with `type:feature`)
- `help wanted` - Extra attention is needed
- `invalid` - This doesn't seem right
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## Usage Guidelines

### For Issues

Every issue should have:
1. **One type label** (type:feature, type:bug, type:docs, etc.)
2. **At least one area label** (area:infrastructure, area:clusters, etc.)
3. **Optional priority label** (priority:P1, priority:P2, priority:P3)
4. **Optional status label** as the issue progresses

**Example**:
- Issue: "Add user authentication system"
- Labels: `type:feature`, `area:auth`, `area:infrastructure`, `priority:P1`

### For Pull Requests

Pull requests should inherit labels from their linked issues, plus:
1. **Type label** matching the work performed
2. **Area labels** for affected parts of the codebase
3. **Status labels** as needed during review

**Example**:
- PR: "GH45 Implement user authentication system"
- Labels: `type:feature`, `area:auth`, `area:infrastructure`, `status:review`

## Creating Labels via GitHub API

If you have admin access and want to create labels programmatically:

```bash
# Type labels
gh label create "type:feature" --color "0e8a16" --description "New functionality or capabilities" --repo teknokomo/universo-platformo-nuxt
gh label create "type:bug" --color "d73a4a" --description "Something isn't working correctly" --repo teknokomo/universo-platformo-nuxt
gh label create "type:docs" --color "0075ca" --description "Documentation improvements or additions" --repo teknokomo/universo-platformo-nuxt
gh label create "type:refactor" --color "fbca04" --description "Code restructuring without changing functionality" --repo teknokomo/universo-platformo-nuxt
gh label create "type:chore" --color "fef2c0" --description "Maintenance tasks, dependency updates, etc." --repo teknokomo/universo-platformo-nuxt

# Area labels
gh label create "area:infrastructure" --color "d4c5f9" --description "Repository setup, build systems, deployment" --repo teknokomo/universo-platformo-nuxt
gh label create "area:clusters" --color "d4c5f9" --description "Clusters feature domain" --repo teknokomo/universo-platformo-nuxt
gh label create "area:metaverses" --color "d4c5f9" --description "Metaverses feature domain" --repo teknokomo/universo-platformo-nuxt
gh label create "area:auth" --color "d4c5f9" --description "Authentication and authorization" --repo teknokomo/universo-platformo-nuxt
gh label create "area:database" --color "d4c5f9" --description "Database operations and migrations" --repo teknokomo/universo-platformo-nuxt
gh label create "area:ui" --color "d4c5f9" --description "User interface and components" --repo teknokomo/universo-platformo-nuxt

# Priority labels
gh label create "priority:P1" --color "b60205" --description "MVP - Must have for initial release" --repo teknokomo/universo-platformo-nuxt
gh label create "priority:P2" --color "ff9800" --description "Important - Should have soon" --repo teknokomo/universo-platformo-nuxt
gh label create "priority:P3" --color "fef2c0" --description "Nice to have - Can be deferred" --repo teknokomo/universo-platformo-nuxt

# Status labels
gh label create "status:blocked" --color "e99695" --description "Cannot proceed due to external dependency" --repo teknokomo/universo-platformo-nuxt
gh label create "status:in-progress" --color "c2e0c6" --description "Currently being worked on" --repo teknokomo/universo-platformo-nuxt
gh label create "status:review" --color "bfdadc" --description "Awaiting code review" --repo teknokomo/universo-platformo-nuxt
```

## Label Count Summary

- **Type Labels**: 5
- **Area Labels**: 6 (initial set, more will be added)
- **Priority Labels**: 3
- **Status Labels**: 3
- **Total Recommended**: 17 labels

This exceeds the minimum requirement of 8 labels (SC-007) specified in the success criteria.

## References

- Complete labeling guidelines: [.github/instructions/github-labels.md](../.github/instructions/github-labels.md)
- Project constitution: [.specify/memory/constitution.md](../.specify/memory/constitution.md)
- Feature specification: [.specify/features/001-initial-setup/spec.md](../.specify/features/001-initial-setup/spec.md)
