import os
import sys
import json
import time
import warnings
import numpy as np
import pandas as pd
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File

warnings.simplefilter(action='ignore', category=FutureWarning)

app = FastAPI()

RESULT_DIR = "./result"
os.makedirs(RESULT_DIR, exist_ok=True)

def create_windows(data, time_step=1, step=1):
    Xs = []
    total_steps = len(data) - time_step
    last_percent_reported = None

    for i in range(0, len(data) - time_step, step):
        features = data[i:i+time_step]
        Xs.append(features)
        percent_complete = int((i / total_steps) * 100)
        if percent_complete != last_percent_reported:
            print(f"\rProgress: {percent_complete}%", end="")
            last_percent_reported = percent_complete
    print("\nCreation of windows complete.")
    return np.array(Xs)

@app.post("/predict")
async def predict(
    result_file: UploadFile = File(...),
    model_file: UploadFile = File(...),
    csv_file: UploadFile = File(...)
):
    result_path = os.path.join(RESULT_DIR, "metadata.json")
    model_path = os.path.join(RESULT_DIR, "model.h5")
    csv_path = os.path.join(RESULT_DIR, csv_file.filename)
    
    with open(result_path, "wb") as f:
        f.write(await result_file.read())
    with open(model_path, "wb") as f:
        f.write(await model_file.read())
    with open(csv_path, "wb") as f:
        f.write(await csv_file.read())

    with open(result_path, "r") as f:
        data = json.load(f)
    window_size = data["window_size"]
    step = data["step_size"]
    class_names = data["class"]

    df = pd.read_csv(csv_path)
    df.set_index(["datetime"], inplace=True)
    X = df.select_dtypes(include=["number"])

    model = tf.keras.models.load_model(model_path)
    features = create_windows(X, window_size, step)
    predictions = model.predict(features)

    probabilities_classes = []
    for i in range(len(predictions)):
        instance_probs = [round(100 * predictions[i][j], 2) for j in range(len(class_names))]
        probabilities_classes.append(instance_probs)

    timestr = time.strftime("%Y%m%d-%H%M%S", time.gmtime(time.time()))
    #results_file = os.path.join(RESULT_DIR, f"predicted_results_{timestr}.json")
    results = {
        "created": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time())),
        "probability": probabilities_classes,
        "modelclass": class_names
    }

    return {"message": "Prediction completed.", "results": results}

