from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from ml_model import get_live_earth_engine_data, predict_future_climate, generate_adaptation_rationale
from vision_attention import analyze_satellite_image

app = FastAPI(title="Alpine Climate Dashboard API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Alpine Climate Dashboard API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/spatial-analysis")
def get_spatial_analysis():
    """Runs Vision Transformer against satellite data and returns b64 images"""
    try:
        data = analyze_satellite_image()
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/climate-data")
def get_climate_data():
    """Returns historical Landsat data and 10-year Transformer predictions"""
    historical = get_live_earth_engine_data()
    future = predict_future_climate(historical, years_to_predict=10)
    
    dynamic_rationale = generate_adaptation_rationale(historical + future["predictions"])
    
    # Combine data for full time-series chart
    full_series = historical + future["predictions"]
    
    return {
        "historical_count": len(historical),
        "prediction_count": len(future["predictions"]),
        "full_series": full_series,
        "rationale": dynamic_rationale
    }
