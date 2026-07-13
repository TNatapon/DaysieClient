import os
import sys
import json
import time
import warnings
import numpy as np
import tensorflow as tf
import joblib
from fastapi import FastAPI, UploadFile, File
from tensorflow.keras.utils import load_img, img_to_array

warnings.simplefilter(action='ignore', category=FutureWarning)

app = FastAPI()

RESULT_DIR = "./result"
os.makedirs(RESULT_DIR, exist_ok=True)

def prepare_image(file, target_size):
    img = load_img(file, target_size=target_size)
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.post("/predict")
async def predict(
    result_file: UploadFile = File(...),
    model_file: UploadFile = File(...),
    image_file: UploadFile = File(...)
):
    result_path = os.path.join(RESULT_DIR, "metadata.json")
    model_path = os.path.join(RESULT_DIR, model_file.filename)
    image_path = os.path.join(RESULT_DIR, image_file.filename)
    
    with open(result_path, "wb") as f:
        f.write(await result_file.read())
    with open(model_path, "wb") as f:
        f.write(await model_file.read())
    with open(image_path, "wb") as f:
        f.write(await image_file.read())

    with open(result_path, "r") as f:
        data = json.load(f)
    class_names = data.get("class", [])
    img_size = tuple(data.get("image_size", [224, 224]))

    # Detect model type and load accordingly
    if model_path.endswith(".h5"):
        model = tf.keras.models.load_model(model_path)
    elif model_path.endswith(".pkl"):
        model = joblib.load(model_path)
    else:
        return {"error": "Unsupported model format. Use .h5 or .pkl"}

    preprocessed_image = prepare_image(image_path, img_size)
    predictions = model.predict(preprocessed_image)

    probabilities_classes = [round(100 * prob, 2) for prob in predictions[0]]
    predicted_class = class_names[np.argmax(predictions[0])] if class_names else "Unknown"
    
    timestr = time.strftime("%Y%m%d-%H%M%S", time.gmtime(time.time()))
    results_file = os.path.join(RESULT_DIR, f"predicted_results_{timestr}.json")
    results = {
        "created": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time())),
        "probability": probabilities_classes,
        "modelclass": class_names,
        "predicted_class": predicted_class
    }

    return {
        "message": "Prediction completed.",
        "results": results
    }

