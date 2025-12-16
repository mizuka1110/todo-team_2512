import os
import firebase_admin
from firebase_admin import credentials

def init_firebase():
    if firebase_admin._apps:
        return

    key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

    if not key_path or not os.path.exists(key_path):
        print("Firebase Admin: service account key not found. Skip init.")
        return

    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)


# import firebase_admin
# from firebase_admin import credentials

# def init_firebase():
#     if not firebase_admin._apps:
#         cred = credentials.Certificate(
#             "firebase-service-account.json"
#         )
#         firebase_admin.initialize_app(cred)
