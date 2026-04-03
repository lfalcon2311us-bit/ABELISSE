from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db import models

from pagos.models import Orden
from inventario.models import Producto


class EstadisticasView(APIView):
    def get(self, request):
        hoy = timezone.now().date()
        inicio_semana = hoy - timedelta(days=hoy.weekday())
        inicio_mes = hoy.replace(day=1)

        # -----------------------------
        # VENTAS
        # -----------------------------
        ventas_dia = Orden.objects.filter(
            fecha__date=hoy,
            estado="COMPLETADA"
        ).aggregate(total=models.Sum("monto"))["total"] or 0

        ventas_semana = Orden.objects.filter(
            fecha__date__gte=inicio_semana,
            estado="COMPLETADA"
        ).aggregate(total=models.Sum("monto"))["total"] or 0

        ventas_mes = Orden.objects.filter(
            fecha__date__gte=inicio_mes,
            estado="COMPLETADA"
        ).aggregate(total=models.Sum("monto"))["total"] or 0

        ventas_por_metodo = {
            "stripe": Orden.objects.filter(metodo="stripe", estado="COMPLETADA").aggregate(total=models.Sum("monto"))["total"] or 0,
            "paypal": Orden.objects.filter(metodo="paypal", estado="COMPLETADA").aggregate(total=models.Sum("monto"))["total"] or 0,
            "yape": Orden.objects.filter(metodo="yape", estado="COMPLETADA").aggregate(total=models.Sum("monto"))["total"] or 0,
        }

        ultimas_ordenes = Orden.objects.order_by("-fecha")[:10].values(
            "id", "nombre", "email", "monto", "metodo", "estado", "fecha"
        )

        total_ventas = Orden.objects.filter(estado="COMPLETADA").aggregate(total=models.Sum("monto"))["total"] or 0
        total_ordenes = Orden.objects.filter(estado="COMPLETADA").count()
        ticket_promedio = total_ventas / total_ordenes if total_ordenes > 0 else 0

        # -----------------------------
        # PRODUCTOS
        # -----------------------------
        productos_mas_vendidos = Producto.objects.order_by("-ventas_totales")[:5].values(
            "id", "nombre", "ventas_totales", "precio"
        )

        inventario_bajo = Producto.objects.filter(stock__lt=5).values(
            "id", "nombre", "stock"
        )

        # -----------------------------
        # COMUNIDAD (SIN MODELO)
        # -----------------------------
        nuevos_suscriptores_dia = 0
        nuevos_suscriptores_semana = 0
        nuevos_suscriptores_mes = 0
        total_suscriptores = 0

        # -----------------------------
        # CONVERSIÓN
        # -----------------------------
        checkouts_iniciados = Orden.objects.count()
        checkouts_completados = Orden.objects.filter(estado="COMPLETADA").count()

        tasa_conversion = (
            (checkouts_completados / checkouts_iniciados) * 100
            if checkouts_iniciados > 0 else 0
        )

        return Response({
            "ventas": {
                "dia": ventas_dia,
                "semana": ventas_semana,
                "mes": ventas_mes,
                "por_metodo": ventas_por_metodo,
                "ultimas_ordenes": list(ultimas_ordenes),
                "ticket_promedio": ticket_promedio,
            },
            "productos": {
                "mas_vendidos": list(productos_mas_vendidos),
                "inventario_bajo": list(inventario_bajo),
            },
            "comunidad": {
                "nuevos_dia": nuevos_suscriptores_dia,
                "nuevos_semana": nuevos_suscriptores_semana,
                "nuevos_mes": nuevos_suscriptores_mes,
                "total": total_suscriptores,
            },
            "conversion": {
                "checkouts_iniciados": checkouts_iniciados,
                "checkouts_completados": checkouts_completados,
                "tasa_conversion": tasa_conversion,
            }
        })
