import firebase_admin
from firebase_admin import credentials, auth

# ⚠ この JSON は backend だけで使う秘密鍵（リポジトリには基本入れない）
cred = credentials.Certificate("serviceAccountKey.json")

# アプリ全体で1回だけ実行される初期化
firebase_admin.initialize_app(cred)

# 他のファイルから import しやすいように auth をそのまま export しておく
__all__ = ["auth"]