# Paper Producer database design (proposal)

This document describes the proposed logical schema for review. It is not a Django model implementation and does not create or apply migrations.

## Decisions this design follows

- A user can belong to at most one institute. A super admin is global and has no institute.
- Boards, grades/classes, subjects, books, and chapters are a shared catalog available to every institute.
- Institute-specific catalog restrictions are out of scope.
- Guess papers are generated for a whole book and cover its chapters; the user cannot select only part of a book for a guess paper.
- Generated papers retain a snapshot of their question content so later question edits do not silently change an already generated paper.

## Proposed entities

### Accounts and institutes

- **User** (custom Django user): login identity, name, active status, and one role: `super_admin`, `institute_admin`, or `teacher`.
  - `institute` is optional only for `super_admin`; institute admins and teachers must have one institute.
  - Email/login identity is unique.
  - Teachers receive subject permissions through **TeacherSubjectAssignment**, which records the assigning administrator and assignment time.
- **Institute**: name, contact information, active status, and timestamps.

### Shared curriculum catalog

- **Board**: curriculum/education board.
- **Grade**: class or grade level.
- **Subject**: subject name/code.
- **Book**: one shared catalog book, related to a board, grade, and subject.
- **Chapter**: ordered chapter within a book; chapter number/order is unique within that book.

All catalog records are global and have no institute owner.

### Questions

- **Question**: question text, optional answer/explanation, question type, difficulty, marks, status, author, and timestamps.
  - Each question belongs to a chapter, and therefore can be filtered by book, subject, grade, and board.
  - `institute` is nullable: null means shared/admin-managed content; an institute value means private content for that institute.
  - A teacher can create and edit questions owned by their institute; only a super admin can manage shared questions.

### Paper templates and generated papers

- **PaperTemplate**: institute-owned reusable exam configuration, with creator, name, subject/book, total marks, duration, and active status.
- **PaperTemplateSection**: ordered section within a template, describing question type/difficulty and target count/marks. This lets the generator follow a repeatable paper structure.
- **GeneratedPaper**: institute, creator, template (optional), selected book, generation type (`exam` or `guess`), title, total marks, duration, status, and creation time.
  - For a guess paper, the selected scope is the entire book; the generator draws from all chapters in that book.
- **GeneratedPaperQuestion**: ordered question entry attached to a generated paper, with a snapshot of the prompt, answer/explanation as needed, marks, and source question reference.

## Relationship sketch

```text
Institute 1 ─── * User (institute_admin / teacher)
Board 1 ─── * Book * ─── 1 Grade
Subject 1 ─── * Book 1 ─── * Chapter 1 ─── * Question
Institute 0..1 ─── * Question (null institute means shared)
Institute 1 ─── * PaperTemplate 1 ─── * PaperTemplateSection
Institute 1 ─── * GeneratedPaper 1 ─── * GeneratedPaperQuestion
Question 0..1 ─── * GeneratedPaperQuestion (content snapshot retained)
```

## Access rules

- **Super admin** manages institutes, user roles, shared catalog data, and shared questions.
- **Institute admin** manages users and institute-owned templates/questions/papers for their own institute.
- **Teacher** works with their institute's templates/questions/papers according to the application permissions.
- Every institute-owned record must be filtered and checked against the signed-in user's institute on the server; hiding another institute's records in the UI is not sufficient.
- Shared catalog records are readable across institutes. Only authorized super-admin operations can change them.

## Constraints to enforce in the implementation

- Institute admin and teacher accounts must have an institute; super admins must not be limited to one.
- A question's chapter must belong to the selected book/scope used to generate the paper.
- Template sections and generated-paper questions have a stable order.
- Guess-paper generation must include source questions from across the selected book's full chapter set, subject to the available-question and template rules.
- Deleting catalog records that are referenced by questions or generated papers should be restricted or handled through inactive/archived status so history is preserved.

## Implementation status

The initial Django model layer follows this proposal. It includes separate English and Urdu text fields for questions, answers, explanations, and options. Generated papers snapshot the question type, text, answers, options, and correct-option markers so the answer key can remain stable. Teacher subject assignments are implemented as an explicit through model with a uniqueness constraint.

The initial migration files and the teacher-assignment migration are generated. Apply any pending migrations with `python manage.py migrate`. Authentication and teacher assignment endpoints enforce institute scope. Question/template/paper APIs, generation-time authorization, paper-generation logic, PDF export, and export metadata are still pending. Institute ownership checks spanning related records must be enforced in application services/permissions in addition to the model fields.
