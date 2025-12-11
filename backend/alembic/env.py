# from logging.config import fileConfig
# from sqlalchemy import engine_from_config, pool
# from alembic import context

# import os
# import sys

# # === /app を PATH に追加 ===
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# # === models を読み込む（順番重要） ===
# from app.models.base import Base
# import app.models.user  # ← class User が Base.metadata に登録される
# import app.models.task  # ← class Task も登録される

# # Alembic にメタデータを渡す
# target_metadata = Base.metadata

# # Alembic の既存設定
# config = context.config
# if config.config_file_name is not None:
#     fileConfig(config.config_file_name)


# def run_migrations_offline():
#     """Offline mode."""
#     url = config.get_main_option("sqlalchemy.url")
#     context.configure(
#         url=url,
#         target_metadata=target_metadata,
#         literal_binds=True,
#         dialect_opts={"paramstyle": "named"},
#     )

#     with context.begin_transaction():
#         context.run_migrations()


# def run_migrations_online():
#     """Online mode."""
#     connectable = engine_from_config(
#         config.get_section(config.config_ini_section),
#         prefix="sqlalchemy.",
#         poolclass=pool.NullPool,
#     )

#     with connectable.connect() as connection:
#         context.configure(
#             connection=connection,
#             target_metadata=target_metadata
#         )

#         with context.begin_transaction():
#             context.run_migrations()


# if context.is_offline_mode():
#     run_migrations_offline()
# else:
#     run_migrations_online()

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

import sys
import os
# /app をパスに追加
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from app.models.base import Base
from app.models.user import User
from app.models.task import Task

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

