from datetime import datetime

def estimate_traffic(duration_min: float, distance_km: float, time_of_day: str):
    """
    Estimates traffic based on route efficiency and time.
    Avg city speed approx 25-30km/h. 
    If speed < 20km/h -> Heavy.
    """
    
    # Calculate implied speed (km/h)
    if duration_min <= 0: return "Moderate"
    
    hours = duration_min / 60
    speed = distance_km / hours
    
    # Peak hours check based on time string (simple heuristic)
    is_peak = time_of_day in ["Morning", "Evening"]
    
    if speed < 20: 
        return "Heavy"
    elif speed < 35 and is_peak:
        return "Heavy"
    elif speed < 40:
        return "Moderate"
    else:
        return "Low"

def get_traffic_condition():
    """
    Legacy fallback: estimates traffic based purely on time of day.
    """
    hour = datetime.now().hour
    # Peak hours: 8-10 AM and 5-8 PM (17-20)
    if (8 <= hour <= 10) or (17 <= hour <= 20):
        return "Heavy"
    # Moderate hours: 11AM-4PM
    elif (11 <= hour < 17):
        return "Moderate"
    # Low traffic: Early morning / Late night
    return "Low"
