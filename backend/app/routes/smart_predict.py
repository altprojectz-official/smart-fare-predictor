from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.services.location_service import get_route_data
from app.services.weather_service import get_real_weather
from app.services.traffic_service import estimate_traffic
from app.services.demand_service import predict_demand
from app.services.ml_service import ml_service
from app.services.surge_service import calculate_surge_multiplier, calculate_final_fare
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class SmartPredictRequest(BaseModel):
    pickup: str
    drop: str
    ride_type: str
    pickup_coords: Optional[List[float]] = None # [lat, lon]
    drop_coords: Optional[List[float]] = None   # [lat, lon]

class SmartPredictResponse(BaseModel):
    base_fare: float
    final_fare: float
    surge_multiplier: float
    context: dict
    explanation: dict

@router.post("/smart-predict", response_model=SmartPredictResponse)
async def smart_predict(request: SmartPredictRequest):
    try:
        # 1. Temporal Context (Time & Day)
        now = datetime.now()
        hour = now.hour
        
        time_of_day = "Morning"
        if 12 <= hour < 17: time_of_day = "Afternoon"
        elif 17 <= hour < 21: time_of_day = "Evening"
        elif hour >= 21 or hour < 6: time_of_day = "Night"
        
        day_type = "Weekend" if now.weekday() >= 5 else "Weekday"
        
        # Parse coords if available
        p_coords = tuple(request.pickup_coords) if request.pickup_coords and len(request.pickup_coords) == 2 else None
        d_coords = tuple(request.drop_coords) if request.drop_coords and len(request.drop_coords) == 2 else None

        # 2. Location Context (Distance & Duration)
        # Pass coords to service for accurate routing
        try:
            route_data = get_route_data(request.pickup, request.drop, p_coords, d_coords)
        except Exception as e:
            logger.error(f"Routing failed: {e}")
            # Fallback to simple distance if route service fails completely
            route_data = {"distance": 10, "duration": 15}

        distance = route_data.get('distance', 10)
        duration = route_data.get('duration', 15)
        
        # 3. Environmental Context (Weather)
        # Use coords for weather if available
        if p_coords:
            weather = get_real_weather(lat=p_coords[0], lon=p_coords[1])
        else:
            weather = get_real_weather(location=request.pickup)
        
        # 4. Derived Context (Traffic & Demand)
        traffic = estimate_traffic(duration, distance, time_of_day)
        demand = predict_demand(time_of_day, day_type, weather)
        
        # 5. Prepare ML Payload
        # Mapping for ML model consistency
        ml_traffic = "Light" if traffic == "Low" else traffic
        ml_weather = "Cloudy" if weather == "Foggy" else weather
        ml_ride = "Bike" if request.ride_type.lower() == "bike" else "Taxi"
        
        ml_input = {
            'ride_type': ml_ride,
            'distance': distance,
            'time_of_day': time_of_day,
            'day_type': day_type,
            'demand_level': demand,
            'traffic_condition': ml_traffic,
            'weather_condition': ml_weather,
            'pickup_zone': request.pickup.strip() or "General"
        }
        
        # 6. Prediction
        try:
            base_fare = ml_service.predict_base_fare(ml_input)
        except:
            base_fare = 50 + (distance * 12) # Fallback formula

        multiplier = calculate_surge_multiplier(demand, time_of_day, ml_traffic, ml_weather)
        final_fare = calculate_final_fare(base_fare, multiplier)
        
        return {
            "base_fare": round(base_fare, 2),
            "final_fare": final_fare,
            "surge_multiplier": multiplier,
            "context": {
                "distance_km": distance,
                "duration_min": duration,
                "weather": weather,
                "traffic": traffic,
                "demand": demand,
                "time_of_day": time_of_day,
                "day_type": day_type
            },
            "explanation": {
                "traffic_impact": f"{traffic} traffic",
                "weather_impact": f"{weather} conditions",
                "demand_impact": f"{demand} demand"
            }
        }

    except Exception as e:
        logger.error(f"Smart Predict Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
