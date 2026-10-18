import { useEffect, useState } from 'react'
import { apiRequest, authPost, getErrorMessage } from '../../services/api'
import { Button, Callout, DataTable, Field, Modal, PageHeader } from '../../components/ui'
import { ROLES } from '../../constants/roles'
import { useSession } from '../../context/SessionContext'
import { useLanguage } from '../../context/LanguageContext'

export function TeachersPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const [addOpen, setAddOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([])
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingAssignments, setSavingAssignments] = useState(false)
  const isAdmin = session.role === ROLES.INSTITUTE_ADMIN
  const canViewTeachers = isAdmin || session.role === ROLES.SUPER_ADMIN
  const title = 'Teachers'
  const description = isAdmin
    ? 'Add teachers to your institute and view their account status.'
    : 'Platform view of teachers across institutes.'

  useEffect(() => {
    if (!canViewTeachers) return
    Promise.all([apiRequest('/auth/teachers/'), apiRequest('/catalog/subjects/')])
      .then(([teacherResponse, subjectResponse]) => {
        setTeachers(teacherResponse.teachers)
        setSubjects(subjectResponse.subjects)
        setLoadError('')
      })
      .catch((error) => setLoadError(getErrorMessage(error)))
  }, [canViewTeachers])

  async function handleCreateTeacher(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSaving(true)
    setFormError('')
    try {
      const response = await authPost('/auth/teachers/create/', {
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
      })
      setTeachers((current) => [...current, response.teacher].sort((a, b) => a.first_name.localeCompare(b.first_name)))
      setAddOpen(false)
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  function openAssignmentEditor(teacher) {
    setSelectedTeacher(teacher)
    setSelectedSubjectIds(teacher.assigned_subjects.map((subject) => subject.id))
    setAssignmentError('')
    setAssignOpen(true)
  }

  async function handleSaveAssignments(event) {
    event.preventDefault()
    if (!selectedTeacher) return
    setSavingAssignments(true)
    setAssignmentError('')
    try {
      const response = await authPost(`/auth/teachers/${selectedTeacher.id}/subjects/`, {
        subject_ids: selectedSubjectIds,
      })
      setTeachers((current) => current.map((teacher) => (
        teacher.id === response.teacher.id ? response.teacher : teacher
      )))
      setSelectedTeacher(response.teacher)
      setAssignOpen(false)
    } catch (error) {
      setAssignmentError(getErrorMessage(error))
    } finally {
      setSavingAssignments(false)
    }
  }

  const rows = teachers.map((teacher) => ({
    id: teacher.id,
    cells: [
      [teacher.first_name, teacher.last_name].filter(Boolean).join(' '),
      teacher.email,
      teacher.institute,
      teacher.assigned_subjects.map((subject) => subject.name).join(', ') || '—',
      teacher.is_active ? 'Active' : 'Inactive',
      <Button key={`assign-${teacher.id}`} variant="ghost" size="sm" onClick={() => openAssignmentEditor(teacher)}>
        Assign subjects
      </Button>,
    ],
  }))

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {isAdmin ? <Button onClick={() => { setFormError(''); setAddOpen(true) }}>Add teacher</Button> : null}
          </>
        }
      />
      {loadError ? <Callout tone="danger">{loadError}</Callout> : null}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <input className="search" placeholder={t('Search teachers')} />
          <Button variant="ghost" size="sm">
            Filters
          </Button>
        </div>
        <DataTable
          columns={['Name', 'Email', 'Institute', 'Subjects', 'Status', 'Actions']}
          rows={rows}
          emptyTitle={loadError ? 'Could not load teachers' : 'No teachers yet'}
        />
      </div>
      {addOpen ? (
        <Modal title="Add teacher" onClose={() => setAddOpen(false)} actions={<Button type="submit" form="add-teacher-form" disabled={saving}>{saving ? 'Creating…' : 'Create teacher'}</Button>}>
          <form id="add-teacher-form" className="stack-form" onSubmit={handleCreateTeacher}>
            <Field label="Full name">
              <input name="name" required maxLength={300} autoComplete="name" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required maxLength={254} autoComplete="email" />
            </Field>
            <Field label="Temporary password" hint="Django stores a one-way password hash. Share the temporary password securely with the teacher.">
              <input name="password" type="password" required autoComplete="new-password" />
            </Field>
            {formError ? <Callout tone="danger">{formError}</Callout> : null}
          </form>
        </Modal>
      ) : null}
      {assignOpen && selectedTeacher ? (
        <Modal title="Assign subject permissions" onClose={() => setAssignOpen(false)} actions={<Button type="submit" form="assign-subjects-form" disabled={savingAssignments}>{savingAssignments ? 'Saving…' : 'Save assignments'}</Button>}>
          <p className="stat-hint">
            {t('Assign subjects for')} {[selectedTeacher.first_name, selectedTeacher.last_name].filter(Boolean).join(' ')}. {t('These assignments will be checked by the question and paper APIs when those features are connected. Institute admins are not limited by teacher assignments.')}
          </p>
          <form id="assign-subjects-form" className="stack-form" onSubmit={handleSaveAssignments}>
            {subjects.length ? subjects.map((subject) => (
              <label key={subject.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(subject.id)}
                  onChange={(event) => setSelectedSubjectIds((current) => (
                    event.target.checked
                      ? [...current, subject.id]
                      : current.filter((id) => id !== subject.id)
                  ))}
                /> {subject.name}
              </label>
            )) : <Callout tone="info">No active subjects are available. Add subjects in the catalog first.</Callout>}
            {assignmentError ? <Callout tone="danger">{assignmentError}</Callout> : null}
          </form>
        </Modal>
      ) : null}
    </>
  )
}
