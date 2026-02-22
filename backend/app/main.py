import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, dashboard, route_info, context, smart_predict, distance

load_dotenv()

app = FastAPI(title="Dynamic Pricing Ride Fare Predictor API")

# Enable CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",  # Common Vite port
    os.getenv("FRONTEND_URL", "*"), # Get from env or fallback to wildcard
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(route_info.router, prefix="/api", tags=["Route Info"])
app.include_router(context.router, prefix="/api", tags=["Context"])
app.include_router(smart_predict.router, prefix="/api", tags=["Smart Prediction"])
app.include_router(distance.router, prefix="/api", tags=["Distance"])

@app.get("/")
def read_root():
    return {"message": "Dynamic Pricing API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
