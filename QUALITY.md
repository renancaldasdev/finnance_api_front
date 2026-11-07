# Code Quality Guidelines

## Overview

This project uses automated tools to maintain code quality across all changes:

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **SonarScanner** - Code quality analysis
- **Husky** - Git hooks for pre-commit checks

## Quality Checks

### Run All Checks

```bash
npm run quality
```

This runs:

1. ESLint linting
2. Prettier formatting
3. Vitest coverage tests

### Individual Commands

```bash
# Lint code
npm run lint
npm run lint:fix  # Auto-fix linting issues

# Format code
npm run format
npm run format:check  # Check without changes

# Run tests
npm run test
npm run test:coverage

# Code quality analysis (requires SonarQube instance)
npm run sonar
```

## Automatic Corrections

The following issues are **automatically fixed** on every code edit:

### 1. Formatting

- Line width: 100 characters
- Indentation: 2 spaces
- Quotes: single quotes
- Semicolons: enabled

**Tool**: Prettier  
**When**: After every `Edit` action

### 2. Linting Issues

Common issues automatically fixed:

- Unused variables
- Missing semicolons
- Incorrect indentation
- Import/export issues
- Type errors

**Tool**: ESLint with `--fix` flag  
**When**: After every `Edit` action

### 3. Type Checking

- TypeScript errors detected
- Type safety validated
- Strict mode enabled

**Tool**: TypeScript compiler  
**When**: After every `Edit` action

## Pre-Commit Checks

Before committing code, the following checks run automatically:

1. ✅ Code formatting (auto-fixed)
2. ✅ ESLint (auto-fixed, fails if errors remain)
3. ✅ Unit tests (must pass)

If any check fails, the commit is blocked and you must fix the issues.

## SonarQube Setup (Optional)

To use SonarQube for deeper analysis:

### Local SonarQube Instance

```bash
# Docker: Start SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Wait for startup (2-3 minutes), then access:
# http://localhost:9000 (admin/admin)

# Run analysis
npm run sonar
```

### Configuration

- **Project Key**: `finannce_api_front`
- **Sources**: `app/` directory
- **Exclusions**: `**/__tests__/**`, `node_modules/`, `.nuxt/`
- **Test Coverage**: Vitest with lcov format
- **TypeScript**: Full type checking enabled

## Warning Levels

| Level       | Action        | Example                                     |
| ----------- | ------------- | ------------------------------------------- |
| **Error**   | Blocks commit | Syntax errors, type errors, test failures   |
| **Warning** | Auto-fixed    | Unused vars, missing semicolons, formatting |
| **Info**    | Reported only | Code complexity, documentation suggestions  |

## Common Warnings & Fixes

### Unused Variables

```typescript
// ❌ Warning: 'unusedVar' is assigned but never used
const unusedVar = 123;

// ✅ Auto-fixed to
const _unusedVar = 123;
```

### Type Safety

```typescript
// ❌ Warning: 'any' type used
const data: any = response;

// ✅ Fixed by adding types
const data: ResponseType = response;
```

### Formatting

```typescript
// ❌ Warning: Line too long
const veryLongVariableNameThatExceedsTheLineWidthLimitOfOneHundredCharacters = 123;

// ✅ Auto-formatted
const veryLongVariableNameThatExceedsTheLineWidthLimitOfOneHundredCharacters = 123;
```

## Git Hooks

Husky hooks are configured in `.husky/pre-commit`:

```bash
# Automatically runs before git commit
- Format code (prettier)
- Fix linting issues (eslint --fix)
- Run tests (vitest)
```

To bypass hooks (not recommended):

```bash
git commit --no-verify
```

## IDE Integration

### VS Code

Install extensions for real-time feedback:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Vitest (`vitest.explorer`)

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Updating Rules

To add or modify quality rules:

1. **ESLint**: Edit `eslint.config.js`
2. **Prettier**: Edit `.prettierrc.json`
3. **Settings**: Edit `.claude/settings.json`
4. **SonarQube**: Edit `sonar-project.properties`

After changes, run `npm run quality` to verify.

## Continuous Integration

These checks run automatically in CI/CD:

- All linting passes
- All tests pass
- Code coverage maintained
- No critical issues

See `.github/workflows/` for CI configuration.
