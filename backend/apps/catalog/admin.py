from django.contrib import admin

from apps.catalog.models import Board, Book, Chapter, Grade, Subject


admin.site.register([Board, Grade, Subject, Book, Chapter])
