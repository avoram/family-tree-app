
# Security Standards

## Purpose

Define the security requirements and guardrails that must be followed during development.

All implementation should comply with these standards.

---

## Authentication

- Users must authenticate using username and password.
- Passwords must never be stored in plain text.
- Passwords must be hashed before storage.
- Authentication logic must be implemented on the backend.
- The backend issues a **JWT** on successful login.
- JWT tokens expire after **24 hours**.
- **No refresh tokens** in Version 1; users must log in again after token expiration.
- JWT signing secrets must be stored in environment variables, not in source code.
- The frontend must include the JWT when calling protected APIs.

---

## Authorization

- Authorization is **role-based** using JWT claims.
- Supported roles: `SuperAdmin`, `User`.
- `SuperAdmin` has full access to all family trees.
- `User` has read-only access.
- The backend must validate the JWT on every protected API endpoint and enforce role permissions.
- Frontend route guards and UI restrictions are supplementary only; backend enforcement is required.

---

## Data Protection

- Sensitive data must not be exposed unnecessarily.
- Validate all user input.
- Sanitize input where appropriate.
- Return only required data from APIs.

---

## Secret Management

- Do not store secrets in source code.
- Use environment variables for secrets and configuration.
- Do not commit credentials, tokens, certificates, or private keys to the repository.

---

## AI Usage Guardrails

- Do not expose production secrets to AI systems.
- Do not share credentials, certificates, or private keys with AI systems.
- Do not share customer or sensitive personal data with AI systems.
- Use sanitized data when generating examples or test data.

---

## MCP Access Control

- Follow least-privilege access.
- Prefer read access over write access where possible.
- Restrict high-impact operations.
- Require approval for sensitive operations.

Examples:

Allowed:
- Read project documentation
- Read repositories
- Read Jira tickets
- Create pull requests

Restricted:
- Delete repositories
- Modify production environments
- Trigger production deployments
- Access production secrets

---

## Security Validation

Every feature should be reviewed for:

- Authentication requirements
- Authorization requirements
- JWT validation and expiration handling
- Role-claim verification (`SuperAdmin`, `User`)
- Input validation
- Secret handling
- API access control

Security validation is part of feature completion.