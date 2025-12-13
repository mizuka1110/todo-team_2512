from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DB URL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://todo_user:todo_pass@todo-mysql:3306/todo_app"

# SQLAlchemy エンジン作成
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True, future=True)

# セッション作成（依存性注入で使用）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base クラス（モデル作成に使用）
Base = declarative_base()
