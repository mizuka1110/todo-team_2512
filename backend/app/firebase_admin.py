from pathlib import Path
import firebase_admin
from firebase_admin import credentials

# firebase_admin.py と同じフォルダ（= backend/app/）を基準に探す
key_path = Path(__file__).resolve().parent / "serviceAccountKey.json"

print("KEY_PATH:", key_path)
print("KEY_FIRST16:", open(key_path, "rb").read(16))

cred = credentials.Certificate(str(key_path))

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
