import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def detectar_pais(request):
    try:
        # Llamada desde el backend → NO tiene CORS
        res = requests.get("https://ipapi.co/json/")
        data = res.json()

        pais = data.get("country_code", "US")  # fallback seguro

        return JsonResponse({"country": pais})

    except Exception as e:
        print("❌ Error detectando país:", e)
        return JsonResponse({"country": "US"})  # fallback
