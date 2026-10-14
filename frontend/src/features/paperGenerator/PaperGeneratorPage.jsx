import { useMemo, useState } from 'react'
import { Button, Callout, Field, Modal, PageHeader } from '../../components/ui'
import { ROLES } from '../../constants/roles'
import {
  BOARDS,
  BOOKS,
  CATALOG_NOTICE,
  CHAPTERS,
  CLASSES,
  DIFFICULTIES,
  QUESTION_TYPES,
  SUBJECTS,
  TOPICS,
} from '../../data/interfaceCatalog'
import { useSession } from '../../context/SessionContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const emptySection = () => ({
  id: crypto.randomUUID(),
  name: 'Section',
  type: 'MCQ',
  count: 5,
  marksEach: 1,
  difficulty: 'Medium',
})

export function PaperGeneratorPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const isTeacher = session.role === ROLES.TEACHER
  const subjects = useMemo(() => {
    if (!isTeacher) return SUBJECTS
    return SUBJECTS.filter((item) => session.assignedSubjects.includes(item.name))
  }, [isTeacher, session.assignedSubjects])

  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '')
  const [bookId, setBookId] = useState(BOOKS.find((book) => book.subjectId === (subjects[0]?.id ?? ''))?.id ?? '')
  const [resultOpen, setResultOpen] = useState(false)
  const [sections, setSections] = useState([
    { ...emptySection(), name: 'Section A', type: 'MCQ', count: 20, marksEach: 1 },
    { ...emptySection(), name: 'Section B', type: 'Short Question', count: 10, marksEach: 2 },
    { ...emptySection(), name: 'Section C', type: 'Long Question', count: 5, marksEach: 4 },
  ])

  const books = BOOKS.filter((book) => book.subjectId === subjectId)
  const chapters = CHAPTERS.filter((chapter) => chapter.bookId === bookId)
  const topics = TOPICS.filter((topic) => chapters.some((chapter) => chapter.id === topic.chapterId))
  const totalMarks = sections.reduce((sum, section) => sum + Number(section.count) * Number(section.marksEach), 0)

  const onSubject = (id) => {
    setSubjectId(id)
    const nextBook = BOOKS.find((book) => book.subjectId === id)
    setBookId(nextBook?.id ?? '')
  }

  return (
    <>
      <PageHeader
        title="Generate regular paper"
        description={
          isTeacher
            ? 'Configure a paper for an assigned subject. Unauthorized subjects are not listed.'
            : 'Institute Admin can generate any authorized subject for the institute, even if no teacher is assigned that subject.'
        }
      />
      <Callout>{CATALOG_NOTICE}</Callout>
      <Callout tone="info" title="Generation is pending">
        {PENDING_COPY.generate} If the bank cannot fill a blueprint, the API will return required / available / missing counts instead of an incomplete paper.
      </Callout>
      <form
        className="grid grid-2"
        style={{ marginTop: 16 }}
        onSubmit={(event) => {
          event.preventDefault()
          setResultOpen(true)
        }}
      >
        <article className="card stack-form">
          <h3>{t('Paper configuration')}</h3>
          <Field label="Board">
            <select>{BOARDS.map((item) => <option key={item.id}>{t(item.name)}</option>)}</select>
          </Field>
          <Field label="Class">
            <select>{CLASSES.map((item) => <option key={item.id}>{t(item.name)}</option>)}</select>
          </Field>
          <Field label="Subject">
            <select value={subjectId} onChange={(e) => onSubject(e.target.value)}>
              {subjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.name)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Book">
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              {books.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.name)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Chapters" hint="Multi-select for regular papers only.">
            <select multiple size={4}>
              {chapters.map((item) => (
                <option key={item.id}>{t(item.name)}</option>
              ))}
            </select>
          </Field>
          <Field label="Topics">
            <select multiple size={4}>
              {topics.map((item) => (
                <option key={item.id}>{t(item.name)}</option>
              ))}
            </select>
          </Field>
          <Field label="Exam title">
            <input defaultValue={t('Mid-term examination')} />
          </Field>
          <Field label="Duration (minutes)">
            <input type="number" defaultValue={180} />
          </Field>
          <Field label="Official template">
            <select>
              <option>{t('No templates loaded')}</option>
            </select>
          </Field>
        </article>
        <article className="card">
          <h3>{t('Blueprint')}</h3>
          <p className="stat-hint">{t('Sections, types, counts, marks, and difficulty distribution.')}</p>
          {sections.map((section, index) => (
            <div className="section-block" key={section.id}>
              <div className="grid grid-2">
                <Field label="Section name">
                  <input
                    value={t(section.name)}
                    onChange={(e) => {
                      const next = [...sections]
                      next[index] = { ...section, name: e.target.value }
                      setSections(next)
                    }}
                  />
                </Field>
                <Field label="Question type">
                  <select
                    value={section.type}
                    onChange={(e) => {
                      const next = [...sections]
                      next[index] = { ...section, type: e.target.value }
                      setSections(next)
                    }}
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type}>{t(type)}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Number of questions">
                  <input
                    type="number"
                    min="1"
                    value={section.count}
                    onChange={(e) => {
                      const next = [...sections]
                      next[index] = { ...section, count: e.target.value }
                      setSections(next)
                    }}
                  />
                </Field>
                <Field label="Marks each">
                  <input
                    type="number"
                    min="1"
                    value={section.marksEach}
                    onChange={(e) => {
                      const next = [...sections]
                      next[index] = { ...section, marksEach: e.target.value }
                      setSections(next)
                    }}
                  />
                </Field>
                <Field label="Difficulty">
                  <select
                    value={section.difficulty}
                    onChange={(e) => {
                      const next = [...sections]
                      next[index] = { ...section, difficulty: e.target.value }
                      setSections(next)
                    }}
                  >
                    {DIFFICULTIES.map((item) => (
                      <option key={item}>{t(item)}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          ))}
          <Button
            variant="ghost"
            onClick={() => setSections((current) => [...current, emptySection()])}
          >
            {t('Add section')}
          </Button>
          <p style={{ fontWeight: 600 }}>{t('Configured total marks:')} {totalMarks}</p>
          <Button type="submit">{t('Generate paper')}</Button>
        </article>
      </form>
      {resultOpen ? (
        <Modal title="Cannot generate yet" onClose={() => setResultOpen(false)}>
          <p>{t(PENDING_COPY.generate)}</p>
          <ul>
            <li>{t('Required questions: not evaluated')}</li>
            <li>{t('Available questions: not evaluated')}</li>
            <li>{t('Missing questions: not evaluated')}</li>
          </ul>
          <p className="stat-hint">{t('Adjust the blueprint here; live availability will be returned by the paper-generator API.')}</p>
        </Modal>
      ) : null}
    </>
  )
}
