# ProfitLeak
## Architecture
Electron Desktop (Frontend) -> HTTPS -> FastAPI Backend (Python) -> PostgreSQL + Redis

## Setup
1. Clone the repository.
2. Setup environment variables (`.env.example` -> `.env`).
3. Build backend: `cd backend && pip install -r requirements.txt`.
4. Build desktop: `cd desktop && npm install`.

## Security Notes
- Secrets are not in the source code.
- Card data is tokenized; raw PAN/CVV is never stored.
- Renderer IPC is strictly controlled via `preload.ts`.
- Structured logging is used without PII.
