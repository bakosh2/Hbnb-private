import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    DEBUG = False

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///app.db'
    )

    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default_jwt_secret_key')
    # Token lifetimes (use seconds or timedelta)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_HOURS', '1')))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv('JWT_REFRESH_DAYS', '7')))
    # Optional: allow disabling token expiry for tests (not recommended in prod)
    JWT_ACCESS_TOKEN_EXPIRES_DISABLE = os.getenv('JWT_ACCESS_EXPIRES_DISABLE', 'false').lower() == 'true'


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DEV_DATABASE_URL',
        'sqlite:///dev.db'
    )


config = {
    'development': DevelopmentConfig,
    'default': DevelopmentConfig
}
