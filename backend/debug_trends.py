import ee
import ml_model

if __name__ == "__main__":
    ml_model.init_earth_engine()
    data = ml_model.get_live_earth_engine_data()
    print(f"Total points: {len(data)}")
    for d in data:
        print(f"Year: {d['year']}, Temp: {d['temp']}, Snow: {d['snow_cover']}")
