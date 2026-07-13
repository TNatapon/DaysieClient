import os
import json
import time
import warnings
import numpy as np
import pandas as pd
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, Form
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

warnings.simplefilter(action='ignore', category=FutureWarning)

app = FastAPI()

RESULT_DIR = "./result"
os.makedirs(RESULT_DIR, exist_ok=True)

def create_windows(data, target, time_step=1, step=1):
    Xs, ys = [], []
    for i in range(0, len(data) - time_step, step):
        Xs.append(data[i:i+time_step])
        ys.append(target[i+time_step])
    return np.array(Xs), np.array(ys)

@app.post("/predict")
async def predict(
    metadata_file: UploadFile = File(...),
    model_file: UploadFile = File(...),
    csv_file: UploadFile = File(...),
):
    """Predict output based on uploaded CSV data and a trained TensorFlow model."""
    # Load parameters from JSON result file
    result_data = json.loads(await metadata_file.read())
    window_size = result_data["window_size"]
    step = result_data["step_size"]

    # Read CSV data
    df = pd.read_csv(csv_file.file)
    df = df.sort_values(by=["datetime"], ignore_index=True)
    df.set_index(["datetime"], inplace=True)

    # Prepare data for prediction
    output_col = "label"
    X = df.drop(columns=[output_col], axis=1).select_dtypes(include=["number"])
    y = df[output_col].values
    
    # Load the trained TensorFlow model
    model_path = os.path.join(RESULT_DIR, model_file.filename)
    with open(model_path, "wb") as f:
        f.write(await model_file.read())
    model = tf.keras.models.load_model(model_path)

    features, labels = create_windows(X, y, window_size, step)
    predictions = model.predict(features)

    # Compute metrics
    mse = mean_squared_error(labels, predictions)
    mae = mean_absolute_error(labels, predictions)
    r2 = r2_score(labels, predictions)
    
    # Save results
    timestr = time.strftime("%Y%m%d-%H%M%S", time.gmtime())
    results_filename = os.path.join(RESULT_DIR, f"predicted_results.csv")
    results_df = pd.DataFrame({
        "datetime": df.index[window_size:window_size + len(predictions)],
        "True_Label": labels.flatten(),
        "Predicted_Label": predictions.flatten()
    })
    results_df.to_csv(results_filename, index=False)
    
    return {
        "created": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()),
        "mse": mse,
        "mae": mae,
        "r2_score": r2
    }

