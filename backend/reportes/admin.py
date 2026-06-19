from django.contrib import admin
from django.utils.html import format_html, mark_safe
import json
from .models import ErrorReport

# ---------------------------------------------------------
# 🔥 ACCIÓN PERSONALIZADA: BORRAR TODOS LOS REPORTES
# ---------------------------------------------------------
@admin.action(description="Borrar TODOS los reportes de error")
def borrar_todos_los_reportes(modeladmin, request, queryset):
    ErrorReport.objects.all().delete()


# ---------------------------------------------------------
# 🔥 ADMIN PERSONALIZADO PARA ERRORREPORT
# ---------------------------------------------------------
@admin.register(ErrorReport)
class ErrorReportAdmin(admin.ModelAdmin):
    list_display = ("short_message", "timestamp", "view_context")
    list_filter = ("timestamp",)
    search_fields = ("message", "error", "context")
    ordering = ("-timestamp",)

    # Agregar acción personalizada
    actions = [borrar_todos_los_reportes]

    # Mostrar mensaje corto en la lista
    def short_message(self, obj):
        return obj.message[:60] + ("..." if len(obj.message) > 60 else "")
    short_message.short_description = "Message"

    # Botón para ver el contexto formateado
    def view_context(self, obj):
        return format_html(
            '<a class="button" href="{}">Ver</a>',
            f"/admin/reportes/errorreport/{obj.id}/change"
        )
    view_context.short_description = "Contexto"

    # Formatear JSON en la vista detallada
    def render_change_form(self, request, context, *args, **kwargs):
        if "original" in context:
            obj = context["original"]
            try:
                parsed = json.dumps(json.loads(obj.context), indent=4, ensure_ascii=False)
                pretty_json = f"<pre style='background:#111;padding:15px;border-radius:8px;color:#0f0;font-size:13px;'>{parsed}</pre>"
                context["adminform"].form.fields["context"].help_text = mark_safe(pretty_json)
            except:
                pass

        return super().render_change_form(request, context, *args, **kwargs)
