from fastapi import APIRouter, HTTPException, Query
from app.core.routes_data import ROUTES

router = APIRouter()

@router.get("/route-info")
def get_route_info(
    from_loc: str = Query(..., alias="from"), 
    to_loc: str = Query(..., alias="to")
):
    # Normalize inputs
    origin = from_loc.lower().strip()
    dest = to_loc.lower().strip()
    
    # Check direct route
    route = ROUTES.get((origin, dest))
    
    if not route:
        # Try reverse just in case keys are order-specific but we want bidirectional fallback
        # (Though our data file has both)
        raise HTTPException(status_code=404, detail="Route not found in database. Try Coimbatore to Pollachi.")
        
    return route
