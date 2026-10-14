import { Button, Callout, DataTable, PageHeader } from '../../components/ui'
import { ROLES } from '../../constants/roles'
import { useSession } from '../../context/SessionContext'
import { useToast } from '../../context/ToastContext'

export function TemplatesPage() {
  const { session } = useSession()
  const { pushToast } = useToast()
  const canCreate = session.role === ROLES.SUPER_ADMIN

  return (
    <>
      <PageHeader
        title="Templates"
        description={
          canCreate
            ? 'Official templates are centrally controlled. Architecture leaves room for future custom templates without a rewrite.'
            : 'You may select and preview approved templates. Institute Admin and teachers cannot create templates.'
        }
        actions={
          canCreate ? (
            <Button onClick={() => pushToast('Template creation will save through the Super Admin API in a later phase.')}>
              New official template
            </Button>
          ) : null
        }
      />
      <Callout tone="info">
        Preview, select, and use are allowed for Institute Admin and Teacher once templates exist on the server.
      </Callout>
      <div className="card" style={{ marginTop: 16 }}>
        <DataTable columns={['Template', 'Paper size', 'Status', 'Updated']} rows={[]} emptyTitle="No templates loaded" />
        <div className="toolbar" style={{ marginTop: 12 }}>
          <Button variant="ghost" onClick={() => pushToast('Preview requires a stored template from the API.')}>
            Preview selected
          </Button>
        </div>
      </div>
    </>
  )
}
