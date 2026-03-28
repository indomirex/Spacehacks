import ee
import ml_model
import json

if __name__ == "__main__":
    ml_model.init_earth_engine()
    data = ml_model.get_live_earth_engine_data()
    with open("data_dump.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Dumped {len(data)} points.")
