from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# NOTE: models are intentionally NOT imported here. Each model module does
# `from app.db.base import Base`, so importing them from this module would
# create a circular import whenever this module is the first one touched
# (e.g. `python -m app.main`). Anything that needs every model registered on
# Base.metadata (Alembic autogenerate, Base.metadata.create_all() in tests
# and seed.py) should `import app.db.models` explicitly instead.
