from pathlib import Path
from decouple import config
import dj_database_url
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ============================
#   KEYS / URLS
# ============================
STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = config("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = config("STRIPE_WEBHOOK_SECRET", default="")

FRONTEND_URL = config("FRONTEND_URL", default="https://abelisse.com")
BACKEND_URL = config("BACKEND_URL", default="https://abelisse-backend.onrender.com")

# ⭐ AGREGAR ESTO (FALTABA)
PAYPAL_CLIENT_ID = config("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = config("PAYPAL_SECRET")

SECRET_KEY = config("SECRET_KEY", default="inseguro")
DEBUG = config("DEBUG", default="False") == "True"

ALLOWED_HOSTS = ["*"]

# ============================
#   APPS
# ============================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',

    'comunidad',
    'inventario',
    'pagos',
]

# ============================
#   MIDDLEWARE
# ============================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'abelisse.urls'

# ============================
#   TEMPLATES
# ============================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'abelisse.wsgi.application'

# ============================
#   BASE DE DATOS
# ============================
DATABASES = {
    'default': dj_database_url.config(
        default=config("DATABASE_URL", default="sqlite:///db.sqlite3"),
        conn_max_age=600,
        ssl_require=False
    )
}

# ============================
#   PASSWORDS
# ============================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================
#   INTERNACIONALIZACIÓN
# ============================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ============================
#   STATIC FILES
# ============================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

# ============================
#   CORS / CSRF
# ============================
CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "https://abelisse.com",
    "https://www.abelisse.com",
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "https://abelisse.com",
    "https://www.abelisse.com",
    "https://abelisse-backend.onrender.com",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

# ============================
#   LOGGING
# ============================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {"handlers": ["console"], "level": "ERROR"},
}
