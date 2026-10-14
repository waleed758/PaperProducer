import { useMemo, useState } from 'react'
import { Button, Callout, Field, Modal, PageHeader } from '../../components/ui'
import { ROLES } from '../../constants/roles'
import { BOARDS, BOOKS, CATALOG_NOTICE, CLASSES, GUESS_MODES, SUBJECTS } from '../../data/interfaceCatalog'
import { useSession } from '../../context/SessionContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function GuessPaperPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const isTeacher = session.role === ROLES.TEACHER
  const subjects = useMemo(() => {
    if (!isTeacher) return SUBJECTS
    return SUBJECTS.filter((item) => session.assignedSubjects.includes(item.name))
  }, [isTeacher, session.assignedSubjects])
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '')
  const [bookId, setBookId] = useState(BOOKS.find((book) => book.subjectId === (subjects[0]?.id ?? ''))?.id ?? '')
  const [mode, setMode] = useState('mixed')
  const [open, setOpen] = useState(false)
  const books = BOOKS.filter((book) => book.subjectId === subjectId)

  return (
    <>
      <PageHeader
        title="Full-book guess paper"
        description="Guess papers are generated for the entire selected book only. Chapter and topic analysis happens internally — there is no chapter-wise or topic-wise guess mode."
      />
      <Callout tone="danger" title="Practice / guess paper">
        Selected based on historical patterns and configured criteria. This product never claims a question will definitely appear, is guaranteed, or is confirmed for an examination.
      </Callout>
      <Callout>{CATALOG_NOTICE}</Callout>
      <form
        className="card stack-form"
        style={{ maxWidth: 640, marginTop: 16 }}
        onSubmit={(event) => {
          event.preventDefault()
          setOpen(true)
        }}
      >
        <Field label="Board">
          <select>{BOARDS.map((item) => <option key={item.id}>{t(item.name)}</option>)}</select>
        </Field>
        <Field label="Class">
          <select>{CLASSES.map((item) => <option key={item.id}>{t(item.name)}</option>)}</select>
        </Field>
        <Field label="Subject">
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value)
              setBookId(BOOKS.find((book) => book.subjectId === e.target.value)?.id ?? '')
            }}
          >
            {subjects.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.name)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Book" hint="The full book is always the generation unit.">
          <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
            {books.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.name)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Guess mode">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {GUESS_MODES.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.label)}
              </option>
            ))}
          </select>
        </Field>
        <p className="stat-hint">
          {t('Internal factors (not user modes): past-paper frequency, chapter coverage, topic coverage, difficulty, question type, configurable weights.')}
        </p>
        <Button type="submit">Generate full-book guess paper</Button>
      </form>
      {open ? (
        <Modal title="Guess paper not generated" onClose={() => setOpen(false)}>
          <p>{t(PENDING_COPY.guess)}</p>
          <p>{t('Mode requested:')} {t(GUESS_MODES.find((item) => item.id === mode)?.label)}</p>
          <p className="stat-hint">{t('Documents produced later will be labeled GUESS PAPER or PRACTICE / GUESS PAPER.')}</p>
        </Modal>
      ) : null}
    </>
  )
}
