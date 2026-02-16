from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.prediction import Prediction
import pandas as pd
import numpy as np
import os
import joblib

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_demand_trend(self):
        # Average fare per demand level
        results = self.db.query(
            Prediction.demand_level, 
            func.avg(Prediction.final_fare).label('avg_fare')
        ).group_by(Prediction.demand_level).all()
        
        return [{"demand_level": r.demand_level, "avg_fare": round(r.avg_fare, 2)} for r in results]

    def get_time_price_trend(self):
        # Average fare per time of day
        results = self.db.query(
            Prediction.time_of_day, 
            func.avg(Prediction.final_fare).label('avg_fare')
        ).group_by(Prediction.time_of_day).all()
        
        # Sort order roughly
        order = {"Morning": 1, "Afternoon": 2, "Evening": 3, "Night": 4}
        data = [{"time_of_day": r.time_of_day, "avg_fare": round(r.avg_fare, 2)} for r in results]
        data.sort(key=lambda x: order.get(x['time_of_day'], 100))
        return data

    def get_ride_distribution(self):
        # Count of rides by type
        results = self.db.query(
            Prediction.ride_type, 
            func.count(Prediction.id).label('count')
        ).group_by(Prediction.ride_type).all()
        
        return [{"ride_type": r.ride_type, "count": r.count} for r in results]

    def get_model_metrics(self):
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            metrics_path = os.path.join(base_dir, 'ml', 'model_metrics.json')
            
            if os.path.exists(metrics_path):
                import json
                with open(metrics_path, 'r') as f:
                    return json.load(f)
        except Exception:
            pass
            
        # Fallback if file not found or error
        return {
            "r2_score": 0.0,
            "mae": 0.0,
            "rmse": 0.0
        }
