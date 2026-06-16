# Security Standards

## Purpose

Define the security requirements and guardrails that must be followed during development.

All implementation should comply with these standards.

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

- Input validation
- Sensitive data handling
- Secret handling
- Client-side data protection

Security validation is part of feature completion.