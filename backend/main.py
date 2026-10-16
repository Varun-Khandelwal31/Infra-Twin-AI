from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import logging

from pipeline import calculate_volumetric_metrics
from rag_engine import generate_rag_boq

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("InfraTwinAI-API")

app = FastAPI(
    title="InfraTwin AI Volumetric Pipeline Service",
    description="YOLOv8-Seg Instance Segmentation & Monocular Depth Anything Estimation API for Road Distress Volume & BOQ Calculation",
    version="1.0.0"
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VolumeRequest(BaseModel):
    area_pixels: float
    avg_depth_pixels: float
    drone_altitude_m: Optional[float] = 12.5
    camera_fov_deg: Optional[float] = 84.0

class RAGBOQRequest(BaseModel):
    volume_m3: float = 0.375
    distress_area_sqm: Optional[float] = 2.5
    max_depth_cm: Optional[float] = 15.0
    road_name: Optional[str] = "Outer Ring Road Stretch"
    prompt: Optional[str] = ""

@app.get("/")
def read_root():
    return {
        "service": "InfraTwin AI Volumetric Core Engine",
        "status": "online",
        "segmentation_model": "YOLOv8-Seg (yolov8n-seg.pt)",
        "depth_estimation_model": "Depth Anything (LiheYoung/depth-anything-small-hf)",
        "rag_vector_db": "ChromaDB / LangChain IRC 83 & IRC 82 Knowledge Base",
        "supported_irc_standards": ["IRC:83", "IRC:82-2023", "IRC:37-2018", "MoRTH Section 3000"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "engine": "active"}

@app.post("/api/v1/inspect")
async def inspect_pothole_image(
    file: UploadFile = File(...),
    drone_altitude_m: float = Query(12.5, description="Drone flight altitude in meters"),
    camera_fov_deg: float = Query(84.0, description="Camera diagonal field-of-view in degrees")
):
    """
    Receives drone inspection image, runs YOLOv8-Seg instance segmentation mask
    and Depth Anything monocular estimation, returning exact 3D metrics & BOQ context.
    """
    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file uploaded")
            
        result = calculate_volumetric_metrics(
            image_bytes=image_bytes,
            drone_altitude_m=drone_altitude_m,
            camera_fov_deg=camera_fov_deg
        )
        return result
    except Exception as e:
        logger.error(f"Inspection error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/copilot/generate-boq")
def generate_copilot_boq(req: RAGBOQRequest):
    """
    RAG BOQ Endpoint: Accepts volume (m³), area, depth, and road name,
    queries IRC 83 vector store, and returns grounded Llama-3 BOQ.
    """
    try:
        result = generate_rag_boq(
            volume_m3=req.volume_m3,
            distress_area_sqm=req.distress_area_sqm or 2.5,
            max_depth_cm=req.max_depth_cm or 15.0,
            road_name=req.road_name or "Outer Ring Road Stretch",
            user_prompt=req.prompt or ""
        )
        return result
    except Exception as e:
        logger.error(f"RAG BOQ generation error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/compute-volume")
def compute_volume_direct(req: VolumeRequest):
    """
    Direct volume formula endpoint:
    volume_m3 = scale_area * area_pixels * scale_depth * avg_depth_pixels
    """
    import math
    fov_rad = math.radians(req.camera_fov_deg)
    ground_width_m = 2.0 * req.drone_altitude_m * math.tan(fov_rad / 2.0)
    scale_area = (ground_width_m / 600.0) ** 2 # assuming 600px width reference
    scale_depth = 0.01 # convert cm to meters
    
    volume_m3 = scale_area * req.area_pixels * scale_depth * req.avg_depth_pixels
    return {
        "area_pixels": req.area_pixels,
        "avg_depth_pixels": req.avg_depth_pixels,
        "volume_m3": round(volume_m3, 3)
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
