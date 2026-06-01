from pathlib import Path
from decouple import config
import dj_database_url
import os
import logging

BASE_DIR = Path(__file__).resolve().parent.parent

# ============================
#   KEYS / URLS
# ============================
STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = config("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = config("STRIPE_WEBHOOK_SECRET", default="")

FRONTEND_URL = config("FRONTEND_URL", default="https://abelisse.com")
BACKEND_URL = config("BACKEND_URL", default="https://abelisse-backend.onrender.com")

SECRET_KEY = config("SECRET_KEY", default="inseguro")
DEBUG = config("DEBUG", default="False") == "True"

ALLOWED_HOSTS = ["*"]


# ============================
#   APPS
# ============================
INSTALLED_APPS = [
    'jazzmin',

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
#   JAZZMIN CONFIG
# ============================
JAZZMIN_SETTINGS = {
    "site_title": "ABELISSE Admin",
    "site_header": "ABELISSE",
    "site_brand": "ABELISSE",
    "welcome_sign": "Panel Administrativo de ABELISSE",
    "copyright": "ABELISSE",

    "theme": None,
    "dark_mode_theme": None,

    "site_logo": None,
    "login_logo": None,
    "login_logo_dark": None,

    "show_sidebar": True,
    "navigation_expanded": False,

    "icons": {
        "auth": "fas fa-users",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users-cog",
        "inventario.Producto": "fas fa-box",
        "inventario.Categoria": "fas fa-tags",
        "pagos.Orden": "fas fa-shopping-cart",
    },

    "custom_links": {},
    # Tu archivo está en backend/static/css/custom_admin.css
    "custom_css": "css/custom_admin.css",
    "custom_js": None,
}


# ============================
#   MIDDLEWARE
# ============================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ← OBLIGATORIO AQUÍ
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← DEBE IR DESPUÉS DE CommonMiddleware
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

# IMPORTANTE: aquí le decimos a Django dónde está tu carpeta backend/static
STATICFILES_DIRS = [
    BASE_DIR / "static",  # backend/static
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]


# ============================
#   CORS / CSRF
# ============================
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

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True


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


# ============================
#   DEBUG DE CORS
# ============================
print("=== CORS DEBUG ===")
print("CORS_ALLOWED_ORIGINS:", CORS_ALLOWED_ORIGINS)
print("CORS_ALLOW_ALL_ORIGINS:", CORS_ALLOW_ALL_ORIGINS)
print("CSRF_TRUSTED_ORIGINS:", CSRF_TRUSTED_ORIGINS)
print("===================")
