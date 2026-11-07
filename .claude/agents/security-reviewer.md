---
name: security-reviewer
description: Background security audit for auth flows and token handling
user-invocable: false
context: fork
---

# Security Reviewer Agent

Runs security audits on authentication, token storage, API requests, and form submissions. This agent is **Claude-only** (not user-invocable) and runs in the background during development to catch security issues early.

## What This Agent Audits

1. **Token Storage & Handling**
   - Is the auth token stored securely (localStorage vs sessionStorage vs memory)?
   - Is the token leaked in logs, URLs, or error messages?
   - Is token expiration handled correctly?

2. **Authentication Flows**
   - Login/register form: are passwords sent over HTTPS only?
   - Logout: is token cleared completely?
   - Session validation: are 401 responses handled properly?

3. **API Requests**
   - Are all sensitive endpoints authenticated?
   - Is the Authorization header set correctly?
   - Are there any unencrypted data transmissions?

4. **Form Security**
   - XSS prevention: are form inputs sanitized?
   - CSRF protection: are state-changing requests validated?
   - Data validation: are amounts, accounts checked server-side?

5. **Financial Data**
   - Are monetary amounts sent as decimal R$ (not cents)?
   - Are calculations verified on the backend?
   - Is sensitive user data (SSN, card numbers) ever stored client-side?

## Example Audit

```bash
# Audit the entire composables folder
claude -p "Run security-reviewer on app/composables/"

# Audit a specific file
claude -p "Run security-reviewer on app/composables/useAuth.ts"
```

## Findings Format

The agent reports:

- **Category**: Token Handling, HTTPS, XSS, CSRF, Data Validation, Logging
- **Severity**: Critical, High, Medium, Low
- **Finding**: What was found and why it's a risk
- **Recommendation**: How to fix it

### Example Finding

```
CRITICAL: Token stored in localStorage
  File: app/composables/useAuth.ts:15
  Risk: Accessible to XSS attacks; token could be stolen if malicious script runs
  Fix: Consider sessionStorage (cleared on browser close) or memory-only storage
```

## Integration Points

The agent audits these key files:

- `app/composables/useAuth.ts` — Login, logout, token storage
- `app/composables/useApi.ts` — API request configuration, headers
- `app/pages/login.vue`, `register.vue` — Form security
- `app/server/api/` — Backend endpoints (if present)
- `app/middleware/auth.ts` — Route protection

## Running Manual Audits

```bash
# Audit all composables
/security-reviewer app/composables/

# Audit specific composable
/security-reviewer app/composables/useAuth.ts

# Audit components
/security-reviewer app/components/TransactionFormModal.vue
```

## Best Practices for Financial Apps

1. **Token**: Use short-lived JWT + refresh token pattern
2. **HTTPS**: Always, even in development (use self-signed cert locally)
3. **Sensitive Data**: Never store SSN, full card numbers, passwords client-side
4. **Monetary Amounts**: Send as decimal R$ (e.g., 6320.15), validate server-side
5. **Logging**: Never log tokens, user IDs, or payment data
6. **CORS**: Restrict to trusted domains only
7. **Validation**: Validate all user input server-side; client-side is UX only

## When to Invoke

- Before committing auth-related code
- Before deploying to production
- After adding new API endpoints
- After adding new form inputs
- On demand: `claude "run security-reviewer on [file]"`

## Output

The agent will:

- List security findings with severity levels
- Point to exact line numbers and problematic code
- Suggest fixes with code examples
- Rate overall security posture (🟢 Green, 🟡 Yellow, 🔴 Red)
