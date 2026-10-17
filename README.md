# Paper Producer

**Just click to make it real.**

Educational SaaS for schools, colleges, academies, and institutes. The React interface is complete, and the Django REST Framework API scaffold has been started.

The frontend is not connected to domain APIs yet. The backend currently provides only the project scaffold and API health endpoints. Sign-in, statistics, generation, and PDFs are not simulated as live systems.

## Run the web interface

Node.js is required only for developers (React build tooling). End users will receive static HTML/CSS/JS.

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # if Node is installed locally
cd frontend
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

- **Sign in** does not authenticate. It explains that the API is pending.
- **Interface preview** lets you inspect Super Admin, Institute Admin, and Teacher screens.

## Run the backend

See [backend/README.md](backend/README.md) for Django environment setup and local run instructions. Domain models, authentication, and database migrations have not been implemented yet.

## Phase status

| Area | Status |
|------|--------|
| Web UI for all roles | Implemented (this phase) |
| Django / DRF project scaffold | Started |
| Authentication, domain APIs, database | Not started |
| Paper / guess generation | UI only — no generation |
| PDF / answer keys | UI only — no files produced |
