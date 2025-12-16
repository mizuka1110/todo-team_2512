# app/firebase_admin.py
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("app/serviceAccountKey.json")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

def verify_firebase_token(token: str) -> dict:
    decoded_token = auth.verify_id_token(token)
    return decoded_token
