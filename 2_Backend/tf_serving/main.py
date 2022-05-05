from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = ["http://localhost", "http://localhost:8000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#

__MODEL = tf.keras.models.load_model("../models/1")
__CLASS_NAMES = ['Alternaria','Anthracnose','Black_spot','Canker','Greening','Healthy','Melanose','Scab']



def __read_file_as_image(data) -> np.ndarray:
    return np.array(Image.open(BytesIO(data)))


@app.post("/predict")
async def predict(file: UploadFile=File(...)) -> dict:
    """ UploadFile ensures a file will be supplied as input """
    image = __read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    prediction = __MODEL.predict(img_batch)

    return {
        'class': __CLASS_NAMES[np.argmax(prediction[0])],
        'confidence': float(np.max(prediction[0]))
    }


@app.get("/ping")
async def status() -> str:
    return "Server is running"


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

