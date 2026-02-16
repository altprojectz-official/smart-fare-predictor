from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.location_service import get_route_data
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class DistanceRequest(BaseModel):
    pickup_city: str
    drop_city: str

class DistanceResponse(BaseModel):
    distance_km: float

@router.post("/get-distance", response_model=DistanceResponse)
def get_distance(request: DistanceRequest):
    try:
        route_data = get_route_data(request.pickup_city, request.drop_city)
        return {"distance_km": route_data['distance']}
    except Exception as e:
        logger.error(f"Distance processing error: {str(e)}")
        # Start of robustness fallback logic if necessary, though location_service handles it.
        # But we must ensure get_route_data returns a dict with 'distance'.
        raise HTTPException(status_code=500, detail="Failed to fetch distance")
