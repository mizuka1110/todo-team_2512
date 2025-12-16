from pathlib import Path
import firebase_admin
from firebase_admin import credentials, auth

# firebase_admin.py と同じフォルダを基準に serviceAccountKey.json を取得
key_path = Path(__file__).resolve().parent / "serviceAccountKey.json"

cred = credentials.Certificate(str(key_path))

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
