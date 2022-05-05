from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import requests


app = FastAPI()

__endpoint = "http://localhost:8501/v1/models/orange-model:predict"
__CLASS_NAMES = ['Alternaria', 'Anthracnose', 'Black_spot', 'Canker', 'Greening', 'Healthy', 'Melanose', 'Scab']


@app.get("/ping")
async def status() -> str:
    return "Server is running"


def __read_file_as_image(data) -> np.ndarray:
    return np.array(Image.open(BytesIO(data)))


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict:
    image_array = __read_file_as_image(await file.read())
    expanded_image = np.expand_dims(image_array, 0)

    json_data = {
        "instances": expanded_image.tolist()
    }

    response = (requests.post(__endpoint, json=json_data)).json()
    prediction = np.array(response["predictions"][0])

    return {
        "class": __CLASS_NAMES[np.argmax(prediction)],
        "confidence": float(np.max(prediction))
    }


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
