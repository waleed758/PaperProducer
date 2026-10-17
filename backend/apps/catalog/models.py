from django.db import models


class Board(models.Model):
    name = models.CharField(max_length=160)
    code = models.CharField(max_length=40, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name", "id"]

    def __str__(self):
        return self.name


class Grade(models.Model):
    name = models.CharField(max_length=80)
    code = models.CharField(max_length=30, unique=True)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name", "id"]

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=40, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name", "id"]

    def __str__(self):
        return self.name


class Book(models.Model):
    board = models.ForeignKey(Board, on_delete=models.PROTECT, related_name="books")
    grade = models.ForeignKey(Grade, on_delete=models.PROTECT, related_name="books")
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT, related_name="books")
    title = models.CharField(max_length=200)
    edition = models.CharField(max_length=80, blank=True)
    publication_year = models.PositiveSmallIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["board__name", "grade__sort_order", "subject__name", "title"]
        constraints = [
            models.UniqueConstraint(
                fields=["board", "grade", "subject", "title", "edition"],
                name="unique_book_catalog_identity",
            )
        ]

    def __str__(self):
        return self.title


class Chapter(models.Model):
    book = models.ForeignKey(Book, on_delete=models.PROTECT, related_name="chapters")
    number = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["book_id", "number"]
        constraints = [
            models.UniqueConstraint(fields=["book", "number"], name="unique_chapter_number_per_book"),
        ]

    def __str__(self):
        return f"{self.book}: Chapter {self.number} — {self.title}"
