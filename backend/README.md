# Paper Producer API

Django REST Framework backend for Paper Producer.

## Local setup

From the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

The API root is `http://127.0.0.1:8000/api/v1/`; health check is `http://127.0.0.1:8000/api/v1/health/`. Run Vite separately from `frontend/` to use the integrated web interface.

## Authentication and account endpoints

Authentication uses Django session cookies and CSRF protection. Vite proxies `/api` to Django in local development, keeping browser requests same-origin.

- `GET /api/v1/auth/csrf/` initializes the CSRF cookie.
- `POST /api/v1/auth/signup/` creates an institute and its first institute-admin account. The public endpoint does not accept a role.
- `POST /api/v1/auth/login/` accepts `email` and `password`.
- `POST /api/v1/auth/logout/` ends the session.
- `GET /api/v1/auth/me/` returns the signed-in user's profile and role.
- `GET /api/v1/auth/teachers/` lists teachers for an institute admin's own institute, or all teachers for a super admin.
- `POST /api/v1/auth/teachers/create/` lets an institute admin create a teacher only in their own institute. It accepts `name`, `email`, and `password`; the password must pass Django's configured validators.

Email is unique, role assignment is controlled by the backend, and Django stores a password hash rather than the original password. The teacher-creation flow currently uses an admin-provided temporary password; email invitations, password reset, email verification, and rate limiting are not implemented yet. Super admins are created through Django's `createsuperuser` management command, not public signup.

## Database and settings

The settings default to local SQLite. To use PostgreSQL, set `DB_ENGINE=postgresql` and provide `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` in `backend/.env`, then run migrations. The `.env` file is ignored by Git; keep real credentials there and never commit them.

For production, configure a private `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, allowed hosts, HTTPS, secure cookie settings, and the appropriate CSRF trusted origins. The local scaffold is not a production deployment configuration.
