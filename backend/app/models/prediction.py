from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
from datetime import datetime

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    ride_type = Column(String, index=True)
    distance = Column(Float)
    time_of_day = Column(String)
    day_type = Column(String)
    demand_level = Column(String)
    traffic_condition = Column(String)
    weather_condition = Column(String)
    pickup_zone = Column(String)
    
    base_fare = Column(Float)
    surge_multiplier = Column(Float)
    final_fare = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
