from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Suscripcion
from .serializers import SuscripcionSerializer

@api_view(['GET', 'POST'])
def suscribirse(request):

    # Respuesta para GET (cuando entras desde el navegador)
    if request.method == 'GET':
        return Response({'message': 'API de Suscripción funcionando correctamente.'})

    # Manejo del POST (cuando envías un email)
    serializer = SuscripcionSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']

        # Evitar duplicados
        if Suscripcion.objects.filter(email=email).exists():
            return Response(
                {'message': 'Este correo ya está registrado.'},
                status=status.HTTP_200_OK
            )

        serializer.save()
        return Response(
            {'message': 'Gracias por unirte a la comunidad Abelisse 💖'},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
