from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth

bearer_scheme = HTTPBearer()

def verify_token(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        token = creds.credentials
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

def get_current_firebase_uid(
    decoded_token: dict = Depends(verify_token),
) -> str:
    return decoded_token["uid"]

# from fastapi import HTTPException, Security
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from firebase_admin import auth as firebase_auth

# bearer_scheme = HTTPBearer()

# def verify_token(
#     creds: HTTPAuthorizationCredentials = Security(bearer_scheme),
# ):
#     try:
#         token = creds.credentials  # ← "Bearer xxxx" の xxxx 部分だけ
#         decoded = firebase_auth.verify_id_token(token)
#         return decoded
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid token")

