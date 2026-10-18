from django.urls import path

from apps.catalog.views import subject_list


urlpatterns = [
    path("subjects/", subject_list, name="subject-list"),
]
