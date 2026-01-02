## Identity API

This service provides account creation, RBAC, MFA, Google OIDC sign-in, secure profile updates, and auditing.

### Prerequisites

- Node.js 18+
- npm

### Getting Started

```bash
cd identity-api
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

The API listens on `http://localhost:4000`.

### Key Endpoints

- `POST /auth/signup` – email/password signup.
- `POST /auth/verify` – email verification.
- `POST /auth/login` – login with password, MFA, recovery codes.
- `POST /auth/google/start` + `/auth/google/callback` – Google OIDC PKCE flow.
- `POST /auth/mfa/enroll` & `/auth/mfa/verify` – TOTP enrollment.
- `POST /profile/me` – update profile.
- `GET /admin/roles`, `POST /admin/roles/:userId` – RBAC management (requires `admin.manage_roles` permission).
- `GET /admin/audit` – audit log review.

### Security Stories Delivered

- Password hashing via Argon2, verification emails, login rate limits, audit logs.
- Google OIDC login w/ PKCE + error handling, refresh tokens, MFA enforcement for admins.
- RBAC middleware guarding admin routes, role assignment UI support.
- MFA with TOTP + recovery codes, per-role enforcement.

For full endpoint details see `src/routes`.
