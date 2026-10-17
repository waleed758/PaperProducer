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

The local scaffold uses Django's default SQLite configuration so the server can start without a separate database service. No migrations have been created or applied for this project yet. The database design and PostgreSQL/MySQL configuration will be handled in the later database step.

Do not use the example secret key outside local development. Keep the real `.env` file private; it is ignored by Git.
