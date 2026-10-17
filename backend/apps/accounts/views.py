import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.core.validators import validate_email
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.models import User
from apps.institutions.models import Institute


def _read_json(request):
    try:
        data = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None
    return data if isinstance(data, dict) else None


def _user_payload(user):
    institute = user.institute
    return {
        "id": user.pk,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "institute": {"id": institute.pk, "name": institute.name} if institute else None,
    }


@require_GET
@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({"detail": "CSRF cookie set."})


@require_POST
@csrf_protect
def signup(request):
    """Create an institute and its first institute-admin account."""
    data = _read_json(request)
    if data is None:
        return JsonResponse({"detail": "Request body must be a JSON object."}, status=400)

    institute_name = str(data.get("institute_name", "")).strip()
    email = str(data.get("email", "")).strip()
    first_name = str(data.get("first_name", "")).strip()
    last_name = str(data.get("last_name", "")).strip()
    password = data.get("password", "")
    password_confirmation = data.get("password_confirmation", "")

    errors = {}
    if not institute_name:
        errors["institute_name"] = ["Enter your institute name."]
    if not email:
        errors["email"] = ["Enter an email address."]
    else:
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = ["Enter a valid email address."]
        else:
            email = User.objects.normalize_email(email).lower()
            if User.objects.filter(email__iexact=email).exists():
                errors["email"] = ["An account with this email already exists."]
    if not first_name:
        errors["first_name"] = ["Enter your first name."]
    if not isinstance(password, str) or not password:
        errors["password"] = ["Enter a password."]
    elif password != password_confirmation:
        errors["password_confirmation"] = ["The passwords do not match."]
    else:
        candidate = User(email=email, first_name=first_name, last_name=last_name)
        try:
            validate_password(password, user=candidate)
        except ValidationError as exc:
            errors["password"] = list(exc.messages)
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    try:
        with transaction.atomic():
            institute = Institute.objects.create(name=institute_name)
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=User.Role.INSTITUTE_ADMIN,
                institute=institute,
            )
    except IntegrityError:
        return JsonResponse(
            {"errors": {"email": ["An account with this email already exists."]}},
            status=409,
        )

    login(request, user)
    return JsonResponse({"user": _user_payload(user)}, status=201)


@require_POST
@csrf_protect
def login_view(request):
    data = _read_json(request)
    if data is None:
        return JsonResponse({"detail": "Request body must be a JSON object."}, status=400)

    email = str(data.get("email", "")).strip()
    password = data.get("password", "")
    if not email or not isinstance(password, str) or not password:
        return JsonResponse({"detail": "Email and password are required."}, status=400)

    user = authenticate(request, email=User.objects.normalize_email(email).lower(), password=password)
    if user is None:
        return JsonResponse({"detail": "Invalid email or password."}, status=401)

    login(request, user)
    return JsonResponse({"user": _user_payload(user)})


@require_POST
@csrf_protect
def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Logged out."})


@require_GET
def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication required."}, status=401)
    return JsonResponse({"user": _user_payload(request.user)})
