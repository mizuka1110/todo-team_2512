import os
import firebase_admin
from firebase_admin import credentials

def init_firebase():
    if firebase_admin._apps:
        print("Firebase already initialized")
        return

    key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
    if not key_path or not os.path.exists(key_path):
        print("Firebase Admin: service account key not found. Skip init.")
        return

    try:
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully")
    except Exception as e:
        print(f"Firebase initialization failed: {e}")
