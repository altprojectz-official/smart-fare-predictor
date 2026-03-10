import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes
from app.routes import predict, dashboard, route_info, context, smart_predict, distance

from contextlib import asynccontextmanager
from app.services.ml_service import ml_service

# Load env early
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML models on startup
    print("Startup: Loading ML models...")
    ml_service.load_model()
    yield
    # Shutdown logic if needed
    print("Shutting down...")

app = FastAPI(
    title="Smart Fare Predictor API",
    description="Optimized for Render Free Tier",
    lifespan=lifespan
)

# 1. Health Check Endpoint (Required for Render to monitor stability)
@app.get("/health")
async def health():
    return {"status": "healthy", "memory_optimized": True}

# 2. Production CORS Setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://smart-fare-predictor-fp7bwjkba-altprojectz-officials-projects.vercel.app",
    "https://smart-fare-predictor.vercel.app",
    os.getenv("FRONTEND_URL", "*"), # Fallback to env or wildcard
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include Routers
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(route_info.router, prefix="/api", tags=["Route Info"])
app.include_router(context.router, prefix="/api", tags=["Context"])
app.include_router(smart_predict.router, prefix="/api", tags=["Smart Prediction"])
app.include_router(distance.router, prefix="/api", tags=["Distance"])

@app.get("/")
async def root():
    return {"message": "Dynamic Pricing API is running on optimized memory mode"}

if __name__ == "__main__":
    import uvicorn
    # Local development settings
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
