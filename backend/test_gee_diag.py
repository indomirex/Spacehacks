import ml_model
import sys

try:
    print("Testing GEE Pure Evidence Pipeline...")
    data = ml_model.get_live_earth_engine_data()
    if data:
        print(f"Fetch Successful: {data[-1]}")
    else:
        print("Fetch returned empty data.")
except Exception as e:
    print(f"Exception during fetch: {e}")
    import traceback
    traceback.print_exc()
