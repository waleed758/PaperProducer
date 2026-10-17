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

The local scaffold defaults to SQLite so the API can start without a database service. PostgreSQL can be selected by setting `DB_ENGINE=postgresql` and filling in the `DB_*` values in `.env`. The project currently supports PostgreSQL or SQLite; schema migrations will be created after the remaining account and tenancy design decisions are settled.

Do not use the example secret key outside local development. Keep the real `.env` file private; it is ignored by Git.
