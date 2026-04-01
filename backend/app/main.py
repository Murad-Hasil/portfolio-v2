import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

load_dotenv()

from app._limiter import limiter  # noqa: E402  (after load_dotenv)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: nothing to initialise for now (DB uses sync engine per plan)
    yield
    # Shutdown


app = FastAPI(
    title="Portfolio API",
    version="1.0.0",
    description="Murad Hasil — Portfolio Backend API",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — origins from env, default to localhost:3000
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers (included as phases are implemented) ──────────────────────────────
# try/except so the health endpoint works even before all routers are created.

try:
    from app.routers import projects

    app.include_router(projects.router)
except ImportError:
    pass

try:
    from app.routers import skills

    app.include_router(skills.router)
except ImportError:
    pass

try:
    from app.routers import contact

    app.include_router(contact.router)
except ImportError:
    pass

try:
    from app.routers import chat

    app.include_router(chat.router)
except ImportError:
    pass

try:
    from app.routers import analytics

    app.include_router(analytics.router)
except ImportError:
    pass

try:
    from app.routers import profile

    app.include_router(profile.router)
except ImportError:
    pass


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
