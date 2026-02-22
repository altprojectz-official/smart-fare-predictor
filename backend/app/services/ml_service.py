import joblib
import numpy as np
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

    def _load_resources(self):
        """Lazy load model and preprocessor with memory management."""
        if self.model is None or self.preprocessor is None:
            logger.info("Initializing lazy load of ML components...")
            try:
                # mmap_mode="r" allows reading large files without loading entire content into RAM
                # This is highly dependent on the model structure but very useful for Free Tiers
                self.model = joblib.load(self.model_path, mmap_mode="r")
                self.preprocessor = joblib.load(self.preprocessor_path)
                
                logger.info("ML components loaded successfully.")
                
                # Proactive garbage collection to free any buffers used during load
                gc.collect()
            except Exception as e:
                logger.error(f"Failed to load ML components: {str(e)}")
                raise RuntimeError("Service temporarily unavailable due to ML engine failure.")

    def predict_base_fare(self, ride_data: dict) -> float:
        """Prediction using minimal memory footprint."""
        self._load_resources()

        # Optimize: Avoid Pandas if possible. 
        # However, ColumnTransformer usually requires a DataFrame or specific layout.
        # We use a small local import to keep startup memory low.
        import pandas as pd
        
        # Define exact column order as expected by the preprocessor
        feature_cols = [
            'ride_type', 'time_of_day', 'day_type', 'demand_level', 
            'traffic_condition', 'weather_condition', 'pickup_zone', 'distance'
        ]
        
        # Create single-row DataFrame efficiently
        df = pd.DataFrame([ride_data], columns=feature_cols)
        
        # Process and Predict
        processed_data = self.preprocessor.transform(df)
        prediction = self.model.predict(processed_data)
        
        # Return serializable float
        result = float(prediction[0])
        
        # OPTIONAL: Clear data if needed, though single row is negligible
        del df, processed_data
        
        return result

# Singleton instance exported
ml_service = MLService()
