import os
import warnings
import json
import time
import numpy as np
import librosa
import tensorflow as tf
import joblib
from fastapi import FastAPI, UploadFile, File

# Suppress TensorFlow logs and warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0 = ALL, 1 = INFO, 2 = WARNING, 3 = ERROR
warnings.simplefilter(action='ignore', category=FutureWarning)

# Initialize FastAPI app
app = FastAPI()

RESULT_DIR = "./result"
os.makedirs(RESULT_DIR, exist_ok=True)

# Feature extraction function for audio files
def extract_feature(file_name):
    X, sample_rate = librosa.load(file_name, sr=None)
    if X.ndim > 1:
        X = X[:, 0]
    X = X.T
    stft = np.abs(librosa.stft(X))
    mfccs = librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40)
    chroma = librosa.feature.chroma_stft(S=stft, sr=sample_rate)
    mel = librosa.feature.melspectrogram(y=X, sr=sample_rate)
    contrast = librosa.feature.spectral_contrast(S=stft, sr=sample_rate)
    tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(X), sr=sample_rate)
    features = np.vstack([mfccs, chroma, mel, contrast, tonnetz]).T
    return features

@app.post("/predict")
async def predict(
    result_file: UploadFile = File(...),
    model_file: UploadFile = File(...),
    audio_file: UploadFile = File(...)
):
    # Save uploaded files
    result_path = os.path.join(RESULT_DIR, "metadata.json")
    model_path = os.path.join(RESULT_DIR, model_file.filename)
    audio_path = os.path.join(RESULT_DIR, audio_file.filename)
    
    with open(result_path, "wb") as f:
        f.write(await result_file.read())
    with open(model_path, "wb") as f:
        f.write(await model_file.read())
    with open(audio_path, "wb") as f:
        f.write(await audio_file.read())

    # Load metadata to get class names
    with open(result_path, "r") as f:
        data = json.load(f)
    class_names = data.get("class", [])

    # Load the model based on the file extension
    if model_path.endswith(".h5"):
        model = tf.keras.models.load_model(model_path)
    elif model_path.endswith(".pkl"):
        model = joblib.load(model_path)
    else:
        return {"error": "Unsupported model format. Use .h5 for TensorFlow or .pkl for other models."}

    # Extract features from the uploaded audio
    feature = extract_feature(audio_path)
    prediction = model.predict(np.array([feature]))
    probalitie = prediction[0]
    
    # Calculate probabilities
    probalities_classes = [round(100 * prob, 2) for prob in probalitie]

    # Get the predicted class
    predicted_class = class_names[np.argmax(probalitie)] if class_names else "Unknown"
    
    # Prepare results
    timestr = time.strftime("%Y%m%d-%H%M%S", time.gmtime(time.time()))
    results_file = os.path.join(RESULT_DIR, f"predicted_results_{timestr}.json")
    results = {
        "created": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time())),
        "probability": probalities_classes,
        "modelclass": class_names,
        "predicted_class": predicted_class
    }

    return {
        "message": "Prediction completed.",
        "results": results
    }

