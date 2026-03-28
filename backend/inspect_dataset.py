from datasets import load_dataset
import pandas as pd
import os

try:
    print("Loading climate_fever dataset...")
    # climate_fever usually only has a 'test' split in the standard HF version
    dataset = load_dataset("climate_fever", split="test") 
    df = pd.DataFrame(dataset)
    print("Columns:", df.columns.tolist())
    print("\nSample Data (first 2 rows):")
    print(df.head(2).to_dict('records'))
except Exception as e:
    print(f"Error: {e}")
