import { Button, Callout, DataTable, PageHeader, StatCard } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function SubscriptionPage() {
  const { pushToast } = useToast()
  const { t } = useLanguage()
  const later = () => pushToast('Renew and upgrade will call the subscription API. Payment is not connected.')

  return (
    <>
      <PageHeader
        title="Institute subscription"
        description="You can view and manage only your own institute subscription. Global plans and pricing cannot be changed here."
        actions={
          <>
            <Button onClick={later}>Renew</Button>
            <Button variant="copper" onClick={later}>
              Upgrade
            </Button>
          </>
        }
      />
      <Callout>{PENDING_COPY.data}</Callout>
      <div className="grid grid-4" style={{ marginTop: 16 }}>
        <StatCard label="Current plan" />
        <StatCard label="Status" />
        <StatCard label="Start date" />
        <StatCard label="Expiry date" />
      </div>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <StatCard label="Teacher seats remaining" />
        <StatCard label="Papers remaining" />
        <StatCard label="Guess papers remaining" />
      </div>
      <article className="card" style={{ marginTop: 16 }}>
        <h3>{t('Enabled features')}</h3>
        <p className="stat-hint">{t('Feature flags will come from the centralized entitlement service, not hardcoded plan names.')}</p>
      </article>
      <article className="card" style={{ marginTop: 16 }}>
        <h3>{t('Billing history')}</h3>
        <DataTable columns={['Date', 'Description', 'Amount', 'Status']} rows={[]} emptyTitle="No payments loaded" />
      </article>
    </>
  )
}
