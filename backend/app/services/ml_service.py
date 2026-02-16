import joblib
import pandas as pd
import os
import sys

class MLService:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self._load_model()

    def _load_model(self):
        try:
            # Construct absolute paths
            # Assuming this file is at backend/app/services/ml_service.py
            # Models are at backend/ml/
            
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            model_path = os.path.join(base_dir, 'ml', 'model.pkl')
            preprocessor_path = os.path.join(base_dir, 'ml', 'preprocessor.pkl')

            print(f"Loading model from: {model_path}")
            print(f"Loading preprocessor from: {preprocessor_path}")

            if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
                raise FileNotFoundError("Model or preprocessor file not found")

            self.model = joblib.load(model_path)
            self.preprocessor = joblib.load(preprocessor_path)
            print("Model and preprocessor loaded successfully")

        except Exception as e:
            print(f"Error loading ML model: {str(e)}")
            # In production, we might want to handle this more gracefully or fail startup
            # For now, we'll let it fail when predict is called if load failed

    def predict_base_fare(self, ride_data: dict) -> float:
        if not self.model or not self.preprocessor:
            self._load_model()
            if not self.model:
                raise RuntimeError("Model not loaded")

        # Convert simple dict to DataFrame for pipeline
        # Note: We ensure column names match what the model expects
        
        # The model expects columns:
        # 'ride_type', 'time_of_day', 'day_type', 'demand_level', 
        # 'traffic_condition', 'weather_condition', 'pickup_zone', 'distance'
        
        input_data = {
            'ride_type': [ride_data['ride_type']],
            'time_of_day': [ride_data['time_of_day']],
            'day_type': [ride_data['day_type']],
            'demand_level': [ride_data['demand_level']],
            'traffic_condition': [ride_data['traffic_condition']],
            'weather_condition': [ride_data['weather_condition']],
            'pickup_zone': [ride_data['pickup_zone']],
            'distance': [ride_data['distance']]
        }
        
        df = pd.DataFrame(input_data)
        
        # Transform features
        X_processed = self.preprocessor.transform(df)
        
        # Predict
        prediction = self.model.predict(X_processed)
        
        return float(prediction[0])

# Global instance
ml_service = MLService()
