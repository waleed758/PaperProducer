from django.urls import path

from apps.accounts import views


urlpatterns = [
    path("csrf/", views.csrf_token, name="auth-csrf"),
    path("signup/", views.signup, name="auth-signup"),
    path("login/", views.login_view, name="auth-login"),
    path("logout/", views.logout_view, name="auth-logout"),
    path("me/", views.current_user, name="auth-current-user"),
]
