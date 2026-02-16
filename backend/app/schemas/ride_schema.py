from pydantic import BaseModel, Field
from typing import Literal

class RideRequest(BaseModel):
    ride_type: str
    distance: float = Field(..., gt=0, description="Distance in km must be greater than 0")
    time_of_day: str
    day_type: str
    demand_level: str
    traffic_condition: str
    weather_condition: str
    pickup_zone: str

    class Config:
        json_schema_extra = {
            "example": {
                "ride_type": "Taxi",
                "distance": 12.5,
                "time_of_day": "Afternoon",
                "day_type": "Weekday",
                "demand_level": "Medium",
                "traffic_condition": "Moderate",
                "weather_condition": "Clear",
                "pickup_zone": "City Center"
            }
        }

class RideResponse(BaseModel):
    base_fare: float
    surge_multiplier: float
    final_fare: float
