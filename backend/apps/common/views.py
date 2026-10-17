from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    return Response({"service": "paper-producer-api", "version": "v1"})


@require_GET
def health_check(request):
    return JsonResponse({"status": "ok"})
