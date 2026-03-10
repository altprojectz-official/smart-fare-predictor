import joblib
import pandas as pd
import os
import gc
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        
        # Absolute paths for reliability
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.model_path = os.path.join(self.base_dir, 'ml', 'model.pkl')
        self.preprocessor_path = os.path.join(self.base_dir, 'ml', 'preprocessor.pkl')

    def load_model(self):
        """Load model and preprocessor once at startup."""
        if self.model is None or self.preprocessor is None:
            logger.info("Initializing ML models for the first time...")
            try:
                # Debug: Check if files are actual models or just Git LFS pointers
                model_size = os.path.getsize(self.model_path)
                logger.info(f"Model file size: {model_size} bytes")
                
                if model_size < 1000:
                    with open(self.model_path, 'r') as f:
                        content = f.read(500)
                        logger.error(f"MODEL FILE APPEARS TO BE A POINTER: {content}")
                
                # Load models normally into RAM
                self.model = joblib.load(self.model_path)
                self.preprocessor = joblib.load(self.preprocessor_path)
                
                logger.info("ML components loaded successfully.")
                gc.collect()
            except Exception as e:
                logger.error(f"Critical Error: Failed to load ML components: {str(e)}")
                raise RuntimeError(f"ML engine failed to initialize: {str(e)}")

    def predict_base_fare(self, ride_data: dict) -> float:
        """Prediction using pre-loaded models."""
        if self.model is None or self.preprocessor is None:
            self.load_model()

        # Define exact column order as expected by the preprocessor
        feature_cols = [
            'ride_type', 'time_of_day', 'day_type', 'demand_level', 
            'traffic_condition', 'weather_condition', 'pickup_zone', 'distance'
        ]
        
        # Create single-row DataFrame efficiently
        # Using a list of dictionaries for single row is fast
        df = pd.DataFrame([ride_data], columns=feature_cols)
        
        # Process and Predict
        processed_data = self.preprocessor.transform(df)
        prediction = self.model.predict(processed_data)
        
        # Return serializable float
        result = float(prediction[0])
        
        # Explicitly delete temporary large objects and collect garbage if necessary
        # (Though single row is small, it's good practice for memory-constrained envs)
        del df, processed_data
        
        return result

# Singleton instance exported
ml_service = MLService()
