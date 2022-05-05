from google.cloud.storage import Client
import tensorflow as tf
from PIL import Image
import numpy as np


# gcloud functions deploy predict --runtime python38 --trigger-http --memory 512 --project orange-disease-predictor
# gcloud functions deploy predict --source=. --project orange-disease-predictor

__PROJECT_ID = "orange-disease-predictor"
__BUCKET_NAME = "orange-disease-predictor-bucket-1"
__CLASS_NAMES = ['Alternaria', 'Anthracnose', 'Black_spot', 'Canker', 'Greening', 'Healthy', 'Melanose', 'Scab']
__VERSION = "1.h5"
__MODEL = None


def download_blob(project_name, bucket_name, model_blob, tmp_file):
    storage = Client(project_name)
    bucket = storage.get_bucket(bucket_name)
    blob = bucket.blob(model_blob)
    blob.download_to_filename(tmp_file)


def predict(request) -> str:
    global __MODEL
    if __MODEL is None:
        download_blob(__PROJECT_ID, __BUCKET_NAME, "models/"+__VERSION, "/tmp/"+__VERSION)
        __MODEL = tf.keras.models.load_model("/tmp/"+__VERSION)

    image = request.files["file"]
    np_image = np.array(Image.open(image).convert("RGB").resize((256,256)))/255
    np_image_expanded = tf.expand_dims(np_image, 0)

    prediction = __MODEL.predict(np_image_expanded)[0]
    img_class = __CLASS_NAMES[np.argmax(prediction)]
    class_conf = round(float(np.max(prediction)), 3)

    return 'class: {}, confidence: {}'.format(img_class, class_conf)
