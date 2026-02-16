def predict_demand(time_of_day: str, day_type: str, weather: str):
    """
    Intelligent demand prediction based on context.
    
    Rules:
    - Weekend + Evening = High
    - Rain + Evening = High
    - Business Hours (Morning/Afternoon) + Weekday = Medium
    - Night = Low
    """
    
    # Normalize inputs
    weather = weather.capitalize()
    time_of_day = time_of_day.capitalize()
    day_type = day_type.capitalize()
    
    is_weekend = day_type == "Weekend"
    is_evening = time_of_day == "Evening"
    is_rain = weather in ["Rainy", "Rain"]
    is_night = time_of_day == "Night"
    
    if (is_weekend and is_evening) or (is_rain and is_evening):
        return "High"
        
    if time_of_day in ["Morning", "Afternoon"] and not is_weekend:
        return "Medium"
        
    if is_night:
        return "Low"
        
    # Default fallback
    return "Low"
