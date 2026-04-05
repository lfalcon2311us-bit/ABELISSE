import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def detectar_pais(request):
    try:
        res = requests.get("https://ipwho.is/")
        data = res.json()

        pais = data.get("country_code", "US")

        return JsonResponse({"country": pais})

    except Exception as e:
        print("❌ Error detectando país:", e)
        return JsonResponse({"country": "US"})
