from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Question(models.Model):
    class Type(models.TextChoices):
        MULTIPLE_CHOICE = "multiple_choice", "Multiple choice"
        SHORT_ANSWER = "short_answer", "Short answer"
        LONG_ANSWER = "long_answer", "Long answer"
        TRUE_FALSE = "true_false", "True or false"
        FILL_BLANK = "fill_blank", "Fill in the blank"

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        REVIEWED = "reviewed", "Reviewed"
        ARCHIVED = "archived", "Archived"

    chapter = models.ForeignKey("catalog.Chapter", on_delete=models.PROTECT, related_name="questions")
    institute = models.ForeignKey(
        "institutions.Institute",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="questions",
        help_text="Empty for shared content; set for institute-private questions.",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="created_questions",
    )
    question_type = models.CharField(max_length=24, choices=Type.choices)
    difficulty = models.CharField(max_length=12, choices=Difficulty.choices)
    question_text = models.TextField()
    question_text_ur = models.TextField(blank=True)
    answer_text = models.TextField(blank=True)
    answer_text_ur = models.TextField(blank=True)
    explanation = models.TextField(blank=True)
    explanation_ur = models.TextField(blank=True)
    marks = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["chapter_id", "id"]
        indexes = [
            models.Index(fields=["institute", "status", "question_type"]),
            models.Index(fields=["chapter", "difficulty"]),
        ]

    def __str__(self):
        return f"{self.get_question_type_display()} question #{self.pk or 'new'}"


class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    order = models.PositiveSmallIntegerField()
    text = models.TextField()
    text_ur = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["question", "order"], name="unique_question_option_order"),
        ]

    def __str__(self):
        return f"Option {self.order} for question {self.question_id}"
