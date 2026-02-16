import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os

# 1. Load Data
# Construct path relative to this script ensuring it works from anywhere
script_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(script_dir, '../data/dynamic_pricing_rides_dataset.csv')

print(f"Loading data from {data_path}...")
try:
    df = pd.read_csv(data_path)
    print(f"Columns in dataset: {df.columns.tolist()}")
    
    # Rename columns to match user requirements
    # Dataset has 'distance_km' and 'final_fare' -> map to 'distance' and 'fare'
    rename_map = {}
    if 'distance_km' in df.columns:
        rename_map['distance_km'] = 'distance'
    if 'final_fare' in df.columns:
        rename_map['final_fare'] = 'fare'
    
    if rename_map:
        print(f"Renaming columns: {rename_map}")
        df.rename(columns=rename_map, inplace=True)
        
except FileNotFoundError:
    print(f"Error: Dataset not found at {data_path}")
    exit(1)

# 2. Define Features and Target
target = 'fare'

categorical_features = [
    'ride_type',
    'time_of_day',
    'day_type',
    'demand_level',
    'traffic_condition',
    'weather_condition',
    'pickup_zone'
]

numerical_features = ['distance']

# Check if columns exist
required_columns = categorical_features + numerical_features + [target]
missing_columns = [col for col in required_columns if col not in df.columns]
if missing_columns:
    print(f"Error: Missing columns in dataset: {missing_columns}")
    exit(1)

X = df[categorical_features + numerical_features]
y = df[target]

# 3. Preprocessing
print("Preprocessing data...")
# Use OneHotEncoder for categorical features and StandardScaler for numerical feature
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ],
    verbose_feature_names_out=False
)

# 4. Model
model = RandomForestRegressor(n_estimators=100, random_state=42)

# 5. Train-Test Split
print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit preprocessor on training data
print("Fitting preprocessor...")
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Train the model
print("Training RandomForestRegressor...")
model.fit(X_train_processed, y_train)

import json

# ... (previous code)

# 6. Evaluation Metrics
print("Evaluating model...")
y_pred = model.predict(X_test_processed)

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print("-" * 30)
print(f"R² Score: {r2:.4f}")
print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print("-" * 30)

# 7. Save Outputs
model_output_path = os.path.join(script_dir, 'model.pkl')
preprocessor_output_path = os.path.join(script_dir, 'preprocessor.pkl')
metrics_output_path = os.path.join(script_dir, 'model_metrics.json')

print(f"Saving model to {model_output_path}...")
joblib.dump(model, model_output_path)

print(f"Saving preprocessor to {preprocessor_output_path}...")
joblib.dump(preprocessor, preprocessor_output_path)

print(f"Saving metrics to {metrics_output_path}...")
metrics_data = {
    "r2_score": round(r2, 4),
    "mae": round(mae, 4),
    "rmse": round(rmse, 4)
}
with open(metrics_output_path, 'w') as f:
    json.dump(metrics_data, f, indent=4)

print("Training pipeline completed successfully.")
