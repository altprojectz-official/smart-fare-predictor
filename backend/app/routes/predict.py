from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.ride_schema import RideRequest, RideResponse
from app.services.ml_service import ml_service
from app.services.surge_service import calculate_surge_multiplier, calculate_final_fare
from app.database import get_db, engine
from app.models.prediction import Prediction, Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

router = APIRouter()

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ... (previous imports)

@router.post("/predict", response_model=RideResponse)
async def predict_fare(request: RideRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received prediction request: {request.model_dump()}")
        
        # 1. Hybrid Pricing Logic
        request_dict = request.model_dump()
        
        # Inter-city Logic (Distance > 50km)
        if request.distance > 50:
            logger.info(f"Long distance detected ({request.distance} km). Using formula pricing.")
            base_fare = request.distance * 10 # ₹10 per km
            # For long distance, fix surge to 1.0 (no surge)
            multiplier = 1.0 
            
            # Skip ML model
            final_fare = base_fare * multiplier
        else:
            # City Logic (ML Model)
            base_fare = ml_service.predict_base_fare(request_dict)
            
            # 2. Calculate Surge Multiplier
            multiplier = calculate_surge_multiplier(
                demand_level=request.demand_level,
                time_of_day=request.time_of_day,
                traffic_condition=request.traffic_condition,
                weather_condition=request.weather_condition
            )
            
            # 3. Calculate Final Fare
            final_fare = calculate_final_fare(base_fare, multiplier)
            
        # Ensure 2 decimal precision
        final_fare = round(final_fare, 2)
            
        logger.info(f"Prediction success: Base={base_fare}, Surge={multiplier}, Final={final_fare}")
        
        # 4. Save to Database
        # ... (rest of code)
        db_prediction = Prediction(
            ride_type=request.ride_type,
            distance=request.distance,
            time_of_day=request.time_of_day,
            day_type=request.day_type,
            demand_level=request.demand_level,
            traffic_condition=request.traffic_condition,
            weather_condition=request.weather_condition,
            pickup_zone=request.pickup_zone,
            base_fare=round(base_fare, 2),
            surge_multiplier=multiplier,
            final_fare=final_fare
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        return RideResponse(
            base_fare=round(base_fare, 2),
            surge_multiplier=multiplier,
            final_fare=final_fare
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
