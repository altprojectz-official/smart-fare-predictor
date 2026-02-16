from fastapi import APIRouter, Query
from datetime import datetime
from app.services.weather_service import get_real_weather
from app.services.traffic_service import get_traffic_condition
from app.services.demand_service import predict_demand

router = APIRouter()

@router.get("/mobility-context")
def get_mobility_context(location: str):
    # 1. Get Time of DayStr
    hour = datetime.now().hour
    time_of_day = "Morning"
    if 12 <= hour < 17:
        time_of_day = "Afternoon"
    elif 17 <= hour < 21:
        time_of_day = "Evening"
    elif hour >= 21 or hour < 6:
        time_of_day = "Night"
        
    day_type = "Weekday" if datetime.now().weekday() < 5 else "Weekend"

    # 2. Get Weather
    weather = get_real_weather(location)
    
    # 3. Get Traffic
    traffic = get_traffic_condition()
    
    # 4. Predict Demand
    demand = predict_demand(time_of_day, day_type, weather)

    return {
        "time_of_day": time_of_day,
        "day_type": day_type,
        "weather": weather,
        "traffic": traffic,
        "demand": demand
    }
