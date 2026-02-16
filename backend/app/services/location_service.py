import os
import requests
import math
from dotenv import load_dotenv

load_dotenv()

ORS_API_KEY = os.getenv("OPENROUTESERVICE_API_KEY", "your_key_here")

def haversine(coord1, coord2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    R = 6371  # Earth radius in km
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2*math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

def get_route_data(pickup: str, drop: str, p_coords: tuple = None, d_coords: tuple = None):
    """
    Fetches distance (km) and duration (min) between two locations.
    Includes validation to prevent unrealistic distances.
    p_coords, d_coords should be (lat, lon) tuples.
    """
    
    # Validation Logic
    if p_coords and d_coords:
        # Check if coordinates are valid numbers
        try:
            p_coords = (float(p_coords[0]), float(p_coords[1]))
            d_coords = (float(d_coords[0]), float(d_coords[1]))
        except (ValueError, TypeError):
             print("DEBUG: Invalid coordinate format")
             # Continue to geocoding fallback if coords are bad
             p_coords = None
             d_coords = None

        if p_coords and d_coords:
            # Calculate straight-line distance
            crow_dist = haversine(p_coords, d_coords)
            print(f"DEBUG: Haversine distance: {crow_dist:.2f} km")
            
            # Sanity Checks
            if crow_dist > 1000:
                print("DEBUG: Distance > 1000km, rejecting.")
                return {"distance": 0, "duration": 0, "error": "Locations too far apart"}
                
            if crow_dist < 0.1:
                print("DEBUG: Distance < 0.1km, rejecting.")
                return {"distance": 0, "duration": 0, "error": "Locations too close"}

    # MOCK DATA FALLBACK (Only for specific known routes if needed)
    mock_routes = {
        ("coimbatore", "pollachi"): {"distance": 42, "duration": 75},
        ("ukkadam", "valparai"): {"distance": 105, "duration": 180},
    }
    p_key = pickup.lower().strip()
    d_key = drop.lower().strip()

    # STRATEGY 1: OpenRouteService (Needs Key)
    if ORS_API_KEY != "your_key_here":
        try:
            headers = {"Authorization": ORS_API_KEY}
            
            start_str = ""
            end_str = ""
            
            # Helper: ORS expects lon,lat for coordinates
            if p_coords:
                start_str = f"{p_coords[1]},{p_coords[0]}"
            else:
                # Geocode
                geo_url = "https://api.openrouteservice.org/geocode/search"
                p_res = requests.get(geo_url, params={"text": pickup}, headers=headers)
                c = p_res.json()['features'][0]['geometry']['coordinates']
                start_str = f"{c[0]},{c[1]}"
                
            if d_coords:
                end_str = f"{d_coords[1]},{d_coords[0]}"
            else:
                d_res = requests.get(geo_url, params={"text": drop}, headers=headers)
                c = d_res.json()['features'][0]['geometry']['coordinates']
                end_str = f"{c[0]},{c[1]}"
            
            # Get Directions
            dir_url = f"https://api.openrouteservice.org/v2/directions/driving-car?start={start_str}&end={end_str}"
            route_res = requests.get(dir_url, headers=headers)
            
            if route_res.status_code == 200:
                data = route_res.json()
                summary = data['features'][0]['properties']['segments'][0]
                return {
                    "distance": round(summary['distance'] / 1000, 1),
                    "duration": round(summary['duration'] / 60, 0)
                }
        except Exception as e:
            print(f"DEBUG: ORS Failed ({e}). Trying OSRM fallback...")

    # STRATEGY 2: OSRM + Nominatim (Free, No Key)
    try:
        print("DEBUG: Attempting Free OSRM + Nominatim Routing...")
        headers = {'User-Agent': 'SmartFarePredictor/1.0'}
        
        # Resolve Coords if missing
        lat1, lon1 = 0.0, 0.0
        lat2, lon2 = 0.0, 0.0
        
        if p_coords:
            lat1, lon1 = p_coords
        else:
            # Fallback Geocoding (Nominatim)
            nom_url = "https://nominatim.openstreetmap.org/search"
            try:
                res = requests.get(nom_url, params={"q": pickup, "format": "json", "limit": 1, "countrycodes": "in"}, headers=headers, timeout=5)
                if not res.ok: raise Exception(f"Geocode API error {res.status_code}")
                data_list = res.json()
                if not data_list: raise Exception(f"Geocode failed for {pickup}")
                data = data_list[0]
                lat1, lon1 = float(data['lat']), float(data['lon'])
            except Exception as e:
                print(f"DEBUG: Geocoding pickup failed: {e}")
                raise e

        if d_coords:
            lat2, lon2 = d_coords
        else:
            nom_url = "https://nominatim.openstreetmap.org/search"
            try:
                res = requests.get(nom_url, params={"q": drop, "format": "json", "limit": 1, "countrycodes": "in"}, headers=headers, timeout=5)
                if not res.ok: raise Exception(f"Geocode API error {res.status_code}")
                data_list = res.json()
                if not data_list: raise Exception(f"Geocode failed for {drop}")
                data = data_list[0]
                lat2, lon2 = float(data['lat']), float(data['lon'])
            except Exception as e:
                 print(f"DEBUG: Geocoding drop failed: {e}")
                 raise e
            
        print(f"DEBUG: OSRM Routing: {lat1},{lon1} -> {lat2},{lon2}")

        # OSRM Routing
        # Endpoint expects: {lon},{lat};{lon},{lat}
        osrm_url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"
        r_res = requests.get(osrm_url, timeout=5)
        
        if not r_res.ok: raise Exception("OSRM Routing failed")
        
        routes = r_res.json().get('routes', [])
        if not routes: raise Exception("No route found by OSRM")
        
        dist_m = routes[0]['distance']
        dur_s = routes[0]['duration']
        
        return {
            "distance": round(dist_m / 1000, 1),
            "duration": round(dur_s / 60, 0)
        }

    except Exception as e:
        print(f"DEBUG: OSRM Failed: {e}")
        
    # STRATEGY 3: Mock Fallback (Last Resort for Demo)
    mock_val = mock_routes.get((p_key, d_key))
    if mock_val: 
        return mock_val
        
    # If everything fails, return basic/default or raise error
    # For safety in demo, return a safe default but log error
    print("DEBUG: All routing failed. Using safe default.")
    return {"distance": 15, "duration": 30, "note": "Estimated due to routing error"}
