from sqlalchemy.orm import Session
from app.models.user import User

def get_or_create_user(
    db: Session,
    firebase_uid: str,
    email: str | None = None,
    name: str | None = None,
):
    user = (
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
        .first()
    )

    if user:
        return user

    user = User(
        firebase_uid=firebase_uid,
        email=email,
        name=name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
