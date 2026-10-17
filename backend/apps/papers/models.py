from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.questions.models import Question


class PaperTemplate(models.Model):
    institute = models.ForeignKey("institutions.Institute", on_delete=models.PROTECT, related_name="paper_templates")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="paper_templates")
    name = models.CharField(max_length=160)
    book = models.ForeignKey("catalog.Book", on_delete=models.PROTECT, related_name="paper_templates")
    total_marks = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])
    duration_minutes = models.PositiveSmallIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name", "id"]
        constraints = [
            models.UniqueConstraint(fields=["institute", "name"], name="unique_template_name_per_institute"),
        ]

    def __str__(self):
        return self.name


class PaperTemplateSection(models.Model):
    template = models.ForeignKey(PaperTemplate, on_delete=models.CASCADE, related_name="sections")
    order = models.PositiveSmallIntegerField()
    name = models.CharField(max_length=120, blank=True)
    question_type = models.CharField(max_length=24, choices=Question.Type.choices)
    difficulty = models.CharField(
        max_length=12,
        choices=Question.Difficulty.choices,
        blank=True,
        help_text="Leave blank to allow any difficulty.",
    )
    question_count = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    marks_per_question = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["template", "order"], name="unique_template_section_order"),
        ]

    def __str__(self):
        return self.name or f"Section {self.order}"


class GeneratedPaper(models.Model):
    class Kind(models.TextChoices):
        EXAM = "exam", "Exam paper"
        GUESS = "guess", "Guess paper"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        READY = "ready", "Ready"
        ARCHIVED = "archived", "Archived"

    institute = models.ForeignKey("institutions.Institute", on_delete=models.PROTECT, related_name="generated_papers")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="generated_papers")
    template = models.ForeignKey(
        PaperTemplate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="generated_papers",
    )
    book = models.ForeignKey("catalog.Book", on_delete=models.PROTECT, related_name="generated_papers")
    kind = models.CharField(max_length=12, choices=Kind.choices)
    title = models.CharField(max_length=200)
    total_marks = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])
    duration_minutes = models.PositiveSmallIntegerField()
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return self.title


class GeneratedPaperQuestion(models.Model):
    paper = models.ForeignKey(GeneratedPaper, on_delete=models.CASCADE, related_name="paper_questions")
    source_question = models.ForeignKey(
        "questions.Question",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="paper_snapshots",
    )
    order = models.PositiveSmallIntegerField()
    question_type = models.CharField(max_length=24, choices=Question.Type.choices)
    question_text = models.TextField()
    question_text_ur = models.TextField(blank=True)
    answer_text = models.TextField(blank=True)
    answer_text_ur = models.TextField(blank=True)
    marks = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["paper", "order"], name="unique_generated_question_order"),
        ]

    def __str__(self):
        return f"Question {self.order} on {self.paper}"


class GeneratedPaperOption(models.Model):
    paper_question = models.ForeignKey(
        GeneratedPaperQuestion,
        on_delete=models.CASCADE,
        related_name="options",
    )
    order = models.PositiveSmallIntegerField()
    text = models.TextField()
    text_ur = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["paper_question", "order"], name="unique_paper_option_order"),
        ]

    def __str__(self):
        return f"Option {self.order} for paper question {self.paper_question_id}"
