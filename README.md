# Paper Producer

Educational SaaS for schools, colleges, academies, and institutes. The repository contains a React/Vite frontend and a Django REST Framework API.

## Run the backend

See [backend/README.md](backend/README.md) for environment setup and local run instructions. The API currently includes health, session authentication, public institute-admin signup, teacher listing/creation, and teacher subject assignments. Paper generation and PDF export are not implemented yet.

## Run the web interface

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`. In development, Vite proxies `/api` requests to Django on port 8000.

## Current phase

| Area | Status |
|------|--------|
| React interface for all roles | Implemented |
| Django / DRF scaffold and data models | Implemented |
| Session login, signup, logout, and current-user API | Implemented |
| Institute-admin teacher list/create API | Implemented |
| Teacher subject assignment API | Implemented; generation-time enforcement awaits paper APIs |
| Role and institute checks on teacher management | Implemented for these endpoints |
| Question, template, and paper APIs | Pending |
| Paper generation, answer keys, and PDF export | Pending |
