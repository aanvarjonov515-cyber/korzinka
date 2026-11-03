# Architecture Overview

```text
Electron Desktop (Frontend)
        ↓
      HTTPS
        ↓
FastAPI Backend (Python)
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
Postgres Redis Worker
```

## Layers
1. Presentation: React UI (Desktop)
2. API Layer: FastAPI (Backend)
3. Business Services: Orchestration
4. Repositories: Data access
5. Persistence: PostgreSQL / Redis
