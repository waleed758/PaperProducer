# Paper Producer

**Just click to make it real.**

Educational SaaS for schools, colleges, academies, and institutes. This repository currently contains **Phase 1: complete web interface**.

The UI is original. It is not connected to a backend yet. Sign-in, statistics, generation, and PDFs are not simulated as live systems.

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

## Phase status

| Area | Status |
|------|--------|
| Web UI for all roles | Implemented (this phase) |
| Django API, auth, database | Not started |
| Paper / guess generation | UI only — no generation |
| PDF / answer keys | UI only — no files produced |
