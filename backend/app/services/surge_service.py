def calculate_surge_multiplier(
    demand_level: str,
    time_of_day: str,
    traffic_condition: str,
    weather_condition: str
) -> float:
    """
    Calculate surge multiplier based on ride conditions.
    
    Base multiplier is 1.0.
    Additions:
    - High Demand: +0.20
    - Peak Time: +0.15 (Assuming 'Morning' or 'Evening' implies peak, or based on specific logic. 
      For this step, let's strictly follow the simple rule: if time_of_day implies peak, but the prompt says 'Peak Time' 
      which isn't a direct field value, we'll infer it or simpler: just stick to the prompt's implied logic mapping if possible.
      However, the prompt says "Time of Day" as a categorical feature with values like Morning, Evening etc.
      We will assume 'Morning' and 'Evening' might be peak, but let's look at the mapping logic requested:
      
      Condition	Increase
      High Demand	+20%
      Peak Time	+15%
      Heavy Traffic	+10%
      Bad Weather	+8%
      
      We need to map the input strings to these conditions.
    """
    
    multiplier = 1.0
    
    # 1. Demand Level
    # Assuming 'High' or 'Very High' counts as High Demand
    if demand_level in ['High', 'Very High']:
        multiplier += 0.20
        
    # 2. Peak Time
    # Usually Morning (rush hour) and Evening (rush hour)
    if time_of_day in ['Morning', 'Evening']:
        multiplier += 0.15
        
    # 3. Traffic Condition
    if traffic_condition in ['Heavy', 'Jam']: # Assuming 'Jam' might exist, but 'Heavy' is standard
        multiplier += 0.10
        
    # 4. Weather Condition
    if weather_condition in ['Rainy', 'Stormy', 'Snow', 'Bad', 'Storm']:
        multiplier += 0.08
        
    return round(multiplier, 2)

def calculate_final_fare(base_fare: float, multiplier: float) -> float:
    return round(base_fare * multiplier, 2)
