import { Link } from 'react-router-dom'
import { Button, Callout, DataTable, PageHeader } from '../../components/ui'
import { ROLES } from '../../constants/roles'
import { useSession } from '../../context/SessionContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function PapersListPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const institute = session.role === ROLES.INSTITUTE_ADMIN
  const editorTo = institute ? '/app/institute/editor' : '/app/teacher/editor'

  return (
    <>
      <PageHeader
        title={institute ? 'Institute papers' : 'My papers'}
        description={
          institute
            ? 'Papers generated in your institute, according to institute permissions. Other institutes are never visible.'
            : 'Your generated papers only. Types: Regular, Guess, Practice.'
        }
        actions={
          <Link to={editorTo}>
            <Button variant="ghost">Open editor workspace</Button>
          </Link>
        }
      />
      <Callout>{PENDING_COPY.data}</Callout>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <input className="search" placeholder={t('Search title')} />
          <select className="search" style={{ flex: '0 0 180px', borderRadius: 12 }}>
            <option>{t('All types')}</option>
            <option>{t('Regular Paper')}</option>
            <option>{t('Guess Paper')}</option>
            <option>{t('Practice Paper')}</option>
          </select>
        </div>
        <DataTable
          columns={['Paper ID', 'Title', 'Board', 'Class', 'Subject', 'Type', 'Template', 'Marks', 'Duration', 'Created']}
          rows={[]}
          emptyTitle="No paper history loaded"
        />
      </div>
    </>
  )
}
