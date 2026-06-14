from django.contrib import admin
from .models import ErrorReport

@admin.register(ErrorReport)
class ErrorReportAdmin(admin.ModelAdmin):
    list_display = ("id", "message", "timestamp")
    list_filter = ("timestamp",)
    search_fields = ("message", "error", "context")
    ordering = ("-timestamp",)
