from django.http import JsonResponse
from django.views.decorators.http import require_GET

from apps.catalog.models import Subject


@require_GET
def subject_list(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    return JsonResponse({
        "subjects": [
            {"id": subject.pk, "name": subject.name, "code": subject.code}
            for subject in Subject.objects.filter(is_active=True)
        ]
    })
