import { useEffect, useState } from 'react'
import { apiRequest, authPost, getErrorMessage } from '../../services/api'
import { Button, Callout, DataTable, Field, Modal, PageHeader, PendingSaveButton } from '../../components/ui'
import { SUBJECTS } from '../../data/interfaceCatalog'
import { ROLES } from '../../constants/roles'
import { useSession } from '../../context/SessionContext'
import { useLanguage } from '../../context/LanguageContext'

export function TeachersPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const [addOpen, setAddOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const isAdmin = session.role === ROLES.INSTITUTE_ADMIN
  const canViewTeachers = isAdmin || session.role === ROLES.SUPER_ADMIN
  const title = 'Teachers'
  const description = isAdmin
    ? 'Add teachers to your institute and view their account status.'
    : 'Platform view of teachers across institutes.'

  useEffect(() => {
    if (!canViewTeachers) return
    apiRequest('/auth/teachers/')
      .then((response) => {
        setTeachers(response.teachers)
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

  const rows = teachers.map((teacher) => ({
    id: teacher.id,
    cells: [
      [teacher.first_name, teacher.last_name].filter(Boolean).join(' '),
      teacher.email,
      teacher.institute,
      teacher.is_active ? 'Active' : 'Inactive',
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
            {isAdmin ? (
              <Button variant="ghost" onClick={() => setAssignOpen(true)}>
                Assign subjects
              </Button>
            ) : null}
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
          columns={['Name', 'Email', 'Institute', 'Status']}
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
      {assignOpen ? (
        <Modal title="Assign subject permissions" onClose={() => setAssignOpen(false)} actions={<PendingSaveButton>Save assignments</PendingSaveButton>}>
          <p className="stat-hint">
            {t('Teacher subject permissions are enforced on the server. Institute Admin paper generation is not limited by these assignments.')}
          </p>
          <div className="stack-form">
            {SUBJECTS.map((subject) => (
              <label key={subject.id} className="checkbox-row">
                <input type="checkbox" /> {t(subject.name)}
              </label>
            ))}
          </div>
        </Modal>
      ) : null}
    </>
  )
}
