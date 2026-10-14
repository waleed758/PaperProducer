import { Callout, Field, PageHeader, PendingSaveButton, StatCard } from '../../components/ui'
import { ResourcePage } from './ResourcePage'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function InstitutesPage() {
  return (
    <ResourcePage
      title="Institutes"
      description="Create and manage tenant institutes. Isolation will be enforced on the backend."
      columns={['Institute', 'Status', 'Plan', 'Teachers', 'Created']}
      createLabel="Add institute"
      fields={[
        { label: 'Institute name' },
        { label: 'Official email' },
        { label: 'City / region' },
      ]}
    />
  )
}

export function UsersPage() {
  return (
    <ResourcePage
      title="Users"
      description="Platform users across roles. Super Admin, Institute Admin, and Teacher."
      columns={['Name', 'Email', 'Role', 'Institute', 'Status']}
      createLabel="Add user"
      fields={[
        { label: 'Full name' },
        { label: 'Email', type: 'email' },
        {
          label: 'Role',
          type: 'select',
          options: ['Super Admin', 'Teacher', 'Institute Admin'],
        },
      ]}
    />
  )
}

export function PlansPage() {
  return (
    <ResourcePage
      title="Subscription plans"
      description="Global plans, features, and limits. Institute admins cannot edit these."
      columns={['Plan', 'Teachers', 'Papers', 'Guess papers', 'Status']}
      createLabel="Add plan"
      fields={[
        { label: 'Plan name' },
        { label: 'Teacher limit' },
        { label: 'Paper limit' },
        { label: 'Guess paper limit' },
      ]}
    />
  )
}

export function AdminSubscriptionsPage() {
  return (
    <ResourcePage
      title="Institute subscriptions"
      description="Assign and review institute entitlements. Limits are not hardcoded in screens."
      columns={['Institute', 'Plan', 'Status', 'Start', 'Expiry']}
      createLabel="Assign subscription"
      fields={[{ label: 'Institute' }, { label: 'Plan' }, { label: 'Start date' }, { label: 'Expiry date' }]}
    />
  )
}

export function BoardsPage() {
  return (
    <ResourcePage
      title="Boards"
      description="Board / curriculum is the top of the academic hierarchy."
      columns={['Board', 'Code', 'Status']}
      createLabel="Add board"
      fields={[{ label: 'Board name' }, { label: 'Code' }]}
    />
  )
}

export function ClassesPage() {
  return (
    <ResourcePage
      title="Classes"
      description="Classes sit under a board. Institute Admin cannot create classes."
      columns={['Class', 'Board', 'Status']}
      createLabel="Add class"
      fields={[{ label: 'Class name' }, { label: 'Board' }]}
    />
  )
}

export function SubjectsPage() {
  return (
    <ResourcePage
      title="Subjects"
      description="Subjects under class. Teacher permissions attach here."
      columns={['Subject', 'Class', 'Board', 'Status']}
      createLabel="Add subject"
      fields={[{ label: 'Subject name' }, { label: 'Class' }]}
    />
  )
}

export function BooksPage() {
  return (
    <ResourcePage
      title="Books"
      description="Guess papers are generated for a full book only."
      columns={['Book', 'Subject', 'Status']}
      createLabel="Add book"
      fields={[{ label: 'Book title' }, { label: 'Subject' }]}
    />
  )
}

export function ChaptersPage() {
  return (
    <ResourcePage
      title="Chapters"
      description="Chapters are analyzed internally for guess papers. Users do not generate chapter-wise guess papers."
      columns={['Chapter', 'Book', 'Order']}
      createLabel="Add chapter"
      fields={[{ label: 'Chapter name' }, { label: 'Book' }, { label: 'Order' }]}
    />
  )
}

export function TopicsPage() {
  return (
    <ResourcePage
      title="Topics"
      description="Topics sit under chapters. No topic-wise guess-paper mode in the product."
      columns={['Topic', 'Chapter', 'Book']}
      createLabel="Add topic"
      fields={[{ label: 'Topic name' }, { label: 'Chapter' }]}
    />
  )
}

export function PastPapersPage() {
  return (
    <ResourcePage
      title="Past papers"
      description="Historical data that can influence full-book guess-paper scoring. Never presented as official upcoming content."
      columns={['Title', 'Board', 'Year', 'Subject', 'Book']}
      createLabel="Add past-paper record"
      fields={[{ label: 'Title' }, { label: 'Year' }, { label: 'Book' }]}
    />
  )
}

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Platform statistics will be computed on the server." />
      <Callout>{PENDING_COPY.data}</Callout>
      <div className="grid grid-4" style={{ marginTop: 16 }}>
        <StatCard label="Papers generated" />
        <StatCard label="Guess papers" />
        <StatCard label="Active institutes" />
        <StatCard label="Storage" />
      </div>
    </>
  )
}

export function AuditLogsPage() {
  return (
    <ResourcePage
      title="Audit logs"
      description="Security-relevant actions across the platform."
      columns={['Time', 'Actor', 'Action', 'Institute', 'Detail']}
      createLabel="Export logs"
      fields={[{ label: 'Date range' }]}
    />
  )
}

export function SupportPage() {
  return (
    <ResourcePage
      title="Support requests"
      description="Incoming institute support tickets."
      columns={['ID', 'Institute', 'Subject', 'Status', 'Opened']}
      createLabel="Add internal note"
      fields={[{ label: 'Note', type: 'textarea' }]}
    />
  )
}

export function SettingsPage() {
  const { t } = useLanguage()
  return (
    <>
      <PageHeader title="System settings" description="Global platform configuration. Secrets never belong in the React app." />
      <div className="card stack-form">
        <Field label="Support email">
            <input placeholder={t('Not loaded')} />
        </Field>
        <Field label="Default guess-paper weight set" hint="Weights are stored server-side and are not hardcoded in screens.">
          <input placeholder={t('Not loaded')} />
        </Field>
        <PendingSaveButton>Save settings</PendingSaveButton>
      </div>
    </>
  )
}
