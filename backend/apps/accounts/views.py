import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.core.validators import validate_email
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_GET, require_POST

from apps.accounts.models import TeacherSubjectAssignment, User
from apps.catalog.models import Subject
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
        "assigned_subjects": [
            {"id": subject.pk, "name": subject.name, "code": subject.code}
            for subject in user.assigned_subjects.filter(is_active=True)
        ] if user.role == User.Role.TEACHER else [],
    }


def _teacher_payload(user):
    return {
        "id": user.pk,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_active": user.is_active,
        "institute": user.institute.name,
        "assigned_subjects": [
            {"id": subject.pk, "name": subject.name, "code": subject.code}
            for subject in user.assigned_subjects.filter(is_active=True)
        ],
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


@require_GET
def teachers(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication required."}, status=401)
    if request.user.role not in {User.Role.SUPER_ADMIN, User.Role.INSTITUTE_ADMIN}:
        return JsonResponse({"detail": "You do not have permission to view teachers."}, status=403)

    users = User.objects.filter(role=User.Role.TEACHER).select_related("institute").prefetch_related("assigned_subjects")
    if request.user.role == User.Role.INSTITUTE_ADMIN:
        users = users.filter(institute_id=request.user.institute_id)

    return JsonResponse({
        "teachers": [
            _teacher_payload(user)
            for user in users.order_by("first_name", "last_name", "email")
        ]
    })


@require_POST
@csrf_protect
def create_teacher(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication required."}, status=401)
    if request.user.role != User.Role.INSTITUTE_ADMIN or request.user.institute_id is None:
        return JsonResponse({"detail": "Only an institute admin can add teachers."}, status=403)

    data = _read_json(request)
    if data is None:
        return JsonResponse({"detail": "Request body must be a JSON object."}, status=400)

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    password = data.get("password", "")
    errors = {}
    if not name:
        errors["name"] = ["Enter the teacher's name."]
    elif len(name.partition(" ")[0]) > 150 or len(name.partition(" ")[2]) > 150:
        errors["name"] = ["The first name and surname must each be 150 characters or fewer."]
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
    if not isinstance(password, str) or not password:
        errors["password"] = ["Enter a temporary password."]
    else:
        first_name, _, last_name = name.partition(" ")
        candidate = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            institute=request.user.institute,
        )
        try:
            validate_password(password, user=candidate)
        except ValidationError as exc:
            errors["password"] = list(exc.messages)
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    first_name, _, last_name = name.partition(" ")
    try:
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.TEACHER,
            institute=request.user.institute,
        )
    except IntegrityError:
        return JsonResponse(
            {"errors": {"email": ["An account with this email already exists."]}},
            status=409,
        )

    return JsonResponse({"teacher": _teacher_payload(user)}, status=201)


@require_POST
@csrf_protect
def assign_teacher_subjects(request, teacher_id):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication required."}, status=401)
    if request.user.role not in {User.Role.SUPER_ADMIN, User.Role.INSTITUTE_ADMIN}:
        return JsonResponse({"detail": "You do not have permission to assign subjects."}, status=403)

    teachers = User.objects.filter(pk=teacher_id, role=User.Role.TEACHER)
    if request.user.role == User.Role.INSTITUTE_ADMIN:
        teachers = teachers.filter(institute_id=request.user.institute_id)
    teacher = teachers.select_related("institute").prefetch_related("assigned_subjects").first()
    if teacher is None:
        return JsonResponse({"detail": "Teacher not found."}, status=404)

    data = _read_json(request)
    if data is None:
        return JsonResponse({"detail": "Request body must be a JSON object."}, status=400)
    subject_ids = data.get("subject_ids")
    if not isinstance(subject_ids, list) or any(type(subject_id) is not int or subject_id < 1 for subject_id in subject_ids):
        return JsonResponse({"errors": {"subject_ids": ["Provide a list of valid subject IDs."]}}, status=400)
    subject_ids = list(dict.fromkeys(subject_ids))
    subjects = list(Subject.objects.filter(pk__in=subject_ids, is_active=True).order_by("name", "id"))
    if len(subjects) != len(subject_ids):
        return JsonResponse({"errors": {"subject_ids": ["One or more subjects are unavailable."]}}, status=400)

    with transaction.atomic():
        TeacherSubjectAssignment.objects.filter(teacher=teacher).delete()
        TeacherSubjectAssignment.objects.bulk_create([
            TeacherSubjectAssignment(teacher=teacher, subject=subject, assigned_by=request.user)
            for subject in subjects
        ])
    teacher = User.objects.select_related("institute").prefetch_related("assigned_subjects").get(pk=teacher.pk)
    return JsonResponse({"teacher": _teacher_payload(teacher)})
