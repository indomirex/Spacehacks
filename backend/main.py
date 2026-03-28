from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from ml_model import get_live_earth_engine_data, generate_adaptation_rationale, get_historical_benchmarks
from vision_attention import analyze_satellite_image, analyze_permafrost_imagery
from misinfo_analyzer import analyzer

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

@app.get("/api/permafrost-analysis")
def get_permafrost_analysis():
    """Runs NDVI-proxy attention analysis for permafrost degradation mapping"""
    try:
        data = analyze_permafrost_imagery()
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/climate-data")
def get_climate_data():
    """Returns live ERA5/MODIS satellite data for the European Alps (1984-present)"""
    try:
        historical = get_live_earth_engine_data()
    except Exception:
        historical = get_historical_benchmarks()
        
    rationale = generate_adaptation_rationale(historical)
    return {
        "historical_count": len(historical),
        "full_series": historical,
        "rationale": rationale
    }

@app.get("/api/misinfo-stats")
def get_misinfo_stats():
    """Returns aggregated stats from the climate-fever dataset"""
    try:
        return {"status": "success", "data": analyzer.get_summary_stats()}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/search-misinfo")
def search_misinfo(query: str):
    """Finds top-K similar claims in the dataset via KNN"""
    try:
        results = analyzer.find_similar_claims(query)
        return {"status": "success", "results": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}
