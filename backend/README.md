# Paper Producer API

Initial Django REST Framework scaffold. Domain models, authentication flows, and database migrations will be added in later steps.

## Local setup

From the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py runserver
```

On Windows PowerShell, activate the virtual environment with:

```powershell
.venv\Scripts\Activate.ps1
```

The API root is available at `http://127.0.0.1:8000/api/v1/` and the health check at `http://127.0.0.1:8000/api/v1/health/`.

## Authentication API

Authentication uses Django session cookies. In local development, the Vite server proxies `/api` to Django, so browser requests are same-origin. Fetch `/api/v1/auth/csrf/` first and send the returned `csrftoken` cookie in the `X-CSRFToken` header on POST requests.

- `POST /api/v1/auth/signup/` creates an institute and its first institute-admin account. The public endpoint does not accept a role; it cannot create super-admin or teacher accounts.
- `POST /api/v1/auth/login/` accepts `email` and `password`.
- `POST /api/v1/auth/logout/` ends the session.
- `GET /api/v1/auth/me/` returns the signed-in user's profile and role.
- `GET /api/v1/auth/csrf/` sets the CSRF cookie needed for POST requests.

Signup currently creates an institute-admin account immediately; email verification, rate limiting, and staff-managed teacher invitations are not part of this initial endpoint layer. Production deployment should serve the frontend and API through a same-origin HTTPS setup or add an explicitly configured trusted-origin/cookie policy.

The local scaffold defaults to SQLite so the API can start without a database service. PostgreSQL can be selected by setting `DB_ENGINE=postgresql` and filling in the `DB_*` values in `.env`. The project currently supports PostgreSQL or SQLite; schema migrations will be created after the remaining account and tenancy design decisions are settled.

Do not use the example secret key outside local development. Keep the real `.env` file private; it is ignored by Git.
