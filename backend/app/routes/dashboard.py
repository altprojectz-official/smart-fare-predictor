from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/dashboard/demand-trend")
def get_demand_trend(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_demand_trend()

@router.get("/dashboard/time-price")
def get_time_price(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_time_price_trend()

@router.get("/dashboard/ride-distribution")
def get_ride_distribution(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_ride_distribution()

@router.get("/dashboard/model-metrics")
def get_model_metrics(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_model_metrics()
