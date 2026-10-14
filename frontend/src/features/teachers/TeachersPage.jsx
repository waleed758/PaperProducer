import { useState } from 'react'
import { Button, Callout, DataTable, Field, Modal, PageHeader, PendingSaveButton } from '../../components/ui'
import { SUBJECTS } from '../../data/interfaceCatalog'
import { ROLES } from '../../constants/roles'
import { useSession } from '../../context/SessionContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function TeachersPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const [addOpen, setAddOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const isAdmin = session.role === ROLES.INSTITUTE_ADMIN
  const title = isAdmin ? 'Teachers' : 'Teachers'
  const description = isAdmin
    ? 'Add, activate, deactivate, and assign subject permissions for teachers in your institute only.'
    : 'Platform view of teachers across institutes.'

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <Button onClick={() => setAddOpen(true)}>Add teacher</Button>
            {isAdmin ? (
              <Button variant="ghost" onClick={() => setAssignOpen(true)}>
                Assign subjects
              </Button>
            ) : null}
          </>
        }
      />
      <Callout>{PENDING_COPY.data}</Callout>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <input className="search" placeholder={t('Search teachers')} />
          <Button variant="ghost" size="sm">
            Filters
          </Button>
        </div>
        <DataTable
          columns={['Name', 'Email', 'Subjects', 'Status', 'Actions']}
          rows={[]}
          emptyTitle="No teachers loaded"
        />
      </div>
      {addOpen ? (
        <Modal title="Add teacher" onClose={() => setAddOpen(false)} actions={<PendingSaveButton>Create teacher</PendingSaveButton>}>
          <div className="stack-form">
            <Field label="Full name">
              <input />
            </Field>
            <Field label="Email">
              <input type="email" />
            </Field>
            <Field label="Temporary password" hint="Passwords will be hashed by Django. Never stored in React.">
              <input type="password" />
            </Field>
          </div>
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
