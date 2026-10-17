from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("An email address is required.")
        email = self.normalize_email(email.strip()).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.SUPER_ADMIN)
        extra_fields.setdefault("institute", None)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("A superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("A superuser must have is_superuser=True.")
        if extra_fields.get("role") != User.Role.SUPER_ADMIN:
            raise ValueError("A superuser must have the super_admin role.")
        if extra_fields.get("institute") is not None:
            raise ValueError("A superuser cannot be assigned to an institute.")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin"
        INSTITUTE_ADMIN = "institute_admin", "Institute Admin"
        TEACHER = "teacher", "Teacher"

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=24, choices=Role.choices)
    institute = models.ForeignKey(
        "institutions.Institute",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="users",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    objects = UserManager()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(role="super_admin", institute__isnull=True)
                    | Q(role__in=["institute_admin", "teacher"], institute__isnull=False)
                ),
                name="user_role_matches_institute",
            )
        ]

    def __str__(self):
        return self.email
