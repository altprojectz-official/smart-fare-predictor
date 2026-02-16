import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY", "your_key_here")

def get_real_weather(location: str = None, lat: float = None, lon: float = None):
    """
    Fetches real weather for a location string OR lat/lon coordinates.
    """
    
    if API_KEY == "your_key_here":
        print(f"Using mock weather (No API Key)")
        return "Clear"

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"appid": API_KEY, "units": "metric"}

    if lat is not None and lon is not None:
        params["lat"] = lat
        params["lon"] = lon
    elif location:
        params["q"] = location
    else:
        return "Clear"
    
    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            main_weather = data['weather'][0]['main'].lower()
            
            # Smart Mapping: API -> ML Model Categories
            if "rain" in main_weather or "drizzle" in main_weather or "thunderstorm" in main_weather:
                return "Rainy"
            elif "cloud" in main_weather or "mist" in main_weather or "fog" in main_weather or "haze" in main_weather:
                return "Foggy" 
            elif "clear" in main_weather or "sun" in main_weather:
                return "Clear"
            else:
                return "Clear"
                
        return "Clear"
    except Exception as e:
        print(f"Weather API error: {e}")
        return "Clear"
