import { useMemo, useState } from 'react'
import { Badge, Button, Callout, DataTable, PageHeader } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { ROLES } from '../../constants/roles'
import { CATALOG_NOTICE, CLASSES, DIFFICULTIES, QUESTION_TYPES, SUBJECTS } from '../../data/interfaceCatalog'
import { useSession } from '../../context/SessionContext'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function QuestionBankPage({ canManage = false }) {
  const { session } = useSession()
  const { t } = useLanguage()
  const { pushToast } = useToast()
  const [subject, setSubject] = useState(session.role === ROLES.TEACHER ? String(session.assignedSubjectRecords[0]?.id ?? '') : '')
  const [type, setType] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const subjectOptions = useMemo(() => {
    if (session.role === ROLES.TEACHER) {
      return session.assignedSubjectRecords
    }
    return SUBJECTS
  }, [session])

  return (
    <>
      <PageHeader
        title="Question bank"
        description={
          canManage
            ? 'Super Admin manages global questions. Institute Admin and teachers consume authorized content only.'
            : session.role === ROLES.INSTITUTE_ADMIN
              ? 'Use authorized questions for generation. You cannot create unrestricted academic content.'
              : 'Only questions for your assigned subjects will be available after the API is connected.'
        }
        actions={
          canManage ? (
            <Button onClick={() => pushToast(PENDING_COPY.save)}>Add question</Button>
          ) : null
        }
      />
      <Callout>{CATALOG_NOTICE}</Callout>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="search" style={{ flex: '0 0 180px', borderRadius: 12 }}>
            <option value="">{t('All subjects')}</option>
            {subjectOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.name)}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="search" style={{ flex: '0 0 180px', borderRadius: 12 }}>
            <option value="">{t('All types')}</option>
            {QUESTION_TYPES.map((item) => (
              <option key={item}>{t(item)}</option>
            ))}
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="search" style={{ flex: '0 0 160px', borderRadius: 12 }}>
            <option value="">{t('All difficulty')}</option>
            {DIFFICULTIES.map((item) => (
              <option key={item}>{t(item)}</option>
            ))}
          </select>
          <select className="search" style={{ flex: '0 0 160px', borderRadius: 12 }}>
            <option value="">{t('All classes')}</option>
            {CLASSES.map((item) => (
              <option key={item.id}>{t(item.name)}</option>
            ))}
          </select>
        </div>
        <div className="toolbar">
          <Badge tone="teal">MCQ</Badge>
          <Badge tone="copper">Short</Badge>
          <Badge tone="muted">Long</Badge>
          <Badge tone="ok">Easy / Medium / Hard</Badge>
        </div>
        <DataTable
          columns={['Question', 'Type', 'Subject', 'Chapter', 'Difficulty', 'Marks']}
          rows={[]}
          emptyTitle="No questions loaded"
        />
        <p className="stat-hint">{PENDING_COPY.data}</p>
      </div>
    </>
  )
}
