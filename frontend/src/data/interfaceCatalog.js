/**
 * Layout-only academic options so generator forms can be used.
 * This is not live question-bank or institute data.
 */
export const CATALOG_NOTICE =
  'These lists exist so the interface can be reviewed. They are not live academic data from the database.'

export const BOARDS = [{ id: 'punjab', name: 'Punjab Curriculum' }]
export const CLASSES = [
  { id: '9', name: 'Class 9' },
  { id: '10', name: 'Class 10' },
]
export const SUBJECTS = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'english', name: 'English' },
]
export const BOOKS = [
  { id: 'math-book', name: 'Mathematics Book', subjectId: 'math' },
  { id: 'physics-book', name: 'Physics Book', subjectId: 'physics' },
  { id: 'chemistry-book', name: 'Chemistry Book', subjectId: 'chemistry' },
  { id: 'english-book', name: 'English Book', subjectId: 'english' },
]
export const CHAPTERS = [
  { id: 'c1', name: 'Chapter 1', bookId: 'math-book' },
  { id: 'c2', name: 'Chapter 2', bookId: 'math-book' },
  { id: 'c3', name: 'Chapter 3', bookId: 'math-book' },
  { id: 'p1', name: 'Chapter 1', bookId: 'physics-book' },
]
export const TOPICS = [
  { id: 't1', name: 'Topic A', chapterId: 'c1' },
  { id: 't2', name: 'Topic B', chapterId: 'c1' },
  { id: 't3', name: 'Topic C', chapterId: 'c2' },
]
export const QUESTION_TYPES = [
  'MCQ',
  'Short Question',
  'Long Question',
  'Fill in the Blank',
  'True/False',
  'Matching',
]
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
export const GUESS_MODES = [
  { id: 'full_book', label: 'Full Book Guess Paper' },
  { id: 'past_paper', label: 'Past-Paper Based Full Book Guess Paper' },
  { id: 'mixed', label: 'Mixed Full Book Guess Paper' },
]
