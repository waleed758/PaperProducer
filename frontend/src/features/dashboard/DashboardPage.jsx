import { Link } from 'react-router-dom'
import { Button, Callout, PageHeader, StatCard } from '../../components/ui'
import { ROLES } from '../../constants/roles'
import { useSession } from '../../context/SessionContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function DashboardPage() {
  const { session } = useSession()
  const { t } = useLanguage()

  if (session.role === ROLES.SUPER_ADMIN) {
    return (
      <>
        <PageHeader title="Platform overview" description="Super Admin manages institutes, global academics, plans, templates, and audit." />
        <Callout tone="info">{PENDING_COPY.data}</Callout>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <StatCard label="Institutes" />
          <StatCard label="Users" />
          <StatCard label="Active subscriptions" />
          <StatCard label="Questions" />
        </div>
        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <article className="card">
            <h3>{t('Recent audit activity')}</h3>
            <p className="stat-hint">{t('Logs will appear here after the audit API is connected.')}</p>
          </article>
          <article className="card">
            <h3>{t('Support queue')}</h3>
            <p className="stat-hint">{t('Open requests will load from the support API.')}</p>
          </article>
        </div>
      </>
    )
  }

  if (session.role === ROLES.INSTITUTE_ADMIN) {
    return (
      <>
        <PageHeader
          title="Institute dashboard"
          description="Manage teachers, view your subscription, and generate any authorized paper for your institute. Teacher subject assignments do not restrict your generation."
          actions={
            <>
              <Link to="/app/institute/generate"><Button>Generate paper</Button></Link>
              <Link to="/app/institute/guess-paper"><Button variant="copper">Guess paper</Button></Link>
            </>
          }
        />
        <Callout tone="info">{PENDING_COPY.data}</Callout>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <StatCard label="Teachers" />
          <StatCard label="Papers this period" />
          <StatCard label="Guess papers" />
          <StatCard label="Subscription" hint="Status not loaded" />
        </div>
        <article className="card" style={{ marginTop: 16 }}>
          <h3>{t(session.instituteName)}</h3>
          <p className="stat-hint">{t('Institute profile, logo, and limits will load from your authenticated membership — never from a client-supplied institute id.')}</p>
        </article>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Teacher dashboard"
        description="Generate papers only for subjects assigned to you. Guess papers are always for a full selected book."
        actions={
          <>
            <Link to="/app/teacher/generate"><Button>Generate paper</Button></Link>
            <Link to="/app/teacher/guess-paper"><Button variant="copper">Guess paper</Button></Link>
          </>
        }
      />
      <Callout tone="info">
        {t('Preview assigned subjects:')} {session.assignedSubjects.map(t).join('، ') || t('none')}. {t('Live assignments will come from the API.')}
      </Callout>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <StatCard label="Assigned subjects" hint={session.assignedSubjects.join(', ') || '—'} />
        <StatCard label="My papers" />
        <StatCard label="Recent activity" />
      </div>
    </>
  )
}
